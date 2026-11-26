// F03 · Wyszukiwanie i filtry: KA1–KA5 i przypadki brzegowe na czystych funkcjach (src/szukaj.js)
// i na HTML ekranu E2. Kliknięcie = operacja, którą wywołuje, plus HTML po niej (plan, sekcja 7).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MIEJSCA, KATEGORIE } from "../src/dane/katalog.js";
import {
  normalizuj, slowaHasla, wynikiSzukania, pustyStanSzukania, zmienFiltr, wyczysc, kraje, miasta
} from "../src/szukaj.js";
import { widokSzukaj, listaWynikow, tekstLiczbyWynikow, PODPOWIEDZI } from "../src/widoki/szukaj.js";
import { widokOdkrywaj, chipyKategorii, adresKategorii } from "../src/widoki/odkrywaj.js";
import { widokMenu } from "../src/widoki/menu.js";

const tekst = (bezpieczny) => bezpieczny.toString();
const policz = (napis, wzor) => (napis.match(wzor) ?? []).length;
const nazwyZKart = (kod) => [...kod.matchAll(/class="jak-link"[^>]*>([^<]*)</g)].map((m) => m[1]);
const zHaslem = (fraza) => ({ ...pustyStanSzukania(), fraza });

test("KA1: „rzym” daje 9 wyników, wszystkie z Rzymu; nad nimi „9 miejsc”", () => {
  const wyniki = wynikiSzukania(zHaslem("rzym"));
  assert.equal(wyniki.length, 9);
  assert.ok(wyniki.every((m) => m.miasto === "Rzym"));
  const kod = tekst(widokSzukaj(zHaslem("rzym")));
  assert.match(kod, /<p id="liczba-wynikow" class="liczba-wynikow" role="status">9 miejsc<\/p>/);
  assert.equal(policz(kod, /<article class="karta-miejsca">/g), 9);
});

test("KA2: „punkt widokowy” znajduje tylko kategorię Punkty widokowe, w tym Kopiec Kościuszki", () => {
  const wyniki = wynikiSzukania(zHaslem("punkt widokowy"));
  assert.ok(wyniki.length > 0);
  assert.ok(wyniki.every((m) => m.kategoria === "punkt"), wyniki.map((m) => m.nazwa).join(", "));
  assert.ok(wyniki.some((m) => m.nazwa === "Kopiec Kościuszki"));
  assert.equal(wyniki.length, MIEJSCA.filter((m) => m.kategoria === "punkt").length, "wszystkie punkty widokowe");
});

test("KA3: kraj Polska i kategoria Kawiarnie → tylko „Kawiarnia z sernikiem na Kazimierzu”", () => {
  let s = zmienFiltr(pustyStanSzukania(), "kraj", "Polska");
  s = zmienFiltr(s, "kategoria", "kawiarnia");
  assert.deepEqual(wynikiSzukania(s).map((m) => m.nazwa), ["Kawiarnia z sernikiem na Kazimierzu"]);
  const kod = tekst(widokSzukaj(s));
  assert.match(kod, /1 miejsce<\/p>/);
  assert.match(kod, /<option value="Polska" selected>Polska<\/option>/);
  assert.match(kod, /<option value="kawiarnia" selected>Kawiarnie<\/option>/);
});

test("KA4: „xyz” → „Nic nie znaleźliśmy”, podpowiedzi i przycisk, który przywraca 41 wyników", () => {
  const s = zHaslem("xyz");
  assert.equal(wynikiSzukania(s).length, 0);
  const kod = tekst(widokSzukaj(s));
  assert.match(kod, /<h2>Nic nie znaleźliśmy<\/h2>/);
  for (const p of PODPOWIEDZI) assert.ok(kod.includes(`data-akcja="podpowiedz" data-fraza="${p}">${p}</button>`), p);
  assert.match(kod, /<button type="button" class="btn" data-akcja="wyczysc-szukanie">Wyczyść wyszukiwanie i filtry<\/button>/);

  // Kliknięcie przycisku: wyczysc() (app.js, akcja „wyczysc-szukanie”), także przy ustawionych filtrach.
  const zFiltrami = zmienFiltr(zmienFiltr(s, "kraj", "Polska"), "kategoria", "plaza");
  const po = wyczysc(zFiltrami);
  assert.equal(wynikiSzukania(po).length, 41);
  assert.match(tekst(widokSzukaj(po)), /41 miejsc<\/p>/);
  assert.equal(policz(tekst(widokSzukaj(po)), /<article class="karta-miejsca">/g), 41);
});

test("KA5: sortowanie alfabetyczne bez hasła → pierwszy wynik „Alfama”", () => {
  const s = zmienFiltr(pustyStanSzukania(), "sortowanie", "alfabetycznie");
  const wyniki = wynikiSzukania(s);
  assert.equal(wyniki[0].nazwa, "Alfama");
  assert.equal(wyniki.length, 41);
  assert.equal(nazwyZKart(tekst(widokSzukaj(s)))[0], "Alfama");
  const nazwy = wyniki.map((m) => m.nazwa);
  assert.deepEqual(nazwy, [...nazwy].sort((a, b) => a.localeCompare(b, "pl")));
});

test("sortowanie Popularne: najpierw miejsca „popularne”, potem reszta w kolejności katalogu", () => {
  const wyniki = wynikiSzukania(pustyStanSzukania());
  const popularne = MIEJSCA.filter((m) => m.oznaczenia.includes("popularne"));
  const reszta = MIEJSCA.filter((m) => !m.oznaczenia.includes("popularne"));
  assert.deepEqual(wyniki, [...popularne, ...reszta]);
});

test("wielkość liter, polskie znaki i spacje na brzegach nie mają znaczenia", () => {
  const wzor = wynikiSzukania(zHaslem("kraków")).map((m) => m.id);
  assert.ok(wzor.length > 0);
  for (const f of ["KRAKOW", "Kraków", "  krakow  ", "kRaKóW "]) {
    assert.deepEqual(wynikiSzukania(zHaslem(f)).map((m) => m.id), wzor, f);
  }
  assert.equal(normalizuj("Łódź KRAKÓW"), "lodz krakow");
  assert.deepEqual(slowaHasla("  punkt   widokowy "), ["punk", "widoko"]);
  assert.deepEqual(wynikiSzukania(zHaslem("   ")).length, 41, "same spacje = brak hasła");
});

test("każde słowo musi pasować: nazwa, miasto, kraj albo kategoria", () => {
  const wyniki = wynikiSzukania(zHaslem("kawiarnia polska"));
  assert.deepEqual(wyniki.map((m) => m.nazwa), ["Kawiarnia z sernikiem na Kazimierzu"]);
  assert.ok(wynikiSzukania(zHaslem("włochy")).every((m) => m.kraj === "Włochy"));
  assert.equal(wynikiSzukania(zHaslem("rzym xyz")).length, 0);
});

test("lista miast zależy od kraju; zmiana kraju bez wybranego miasta zeruje filtr miasta", () => {
  assert.deepEqual(kraje(), [...new Set(MIEJSCA.map((m) => m.kraj))].sort((a, b) => a.localeCompare(b, "pl")));
  const wPolsce = miasta("Polska");
  assert.ok(wPolsce.length > 0 && wPolsce.every((c) => MIEJSCA.some((m) => m.miasto === c && m.kraj === "Polska")));

  let s = zmienFiltr(pustyStanSzukania(), "miasto", "Rzym");
  s = zmienFiltr(s, "kraj", "Włochy");
  assert.equal(s.miasto, "Rzym", "Rzym jest we Włoszech, zostaje");
  s = zmienFiltr(s, "kraj", "Polska");
  assert.equal(s.miasto, "", "w Polsce nie ma Rzymu → Wszystkie");
  const kod = tekst(widokSzukaj(s));
  assert.ok(!kod.includes(`<option value="Rzym"`), "lista miast tylko z Polski");
  assert.match(kod, /<select id="filtr-miasto"[^>]*>\s*<option value="" selected>Wszystkie<\/option>/);

  const przed = pustyStanSzukania();
  zmienFiltr(przed, "kraj", "Polska");
  assert.equal(przed.kraj, "", "zmienFiltr nie zmienia przekazanego stanu");
});

test("E2 (HTML): pole z etykietą, 4 listy, sortowanie bez „Wszystkie”; hasło jest tekstem, nie kodem", () => {
  const kod = tekst(widokSzukaj(zHaslem(`<b>"x"</b>`)));
  assert.match(kod, /<label for="pole-szukaj">Szukaj<\/label>/);
  assert.match(kod, /<input type="search" id="pole-szukaj" data-wpis="szukaj" value="&lt;b&gt;&quot;x&quot;&lt;\/b&gt;"/);
  for (const [klucz, podpis] of [["kategoria", "Kategoria"], ["kraj", "Kraj"], ["miasto", "Miasto lub region"], ["sortowanie", "Sortuj"]]) {
    assert.ok(kod.includes(`<label for="filtr-${klucz}">${podpis}</label>`), klucz);
  }
  const sortowanie = kod.match(/<select id="filtr-sortowanie"[\s\S]*?<\/select>/)[0];
  assert.ok(!sortowanie.includes("Wszystkie"));
  assert.match(sortowanie, /<option value="popularne" selected>Popularne<\/option>/);
  assert.equal(tekstLiczbyWynikow([]), "0 miejsc");
  assert.match(tekst(listaWynikow([])), /Nic nie znaleźliśmy/);
});

test("pkt 1: menu ma sekcję Szukaj z lupą i kolorem sekcji; jest aktywna na E2", () => {
  const kod = tekst(widokMenu("szukaj"));
  assert.match(kod, /<a class="menu-pozycja" href="#\/szukaj" data-sekcja="szukaj" style="--sekcja: var\(--sekcja-szukaj\)" aria-current="page">/);
  assert.ok(kod.includes('<circle cx="11" cy="11" r="7"/>'), "ikona lupy");
  const css = fs.readFileSync(new URL("../style.css", import.meta.url), "utf8");
  assert.match(css, /--sekcja-szukaj: #4F6D8A;/);
  assert.match(css, /\.menu \{[^}]*grid-template-columns: repeat\(4, 1fr\)/, "menu dolne na 4 pozycje");
});

test("pkt 5: E1 ma chipy wszystkich kategorii; chip otwiera E2 z wybraną kategorią", () => {
  const kod = tekst(widokOdkrywaj());
  assert.ok(kod.includes(tekst(chipyKategorii())));
  for (const [id, k] of Object.entries(KATEGORIE)) {
    assert.ok(kod.includes(`<a class="chip" href="#/szukaj/${id}">`) && kod.includes(`${k.etykieta}</a>`), id);
  }
  assert.equal(adresKategorii("kawiarnia"), "#/szukaj/kawiarnia");
  // Adres #/szukaj/kawiarnia → app.js zaczyna E2 od pustyStanSzukania("kawiarnia").
  const s = pustyStanSzukania("kawiarnia");
  assert.equal(s.kategoria, "kawiarnia");
  assert.ok(wynikiSzukania(s).every((m) => m.kategoria === "kawiarnia"));
  assert.match(tekst(widokSzukaj(s)), /<option value="kawiarnia" selected>Kawiarnie<\/option>/);
  assert.equal(pustyStanSzukania("nie-ma-takiej").kategoria, "", "nieznana kategoria w adresie → Wszystkie");
});

test("podpowiedź ustawia hasło i czyści filtry; wyczyszczenie zostawia sortowanie", () => {
  const s = zmienFiltr(zmienFiltr(zHaslem("xyz"), "sortowanie", "alfabetycznie"), "kraj", "Polska");
  const po = { ...wyczysc(s), fraza: "Lizbona" }; // app.js, akcja „podpowiedz”
  assert.equal(po.kraj, "");
  assert.equal(po.sortowanie, "alfabetycznie");
  assert.ok(wynikiSzukania(po).every((m) => m.miasto === "Lizbona"));
});

test("N1: wyszukiwanie niczego nie zapisuje ani nie wysyła", () => {
  for (const plik of ["../src/szukaj.js", "../src/widoki/szukaj.js"]) {
    const kod = fs.readFileSync(new URL(plik, import.meta.url), "utf8");
    assert.ok(!/localStorage|fetch\(|XMLHttpRequest|sendBeacon|WebSocket|zapisz\(|zatwierdz\(/.test(kod), plik);
  }
});
