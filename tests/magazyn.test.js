// Zapis danych użytkownika w przeglądarce: pusty start, wersje, uszkodzone dane, blokada zapisu (A5), N5.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  KLUCZ, KLUCZ_KOPII, WERSJA, KOMUNIKATY,
  wczytaj, zapisz, pusteDane, atrapaPamieci, atrapaBlokujaca
} from "../src/magazyn.js";
import { zestawTestowy } from "../src/dane/zestaw-testowy.js";
import { MIEJSCA } from "../src/dane/katalog.js";

test("pierwsze uruchomienie bez danych: puste dane, bez komunikatu i bez błędu", () => {
  const pamiec = atrapaPamieci();
  const wynik = wczytaj(pamiec);
  assert.deepEqual(wynik, { stan: { wersja: WERSJA, zapisane: [], podroze: [] }, ostrzezenie: null, trwaly: true });
  assert.equal(pamiec.getItem(KLUCZ), null, "samo wczytanie niczego nie zapisuje");
});

test("dane mają numer wersji formatu i własny klucz aplikacji", () => {
  assert.equal(KLUCZ, "szlak.app.dane");
  assert.equal(pusteDane().wersja, WERSJA);
  const pamiec = atrapaPamieci();
  assert.equal(zapisz(pamiec, pusteDane()), true);
  assert.equal(JSON.parse(pamiec.getItem(KLUCZ)).wersja, WERSJA);
});

test("N5: dane zostają po ponownym wczytaniu (odświeżenie strony)", () => {
  const pamiec = atrapaPamieci();
  assert.equal(zapisz(pamiec, zestawTestowy()), true);
  const poOdswiezeniu = wczytaj(pamiec);
  assert.deepEqual(poOdswiezeniu.stan, zestawTestowy());
  assert.equal(poOdswiezeniu.ostrzezenie, null);
});

test("dane prototypu pod innym kluczem nie są odczytywane ani zmieniane", () => {
  const pamiec = atrapaPamieci({ "szlak-dane-v1": '{"saved":["rzym-koloseum"]}' });
  assert.deepEqual(wczytaj(pamiec).stan, pusteDane());
  assert.equal(pamiec.getItem("szlak-dane-v1"), '{"saved":["rzym-koloseum"]}');
});

for (const [opis, tekst] of [
  ["niepoprawny JSON", "{to nie jest json"],
  ["nieznany kształt", '{"cos":"innego"}'],
  ["tablica zamiast obiektu", "[1,2,3]"],
  ["brak listy podróży", `{"wersja":${WERSJA},"zapisane":[]}`],
  ["wersja nowsza niż aplikacja", `{"wersja":${WERSJA + 1},"zapisane":[],"podroze":[]}`]
]) {
  test(`uszkodzone dane (${opis}): kopia zachowana, start z pustymi danymi i komunikat`, () => {
    const pamiec = atrapaPamieci({ [KLUCZ]: tekst });
    const wynik = wczytaj(pamiec);
    assert.deepEqual(wynik.stan, pusteDane());
    assert.equal(wynik.ostrzezenie, KOMUNIKATY.uszkodzone);
    assert.equal(wynik.trwaly, true);
    assert.equal(pamiec.getItem(KLUCZ_KOPII), tekst, "oryginał jest w kopii");
    assert.equal(pamiec.getItem(KLUCZ), tekst, "samo wczytanie nie kasuje danych");
  });
}

test("istniejąca kopia nie jest nadpisywana", () => {
  const pamiec = atrapaPamieci({ [KLUCZ]: "zepsute 2", [KLUCZ_KOPII]: "zepsute 1" });
  wczytaj(pamiec);
  assert.equal(pamiec.getItem(KLUCZ_KOPII), "zepsute 1");
});

test("drugie uszkodzenie: nowe dane trafiają do kolejnej kopii i zostają po zapisie (plan 5.3, W2)", () => {
  const pamiec = atrapaPamieci({ [KLUCZ]: "zepsute 2", [KLUCZ_KOPII]: "zepsute 1" });
  const wynik = wczytaj(pamiec);
  assert.equal(wynik.ostrzezenie, KOMUNIKATY.uszkodzone);
  assert.equal(wynik.trwaly, true);
  assert.equal(pamiec.getItem(KLUCZ_KOPII), "zepsute 1");
  assert.equal(pamiec.getItem("szlak.app.kopia.2"), "zepsute 2");
  // Pierwszy zapis zmian użytkownika zastępuje dane, ale żadnej kopii.
  assert.equal(zapisz(pamiec, wynik.stan), true);
  assert.equal(pamiec.getItem(KLUCZ_KOPII), "zepsute 1");
  assert.equal(pamiec.getItem("szlak.app.kopia.2"), "zepsute 2");
});

test("ten sam uszkodzony tekst przy kolejnych startach nie tworzy nowych kopii", () => {
  const pamiec = atrapaPamieci({ [KLUCZ]: "zepsute" });
  for (let i = 0; i < 3; i++) wczytaj(pamiec);
  assert.equal(pamiec.getItem(KLUCZ_KOPII), "zepsute");
  assert.equal(pamiec.getItem("szlak.app.kopia.2"), null);
});

test("migracja przy istniejącej kopii: oryginał sprzed migracji trafia do kolejnej kopii", () => {
  const stary = JSON.stringify({ wersja: 1, zapisane: [], podroze: [] });
  const pamiec = atrapaPamieci({ [KLUCZ]: stary, [KLUCZ_KOPII]: "zepsute 1" });
  const wynik = wczytaj(pamiec, { wersja: 2, migracje: { 1: (d) => ({ ...d, wersja: 2 }) } });
  assert.equal(wynik.stan.wersja, 2);
  assert.equal(pamiec.getItem(KLUCZ_KOPII), "zepsute 1");
  assert.equal(pamiec.getItem("szlak.app.kopia.2"), stary);
});

test("migracja ze starszej wersji: dane przeniesione, zapisane w nowej wersji, kopia oryginału", () => {
  const stary = JSON.stringify({ wersja: 1, zapisane: [{ miejsce: "rzym-koloseum", zapisano: "2026-11-20T18:00:00.000Z" }], podroze: [] });
  const pamiec = atrapaPamieci({ [KLUCZ]: stary });
  const migracje = { 1: (d) => ({ ...d, wersja: 2, nowePole: true }) };
  const wynik = wczytaj(pamiec, { wersja: 2, migracje });
  assert.equal(wynik.stan.wersja, 2);
  assert.equal(wynik.stan.nowePole, true);
  assert.equal(wynik.stan.zapisane.length, 1);
  assert.equal(JSON.parse(pamiec.getItem(KLUCZ)).wersja, 2);
  assert.equal(pamiec.getItem(KLUCZ_KOPII), stary);
});

test("brak migracji albo migracja bez podniesienia wersji: dane traktowane jak uszkodzone, nie kasowane", () => {
  const stary = JSON.stringify({ wersja: 1, zapisane: [], podroze: [] });
  for (const migracje of [{}, { 1: (d) => d }, { 1: () => { throw new Error("błąd"); } }]) {
    const pamiec = atrapaPamieci({ [KLUCZ]: stary });
    const wynik = wczytaj(pamiec, { wersja: 2, migracje });
    assert.equal(wynik.ostrzezenie, KOMUNIKATY.uszkodzone);
    assert.equal(pamiec.getItem(KLUCZ_KOPII), stary);
  }
});

test("A5: przeglądarka blokująca zapis → ostrzeżenie, tryb tylko w pamięci, zapis zwraca false", () => {
  const pamiec = atrapaBlokujaca();
  const wynik = wczytaj(pamiec);
  assert.equal(wynik.ostrzezenie, "Ta przeglądarka nie pozwala zapisywać danych. Wszystko zniknie po zamknięciu strony.");
  assert.equal(wynik.trwaly, false);
  assert.deepEqual(wynik.stan, pusteDane());
  assert.equal(zapisz(pamiec, zestawTestowy()), false);
});

test("A5: brak dostępu do pamięci przeglądarki (null albo błąd odczytu) → ostrzeżenie bez błędu", () => {
  assert.equal(wczytaj(null).ostrzezenie, KOMUNIKATY.blokada);
  const rzucajaca = { getItem() { throw new Error("SecurityError"); } };
  assert.equal(wczytaj(rzucajaca).ostrzezenie, KOMUNIKATY.blokada);
});

test("zapis odczytywalny, ale zablokowany: dane widoczne, zmiany nie są zapisywane", () => {
  const tekst = JSON.stringify(zestawTestowy());
  const pamiec = { ...atrapaBlokujaca(), getItem: (k) => (k === KLUCZ ? tekst : null) };
  const wynik = wczytaj(pamiec);
  assert.equal(wynik.stan.zapisane.length, 3);
  assert.equal(wynik.trwaly, false);
  assert.equal(wynik.ostrzezenie, KOMUNIKATY.blokada);
});

test("uszkodzone dane, gdy kopii nie da się zrobić: zmiany nie są zapisywane, żeby nie nadpisać danych", () => {
  const pamiec = atrapaPamieci({ [KLUCZ]: "zepsute" });
  const zwykly = pamiec.setItem;
  pamiec.setItem = (k, v) => {
    if (k === KLUCZ_KOPII) throw new Error("QuotaExceededError");
    zwykly(k, v);
  };
  const wynik = wczytaj(pamiec);
  assert.equal(wynik.trwaly, false);
  assert.equal(wynik.ostrzezenie, KOMUNIKATY.uszkodzoneBezKopii);
});

test("błąd zapisu w trakcie (np. brak miejsca) → zapisz zwraca false", () => {
  const pamiec = atrapaPamieci();
  pamiec.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.equal(zapisz(pamiec, pusteDane()), false);
});

test("KA3: zestaw testowy po załadowaniu to 3 zapisane miejsca i 1 podróż z 3 dniami", () => {
  const pamiec = atrapaPamieci();
  assert.equal(zapisz(pamiec, zestawTestowy()), true);
  const { stan } = wczytaj(pamiec);

  assert.deepEqual(stan.zapisane.map((z) => z.miejsce), ["rzym-koloseum", "rzym-panteon", "rzym-trevi"]);
  assert.equal(stan.podroze.length, 1);
  const p = stan.podroze[0];
  assert.equal(p.nazwa, "Testowy wyjazd: Rzym");
  assert.equal(p.start, "2026-12-04");
  assert.equal(p.koniec, "2026-12-06");
  // Liczba dni z dat, włącznie, liczona w UTC (plan 5.2).
  const dniZDat = (Date.parse(p.koniec + "T00:00:00Z") - Date.parse(p.start + "T00:00:00Z")) / 86400000 + 1;
  assert.equal(dniZDat, 3);
  // Wszystkie trzy miejsca są w „Do zaplanowania” (dzień 0) i istnieją w katalogu.
  assert.deepEqual(p.punkty.map((x) => x.dzien), [0, 0, 0]);
  for (const x of [...stan.zapisane, ...p.punkty]) assert.ok(MIEJSCA.some((m) => m.id === x.miejsce), x.miejsce);
});

test("zestaw testowy zwraca nową kopię (zmiana jednej nie psuje następnej)", () => {
  const a = zestawTestowy();
  a.zapisane.pop();
  assert.equal(zestawTestowy().zapisane.length, 3);
});
