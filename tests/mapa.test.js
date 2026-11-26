// F06 · Mapa trasy: KA1–KA5, N3 i przypadki brzegowe.
// Kliknięcie = operacja, którą wywołuje app.js (stan.js, przelaczPodswietlenie), plus HTML panelu po niej (plan, sekcja 7).
// Dane: podróż „Testowy wyjazd: Rzym” z zestawu testowego F00 (04–06.12.2026, 3 dni); miejsca z katalogu.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { przypiszDoDnia, przesun, dodajPunkty, podroz, planDnia } from "../src/stan.js";
import {
  rzut, pokazMapy, wpisyMapy, danePanelu, przelaczPodswietlenie, SZEROKOSC, WYSOKOSC, MARGINES
} from "../src/mapa.js";
import {
  widokPodrozy, panelMapy, OPIS_MAPY, BRAK_PUNKTOW_NA_MAPIE, EKRAN_PODROZY
} from "../src/widoki/plan.js";
import { miejsce } from "../src/dane/katalog.js";
import { zestawTestowy } from "../src/dane/zestaw-testowy.js";

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DZIS = "2026-11-26";
const ID = "p-test-rzym";
const KOLOSEUM = "rzym-koloseum";
const PANTEON = "rzym-panteon";
const TREVI = "rzym-trevi";
const FORUM = "rzym-forum";
const PINCIO = "rzym-pincio";

/** Wykonuje kolejne operacje planu na zestawie testowym; każda musi coś zmienić. */
function plan(...operacje) {
  let stan = zestawTestowy();
  for (const op of operacje) {
    const wynik = op(stan);
    assert.ok(wynik.zmieniono, "operacja zmieniła plan");
    stan = wynik.stan;
  }
  return stan;
}
const przypisz = (id, dzien) => (s) => przypiszDoDnia(s, ID, id, dzien);

/** Dzień 1: Koloseum (1), Panteon (2); Trevi zostaje w „Do zaplanowania”. */
const dzien1 = () => plan(przypisz(KOLOSEUM, 1), przypisz(PANTEON, 1));

const ekran = (zmiany = {}) => ({ ...EKRAN_PODROZY, ...zmiany });
const kod = (b) => b.toString();

/** Pinezki z HTML panelu: [{ klucz, styl, numer, pusta, aktywna, wcisnieta, podpis }]. */
function pinezki(html) {
  return [...html.matchAll(/<button type="button" class="pinezka( aktywna)?" data-akcja="podswietl" data-klucz="([^"]+)"\s+style="([^"]*)" aria-pressed="(true|false)" aria-label="([^"]*)">(.*?)<\/button>/gs)]
    .map(([, aktywna, klucz, styl, wcisnieta, opis, wnetrze]) => ({
      klucz,
      styl,
      opis,
      numer: wnetrze.match(/<span class="numer" aria-hidden="true">(\d+)<\/span>/)?.[1] ?? null,
      pusta: wnetrze.includes('class="numer kolko-puste"'),
      aktywna: Boolean(aktywna),
      wcisnieta: wcisnieta === "true",
      podpis: wnetrze.match(/<span class="podpis-pinezki[^"]*" aria-hidden="true">([^<]*)<\/span>/)?.[1] ?? null
    }));
}

/** Punkty listy pod mapą: [{ klucz, aktywny, wcisniety, tekst }]. */
function lista(html) {
  return [...html.matchAll(/<button type="button" class="punkt-mapy( aktywny)?" data-akcja="podswietl" data-klucz="([^"]+)"\s+aria-pressed="(true|false)"[^>]*>(.*?)<\/button>/gs)]
    .map(([, aktywny, klucz, wcisniety, wnetrze]) => ({
      klucz,
      aktywny: Boolean(aktywny),
      wcisniety: wcisniety === "true",
      tekst: wnetrze.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    }));
}

/** Linie tras: [{ dzien, punkty: ["x,y", ...] }]. */
const linie = (html) => [...html.matchAll(/<polyline class="trasa" data-dzien="(\d+)" points="([^"]*)"/g)]
  .map(([, dzien, punkty]) => ({ dzien: Number(dzien), punkty: punkty.split(" ") }));

// ---------- Rzut współrzędnych ----------

test("rzut: jeden punkt trafia na środek panelu, bez dzielenia przez zero", () => {
  assert.deepEqual(rzut([[41.8902, 12.4922]]), [{ x: SZEROKOSC / 2, y: WYSOKOSC / 2 }]);
  assert.deepEqual(rzut([]), []);
});

test("rzut: kilka punktów w tym samym miejscu → wszystkie na środku", () => {
  const wynik = rzut([[41.9, 12.5], [41.9, 12.5], [41.9, 12.5]]);
  for (const { x, y } of wynik) {
    assert.equal(x, SZEROKOSC / 2);
    assert.equal(y, WYSOKOSC / 2);
  }
});

test("rzut: punkty na jednej szerokości albo długości mieszczą się w panelu i są wyśrodkowane w drugim kierunku", () => {
  const poziomo = rzut([[41.9, 12.4], [41.9, 12.6]]);
  assert.ok(poziomo.every(({ y }) => y === WYSOKOSC / 2));
  assert.ok(poziomo.every(({ x }) => Number.isFinite(x) && x >= MARGINES && x <= SZEROKOSC - MARGINES));
  const pionowo = rzut([[41.8, 12.5], [42.0, 12.5]]);
  assert.ok(pionowo.every(({ x }) => x === SZEROKOSC / 2));
  assert.ok(pionowo.every(({ y }) => y >= MARGINES && y <= WYSOKOSC - MARGINES));
});

test("rzut: północ u góry, a stopień długości jest krótszy o cos(szerokości)", () => {
  const [poludnie, polnoc] = rzut([[41.8, 12.5], [42.0, 12.5]]);
  assert.ok(polnoc.y < poludnie.y, "punkt bardziej na północ jest wyżej");
  // Na 60° szerokości 1° długości to połowa 1° szerokości.
  const [a, b, c] = rzut([[60, 10], [60, 11], [61, 10]]);
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(c.y - a.y);
  assert.ok(Math.abs(dx / dy - Math.cos((60.5 * Math.PI) / 180)) < 0.01, `dx/dy = ${(dx / dy).toFixed(3)}`);
});

test("rzut: punkty bardzo daleko od siebie (Rzym i Dolomity) mieszczą się w panelu", () => {
  const ids = [KOLOSEUM, PANTEON, "dol-tre-cime", "dol-braies", "dol-seceda"];
  const wynik = rzut(ids.map((id) => miejsce(id).wsp));
  for (const { x, y } of wynik) {
    assert.ok(x >= MARGINES - 1e-9 && x <= SZEROKOSC - MARGINES + 1e-9, `x = ${x}`);
    assert.ok(y >= MARGINES - 1e-9 && y <= WYSOKOSC - MARGINES + 1e-9, `y = ${y}`);
  }
});

// ---------- Kryteria akceptacji ----------

test("F06-KA1: dzień 1 z Koloseum (1) i Panteonem (2) → 2 pinezki z numerami 1 i 2 w kolorze dnia 1 i jedna linia", () => {
  const p = podroz(dzien1(), ID);
  const html = kod(panelMapy(p, ekran({ pokaz: "1" })));
  const piny = pinezki(html);
  assert.deepEqual(piny.map((x) => [x.klucz, x.numer]), [[KOLOSEUM, "1"], [PANTEON, "2"]]);
  for (const x of piny) assert.match(x.styl, /--dzien: var\(--dzien-1\)/);
  const l = linie(html);
  assert.equal(l.length, 1);
  assert.equal(l[0].dzien, 1);
  assert.equal(l[0].punkty.length, 2);
  assert.match(html, /<polyline class="trasa" data-dzien="1" points="[^"]*" style="stroke: var\(--dzien-1\)"/);
  // Trevi jest w „Do zaplanowania”, więc przy wybranym dniu jej nie ma.
  assert.ok(!html.includes(TREVI));
});

test("F06-KA2: zamiana Koloseum i Panteonu w planie zamienia numery pinezek (N3)", () => {
  const stan = plan(przypisz(KOLOSEUM, 1), przypisz(PANTEON, 1), (s) => przesun(s, ID, PANTEON, -1));
  const p = podroz(stan, ID);
  const piny = pinezki(kod(panelMapy(p, ekran({ pokaz: "1" }))));
  assert.deepEqual(piny.map((x) => [x.klucz, x.numer]), [[PANTEON, "1"], [KOLOSEUM, "2"]]);
  // Numery pinezek to numery z planu dnia (ta sama funkcja planDnia).
  assert.deepEqual(planDnia(p, 1).map((x) => [x.punkt.miejsce, String(x.numer)]), piny.map((x) => [x.klucz, x.numer]));
  // Linia też idzie w nowej kolejności: od Panteonu do Koloseum.
  const d = danePanelu(wpisyMapy(p, 1));
  const [pan, kol] = d.pinezki;
  assert.deepEqual(d.trasy[0].punkty, [{ x: pan.x, y: pan.y }, { x: kol.x, y: kol.y }]);
});

test("F06-KA3: „Cała podróż” → osobna linia dla każdego dnia, „Do zaplanowania” to puste kółka bez numeru", () => {
  const stan = plan(
    (s) => dodajPunkty(s, ID, [FORUM, PINCIO]),
    przypisz(KOLOSEUM, 1), przypisz(PANTEON, 1), przypisz(TREVI, 2), przypisz(FORUM, 2)
  );
  const p = podroz(stan, ID);
  const html = kod(panelMapy(p, ekran()));
  const l = linie(html);
  assert.deepEqual(l.map((x) => x.dzien), [1, 2]);
  assert.match(html, /data-dzien="2" points="[^"]*" style="stroke: var\(--dzien-2\)"/);

  // Każda linia przechodzi tylko przez pinezki swojego dnia: żadna nie łączy dnia 1 z dniem 2.
  const d = danePanelu(wpisyMapy(p, "wszystko"));
  for (const t of d.trasy) {
    const swoje = d.pinezki.filter((x) => x.dzien === t.dzien).map(({ x, y }) => ({ x, y }));
    assert.deepEqual(t.punkty, swoje);
  }

  const piny = pinezki(html);
  assert.deepEqual(piny.map((x) => [x.klucz, x.numer]),
    [[KOLOSEUM, "1"], [PANTEON, "2"], [TREVI, "1"], [FORUM, "2"], [PINCIO, null]]);
  const pincio = piny.find((x) => x.klucz === PINCIO);
  assert.ok(pincio.pusta, "puste kółko");
  assert.ok(!/--dzien/.test(pincio.styl), "bez koloru dnia");
  assert.equal(pincio.opis, "Do zaplanowania: Taras widokowy Pincio");
  // Puste kółko nie używa klasy „pusty” (stan pusty E4/E6 rozpycha znacznik; weryfikacja MVP-1, W2).
  assert.ok(!/class="[^"]*\bpusty\b/.test(html));
});

test("F06-KA4: pinezka Panteonu podświetla Panteon na liście; Koloseum na liście podświetla swoją pinezkę", () => {
  const p = podroz(dzien1(), ID);
  // Kliknięcie pinezki Panteonu (app.js: przelaczPodswietlenie, potem panel od nowa).
  let aktywny = przelaczPodswietlenie(null, PANTEON);
  let html = kod(panelMapy(p, ekran({ pokaz: "1", aktywny })));
  assert.deepEqual(lista(html).map((x) => [x.klucz, x.aktywny, x.wcisniety]),
    [[KOLOSEUM, false, false], [PANTEON, true, true]]);
  const panteon = pinezki(html).find((x) => x.klucz === PANTEON);
  assert.ok(panteon.aktywna && panteon.wcisnieta);
  assert.equal(panteon.podpis, "Panteon", "aktywna pinezka ma podpis z nazwą");

  // Kliknięcie Koloseum na liście pod mapą.
  aktywny = przelaczPodswietlenie(aktywny, KOLOSEUM);
  html = kod(panelMapy(p, ekran({ pokaz: "1", aktywny })));
  const piny = pinezki(html);
  assert.deepEqual(piny.map((x) => [x.klucz, x.aktywna, x.wcisnieta]), [[KOLOSEUM, true, true], [PANTEON, false, false]]);
  assert.equal(piny[0].podpis, "Koloseum");
  assert.deepEqual(lista(html).map((x) => x.aktywny), [true, false]);

  // Drugie kliknięcie tego samego punktu zdejmuje podświetlenie.
  assert.equal(przelaczPodswietlenie(KOLOSEUM, KOLOSEUM), null);
});

test("F06-KA5: punkt bez współrzędnych nie ma pinezki, a pod mapą jest „Brak współrzędnych…”", () => {
  const p = podroz(dzien1(), ID);
  const wpisy = wpisyMapy(p, 1).map((w) => (w.id === PANTEON ? { ...w, wsp: null } : w));
  const html = kod(panelMapy(p, ekran({ pokaz: "1" }), wpisy));
  assert.deepEqual(pinezki(html).map((x) => x.klucz), [KOLOSEUM]);
  assert.ok(html.includes("Brak współrzędnych, więc nie pokazano na mapie: Panteon."));
  assert.deepEqual(lista(html).map((x) => x.klucz), [KOLOSEUM], "lista pokazuje tylko punkty na mapie");
  assert.equal(linie(html).length, 0, "jedna pinezka w dniu → bez linii");
  // Gdy wszystkie mają współrzędne, tego tekstu nie ma.
  assert.ok(!kod(panelMapy(p, ekran({ pokaz: "1" }))).includes("Brak współrzędnych"));
});

// ---------- Panel, wybór „Pokaż” i przypadki brzegowe ----------

test("panel: tekst o mapie schematycznej i lista pokazanych punktów z numerami", () => {
  const p = podroz(dzien1(), ID);
  const html = kod(panelMapy(p, ekran({ pokaz: "1" })));
  assert.equal(OPIS_MAPY, "Mapa schematyczna bez podkładu. Trasa łączy punkty liniami prostymi w kolejności z planu, "
    + "osobno dla każdego dnia. Odległości i czasy przejazdu nie są wyznaczane.");
  assert.ok(html.includes(OPIS_MAPY));
  assert.match(html, /<ol class="lista-mapy" aria-label="Punkty na mapie">/);
  assert.deepEqual(lista(html).map((x) => x.tekst), ["1 Punkt 1: Koloseum", "2 Punkt 2: Panteon"]);
  // Siatka i oznaczenie północy.
  assert.match(html, /<g class="siatka">(<line [^>]+\/>)+<\/g>/);
  assert.match(html, /<span class="polnoc" aria-hidden="true">N ↑<\/span>/);
});

test("panel: „Pokaż” ma „Cała podróż” i każdy dzień; przy „Cała podróż” lista mówi, który to dzień", () => {
  const p = podroz(dzien1(), ID);
  const html = kod(panelMapy(p, ekran()));
  const opcje = [...html.matchAll(/<option value="([^"]+)"( selected)?>([^<]+)<\/option>/g)].map((m) => [m[1], m[3], Boolean(m[2])]);
  assert.deepEqual(opcje, [
    ["wszystko", "Cała podróż", true],
    ["1", "Dzień 1 · pt., 4.12", false],
    ["2", "Dzień 2 · sob., 5.12", false],
    ["3", "Dzień 3 · niedz., 6.12", false]
  ]);
  assert.match(html, /<label class="pokaz" for="pokaz-mapa">Pokaż\s*<select id="pokaz-mapa" data-zmiana="pokaz-mapa">/);
  assert.deepEqual(lista(html).map((x) => x.tekst),
    ["1 Punkt 1: Koloseum · Dzień 1", "2 Punkt 2: Panteon · Dzień 1", "Fontanna di Trevi · Do zaplanowania"]);
  assert.match(kod(panelMapy(p, ekran({ pokaz: "2" }))), /<option value="2" selected>/);
});

test("pokaz: dzień spoza podróży albo zła wartość → „Cała podróż”", () => {
  const p = podroz(zestawTestowy(), ID);
  assert.equal(pokazMapy(p, "2"), 2);
  assert.equal(pokazMapy(p, 3), 3);
  for (const zla of ["4", "0", "wszystko", "", null, "1.5", "abc"]) assert.equal(pokazMapy(p, zla), "wszystko", String(zla));
});

test("dzień bez punktów: „Brak punktów do pokazania na mapie”, bez pinezek i listy", () => {
  const p = podroz(dzien1(), ID);
  const html = kod(panelMapy(p, ekran({ pokaz: "3" })));
  assert.equal(BRAK_PUNKTOW_NA_MAPIE, "Brak punktów do pokazania na mapie");
  assert.match(html, /<p class="mapa-pusta">Brak punktów do pokazania na mapie<\/p>/);
  assert.equal(pinezki(html).length, 0);
  assert.ok(!html.includes("lista-mapy"));
});

test("jeden punkt w dniu: pinezka na środku mapy, bez linii", () => {
  const p = podroz(plan(przypisz(TREVI, 2)), ID);
  const html = kod(panelMapy(p, ekran({ pokaz: "2" })));
  const [pin] = pinezki(html);
  assert.equal(pin.styl, "left: 50.00%; top: 50.00%; --dzien: var(--dzien-2)");
  assert.equal(linie(html).length, 0);
});

test("„Miejsce niedostępne” (usunięte z katalogu) nie ma pinezki i jest w tekście o braku współrzędnych", () => {
  const stan = dzien1();
  stan.podroze[0].punkty.push({ miejsce: "usuniete-miejsce", dzien: 1 });
  const p = podroz(stan, ID);
  const html = kod(panelMapy(p, ekran({ pokaz: "1" })));
  assert.deepEqual(pinezki(html).map((x) => x.numer), ["1", "2"]);
  assert.ok(html.includes("Brak współrzędnych, więc nie pokazano na mapie: Miejsce niedostępne."));
});

test("pinezki są przyciskami z opisem dla czytnika ekranu (Tab, Enter)", () => {
  const p = podroz(dzien1(), ID);
  const piny = pinezki(kod(panelMapy(p, ekran({ pokaz: "1" }))));
  assert.deepEqual(piny.map((x) => x.opis), ["Dzień 1, punkt 1: Koloseum", "Dzień 1, punkt 2: Panteon"]);
  assert.ok(piny.every((x) => !x.wcisnieta));
});

// ---------- E7: układ z planem ----------

test("E7: panel mapy obok planu; przełącznik „Plan dni / Mapa” zaczyna od planu", () => {
  const p = podroz(dzien1(), ID);
  let html = kod(widokPodrozy(p, DZIS));
  assert.match(html, /<div class="podroz-uklad" data-panel="plan" data-podroz="p-test-rzym">/);
  assert.match(html, /<section class="karta-planu panel-mapy" id="panel-mapy" aria-labelledby="tytul-mapy">/);
  assert.match(html, /data-panel="plan" aria-pressed="true">Plan dni<\/button>/);
  assert.match(html, /data-panel="mapa" aria-pressed="false">Mapa<\/button>/);
  html = kod(widokPodrozy(p, DZIS, ekran({ panel: "mapa", pokaz: "1" })));
  assert.match(html, /<div class="podroz-uklad" data-panel="mapa"/);
  assert.match(html, /data-panel="mapa" aria-pressed="true">Mapa<\/button>/);
  assert.equal(pinezki(html).length, 2);
});

test("wygląd: na telefonie widać jedną kolumnę, od 900 px obie; pinezka ma obszar 44 × 44 px", () => {
  const css = fs.readFileSync(path.join(KATALOG, "style.css"), "utf8");
  assert.match(css, /\.podroz-uklad\[data-panel="plan"\] > \.panel-mapy,\s*\.podroz-uklad\[data-panel="mapa"\] > \.plan \{ display: none; \}/);
  // \r?\n: przy core.autocrlf=true git zapisuje style.css z końcami linii Windowsa (weryfikacja MVP-2, W3).
  const poczatek = css.search(/@media \(min-width: 900px\) \{\r?\n {2}\.przelacznik-panelu/);
  assert.ok(poczatek >= 0, "jest blok @media od 900 px z przełącznikiem");
  const od900 = css.slice(poczatek);
  assert.match(od900, /\.przelacznik-panelu \{ display: none; \}/);
  assert.match(od900, /position: sticky;/);
  const pinezka = css.match(/\.pinezka \{[^}]*\}/)?.[0] ?? "";
  assert.match(pinezka, /width: 44px;/);
  assert.match(pinezka, /height: 44px;/);
  // Numer na pinezce to ten sam duży tekst co w planie (19,2 px, DEC-21): .pinezka .numer nie zmienia rozmiaru.
  assert.ok(!/\.pinezka[^{]*\.numer \{[^}]*font-size/.test(css));
});

test("wygląd: puste kółko „Do zaplanowania” leży pod pinezkami z numerami (weryfikacja MVP-2, W1a)", () => {
  // Pinezki „Do zaplanowania” są w HTML na końcu, więc bez niższej warstwy przykrywały numery w tym samym miejscu.
  const css = fs.readFileSync(path.join(KATALOG, "style.css"), "utf8");
  const warstwa = (selektor) => {
    const m = css.match(new RegExp(`${selektor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{[^}]*z-index: (\\d+)`));
    assert.ok(m, selektor);
    return { z: Number(m[1]), pozycja: m.index };
  };
  const zwykla = warstwa(".pinezka");
  const pusta = warstwa(".pinezka:has(.kolko-puste)");
  const fokus = warstwa(".pinezka:hover, .pinezka:focus-visible");
  const aktywna = warstwa(".pinezka.aktywna");
  assert.ok(pusta.z < zwykla.z, "puste kółko niżej niż pinezka z numerem");
  // Ta sama szczegółowość selektorów, więc najechanie, fokus i podświetlenie muszą stać w CSS po regule pustego kółka.
  assert.ok(fokus.pozycja > pusta.pozycja && fokus.z > zwykla.z);
  assert.ok(aktywna.pozycja > pusta.pozycja && aktywna.z > fokus.z);
  // „Cała podróż”: pinezki dni są w HTML przed pustymi kółkami, kolejność listy i Tab bez zmian (F06-KA3).
  const stan = plan((s) => dodajPunkty(s, ID, [PINCIO]), przypisz(KOLOSEUM, 1));
  const piny = pinezki(kod(panelMapy(podroz(stan, ID), ekran())));
  assert.deepEqual(piny.map((x) => x.pusta), [false, true, true, true]);
});
