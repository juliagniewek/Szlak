// F05 · Plan dni: KA1–KA6, N2, N5 i przypadki brzegowe.
// Kliknięcie = operacja, którą wywołuje app.js (stan.js → zatwierdz), plus HTML widoku po niej (plan, sekcja 7).
// Dane: podróż „Testowy wyjazd: Rzym” z zestawu testowego F00 (04–06.12.2026, 3 dni).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { wczytaj, zatwierdz, atrapaPamieci, KOMUNIKATY } from "../src/magazyn.js";
import {
  przypiszDoDnia, przeniesDoDnia, przesun, usunPunkt, dodajPunkty, planDnia, podroz, czyZapisane, przelaczZapis
} from "../src/stan.js";
import { dataDnia, nazwaDnia } from "../src/daty.js";
import { widokPodrozy, komunikatUsunieciaPunktu, komunikatDodaniaMiejsc } from "../src/widoki/plan.js";
import {
  widokDodawania, listaDodawania, przyciskiDodawania, miejscaDoDodania, normalizuj
} from "../src/widoki/dodaj-miejsca.js";
import { miejsce, MIEJSCA } from "../src/dane/katalog.js";
import { zestawTestowy } from "../src/dane/zestaw-testowy.js";

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tekst = (b) => b.toString();
const DZIS = "2026-11-26";
const ID = "p-test-rzym";
const KOLOSEUM = "rzym-koloseum";
const PANTEON = "rzym-panteon";
const TREVI = "rzym-trevi";

/** Zestaw testowy zapisany w atrapie pamięci (jak po „Załaduj zestaw testowy”). */
function start() {
  const pamiec = atrapaPamieci();
  zatwierdz(pamiec, true, zestawTestowy());
  const { stan, trwaly } = wczytaj(pamiec);
  return { pamiec, stan, trwaly };
}

/** To, co robi app.js po kliknięciu: zapis; przy błędzie stan zostaje poprzedni i jest komunikat o błędzie. */
function kliknij(pamiec, trwaly, stan, wynik) {
  const przyjete = wynik.zmieniono && zatwierdz(pamiec, trwaly, wynik.stan);
  return {
    stan: przyjete ? wynik.stan : stan,
    przyjete,
    komunikat: wynik.zmieniono && !przyjete ? KOMUNIKATY.bladZapisu : null
  };
}

/** Plan dnia jako [[nazwa, numer]]. */
const dzien = (stan, n) => planDnia(podroz(stan, ID), n).map((x) => [x.miejsce?.nazwa ?? null, x.numer]);

/** Fragment HTML jednej sekcji planu (0 = „Do zaplanowania”). */
function sekcja(kod, n) {
  const od = kod.lastIndexOf("<section", kod.indexOf(`aria-labelledby="tytul-dnia-${n}"`));
  const doo = kod.indexOf("<section", od + 1);
  return kod.slice(od, doo < 0 ? undefined : doo);
}

/** Fragment HTML punktu planu (od <li> do </li>) z danym id miejsca w danej sekcji. */
function punktW(kod, n, id) {
  const s = sekcja(kod, n);
  const i = s.indexOf(`data-id="${id}"`);
  if (i < 0) return null;
  return s.slice(s.lastIndexOf("<li", i), s.indexOf("</li>", i));
}

test("E7: nagłówek, „Do zaplanowania” z licznikiem i karty dni „Dzień 1 · pt., 4.12” z liczbą miejsc i kolorem", () => {
  const { stan } = start();
  const kod = tekst(widokPodrozy(podroz(stan, ID), DZIS));
  assert.match(kod, /<h1[^>]*>Testowy wyjazd: Rzym<\/h1>/);
  assert.match(kod, /Rzym · 04\.12\.2026 – 06\.12\.2026 · 3 dni · 3 miejsca/);
  assert.match(kod, /data-akcja="edytuj-podroz" data-id="p-test-rzym">Edytuj podróż</);
  assert.match(kod, /data-akcja="dodaj-miejsca"[^>]*>\+ Dodaj miejsca</);
  assert.match(kod, /Do zaplanowania <span class="znacznik">3<\/span>/);
  for (const [n, nazwa] of [[1, "Dzień 1 · pt., 4.12"], [2, "Dzień 2 · sob., 5.12"], [3, "Dzień 3 · niedz., 6.12"]]) {
    assert.ok(sekcja(kod, n).includes(`>${nazwa}</h2>`), nazwa);
    assert.ok(sekcja(kod, n).includes(`style="--dzien: var(--dzien-${n})"`), `kolor dnia ${n}`);
    assert.ok(sekcja(kod, n).includes("0 miejsc"), `liczba miejsc w dniu ${n}`);
  }
  assert.doesNotMatch(kod, /tytul-dnia-4/);
  // Punkt w „Do zaplanowania”: nazwa, kategoria, miasto, „Przypisz do dnia…”, ×.
  const pk = punktW(kod, 0, PANTEON);
  assert.match(pk, /Panteon/);
  assert.match(pk, /Kultura · Rzym/);
  assert.match(pk, /<option value="">Przypisz do dnia…<\/option>/);
  assert.match(pk, /<option value="1">Dzień 1 · pt\., 4\.12<\/option>/);
  assert.match(pk, /data-akcja="usun-punkt"[^>]*aria-label="Usuń z podróży: Panteon"/);
});

test("daty dni: „pt., 4.12”; szkic bez dat ma „Dzień 1”; kolory dni powtarzają się od dnia 8", () => {
  const p = podroz(zestawTestowy(), ID);
  assert.equal(dataDnia(p, 1), "pt., 4.12");
  assert.equal(nazwaDnia(p, 3), "Dzień 3 · niedz., 6.12");
  // Przejście przez miesiąc i rok, poniedziałek.
  const zima = { ...p, start: "2026-12-30", koniec: "2027-01-04" };
  assert.equal(nazwaDnia(zima, 6), "Dzień 6 · pon., 4.1");
  const szkic = { ...p, start: null, koniec: null, dniSzkicu: 9 };
  assert.equal(nazwaDnia(szkic, 1), "Dzień 1");
  const kod = tekst(widokPodrozy(szkic, DZIS));
  assert.ok(sekcja(kod, 1).includes(">Dzień 1</h2>"));
  assert.ok(sekcja(kod, 8).includes("var(--dzien-1)"), "dzień 8 ma kolor dnia 1");
  assert.ok(sekcja(kod, 9).includes("var(--dzien-2)"));
  assert.match(kod, /Szkic bez dat · 9 dni/);
});

test("KA1: „Przypisz do dnia” → „Dzień 1” przy Panteonie: numer 1 w dniu 1, znika z „Do zaplanowania”", () => {
  const { pamiec, stan, trwaly } = start();
  const wynik = kliknij(pamiec, trwaly, stan, przypiszDoDnia(stan, ID, PANTEON, 1));
  assert.equal(wynik.przyjete, true);
  assert.deepEqual(dzien(wynik.stan, 1), [["Panteon", 1]]);
  assert.deepEqual(dzien(wynik.stan, 0), [["Koloseum", null], ["Fontanna di Trevi", null]]);

  const kod = tekst(widokPodrozy(podroz(wynik.stan, ID), DZIS));
  assert.match(kod, /Do zaplanowania <span class="znacznik">2<\/span>/);
  assert.equal(punktW(kod, 0, PANTEON), null);
  assert.match(punktW(kod, 1, PANTEON), /<span class="numer"><span class="sr">Punkt <\/span>1<\/span>/);
  assert.ok(sekcja(kod, 1).includes("1 miejsce"));
});

test("KA2: Koloseum (1), Panteon (2), ↓ przy Koloseum → Panteon 1, Koloseum 2; ↑ przy pierwszym nieaktywne", () => {
  const { pamiec, trwaly } = start();
  let { stan } = start();
  stan = przypiszDoDnia(stan, ID, KOLOSEUM, 1).stan;
  stan = przypiszDoDnia(stan, ID, PANTEON, 1).stan;
  assert.deepEqual(dzien(stan, 1), [["Koloseum", 1], ["Panteon", 2]]);

  const wynik = kliknij(pamiec, trwaly, stan, przesun(stan, ID, KOLOSEUM, 1));
  assert.equal(wynik.przyjete, true);
  assert.deepEqual(dzien(wynik.stan, 1), [["Panteon", 1], ["Koloseum", 2]]);

  const kod = tekst(widokPodrozy(podroz(wynik.stan, ID), DZIS));
  assert.match(punktW(kod, 1, PANTEON), /data-akcja="przesun-wyzej"[^>]*aria-label="Przesuń wyżej: Panteon" disabled>/);
  assert.doesNotMatch(punktW(kod, 1, PANTEON), /aria-label="Przesuń niżej: Panteon" disabled/);
  assert.match(punktW(kod, 1, KOLOSEUM), /aria-label="Przesuń niżej: Koloseum" disabled>/);
  assert.doesNotMatch(punktW(kod, 1, KOLOSEUM), /aria-label="Przesuń wyżej: Koloseum" disabled/);

  // ↑ przy pierwszym i ↓ przy ostatnim nic nie zmieniają.
  assert.equal(przesun(wynik.stan, ID, PANTEON, -1).zmieniono, false);
  assert.equal(przesun(wynik.stan, ID, KOLOSEUM, 1).zmieniono, false);
});

test("KA3: punkt 1 z dnia 1 do dnia 2 → na koniec dnia 2, numeracja w obu dniach od 1 bez luk", () => {
  const { pamiec, trwaly } = start();
  let { stan } = start();
  stan = przypiszDoDnia(stan, ID, KOLOSEUM, 1).stan;
  stan = przypiszDoDnia(stan, ID, PANTEON, 1).stan;
  stan = przypiszDoDnia(stan, ID, TREVI, 2).stan;

  const wynik = kliknij(pamiec, trwaly, stan, przeniesDoDnia(stan, ID, KOLOSEUM, 2));
  assert.equal(wynik.przyjete, true);
  assert.deepEqual(dzien(wynik.stan, 1), [["Panteon", 1]]);
  assert.deepEqual(dzien(wynik.stan, 2), [["Fontanna di Trevi", 1], ["Koloseum", 2]]);

  const kod = tekst(widokPodrozy(podroz(wynik.stan, ID), DZIS));
  // „Przenieś do…”: inne dni i „Do zaplanowania”, bez bieżącego dnia.
  const lista = punktW(kod, 2, KOLOSEUM);
  assert.match(lista, /<option value="">Przenieś do…<\/option>/);
  assert.match(lista, /<option value="1">Dzień 1 · pt\., 4\.12<\/option>/);
  assert.match(lista, /<option value="3">Dzień 3 · niedz\., 6\.12<\/option>/);
  assert.doesNotMatch(lista, /<option value="2">/);
  assert.match(lista, /<option value="0">Do zaplanowania<\/option>/);

  // Z dnia do „Do zaplanowania”: na koniec listy, bez numeru; w dniu 2 zostaje numer 1.
  const doListy = przeniesDoDnia(wynik.stan, ID, TREVI, 0).stan;
  assert.deepEqual(dzien(doListy, 2), [["Koloseum", 1]]);
  assert.deepEqual(dzien(doListy, 0), [["Fontanna di Trevi", null]]);
});

test("KA4 / N2: × przy zapisanym miejscu → punkt znika z podróży, miejsce zostaje w Zapisanych", () => {
  const { pamiec, stan, trwaly } = start();
  const przed = przypiszDoDnia(stan, ID, KOLOSEUM, 1).stan;
  assert.equal(czyZapisane(przed, KOLOSEUM), true);
  const wynik = kliknij(pamiec, trwaly, przed, usunPunkt(przed, ID, KOLOSEUM));
  assert.equal(wynik.przyjete, true);
  assert.ok(!podroz(wynik.stan, ID).punkty.some((pk) => pk.miejsce === KOLOSEUM));
  assert.equal(czyZapisane(wynik.stan, KOLOSEUM), true);
  assert.deepEqual(wynik.stan.zapisane, przed.zapisane);
  assert.equal(komunikatUsunieciaPunktu("Koloseum", true), "Usunięto „Koloseum” z podróży. Miejsce zostaje w Zapisanych.");
  assert.equal(komunikatUsunieciaPunktu("Koloseum", false), "Usunięto „Koloseum” z podróży.");
  // Po odświeżeniu też.
  const odczyt = wczytaj(pamiec).stan;
  assert.equal(czyZapisane(odczyt, KOLOSEUM), true);
  assert.equal(podroz(odczyt, ID).punkty.length, 2);

  // I odwrotnie (N2): usunięcie zapisu zostawia punkt w podróży.
  const bezZapisu = przelaczZapis(przed, PANTEON, new Date()).stan;
  assert.ok(podroz(bezZapisu, ID).punkty.some((pk) => pk.miejsce === PANTEON));
  // × usuwa tylko z tej podróży; drugie kliknięcie nic nie zmienia.
  assert.equal(usunPunkt(wynik.stan, ID, KOLOSEUM).zmieniono, false);
});

test("KA5: E8 — wybór 2 miejsc i „Dodaj (2)” → oba w „Do zaplanowania”; miejsca z podróży nieaktywne", () => {
  const { pamiec, stan, trwaly } = start();
  const p = podroz(stan, ID);
  const wybrane = new Set(["rzym-forum", "rzym-zatybrze"]);
  assert.ok(wybrane.has("rzym-forum") && miejsce("rzym-forum") && miejsce("rzym-zatybrze"), "miejsca z katalogu");

  const okno = tekst(widokDodawania(stan, p, "", wybrane));
  assert.match(okno, /<h2 id="dodawanie-tytul">Dodaj miejsca<\/h2>/);
  assert.match(okno, /<label for="pole-szukaj-dodawanie">Szukaj w katalogu<\/label>/);
  assert.match(okno, /data-akcja="potwierdz-dodawanie"[^>]*>Dodaj \(2\)<\/button>/);
  for (const id of [KOLOSEUM, PANTEON, TREVI]) {
    assert.match(okno, new RegExp(`data-id="${id}" checked disabled>`), `${id} zaznaczone i nieaktywne`);
  }
  assert.match(okno, /data-id="rzym-forum" checked>/);
  assert.match(okno, /Koloseum\s*<span class="maly muted">· Rzym · już w podróży<\/span>/);
  assert.match(tekst(przyciskiDodawania(ID, 0)), /disabled>Dodaj \(0\)/);

  const wynik = kliknij(pamiec, trwaly, stan, dodajPunkty(stan, ID, [...wybrane]));
  assert.equal(dodajPunkty(stan, ID, [...wybrane]).dodano, 2);
  assert.deepEqual(dzien(wynik.stan, 0).map(([n]) => n), ["Koloseum", "Panteon", "Fontanna di Trevi", "Forum Romanum", miejsce("rzym-zatybrze").nazwa]);
  assert.equal(komunikatDodaniaMiejsc(2), "Dodano 2 miejsca do listy „Do zaplanowania”.");

  // Miejsca już w podróży nie dodają się drugi raz (także gdy ktoś obejdzie nieaktywne pole).
  const drugi = dodajPunkty(wynik.stan, ID, ["rzym-forum", KOLOSEUM, "rzym-forum"]);
  assert.equal(drugi.dodano, 0);
  assert.equal(drugi.stan, wynik.stan);
  // Powtórzenie w jednym wyborze i id spoza katalogu są pomijane.
  const trzeci = dodajPunkty(stan, ID, ["rzym-forum", "rzym-forum", "nie-ma-takiego"]);
  assert.equal(trzeci.dodano, 1);
});

test("E8: zapisane (♥) na górze, potem alfabetycznie; wyszukiwanie bez polskich znaków, każde słowo musi pasować", () => {
  const { stan } = start();
  const p = podroz(stan, ID);
  const lista = miejscaDoDodania(stan, p, "");
  assert.equal(lista.length, MIEJSCA.length);
  assert.deepEqual(lista.slice(0, 3).map((x) => x.miejsce.id).sort(), [KOLOSEUM, PANTEON, TREVI].sort());
  assert.ok(lista.slice(0, 3).every((x) => x.zapisane));
  const reszta = lista.slice(3).map((x) => x.miejsce.nazwa);
  assert.deepEqual(reszta, [...reszta].sort((a, b) => a.localeCompare(b, "pl")));
  assert.match(tekst(listaDodawania(stan, p, "", new Set())), /<span class="serduszko" aria-hidden="true">♥ <\/span><span class="sr">Zapisane: <\/span>Koloseum/);

  assert.equal(miejscaDoDodania(stan, p, "rzym").length, 9);
  assert.equal(normalizuj("Łódź KRAKÓW"), "lodz krakow");
  const kazimierz = miejscaDoDodania(stan, p, "kawiarnie krakow").map((x) => x.miejsce.nazwa);
  assert.ok(kazimierz.length >= 1 && kazimierz.every((n) => MIEJSCA.find((m) => m.nazwa === n).miasto === "Kraków"));
  assert.match(tekst(listaDodawania(stan, p, "xyz nie ma", new Set())), /Brak wyników\./);
});

test("KA6 / N5: ułożony plan (przypisanie i kolejność) jest taki sam po odświeżeniu strony", () => {
  const { pamiec, trwaly } = start();
  let { stan } = start();
  const kroki = [
    (s) => przypiszDoDnia(s, ID, KOLOSEUM, 1),
    (s) => przypiszDoDnia(s, ID, PANTEON, 1),
    (s) => przypiszDoDnia(s, ID, TREVI, 2),
    (s) => przesun(s, ID, PANTEON, -1),
    (s) => przeniesDoDnia(s, ID, TREVI, 1)
  ];
  for (const krok of kroki) {
    const w = kliknij(pamiec, trwaly, stan, krok(stan));
    assert.equal(w.przyjete, true);
    stan = w.stan;
  }
  assert.deepEqual(dzien(stan, 1), [["Panteon", 1], ["Koloseum", 2], ["Fontanna di Trevi", 3]]);
  const odswiezone = wczytaj(pamiec).stan;
  assert.deepEqual(odswiezone, stan);
  assert.equal(tekst(widokPodrozy(podroz(odswiezone, ID), DZIS)), tekst(widokPodrozy(podroz(stan, ID), DZIS)));
});

test("brzegowe: szybkie podwójne ↓ przesuwa o jedną albo dwie pozycje, punkt nie znika i się nie dubluje", () => {
  let { stan } = start();
  for (const id of [KOLOSEUM, PANTEON, TREVI]) stan = przypiszDoDnia(stan, ID, id, 1).stan;
  const raz = przesun(stan, ID, KOLOSEUM, 1).stan;
  const dwa = przesun(raz, ID, KOLOSEUM, 1).stan;
  const trzy = przesun(dwa, ID, KOLOSEUM, 1).stan; // już ostatni: bez zmian
  assert.deepEqual(dzien(raz, 1), [["Panteon", 1], ["Koloseum", 2], ["Fontanna di Trevi", 3]]);
  assert.deepEqual(dzien(dwa, 1), [["Panteon", 1], ["Fontanna di Trevi", 2], ["Koloseum", 3]]);
  assert.equal(trzy, dwa);

  // Dowolna seria operacji: zawsze te same miejsca, każde raz, numeracja od 1 bez luk.
  let losowa = 7;
  const los = (n) => (losowa = (losowa * 48271) % 2147483647) % n;
  const ids = [KOLOSEUM, PANTEON, TREVI, "rzym-forum"];
  stan = dodajPunkty(stan, ID, ["rzym-forum"]).stan;
  for (let i = 0; i < 300; i++) {
    const id = ids[los(ids.length)];
    const r = los(3);
    stan = (r === 0 ? przesun(stan, ID, id, los(2) ? 1 : -1) : przeniesDoDnia(stan, ID, id, los(4))).stan;
    const p = podroz(stan, ID);
    assert.deepEqual(p.punkty.map((pk) => pk.miejsce).sort(), [...ids].sort());
    for (const n of [1, 2, 3]) assert.deepEqual(planDnia(p, n).map((x) => x.numer), planDnia(p, n).map((_, k) => k + 1));
  }
});

test("brzegowe: błąd zapisu → komunikat o błędzie, widok pokazuje stan, który naprawdę zapisano", () => {
  const { pamiec, stan, trwaly } = start();
  pamiec.setItem = () => { throw new Error("QuotaExceededError"); };
  for (const operacja of [
    przypiszDoDnia(stan, ID, PANTEON, 1),
    usunPunkt(stan, ID, KOLOSEUM),
    dodajPunkty(stan, ID, ["rzym-forum"])
  ]) {
    const wynik = kliknij(pamiec, trwaly, stan, operacja);
    assert.equal(wynik.przyjete, false);
    assert.equal(wynik.komunikat, "Nie udało się zapisać zmian. Spróbuj ponownie.");
    assert.equal(wynik.stan, stan);
  }
  const kod = tekst(widokPodrozy(podroz(stan, ID), DZIS));
  assert.match(kod, /Do zaplanowania <span class="znacznik">3<\/span>/);
  assert.ok(punktW(kod, 0, PANTEON));
  assert.deepEqual(wczytaj(pamiec).stan, zestawTestowy());
});

test("brzegowe: dzień spoza podróży nie jest przyjmowany; podróż 1-dniowa ma jeden dzień do wyboru", () => {
  const { stan } = start();
  for (const zly of [4, -1, 1.5, NaN, "1"]) assert.equal(przeniesDoDnia(stan, ID, PANTEON, zly).zmieniono, false, String(zly));
  assert.equal(przeniesDoDnia(stan, ID, PANTEON, 0).zmieniono, false, "już jest w „Do zaplanowania”");
  assert.equal(przeniesDoDnia(stan, "p-nie-ma", PANTEON, 1).zmieniono, false);
  assert.equal(przeniesDoDnia(stan, ID, "rzym-forum", 1).zmieniono, false, "miejsca nie ma w podróży");

  const jeden = { ...podroz(stan, ID), start: null, koniec: null, dniSzkicu: 1 };
  const kod = tekst(widokPodrozy(jeden, DZIS));
  assert.equal((punktW(kod, 0, PANTEON).match(/<option value="\d+">/g) ?? []).length, 1);
});

test("stany puste: „Wszystkie miejsca są przypisane do dni.” i „Brak punktów…” w dniu", () => {
  let { stan } = start();
  for (const id of [KOLOSEUM, PANTEON, TREVI]) stan = przypiszDoDnia(stan, ID, id, 1).stan;
  const kod = tekst(widokPodrozy(podroz(stan, ID), DZIS));
  assert.match(sekcja(kod, 0), /Wszystkie miejsca są przypisane do dni\./);
  assert.match(sekcja(kod, 0), /Do zaplanowania <span class="znacznik">0<\/span>/);
  assert.match(sekcja(kod, 2), /Brak punktów\. Przypisz miejsca z listy „Do zaplanowania”\./);
  assert.doesNotMatch(sekcja(kod, 1), /Brak punktów/);
  // Podróż bez żadnych miejsc: zachęta do „+ Dodaj miejsca” zamiast „wszystkie są przypisane”.
  const pusta = tekst(widokPodrozy({ ...podroz(stan, ID), punkty: [] }, DZIS));
  assert.match(sekcja(pusta, 0), /Dodaj je przyciskiem „\+ Dodaj miejsca”/);
});

test("plan 5.4: „Miejsce niedostępne” bez numeru i strzałek, tylko ×; numeracja i ↑/↓ je pomijają", () => {
  const { stan } = start();
  const p = {
    ...podroz(stan, ID),
    punkty: [
      { miejsce: KOLOSEUM, dzien: 1 },
      { miejsce: "nie-ma-takiego", dzien: 1 },
      { miejsce: PANTEON, dzien: 1 },
      { miejsce: "tez-nie-ma", dzien: 0 }
    ]
  };
  assert.deepEqual(planDnia(p, 1).map((x) => x.numer), [1, null, 2]);
  const kod = tekst(widokPodrozy(p, DZIS));
  const niedostepny = punktW(kod, 1, "nie-ma-takiego");
  assert.match(niedostepny, /Miejsce niedostępne/);
  assert.match(niedostepny, /data-akcja="usun-punkt"/);
  assert.doesNotMatch(niedostepny, /przesun|przenies|class="numer">/);
  assert.doesNotMatch(punktW(kod, 0, "tez-nie-ma"), /Przypisz do dnia/);
  assert.match(punktW(kod, 1, PANTEON), /aria-label="Przesuń niżej: Panteon" disabled/);

  const s = { ...stan, podroze: [p] };
  const zamiana = przesun(s, ID, KOLOSEUM, 1).stan;
  assert.deepEqual(podroz(zamiana, ID).punkty.map((x) => x.miejsce), [PANTEON, "nie-ma-takiego", KOLOSEUM, "tez-nie-ma"]);
  assert.equal(przesun(s, ID, "nie-ma-takiego", 1).zmieniono, false);
  assert.equal(usunPunkt(s, ID, "nie-ma-takiego").zmieniono, true);
});

test("tekst użytkownika jako tekst: nazwa `<b>test</b>` w E7 i w oknie E8", () => {
  const { stan } = start();
  const p = { ...podroz(stan, ID), nazwa: "<b>test</b>", kierunek: "<i>x</i>", opis: "<script>alert(1)</script>" };
  for (const kod of [tekst(widokPodrozy(p, DZIS)), tekst(widokDodawania(stan, p, "<img src=x>", new Set()))]) {
    assert.ok(!kod.includes("<b>test</b>") && kod.includes("&lt;b&gt;test&lt;/b&gt;"));
    assert.ok(!kod.includes("<script>") && !kod.includes("<i>x</i>") && !kod.includes("<img src=x>"));
  }
});

test("N1: zmiany planu i dodawanie miejsc nie wysyłają żadnego żądania sieciowego", () => {
  const wywolania = [];
  const szpieg = (nazwa) => () => { wywolania.push(nazwa); };
  const stare = { fetch: globalThis.fetch, XMLHttpRequest: globalThis.XMLHttpRequest };
  globalThis.fetch = szpieg("fetch");
  globalThis.XMLHttpRequest = function () { wywolania.push("XMLHttpRequest"); };
  Object.defineProperty(globalThis.navigator, "sendBeacon", { value: szpieg("sendBeacon"), configurable: true, writable: true });
  try {
    const { pamiec, trwaly } = start();
    let { stan } = start();
    for (const op of [
      (s) => przypiszDoDnia(s, ID, KOLOSEUM, 1), (s) => przypiszDoDnia(s, ID, PANTEON, 1),
      (s) => przesun(s, ID, PANTEON, -1), (s) => przeniesDoDnia(s, ID, KOLOSEUM, 3),
      (s) => usunPunkt(s, ID, TREVI), (s) => dodajPunkty(s, ID, ["rzym-forum"])
    ]) {
      stan = kliknij(pamiec, trwaly, stan, op(stan)).stan;
      widokPodrozy(podroz(stan, ID), DZIS).toString();
      widokDodawania(stan, podroz(stan, ID), "rzym", new Set()).toString();
    }
    wczytaj(pamiec);
  } finally {
    globalThis.fetch = stare.fetch;
    globalThis.XMLHttpRequest = stare.XMLHttpRequest;
    delete globalThis.navigator.sendBeacon;
  }
  assert.deepEqual(wywolania, []);
});

test("wygląd: numer w kolorze dnia to duży pogrubiony tekst z kontrastem co najmniej 3:1 (WCAG AA)", () => {
  const css = fs.readFileSync(path.join(KATALOG, "style.css"), "utf8");
  const numer = css.match(/\n\.numer\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(numer, /color:\s*#fff/);
  assert.match(numer, /font-weight:\s*700/);
  const rem = Number(numer.match(/font-size:\s*([\d.]+)rem/)?.[1]);
  assert.ok(rem * 16 >= 18.66, `numer ma ${rem * 16} px, „duży tekst” od 18,66 px pogrubionego`);
  const jasnosc = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const kolory = [...css.matchAll(/--dzien-\d:\s*(#[0-9A-Fa-f]{6})/g)].map((m) => m[1]);
  assert.equal(kolory.length, 7);
  for (const k of kolory) {
    const kontrast = 1.05 / (jasnosc(k) + 0.05);
    assert.ok(kontrast >= 3, `biały na ${k}: ${kontrast.toFixed(2)}:1`);
  }
});

test("index.html ma okno <dialog> na E8", () => {
  const strona = fs.readFileSync(path.join(KATALOG, "index.html"), "utf8");
  assert.match(strona, /<dialog id="okno-dodawania" class="okno" aria-labelledby="dodawanie-tytul"><\/dialog>/);
});
