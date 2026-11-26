// F04 · Podróże: KA1–KA8, N2, N5 i przypadki brzegowe.
// Kliknięcie = operacja, którą wywołuje app.js (walidacja → stan → zatwierdz), plus HTML widoku po niej (plan, sekcja 7).
import { test } from "node:test";
import assert from "node:assert/strict";
import { wczytaj, zatwierdz, atrapaPamieci, atrapaBlokujaca, pusteDane, KOMUNIKATY } from "../src/magazyn.js";
import {
  przelaczZapis, utworzPodroz, edytujPodroz, usunPodroz, dodajDoPodrozy, podroz, podrozeOdNajnowszej,
  podrozeZMiejscem, nowyIdPodrozy, czyZapisane
} from "../src/stan.js";
import { walidujPodroz, BLEDY } from "../src/walidacja.js";
import { liczbaDni, statusPodrozy, zakresDat, odmiana, dzisiaj, poprawnaData } from "../src/daty.js";
import { widokZapisane, wybraneMiejsca } from "../src/widoki/zapisane.js";
import {
  widokFormularzaPodrozy, wartosciNowej, wartosciEdycji, najczestszeMiasto, KRAJE
} from "../src/widoki/formularz-podrozy.js";
import {
  widokPodroze, widokPodrozy, komunikatEdycji, komunikatDodania, KOMUNIKATY_PODROZY
} from "../src/widoki/podroze.js";
import { widokMiejsca } from "../src/widoki/miejsce.js";
import { miejsce, MIEJSCA, KIERUNKI } from "../src/dane/katalog.js";
import { zestawTestowy } from "../src/dane/zestaw-testowy.js";

const tekst = (b) => b.toString();
const T = new Date("2026-11-24T18:00:00.000Z");
const DZIS = "2026-11-24";
const RZYM = ["rzym-koloseum", "rzym-panteon", "rzym-trevi"];
const pola = (zmiany = {}) => ({ nazwa: "Wyjazd: Rzym", kierunek: "Rzym", start: "", koniec: "", dniSzkicu: "3", opis: "", ...zmiany });

/** Stan z zapisanymi miejscami (zapisane po kolei, ostatnie najnowsze). */
function zZapisanymi(ids) {
  let stan = pusteDane();
  ids.forEach((id, i) => {
    stan = przelaczZapis(stan, id, new Date(T.getTime() + i * 1000)).stan;
  });
  return stan;
}

/** „Utwórz podróż” tak jak w app.js: walidacja, operacja, zapis. Błąd zapisu → stan bez zmian. */
function wyslijNowa(pamiec, trwaly, stan, wartosci, { id = "p-test", miejsca = [] } = {}) {
  const { bledy, dane } = walidujPodroz(wartosci);
  if (!dane) return { stan, bledy, komunikat: null };
  const { stan: nowy, utworzono } = utworzPodroz(stan, dane, { id, teraz: T, miejsca });
  if (!utworzono) return { stan, bledy, komunikat: null };
  if (!zatwierdz(pamiec, trwaly, nowy)) return { stan, bledy, komunikat: null, bladZapisu: KOMUNIKATY.bladZapisu };
  return { stan: nowy, bledy, komunikat: KOMUNIKATY_PODROZY.utworzona };
}

/** Pola wyboru zaznaczone na E4 (id miejsc). */
const zaznaczoneW = (kod) => [...kod.matchAll(/data-zmiana="zaznacz" data-id="([^"]+)" checked/g)].map((m) => m[1]);
/** Wartość atrybutu value pola o danym id w HTML formularza. */
const wartoscPola = (kod, id) => kod.match(new RegExp(`id="${id}"[^>]*value="([^"]*)"`))?.[1];

test("E4: każda karta ma pole zaznaczenia, a pasek pokazuje „Zaznaczone: 3” i akcje", () => {
  const stan = zZapisanymi(RZYM);
  const kod = tekst(widokZapisane(stan, new Set(RZYM)));
  assert.equal([...kod.matchAll(/data-zmiana="zaznacz"/g)].length, 3);
  assert.deepEqual(zaznaczoneW(kod).sort(), [...RZYM].sort());
  assert.match(kod, /Zaznaczone: 3/);
  assert.match(kod, /data-akcja="podroz-z-wybranych">Utwórz podróż z wybranych/);
  assert.match(kod, /Zaznacz wszystkie/);
  assert.match(kod, /data-akcja="odznacz">Odznacz/);
  assert.match(kod, /<span class="sr">Zaznacz: Koloseum<\/span>/, "pole ma podpis z nazwą miejsca");

  const pusty = tekst(widokZapisane(stan, new Set()));
  assert.match(pusty, /Zaznaczone: 0/);
  assert.match(pusty, /data-akcja="podroz-z-wybranych" disabled/, "bez zaznaczenia przycisk jest nieaktywny");
});

test("KA1: 3 zaznaczone miejsca z Rzymu → formularz ma kierunek „Rzym” i nazwę „Wyjazd: Rzym”", () => {
  const stan = zZapisanymi(["lis-belem", ...RZYM]);
  const wybrane = wybraneMiejsca(stan, new Set(RZYM));
  assert.equal(wybrane.length, 3);
  const wartosci = wartosciNowej(wybrane);
  assert.equal(wartosci.kierunek, "Rzym");
  assert.equal(wartosci.nazwa, "Wyjazd: Rzym");

  const kod = tekst(widokFormularzaPodrozy({ tryb: "nowa", id: "p-1", miejsca: wybrane, wartosci }));
  assert.equal(wartoscPola(kod, "pole-kierunek"), "Rzym");
  assert.equal(wartoscPola(kod, "pole-nazwa"), "Wyjazd: Rzym");
  assert.match(kod, /<option value="Rzym" selected>Rzym \(Włochy\)<\/option>/, "lista pokazuje wybrany kierunek");
  assert.match(kod, /Nowa podróż: 3 miejsca/);
});

test("kierunek: najczęstsze miasto zaznaczonych miejsc; lista ma „Wybierz z listy…”, 5 kierunków i 4 kraje", () => {
  const m = (id) => miejsce(id);
  assert.equal(najczestszeMiasto([m("lis-belem"), m("rzym-koloseum"), m("rzym-panteon")]), "Rzym");
  assert.equal(najczestszeMiasto([]), "");
  assert.deepEqual(wartosciNowej([]), { nazwa: "", kierunek: "", start: "", koniec: "", dniSzkicu: "3", opis: "" });

  const kod = tekst(widokFormularzaPodrozy({ tryb: "nowa", id: "p-1", wartosci: wartosciNowej([]) }));
  assert.match(kod, /<option value="">Wybierz z listy…<\/option>/);
  assert.equal(KIERUNKI.length, 5);
  assert.deepEqual(KRAJE, ["Włochy", "Portugalia", "Polska", "Hiszpania"]);
  const opcje = [...kod.matchAll(/<option value="([^"]+)"/g)].map((x) => x[1]);
  assert.deepEqual(opcje, [...KIERUNKI.map((k) => k.miasto), ...KRAJE]);
  assert.match(kod, /data-zmiana="wybierz-kierunek"/, "wybór z listy wpisuje kierunek do pola (app.js)");
  // Każde pole ma etykietę (sekcja 9).
  for (const id of ["pole-nazwa", "pole-kierunek", "pole-lista-kierunkow", "pole-start", "pole-koniec", "pole-dni", "pole-opis"]) {
    assert.match(kod, new RegExp(`<label[^>]*for="${id}"`), id);
  }
});

test("KA2 / N5: daty 04.12–06.12.2026 → 3 dni, 3 miejsca w „Do zaplanowania”, wszystko zostaje po odświeżeniu", () => {
  const pamiec = atrapaPamieci();
  const { stan: start, trwaly } = wczytaj(pamiec);
  let stan = start;
  for (const id of RZYM) stan = przelaczZapis(stan, id, T).stan;
  const wynik = wyslijNowa(pamiec, trwaly, stan, pola({ start: "2026-12-04", koniec: "2026-12-06" }), { id: "p-rzym", miejsca: RZYM });
  assert.equal(wynik.komunikat, "Podróż utworzona. Przypisz miejsca do dni.");

  const p = podroz(wynik.stan, "p-rzym");
  assert.equal(liczbaDni(p), 3);
  assert.deepEqual(p.punkty, RZYM.map((m) => ({ miejsce: m, dzien: 0 })));
  assert.equal(p.dniSzkicu, null);

  // Odświeżenie strony = nowe wczytanie z tej samej pamięci.
  const poOdswiezeniu = wczytaj(pamiec).stan;
  assert.deepEqual(poOdswiezeniu, wynik.stan);
  const e7 = tekst(widokPodrozy(podroz(poOdswiezeniu, "p-rzym"), DZIS));
  assert.match(e7, /Do zaplanowania <span class="znacznik">3<\/span>/);
  assert.match(e7, /04\.12\.2026 – 06\.12\.2026 · 3 dni/);
  for (const id of RZYM) assert.ok(e7.includes(miejsce(id).nazwa));
  // Format dnia z karty F05 (decyzja właścicielki 26.11.2026; wcześniej podgląd F04 miał „Dzień 1 · 04.12”).
  assert.match(e7, /Dzień 1 · pt\., 4\.12/);
  assert.match(e7, /Dzień 3 · niedz\., 6\.12/);
  assert.doesNotMatch(e7, /Dzień 4/);
});

test("KA3: pusta nazwa → „Podaj nazwę podróży.” i podróż nie powstaje; 60 znaków tak, 61 nie", () => {
  const pamiec = atrapaPamieci();
  const { stan, trwaly } = wczytaj(pamiec);

  const pusta = wyslijNowa(pamiec, trwaly, stan, pola({ nazwa: "   " }));
  assert.equal(pusta.bledy.nazwa, "Podaj nazwę podróży.");
  assert.equal(pusta.stan.podroze.length, 0);
  assert.equal(wczytaj(pamiec).stan.podroze.length, 0, "nic nie zapisano");

  // Formularz pokazuje błąd przy polu i zachowuje wpisane dane.
  const kod = tekst(widokFormularzaPodrozy({ tryb: "nowa", id: "p-1", wartosci: pola({ nazwa: "", opis: "Weekend" }), bledy: pusta.bledy }));
  assert.match(kod, /id="pole-nazwa"[^>]*aria-invalid="true" aria-describedby="blad-nazwa"/);
  assert.match(kod, /<p class="blad-pola" id="blad-nazwa">Podaj nazwę podróży\.<\/p>/);
  assert.match(kod, />Weekend<\/textarea>/);

  const n60 = "a".repeat(60);
  const ok = wyslijNowa(pamiec, trwaly, stan, pola({ nazwa: n60 }), { id: "p-60" });
  assert.equal(podroz(ok.stan, "p-60").nazwa, n60);

  const za = wyslijNowa(pamiec, trwaly, stan, pola({ nazwa: "a".repeat(61) }), { id: "p-61" });
  assert.equal(za.bledy.nazwa, BLEDY.dlugaNazwa);
  assert.equal(podroz(za.stan, "p-61"), undefined);
});

test("A2: kierunek do 60 znaków i wymagany, opis do 300 znaków", () => {
  assert.equal(walidujPodroz(pola({ kierunek: "" })).bledy.kierunek, BLEDY.brakKierunku);
  assert.equal(walidujPodroz(pola({ kierunek: "k".repeat(61) })).bledy.kierunek, BLEDY.dlugiKierunek);
  assert.ok(walidujPodroz(pola({ kierunek: "k".repeat(60) })).dane);
  assert.ok(walidujPodroz(pola({ opis: "o".repeat(300) })).dane);
  assert.equal(walidujPodroz(pola({ opis: "o".repeat(301) })).bledy.opis, BLEDY.dlugiOpis);
});

test("KA4: jedna data, koniec przed początkiem, 30 i 31 dni", () => {
  assert.equal(walidujPodroz(pola({ start: "2026-12-04" })).bledy.koniec, "Podaj obie daty albo zostaw obie puste.");
  assert.equal(walidujPodroz(pola({ koniec: "2026-12-06" })).bledy.start, "Podaj obie daty albo zostaw obie puste.");
  assert.equal(
    walidujPodroz(pola({ start: "2026-12-06", koniec: "2026-12-04" })).bledy.koniec,
    "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia."
  );
  const trzydziesci = walidujPodroz(pola({ start: "2026-12-01", koniec: "2026-12-30" }));
  assert.ok(trzydziesci.dane, "30 dni zostaje zapisane");
  assert.equal(liczbaDni(trzydziesci.dane), 30);
  assert.equal(walidujPodroz(pola({ start: "2026-12-01", koniec: "2026-12-31" })).bledy.koniec, "Podróż może mieć najwyżej 30 dni.");
  // Przez zmianę czasu (koniec marca) liczba dni się nie zmienia.
  assert.equal(liczbaDni({ start: "2027-03-27", koniec: "2027-03-29" }), 3);
});

test("A1: liczba dni szkicu 1–30, domyślnie 3; z datami liczba dni szkicu jest pomijana", () => {
  assert.equal(walidujPodroz(pola({ dniSzkicu: "1" })).dane.dniSzkicu, 1);
  assert.equal(walidujPodroz(pola({ dniSzkicu: "30" })).dane.dniSzkicu, 30);
  for (const zle of ["0", "31", "", "2.5", "abc"]) {
    assert.equal(walidujPodroz(pola({ dniSzkicu: zle })).bledy.dniSzkicu, BLEDY.dniSzkicu, zle);
  }
  const zDatami = walidujPodroz(pola({ start: "2026-12-04", koniec: "2026-12-06", dniSzkicu: "99" }));
  assert.equal(zDatami.dane.dniSzkicu, null);
  assert.equal(walidujPodroz(pola({ start: "2026-02-30", koniec: "2026-03-02" })).bledy.start, BLEDY.zlaData);
  assert.ok(!poprawnaData("2026-13-01"));
});

test("KA5: skrócenie z 3 do 2 dni → 2 punkty z dnia 3 wracają do „Do zaplanowania” i komunikat A6", () => {
  const stan = {
    ...pusteDane(),
    podroze: [{
      id: "p-1", nazwa: "Wyjazd: Rzym", kierunek: "Rzym", start: "2026-12-04", koniec: "2026-12-06",
      dniSzkicu: null, opis: "", utworzono: T.toISOString(),
      punkty: [
        { miejsce: "rzym-koloseum", dzien: 3 },
        { miejsce: "rzym-panteon", dzien: 1 },
        { miejsce: "rzym-trevi", dzien: 3 },
        { miejsce: "rzym-forum", dzien: 0 }
      ]
    }]
  };
  const { dane } = walidujPodroz({ ...wartosciEdycji(stan.podroze[0]), koniec: "2026-12-05" });
  const { stan: nowy, wrocilo } = edytujPodroz(stan, "p-1", dane);
  assert.equal(wrocilo, 2);
  const p = podroz(nowy, "p-1");
  assert.equal(liczbaDni(p), 2);
  assert.deepEqual(p.punkty, [
    { miejsce: "rzym-panteon", dzien: 1 },
    { miejsce: "rzym-forum", dzien: 0 },
    { miejsce: "rzym-koloseum", dzien: 0 },
    { miejsce: "rzym-trevi", dzien: 0 }
  ], "wracają na koniec „Do zaplanowania”, w tej samej kolejności");
  assert.equal(komunikatEdycji(wrocilo), "Zapisano zmiany. 2 miejsca z usuniętych dni wróciły do „Do zaplanowania”.");
  assert.equal(stan.podroze[0].punkty[0].dzien, 3, "stary stan bez zmian");
});

test("A6: odmiana komunikatu po skróceniu (1 / 2 / 5 miejsc) i bez punktów do przeniesienia", () => {
  assert.equal(komunikatEdycji(0), "Zapisano zmiany.");
  assert.equal(komunikatEdycji(1), "Zapisano zmiany. 1 miejsce z usuniętych dni wróciło do „Do zaplanowania”.");
  assert.equal(komunikatEdycji(5), "Zapisano zmiany. 5 miejsc z usuniętych dni wróciło do „Do zaplanowania”.");
  assert.equal(komunikatEdycji(22), "Zapisano zmiany. 22 miejsca z usuniętych dni wróciły do „Do zaplanowania”.");
  assert.equal(odmiana(12, "a", "b", "c"), "c");
});

test("edycja: zmiana nazwy i przejście na szkic bez dat; formularz edycji ma obecne wartości", () => {
  const stan = zestawTestowy();
  const p = stan.podroze[0];
  const wartosci = wartosciEdycji(p);
  assert.deepEqual(wartosci, { nazwa: "Testowy wyjazd: Rzym", kierunek: "Rzym", start: "2026-12-04", koniec: "2026-12-06", dniSzkicu: "3", opis: "" });
  const kod = tekst(widokFormularzaPodrozy({ tryb: "edycja", id: p.id, wartosci }));
  assert.match(kod, /Edytuj podróż/);
  assert.match(kod, />Zapisz zmiany</);

  const { dane } = walidujPodroz({ ...wartosci, nazwa: "Rzym zimą", start: "", koniec: "", dniSzkicu: "4" });
  const { stan: nowy, wrocilo } = edytujPodroz(stan, p.id, dane);
  const zmieniona = podroz(nowy, p.id);
  assert.equal(wrocilo, 0);
  assert.equal(zmieniona.nazwa, "Rzym zimą");
  assert.equal(liczbaDni(zmieniona), 4);
  assert.equal(statusPodrozy(zmieniona, DZIS), "szkic");
  assert.equal(zmieniona.utworzono, p.utworzono);
});

test("KA6 / N2 / A7: usunięcie podróży po potwierdzeniu; miejsca zostają w Zapisanych; anulowanie nic nie zmienia", () => {
  const pamiec = atrapaPamieci();
  const { trwaly } = wczytaj(pamiec);
  const stan = zestawTestowy();
  zatwierdz(pamiec, trwaly, stan);

  /** Kliknięcie „Usuń” tak jak w app.js: pytanie, potem operacja i zapis. */
  const kliknijUsun = (s, id, potwierdzam) => {
    if (!potwierdzam) return s;
    const nowy = usunPodroz(s, id);
    return zatwierdz(pamiec, trwaly, nowy) ? nowy : s;
  };

  const poAnulowaniu = kliknijUsun(stan, "p-test-rzym", false);
  assert.equal(poAnulowaniu, stan);
  assert.match(tekst(widokPodroze(poAnulowaniu, DZIS)), /Testowy wyjazd: Rzym/);

  const poUsunieciu = kliknijUsun(stan, "p-test-rzym", true);
  assert.equal(poUsunieciu.podroze.length, 0);
  assert.doesNotMatch(tekst(widokPodroze(poUsunieciu, DZIS)), /Testowy wyjazd/);
  for (const id of RZYM) assert.ok(czyZapisane(poUsunieciu, id), `${id} zostaje w Zapisanych`);
  assert.deepEqual(poUsunieciu.zapisane, stan.zapisane);
  assert.deepEqual(wczytaj(pamiec).stan, poUsunieciu, "po odświeżeniu podróży nie ma");
});

test("KA7: nazwa `<b>test</b>` na liście podróży jest tekstem, nie pogrubieniem", () => {
  const { dane } = walidujPodroz(pola({ nazwa: "<b>test</b>", kierunek: "<i>x</i>", opis: "<script>alert(1)</script>" }));
  const { stan } = utworzPodroz(pusteDane(), dane, { id: "p-x", teraz: T });
  const lista = tekst(widokPodroze(stan, DZIS));
  assert.ok(lista.includes("&lt;b&gt;test&lt;/b&gt;"));
  assert.ok(!lista.includes("<b>test</b>"));
  assert.ok(!lista.includes("<i>x</i>"));
  const e7 = tekst(widokPodrozy(podroz(stan, "p-x"), DZIS));
  assert.ok(!e7.includes("<script>") && e7.includes("&lt;script&gt;"));
  const formularz = tekst(widokFormularzaPodrozy({ tryb: "edycja", id: "p-x", wartosci: wartosciEdycji(podroz(stan, "p-x")) }));
  assert.ok(!formularz.includes("<b>test</b>") && !formularz.includes("<script>"));
  const e3 = tekst(widokMiejsca(miejsce("rzym-koloseum"), false, stan.podroze, stan.podroze));
  assert.ok(!e3.includes("<b>test</b>"));
});

test("KA8 / DEC-16: status przy dzisiejszej dacie 24.11.2026", () => {
  const p = (start, koniec) => ({ start, koniec, dniSzkicu: start ? null : 3 });
  assert.equal(statusPodrozy(p("2026-12-04", "2026-12-06"), DZIS), "nadchodzaca");
  assert.equal(statusPodrozy(p("2026-11-20", "2026-11-30"), DZIS), "w-trakcie");
  assert.equal(statusPodrozy(p("2026-11-01", "2026-11-03"), DZIS), "zakonczona");
  assert.equal(statusPodrozy(p(null, null), DZIS), "szkic");
  assert.equal(statusPodrozy(p("2026-11-24", "2026-11-24"), DZIS), "w-trakcie", "pierwszy i ostatni dzień to „W trakcie”");

  const stan = { ...pusteDane(), podroze: [
    ["p-a", "Nadchodząca", "2026-12-04", "2026-12-06"], ["p-b", "Trwa", "2026-11-20", "2026-11-30"],
    ["p-c", "Była", "2026-11-01", "2026-11-03"], ["p-d", "Bez dat", null, null]
  ].map(([id, nazwa, start, koniec], i) => ({
    id, nazwa, kierunek: "Rzym", start, koniec, dniSzkicu: start ? null : 3, opis: "",
    utworzono: new Date(T.getTime() - i * 1000).toISOString(), punkty: []
  })) };
  const kod = tekst(widokPodroze(stan, DZIS));
  const etykiety = [...kod.matchAll(/<p class="status status-[\w-]+">([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(etykiety, ["Nadchodząca", "W trakcie", "Zakończona", "Szkic"]);
  assert.match(kod, /Rzym · Szkic bez dat/);
  assert.equal(dzisiaj(new Date(2026, 10, 24, 23, 30)), "2026-11-24", "dzisiaj według czasu lokalnego");
});

test("E6: lista od najnowszej, nazwa, kierunek, daty, liczba dni i miejsc, Otwórz / Edytuj / Usuń", () => {
  let stan = zestawTestowy();
  const { dane } = walidujPodroz(pola({ nazwa: "Lizbona", kierunek: "Lizbona", dniSzkicu: "1" }));
  stan = utworzPodroz(stan, dane, { id: "p-nowa", teraz: T, miejsca: ["lis-belem"] }).stan;
  assert.deepEqual(podrozeOdNajnowszej(stan).map((p) => p.id), ["p-nowa", "p-test-rzym"]);

  const kod = tekst(widokPodroze(stan, DZIS));
  assert.ok(kod.indexOf("Lizbona") < kod.indexOf("Testowy wyjazd: Rzym"), "najnowsza na górze");
  assert.match(kod, /Rzym · 04\.12\.2026 – 06\.12\.2026/);
  assert.match(kod, /<span class="znacznik">3 dni<\/span><span class="znacznik">3 miejsca<\/span>/);
  assert.match(kod, /<span class="znacznik">1 dzień<\/span><span class="znacznik">1 miejsce<\/span>/);
  assert.match(kod, /<a class="btn" href="#\/podroze\/p-test-rzym">Otwórz<span class="sr">: Testowy wyjazd: Rzym<\/span><\/a>/);
  assert.match(kod, /data-akcja="edytuj-podroz" data-id="p-test-rzym">Edytuj/);
  assert.match(kod, /class="btn usun" data-akcja="usun-podroz" data-id="p-test-rzym">Usuń/);
  assert.match(kod, /data-akcja="nowa-podroz">\+ Nowa podróż/);
  assert.equal(zakresDat({ start: null, koniec: null }), "Szkic bez dat");
});

test("E6 pusty: „Nie masz jeszcze podróży” z „+ Nowa podróż” i „Przejdź do Zapisanych”", () => {
  const kod = tekst(widokPodroze(pusteDane(), DZIS));
  assert.match(kod, /Nie masz jeszcze podróży/);
  assert.match(kod, /data-akcja="nowa-podroz">\+ Nowa podróż/);
  assert.match(kod, /href="#\/zapisane">Przejdź do Zapisanych/);
});

test("E3: „Dodaj do podróży” z listą podróży; miejsce trafia do „Do zaplanowania” najwyżej raz", () => {
  const stan = zestawTestowy();
  const forum = miejsce("rzym-forum");
  const kod = tekst(widokMiejsca(forum, false, podrozeOdNajnowszej(stan), podrozeZMiejscem(stan, forum.id)));
  assert.match(kod, /<h3 id="dodaj-tytul">Dodaj do podróży<\/h3>/);
  assert.match(kod, /<option value="p-test-rzym">Testowy wyjazd: Rzym<\/option>/);
  assert.match(kod, /<label class="sr" for="pole-podroz">Podróż<\/label>/);

  const { stan: nowy, dodano } = dodajDoPodrozy(stan, "p-test-rzym", forum.id);
  assert.ok(dodano);
  assert.deepEqual(podroz(nowy, "p-test-rzym").punkty.at(-1), { miejsce: "rzym-forum", dzien: 0 });
  assert.equal(komunikatDodania("Testowy wyjazd: Rzym", true), "Dodano do podróży „Testowy wyjazd: Rzym”, do listy „Do zaplanowania”.");
  assert.ok(!czyZapisane(nowy, forum.id), "dodanie do podróży nie zapisuje miejsca (N2)");
  assert.match(tekst(widokMiejsca(forum, false, nowy.podroze, podrozeZMiejscem(nowy, forum.id))), /W podróżach: „Testowy wyjazd: Rzym”/);

  const drugi = dodajDoPodrozy(nowy, "p-test-rzym", forum.id);
  assert.equal(drugi.dodano, false);
  assert.equal(drugi.stan, nowy);
  assert.equal(komunikatDodania("Testowy wyjazd: Rzym", false), "To miejsce jest już w podróży „Testowy wyjazd: Rzym”.");

  const bezPodrozy = tekst(widokMiejsca(forum, false, [], []));
  assert.match(bezPodrozy, /Nie masz jeszcze podróży/);
  assert.match(bezPodrozy, /data-akcja="nowa-podroz" data-id="rzym-forum">Utwórz podróż/);
});

test("brzegowe: kierunek spoza listy („Paryż”) można zapisać", () => {
  const { dane } = walidujPodroz(pola({ nazwa: "Wyjazd: Paryż", kierunek: "Paryż" }));
  const { stan } = utworzPodroz(pusteDane(), dane, { id: "p-paryz", teraz: T });
  assert.equal(podroz(stan, "p-paryz").kierunek, "Paryż");
  assert.equal(liczbaDni(podroz(stan, "p-paryz")), 3);
});

test("brzegowe: dwukrotne kliknięcie „Utwórz podróż” tworzy jedną podróż", () => {
  const pamiec = atrapaPamieci();
  const { stan: start, trwaly } = wczytaj(pamiec);
  const id = nowyIdPodrozy(T, () => 0.123456);
  assert.match(id, /^p-[0-9a-z]+-[0-9a-z]{4}$/);
  const raz = wyslijNowa(pamiec, trwaly, start, pola(), { id, miejsca: RZYM });
  const dwa = wyslijNowa(pamiec, trwaly, raz.stan, pola(), { id, miejsca: RZYM });
  assert.equal(dwa.stan.podroze.length, 1);
  assert.equal(dwa.komunikat, null, "drugie kliknięcie nie pokazuje drugiego komunikatu");
  assert.equal(wczytaj(pamiec).stan.podroze.length, 1);
  // To samo miejsce podane dwa razy trafia do podróży raz.
  const { dane } = walidujPodroz(pola());
  assert.equal(utworzPodroz(pusteDane(), dane, { id: "p-z", teraz: T, miejsca: ["rzym-trevi", "rzym-trevi"] }).stan.podroze[0].punkty.length, 1);
});

test("brzegowe: błąd zapisu → komunikat o błędzie, formularz z wpisanymi danymi, bez „Podróż utworzona”", () => {
  // Pamięć, która przyjmuje próbny zapis przy starcie, a potem odmawia (np. brak miejsca).
  const pamiec = atrapaPamieci();
  const { stan, trwaly } = wczytaj(pamiec);
  pamiec.setItem = () => { throw new Error("QuotaExceededError"); };
  const wartosci = pola({ nazwa: "Mój wyjazd", opis: "Weekend" });
  const wynik = wyslijNowa(pamiec, trwaly, stan, wartosci, { id: "p-blad" });
  assert.equal(wynik.komunikat, null);
  assert.equal(wynik.bladZapisu, "Nie udało się zapisać zmian. Spróbuj ponownie.");
  assert.equal(wynik.stan.podroze.length, 0);
  const kod = tekst(widokFormularzaPodrozy({ tryb: "nowa", id: "p-blad", wartosci, bladOgolny: wynik.bladZapisu }));
  assert.match(kod, /role="alert">Nie udało się zapisać zmian\. Spróbuj ponownie\./);
  assert.equal(wartoscPola(kod, "pole-nazwa"), "Mój wyjazd");
  assert.ok(!kod.includes(KOMUNIKATY_PODROZY.utworzona));
});

test("A5: przeglądarka blokuje zapis → podróż działa w pamięci do zamknięcia strony", () => {
  const pamiec = atrapaBlokujaca();
  const { stan, trwaly } = wczytaj(pamiec);
  assert.equal(trwaly, false);
  const wynik = wyslijNowa(pamiec, trwaly, stan, pola(), { id: "p-pam" });
  assert.equal(wynik.komunikat, KOMUNIKATY_PODROZY.utworzona);
  assert.ok(podroz(wynik.stan, "p-pam"));
});

test("E7: nieistniejąca podróż i punkt z miejscem spoza katalogu nie psują widoku", () => {
  assert.match(tekst(widokPodrozy(undefined, DZIS)), /Nie ma takiej podróży/);
  const p = { id: "p", nazwa: "X", kierunek: "Y", start: null, koniec: null, dniSzkicu: 2, opis: "", utworzono: T.toISOString(),
    punkty: [{ miejsce: "nie-ma-takiego", dzien: 1 }, { miejsce: "rzym-trevi", dzien: 9 }] };
  const kod = tekst(widokPodrozy(p, DZIS));
  assert.match(kod, /Miejsce niedostępne/);
  assert.match(kod, /Do zaplanowania <span class="znacznik">1<\/span>/, "dzień spoza zakresu pokazany w „Do zaplanowania”");
  assert.equal(MIEJSCA.some((m) => m.id === "nie-ma-takiego"), false);
});
