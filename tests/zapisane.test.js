// F02 · Zapisywanie miejsc: KA1–KA6, N2, N5 i przypadki brzegowe.
// Kliknięcie serca = operacja przelaczZapis() + zatwierdz() (to robi app.js) i HTML widoków po niej (plan, sekcja 7).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { wczytaj, zapisz, zatwierdz, pusteDane, atrapaPamieci, atrapaBlokujaca, KOMUNIKATY } from "../src/magazyn.js";
import { przelaczZapis, czyZapisane, zapisaneMiejsca, liczbaZapisanych, wPodrozy } from "../src/stan.js";
import { widokZapisane, komunikatZapisu } from "../src/widoki/zapisane.js";
import { widokOdkrywaj, kartaMiejsca } from "../src/widoki/odkrywaj.js";
import { widokMiejsca } from "../src/widoki/miejsce.js";
import { widokMenu } from "../src/widoki/menu.js";
import { miejsce } from "../src/dane/katalog.js";
import { zestawTestowy } from "../src/dane/zestaw-testowy.js";

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tekst = (b) => b.toString();
const KOLOSEUM = "rzym-koloseum";
const PANTEON = "rzym-panteon";
const T1 = new Date("2026-11-24T18:00:00.000Z");
const T2 = new Date("2026-11-24T18:01:00.000Z");

/** Atrybuty serca danego miejsca w HTML (karta albo E3). */
function serceW(kod, id) {
  const m = kod.match(new RegExp(`<button[^>]*data-akcja="przelacz-zapis" data-id="${id}"[^>]*>`));
  return m?.[0] ?? null;
}
/** Licznik przy „Zapisane” w menu (liczba albo null, gdy go nie ma). */
function licznikMenu(kod) {
  const m = kod.match(/<span class="licznik">(?:<span class="sr">[^<]*<\/span>)?(\d+)/);
  return m ? Number(m[1]) : null;
}
/** Nazwy miejsc z kart w kolejności. */
const nazwyZKart = (kod) => [...kod.matchAll(/class="jak-link"[^>]*>([^<]*)</g)].map((m) => m[1]);

/** Kliknięcie serca tak jak w app.js: operacja, potem zapis; przy błędzie stan zostaje. */
function kliknijSerce(pamiec, trwaly, stan, id, teraz) {
  const { stan: nowy, zapisano } = przelaczZapis(stan, id, teraz);
  if (!zatwierdz(pamiec, trwaly, nowy)) return { stan, przyjete: false, komunikat: KOMUNIKATY.bladZapisu };
  return { stan: nowy, przyjete: true, komunikat: komunikatZapisu(miejsce(id).nazwa, zapisano, wPodrozy(nowy, id)) };
}

test("KA1: serce przy „Koloseum” jest wypełnione, a licznik przy „Zapisane” zmienia się z 0 na 1", () => {
  const pamiec = atrapaPamieci();
  const { stan: przed, trwaly } = wczytaj(pamiec);
  assert.equal(liczbaZapisanych(przed), 0);
  assert.equal(licznikMenu(tekst(widokMenu("odkrywaj", liczbaZapisanych(przed)))), null, "przy zerze licznika nie ma");
  assert.match(serceW(tekst(widokOdkrywaj(null, new Set())), KOLOSEUM), /aria-pressed="false"/);

  const { stan, komunikat } = kliknijSerce(pamiec, trwaly, przed, KOLOSEUM, T1);
  assert.equal(liczbaZapisanych(stan), 1);
  assert.equal(licznikMenu(tekst(widokMenu("odkrywaj", liczbaZapisanych(stan)))), 1);

  const zbior = new Set(stan.zapisane.map((z) => z.miejsce));
  const karta = tekst(kartaMiejsca(miejsce(KOLOSEUM), zbior));
  assert.match(serceW(karta, KOLOSEUM), /aria-pressed="true"/);
  assert.match(karta, /<svg[^>]*fill="currentColor"/, "serce wypełnione");
  assert.match(serceW(karta, KOLOSEUM), /aria-label="Zapisz: Koloseum"/);
  // E3 ma to samo serce (przycisk zapisu) w stanie „wciśnięty”.
  assert.match(serceW(tekst(widokMiejsca(miejsce(KOLOSEUM), true)), KOLOSEUM), /aria-pressed="true"/);
  assert.match(serceW(tekst(widokMiejsca(miejsce(KOLOSEUM), false)), KOLOSEUM), /aria-pressed="false"/);
  assert.equal(komunikat, "Zapisano „Koloseum”. Znajdziesz je w zakładce Zapisane.");
});

test("KA2: po zapisie „Koloseum”, potem „Panteon” na E4 „Panteon” jest pierwszy, a „Koloseum” drugi", () => {
  let stan = pusteDane();
  stan = przelaczZapis(stan, KOLOSEUM, T1).stan;
  stan = przelaczZapis(stan, PANTEON, T2).stan;
  assert.deepEqual(nazwyZKart(tekst(widokZapisane(stan))), ["Panteon", "Koloseum"]);
  // Ta sama chwila zapisu (np. szybkie kliknięcia): później kliknięte i tak jest pierwsze.
  let rowno = przelaczZapis(pusteDane(), KOLOSEUM, T1).stan;
  rowno = przelaczZapis(rowno, PANTEON, T1).stan;
  assert.deepEqual(zapisaneMiejsca(rowno).map((m) => m.nazwa), ["Panteon", "Koloseum"]);
  // Zestaw testowy ma zapisy w kolejności od najstarszego: E4 i tak pokazuje najnowszy na górze.
  assert.deepEqual(zapisaneMiejsca(zestawTestowy()).map((m) => m.id), ["rzym-trevi", "rzym-panteon", "rzym-koloseum"]);
});

test("KA3 / N5: zapisane miejsce zostaje na E4 po odświeżeniu strony (ponowne wczytanie)", () => {
  const pamiec = atrapaPamieci();
  const { stan, trwaly } = wczytaj(pamiec);
  kliknijSerce(pamiec, trwaly, stan, KOLOSEUM, T1);
  const poOdswiezeniu = wczytaj(pamiec);
  assert.equal(poOdswiezeniu.ostrzezenie, null);
  assert.deepEqual(poOdswiezeniu.stan.zapisane, [{ miejsce: KOLOSEUM, zapisano: T1.toISOString() }]);
  assert.deepEqual(nazwyZKart(tekst(widokZapisane(poOdswiezeniu.stan))), ["Koloseum"]);
});

test("KA4: ponowne kliknięcie usuwa miejsce z E4 i zmniejsza licznik; dwa szybkie kliknięcia nie tworzą dwóch zapisów", () => {
  const pamiec = atrapaPamieci();
  let { stan, trwaly } = wczytaj(pamiec);
  stan = kliknijSerce(pamiec, trwaly, stan, PANTEON, T1).stan;
  stan = kliknijSerce(pamiec, trwaly, stan, KOLOSEUM, T1).stan;
  assert.equal(liczbaZapisanych(stan), 2);

  const wynik = kliknijSerce(pamiec, trwaly, stan, KOLOSEUM, T2);
  assert.equal(liczbaZapisanych(wynik.stan), 1);
  assert.deepEqual(nazwyZKart(tekst(widokZapisane(wynik.stan))), ["Panteon"]);
  assert.equal(wynik.komunikat, "Usunięto „Koloseum” z Zapisanych.");
  assert.equal(wczytaj(pamiec).stan.zapisane.length, 1, "usunięcie też jest zapisane");

  // Dwa kliknięcia z rzędu: zapis i usunięcie, nigdy dwa zapisy tego samego miejsca.
  let szybko = pusteDane();
  szybko = przelaczZapis(szybko, KOLOSEUM, T1).stan;
  assert.equal(szybko.zapisane.length, 1);
  szybko = przelaczZapis(szybko, KOLOSEUM, T1).stan;
  assert.equal(szybko.zapisane.length, 0);
  assert.equal(czyZapisane(szybko, KOLOSEUM), false);
});

test("KA5: przeglądarka blokuje zapis → ostrzeżenie nad treścią, zapisywanie działa do zamknięcia strony (A5)", () => {
  const pamiec = atrapaBlokujaca();
  let { stan, ostrzezenie, trwaly } = wczytaj(pamiec);
  assert.equal(ostrzezenie, "Ta przeglądarka nie pozwala zapisywać danych. Wszystko zniknie po zamknięciu strony.");
  assert.equal(trwaly, false);

  const wynik = kliknijSerce(pamiec, trwaly, stan, KOLOSEUM, T1);
  assert.equal(wynik.przyjete, true, "w trybie tylko w pamięci zapis jest przyjęty");
  assert.equal(liczbaZapisanych(wynik.stan), 1);
  assert.deepEqual(nazwyZKart(tekst(widokZapisane(wynik.stan))), ["Koloseum"]);
  assert.equal(wczytaj(pamiec).stan.zapisane.length, 0, "po zamknięciu strony nic nie zostaje");

  // Ostrzeżenie jest w index.html nad treścią ekranu (przed #widok).
  const strona = fs.readFileSync(path.join(KATALOG, "index.html"), "utf8");
  assert.ok(strona.indexOf('id="ostrzezenie"') < strona.indexOf('id="widok"'));
});

test("błąd zapisu (np. brak miejsca): komunikat o błędzie, bez „Zapisano”, serce zgodne z tym, co zapisano", () => {
  const pamiec = atrapaPamieci();
  const { stan, trwaly } = wczytaj(pamiec);
  pamiec.setItem = () => { throw new Error("QuotaExceededError"); };
  const wynik = kliknijSerce(pamiec, trwaly, stan, KOLOSEUM, T1);
  assert.equal(wynik.przyjete, false);
  assert.equal(wynik.komunikat, "Nie udało się zapisać zmian. Spróbuj ponownie.");
  assert.equal(czyZapisane(wynik.stan, KOLOSEUM), false);
  assert.match(serceW(tekst(widokOdkrywaj(null, new Set(wynik.stan.zapisane.map((z) => z.miejsce)))), KOLOSEUM), /aria-pressed="false"/);
});

test("KA6 / N1: zapisywanie i usuwanie nie wysyła żadnego żądania sieciowego", () => {
  const wywolania = [];
  const szpieg = (nazwa) => (...a) => { wywolania.push(nazwa); };
  const stare = { fetch: globalThis.fetch, XMLHttpRequest: globalThis.XMLHttpRequest };
  globalThis.fetch = szpieg("fetch");
  globalThis.XMLHttpRequest = function () { wywolania.push("XMLHttpRequest"); };
  Object.defineProperty(globalThis.navigator, "sendBeacon", { value: szpieg("sendBeacon"), configurable: true, writable: true });
  try {
    const pamiec = atrapaPamieci();
    let { stan, trwaly } = wczytaj(pamiec);
    for (const [id, t] of [[KOLOSEUM, T1], [PANTEON, T2], [KOLOSEUM, T2]]) {
      stan = kliknijSerce(pamiec, trwaly, stan, id, t).stan;
      const zbior = new Set(stan.zapisane.map((z) => z.miejsce));
      widokOdkrywaj(null, zbior).toString();
      widokZapisane(stan).toString();
      widokMenu("zapisane", liczbaZapisanych(stan)).toString();
      widokMiejsca(miejsce(id), czyZapisane(stan, id)).toString();
    }
    wczytaj(pamiec);
  } finally {
    globalThis.fetch = stare.fetch;
    globalThis.XMLHttpRequest = stare.XMLHttpRequest;
    delete globalThis.navigator.sendBeacon;
  }
  assert.deepEqual(wywolania, []);
});

test("N2: usunięcie zapisu nie usuwa miejsca z podróży, a komunikat mówi, że w podróży zostaje", () => {
  const stan = zestawTestowy(); // Koloseum zapisane i w podróży „Testowy wyjazd: Rzym”
  const { stan: nowy, zapisano } = przelaczZapis(stan, KOLOSEUM, T1);
  assert.equal(zapisano, false);
  assert.deepEqual(nowy.podroze, stan.podroze);
  assert.ok(wPodrozy(nowy, KOLOSEUM));
  assert.equal(komunikatZapisu("Koloseum", false, true), "Usunięto „Koloseum” z Zapisanych. W podróży nadal zostaje.");
  assert.equal(stan.zapisane.length, 3, "operacja nie zmienia przekazanego stanu");
});

test("E4 pusty: „Nie masz jeszcze zapisanych miejsc” i przycisk „Odkrywaj miejsca”", () => {
  const kod = tekst(widokZapisane(pusteDane()));
  assert.match(kod, /Nie masz jeszcze zapisanych miejsc/);
  assert.match(kod, /<a class="btn glowny" href="#\/odkrywaj">Odkrywaj miejsca<\/a>/);
  assert.equal(nazwyZKart(kod).length, 0);
});

test("zapis miejsca, którego nie ma już w katalogu, nie psuje E4 i nie liczy się w menu (plan 5.4)", () => {
  const stan = { ...pusteDane(), zapisane: [
    { miejsce: "usuniete-z-katalogu", zapisano: T2.toISOString() },
    { miejsce: KOLOSEUM, zapisano: T1.toISOString() }
  ] };
  assert.deepEqual(nazwyZKart(tekst(widokZapisane(stan))), ["Koloseum"]);
  assert.equal(liczbaZapisanych(stan), 1);
  assert.equal(stan.zapisane.length, 2, "zapis zostaje w danych");
});

test("nazwa miejsca w sercu i komunikacie jest tekstem, nie kodem strony", () => {
  const m = { ...miejsce(KOLOSEUM), id: "x", nazwa: "<b>test</b>" };
  const kod = tekst(kartaMiejsca(m, new Set(["x"])));
  assert.ok(!kod.includes("<b>test</b>"));
  assert.match(kod, /aria-label="Zapisz: &lt;b&gt;test&lt;\/b&gt;"/);
});
