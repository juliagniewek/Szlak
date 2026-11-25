// Dane startowe katalogu: F00-KA2, F00-KA6, F00-KA8.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MIEJSCA, KIERUNKI, KATEGORIE, OZNACZENIA, SZEROKOSCI_ZDJEC,
  adresZdjecia, adresStronyPliku, miejsce
} from "../src/dane/katalog.js";

/** Zwraca listę problemów z miejscem katalogu (pusta lista = miejsce poprawne). */
function problemyMiejsca(m) {
  const problemy = [];
  for (const pole of ["id", "nazwa", "miasto", "kraj", "kategoria", "opis"]) {
    if (typeof m[pole] !== "string" || m[pole].trim() === "") problemy.push(`brak pola ${pole}`);
  }
  if (!(m.kategoria in KATEGORIE)) problemy.push(`kategoria spoza listy: ${m.kategoria}`);
  if (/\s/.test(m.id ?? "")) problemy.push("identyfikator ze spacją");
  if ((m.opis ?? "").length > 200) problemy.push("opis dłuższy niż 200 znaków");
  if (m.wsp !== null && m.wsp !== undefined) {
    const [szer, dl] = m.wsp;
    if (!(Math.abs(szer) <= 90 && Math.abs(dl) <= 180)) problemy.push("współrzędne poza zakresem");
  }
  for (const o of m.oznaczenia ?? []) if (!(o in OZNACZENIA)) problemy.push(`nieznane oznaczenie ${o}`);
  problemy.push(...problemyZdjecia(m.zdjecie));
  return problemy;
}

function problemyZdjecia(z) {
  if (z === null || z === undefined) return [];
  const problemy = [];
  if (!/^[0-9a-f]\/[0-9a-f]{2}\/[^/]+$/.test(z.plik ?? "")) problemy.push(`zła ścieżka pliku: ${z.plik}`);
  if (typeof z.autor !== "string" || z.autor.trim() === "") problemy.push(`brak autora zdjęcia ${z.plik}`);
  if (typeof z.licencja !== "string" || z.licencja.trim() === "") problemy.push(`brak licencji zdjęcia ${z.plik}`);
  return problemy;
}

test("KA2: katalog ma 41 miejsc i 5 kierunków", () => {
  assert.equal(MIEJSCA.length, 41);
  assert.equal(KIERUNKI.length, 5);
  assert.deepEqual(KIERUNKI.map((k) => k.miasto), ["Rzym", "Lizbona", "Kraków", "Barcelona", "Dolomity"]);
});

test("KA2: każde miejsce ma nazwę, miasto, kraj i kategorię z listy", () => {
  assert.equal(Object.keys(KATEGORIE).length, 8);
  for (const m of MIEJSCA) assert.deepEqual(problemyMiejsca(m), [], m.id);
});

test("identyfikatory miejsc są unikalne, a miejsce() znajduje je po identyfikatorze", () => {
  const ids = MIEJSCA.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(miejsce("rzym-koloseum").nazwa, "Koloseum");
  assert.equal(miejsce("nie-ma-takiego"), undefined);
});

test("każdy kierunek ma kraj, tekst i miejsca w katalogu", () => {
  for (const k of KIERUNKI) {
    assert.ok(k.kraj && k.tekst, k.miasto);
    assert.ok(MIEJSCA.some((m) => m.miasto === k.miasto && m.kraj === k.kraj), k.miasto);
  }
});

test("dane z katalogu, na których opierają się kryteria kolejnych kart", () => {
  const liczba = (miasto) => MIEJSCA.filter((m) => m.miasto === miasto).length;
  assert.equal(liczba("Lizbona"), 9);
  assert.equal(liczba("Rzym"), 9);
  assert.equal(miejsce("rzym-awentyn").zdjecie, null);
  assert.equal(miejsce("kra-kosciuszko").kategoria, "punkt");
});

test("KA6: miejsce bez współrzędnych albo zdjęcia jest poprawne i nie powoduje błędu", () => {
  const bezZdjec = MIEJSCA.filter((m) => m.zdjecie === null);
  assert.ok(bezZdjec.length > 0, "katalog ma miejsca bez zdjęcia");
  const bezWsp = { ...MIEJSCA[0], id: "test-bez-wsp", wsp: null, zdjecie: null };
  assert.deepEqual(problemyMiejsca(bezWsp), []);
  assert.equal(adresZdjecia(bezWsp.zdjecie), null);
  assert.equal(adresStronyPliku(bezWsp.zdjecie), null);
});

test("KA8: każde zdjęcie miejsca i kierunku ma niepusty autor i licencję (DEC-13)", () => {
  const zdjecia = [...MIEJSCA, ...KIERUNKI].map((x) => x.zdjecie).filter(Boolean);
  assert.ok(zdjecia.length >= 30);
  for (const z of zdjecia) assert.deepEqual(problemyZdjecia(z), [], z.plik);
  assert.deepEqual(problemyZdjecia({ plik: "d/de/A.jpg", autor: "", licencja: "CC BY 2.0" }), ["brak autora zdjęcia d/de/A.jpg"]);
});

test("adresy zdjęć używają tylko standardowych szerokości 500 i 960 px", () => {
  assert.deepEqual(SZEROKOSCI_ZDJEC, [500, 960]);
  const z = miejsce("rzym-koloseum").zdjecie;
  assert.equal(adresZdjecia(z), "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/500px-Colosseo_2020.jpg");
  assert.equal(adresZdjecia(z, 960), "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg");
  assert.throws(() => adresZdjecia(z, 640), /Niedozwolona szerokość/);
  assert.equal(adresStronyPliku(z), "https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg");
});
