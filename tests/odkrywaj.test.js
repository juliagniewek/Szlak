// F01 · Układ aplikacji i Odkrywaj: KA2–KA4, KA7, KA8 i przypadki brzegowe na HTML z widoków.
// Kliknięcia sprawdzamy na poziomie widoku, który kliknięcie pokazuje (plan, sekcja 7).
import { test } from "node:test";
import assert from "node:assert/strict";
import { MIEJSCA, KIERUNKI, miejsce, adresStronyPliku } from "../src/dane/katalog.js";
import {
  widokOdkrywaj, miejscaSekcji, miejscaKierunku, adresKierunku, kartaMiejsca, zrodlaZdjec, KART_W_SEKCJI
} from "../src/widoki/odkrywaj.js";
import { widokMiejsca, formatWspolrzednych } from "../src/widoki/miejsce.js";
import { widokMenu, widokStopki, SEKCJE_MENU, TEKST_STOPKI } from "../src/widoki/menu.js";

const tekst = (bezpieczny) => bezpieczny.toString();
const policz = (napis, wzor) => (napis.match(wzor) ?? []).length;
const KARTA = /<article class="karta-miejsca">/g;

/** Nazwy miejsc z kart w HTML, w kolejności (nazwa jest w przycisku .jak-link). */
function nazwyZKart(kod) {
  return [...kod.matchAll(/class="jak-link"[^>]*>([^<]*)</g)].map((m) => m[1]);
}

test("KA1 (HTML): E1 ma 5 kierunków i sekcje Wyróżnione, Popularne, Na jesień i zimę, Mniej znane", () => {
  const kod = tekst(widokOdkrywaj());
  assert.equal(policz(kod, /<a class="kierunek"/g), 5);
  for (const naglowek of ["Wyróżnione kierunki", "Popularne miejsca", "Na jesień i zimę", "Mniej znane miejsca"]) {
    assert.ok(kod.includes(`<h2>${naglowek}</h2>`), naglowek);
  }
  assert.match(kod, /Zdjęcia: Wikimedia Commons/);
});

test("E1: każda sekcja ma najwyżej 8 kart, według oznaczeń, w kolejności katalogu", () => {
  for (const o of ["popularne", "jesien-zima", "mniej-znane"]) {
    const lista = miejscaSekcji(o);
    assert.ok(lista.length > 0 && lista.length <= KART_W_SEKCJI, o);
    assert.ok(lista.every((m) => m.oznaczenia.includes(o)), o);
    assert.deepEqual(lista, MIEJSCA.filter((m) => m.oznaczenia.includes(o)).slice(0, 8), o);
  }
  assert.equal(policz(tekst(widokOdkrywaj()), KARTA), 24);
});

test("KA2: kierunek „Lizbona” pokazuje dokładnie 9 miejsc, wszystkie z Lizbony", () => {
  const kierunek = KIERUNKI.find((k) => k.miasto === "Lizbona");
  assert.ok(tekst(widokOdkrywaj()).includes(`href="${adresKierunku(kierunek.miasto)}"`));

  const kod = tekst(widokOdkrywaj("Lizbona"));
  assert.match(kod, /<h1>Miejsca: Lizbona<\/h1>/);
  assert.match(kod, /href="#\/odkrywaj"[^>]*>← Wszystkie inspiracje/);
  assert.equal(policz(kod, KARTA), 9);
  const lokalizacje = [...kod.matchAll(/<p class="lokalizacja">([^<]*)<\/p>/g)].map((m) => m[1]);
  assert.equal(lokalizacje.length, 9);
  assert.ok(lokalizacje.every((l) => l === "Lizbona, Portugalia"), lokalizacje.join(" | "));
  assert.equal(miejscaKierunku("Lizbona").length, 9);
});

test("kierunek z polską literą działa w adresie (Kraków) i nieznany kierunek nie psuje ekranu", () => {
  assert.equal(adresKierunku("Kraków"), "#/odkrywaj/Krak%C3%B3w");
  assert.equal(decodeURIComponent(adresKierunku("Kraków").split("/")[2]), "Kraków");
  const kod = tekst(widokOdkrywaj("Atlantyda"));
  assert.equal(policz(kod, KARTA), 0);
  assert.match(kod, /Nie ma takiego kierunku/);
});

test("KA3: E3 „Koloseum” ma kategorię Kultura, lokalizację „Rzym, Włochy” i współrzędne „41.8902, 12.4922”", () => {
  const koloseum = miejsce("rzym-koloseum");
  assert.ok(tekst(kartaMiejsca(koloseum)).includes('data-akcja="otworz-miejsce" data-id="rzym-koloseum"'));

  const kod = tekst(widokMiejsca(koloseum));
  assert.match(kod, /<p class="etykieta">Kultura<\/p>/);
  assert.match(kod, /<h2 id="okno-tytul">Koloseum<\/h2>/);
  assert.match(kod, /<dt>Lokalizacja<\/dt><dd>Rzym, Włochy<\/dd>/);
  assert.match(kod, /<dt>Współrzędne<\/dt><dd>41\.8902, 12\.4922<\/dd>/);
  assert.ok(kod.includes(koloseum.opis));
  assert.match(kod, /data-akcja="zamknij-okno" aria-label="Zamknij"/);
  assert.match(kod, /960px-Colosseo_2020\.jpg/, "duże zdjęcie 960 px");
});

test("współrzędne: zawsze 4 miejsca po przecinku, brak współrzędnych → „brak”", () => {
  assert.equal(formatWspolrzednych([41.9, 12.5]), "41.9000, 12.5000");
  assert.equal(formatWspolrzednych(null), null);
  const bezWsp = { ...miejsce("rzym-koloseum"), wsp: null };
  assert.match(tekst(widokMiejsca(bezWsp)), /<dt>Współrzędne<\/dt><dd>brak<\/dd>/);
});

test("KA4: miejsce bez zdjęcia ma gradient i ikonę kategorii, bez <img>", () => {
  const ogrod = MIEJSCA.find((m) => m.nazwa === "Ogród Pomarańczowy na Awentynie");
  assert.equal(ogrod.zdjecie, null);
  for (const kod of [tekst(kartaMiejsca(ogrod)), tekst(widokMiejsca(ogrod))]) {
    assert.ok(!kod.includes("<img"), "bez obrazka");
    assert.match(kod, /class="zdjecie[^"]*" style="background: linear-gradient/);
    assert.match(kod, /<svg class="ikona"/);
  }
  assert.ok(!tekst(widokMiejsca(ogrod)).includes("Zdjęcie:"), "bez podpisu, gdy nie ma zdjęcia");
});

test("KA4: zdjęcie, które się nie wczyta, odsłania gradient i ikonę (ikona pod zdjęciem, app.js usuwa <img data-zdjecie>)", () => {
  const kod = tekst(kartaMiejsca(miejsce("rzym-koloseum")));
  assert.match(kod, /style="background: linear-gradient[^"]*">\s*<svg class="ikona"[\s\S]*<\/svg>\s*<img [^>]*data-zdjecie>/);
  assert.match(kod, /<img src="https:\/\/upload\.wikimedia\.org\/[^"]*\/500px-Colosseo_2020\.jpg" alt="Koloseum" loading="lazy" data-zdjecie>/);
  assert.ok(!/onerror/i.test(kod), "bez skryptów w atrybutach (CSP)");
});

test("KA7: E3 „Koloseum” ma podpis z autorem i licencją oraz odnośnik do strony pliku na Commons", () => {
  const koloseum = miejsce("rzym-koloseum");
  const kod = tekst(widokMiejsca(koloseum));
  const { autor, licencja } = koloseum.zdjecie;
  assert.ok(kod.includes(`Zdjęcie: ${autor}, ${licencja}`));
  assert.ok(kod.includes(`href="${adresStronyPliku(koloseum.zdjecie)}"`));
  assert.match(kod, /href="https:\/\/commons\.wikimedia\.org\/wiki\/File:Colosseo_2020\.jpg"/);
  // podpis jest pod zdjęciem
  assert.ok(kod.indexOf('class="zdjecie') < kod.indexOf("Zdjęcie:"));
});

test("KA7: „Źródła zdjęć” wymienia każde zdjęcie z katalogu (miejsca i kierunki)", () => {
  const kod = tekst(widokOdkrywaj());
  assert.match(kod, /<summary>Źródła zdjęć<\/summary>/);
  const wszystkie = [...MIEJSCA, ...KIERUNKI].filter((x) => x.zdjecie).map((x) => x.zdjecie);
  assert.equal(zrodlaZdjec().length, wszystkie.length);
  for (const z of wszystkie) {
    assert.ok(kod.includes(`href="${adresStronyPliku(z)}"`), z.plik);
    assert.ok(kod.includes(`${z.autor}, ${z.licencja}`.replace(/&/g, "&amp;").replace(/'/g, "&#39;")), z.plik);
  }
  assert.ok(tekst(widokOdkrywaj("Lizbona")).includes("<summary>Źródła zdjęć</summary>"), "także na liście kierunku");
});

test("KA8: stopka z informacją o danych, a „O danych” wymienia GitHub i Wikimedia", () => {
  const kod = tekst(widokStopki());
  assert.equal(TEKST_STOPKI, "Twoje dane zostają tylko w tej przeglądarce i znikną po jej wyczyszczeniu.");
  assert.ok(kod.includes(TEKST_STOPKI));
  assert.match(kod, /<summary>O danych<\/summary>/);
  assert.match(kod, /GitHub[^<]*adresy IP/);
  assert.match(kod, /Wikimedia[^<]*adres IP/);
});

test("KA8: stopka jest wstawiana na każdym ekranie (app.js renderuje ją niezależnie od sekcji)", async () => {
  const fs = await import("node:fs");
  const app = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const render = app.match(/function render\(\) \{[\s\S]*?\n\}/)?.[0] ?? "";
  assert.match(render, /getElementById\("stopka"\)\.innerHTML = widokStopki\(\)/);
  assert.ok(!/if\s*\(/.test(render), "stopka bez warunku");
});

test("KA5 (HTML): w menu wyróżniona jest tylko aktywna sekcja", () => {
  assert.deepEqual(SEKCJE_MENU.map((s) => s.tytul), ["Odkrywaj", "Zapisane", "Podróże"]);
  for (const aktywna of SEKCJE_MENU) {
    const kod = tekst(widokMenu(aktywna.id));
    assert.equal(policz(kod, /aria-current="page"/g), 1, aktywna.id);
    assert.match(kod, new RegExp(`data-sekcja="${aktywna.id}"[^>]*aria-current="page"`));
    assert.equal(policz(kod, /<svg class="ikona"/g), 3, "każda pozycja ma ikonę");
  }
});

test("długa nazwa i nazwa z apostrofem wyświetlają się jako tekst", () => {
  const trattoria = MIEJSCA.find((m) => m.nazwa === "Trattoria z domowym makaronem na Zatybrzu");
  assert.deepEqual(nazwyZKart(tekst(kartaMiejsca(trattoria))), ["Trattoria z domowym makaronem na Zatybrzu"]);

  const cortina = MIEJSCA.find((m) => m.nazwa.includes("Cortina"));
  assert.ok(cortina, "Cortina d'Ampezzo w katalogu");
  const kod = tekst(kartaMiejsca(cortina));
  assert.ok(kod.includes("Cortina d&#39;Ampezzo"), "apostrof jako encja; przeglądarka pokaże zwykły apostrof");
  assert.match(kod, /alt="Cortina d&#39;Ampezzo"/);
  // tekst spoza katalogu też zostaje tekstem
  const obce = { ...cortina, nazwa: "<b>test</b>" };
  assert.ok(tekst(kartaMiejsca(obce)).includes("&lt;b&gt;test&lt;/b&gt;"));
});

test("zdjęcia tylko w szerokościach 500 (karty, kierunki) i 960 (okno)", () => {
  const kod = tekst(widokOdkrywaj()) + MIEJSCA.map((m) => tekst(widokMiejsca(m))).join("");
  const szerokosci = new Set([...kod.matchAll(/\/(\d+)px-/g)].map((m) => Number(m[1])));
  assert.deepEqual([...szerokosci].sort((a, b) => a - b), [500, 960]);
});
