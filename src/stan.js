// Operacje na danych użytkownika (plan 5.2). Czyste funkcje: dostają stan i zwracają nowy,
// niczego nie zapisują i nie zmieniają przekazanego obiektu. Zapis robi app.js przez magazyn.js.
import { miejsce } from "./dane/katalog.js";
import { liczbaDni } from "./daty.js";

/** Czy miejsce jest zapisane (sercem). */
export function czyZapisane(stan, idMiejsca) {
  return stan.zapisane.some((z) => z.miejsce === idMiejsca);
}

/**
 * Zapisuje miejsce albo usuwa jego zapis (F02, sekcja 6: miejsce można zapisać tylko raz).
 * `teraz` to data zapisu (Date), podawana z zewnątrz, żeby testy były powtarzalne.
 * Zwraca { stan: nowy stan, zapisano: true = zapisane, false = usunięte }.
 * Nie dotyka podróży: usunięcie zapisu nie usuwa miejsca z podróży (N2).
 */
export function przelaczZapis(stan, idMiejsca, teraz) {
  if (czyZapisane(stan, idMiejsca)) {
    return {
      stan: { ...stan, zapisane: stan.zapisane.filter((z) => z.miejsce !== idMiejsca) },
      zapisano: false
    };
  }
  const zapis = { miejsce: idMiejsca, zapisano: teraz.toISOString() };
  // Nowy zapis na początku listy: przy tej samej dacie zapisu i tak jest pierwszy na E4.
  return { stan: { ...stan, zapisane: [zapis, ...stan.zapisane] }, zapisano: true };
}

/**
 * Zapisane miejsca z katalogu, najnowsze na górze (E4).
 * Zapis miejsca, którego nie ma już w katalogu, zostaje w danych, ale nie jest pokazywany (plan 5.4).
 */
export function zapisaneMiejsca(stan) {
  return stan.zapisane
    .map((z, i) => ({ z, i, m: miejsce(z.miejsce) }))
    .filter((x) => x.m)
    .sort((a, b) => Date.parse(b.z.zapisano) - Date.parse(a.z.zapisano) || a.i - b.i)
    .map((x) => x.m);
}

/** Licznik przy „Zapisane” w menu: tylko miejsca, które są w katalogu (plan 5.4). */
export function liczbaZapisanych(stan) {
  return stan.zapisane.filter((z) => miejsce(z.miejsce)).length;
}

/** Czy miejsce jest w którejś podróży (do komunikatu po usunięciu zapisu, N2). */
export function wPodrozy(stan, idMiejsca) {
  return stan.podroze.some((p) => p.punkty.some((pk) => pk.miejsce === idMiejsca));
}

// ---------- Podróże (F04) ----------

/** Podróż po identyfikatorze; undefined, gdy jej nie ma. */
export function podroz(stan, id) {
  return stan.podroze.find((p) => p.id === id);
}

/** Podróże do listy E6: najnowsza (data utworzenia) na górze. */
export function podrozeOdNajnowszej(stan) {
  return stan.podroze
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (Date.parse(b.p.utworzono) || 0) - (Date.parse(a.p.utworzono) || 0) || a.i - b.i)
    .map((x) => x.p);
}

/** Podróże, w których jest dane miejsce (do okna E3). */
export function podrozeZMiejscem(stan, idMiejsca) {
  return stan.podroze.filter((p) => p.punkty.some((pk) => pk.miejsce === idMiejsca));
}

/** Nowy identyfikator podróży: czas + losowy przyrostek, np. „p-mi8x2k1c-4f2a” (plan 5.2). */
export function nowyIdPodrozy(teraz = new Date(), losowa = Math.random) {
  return `p-${teraz.getTime().toString(36)}-${losowa().toString(36).slice(2, 6).padEnd(4, "0")}`;
}

/**
 * Tworzy podróż z danych po walidacji (walidujPodroz). `id` nadaje formularz przy otwarciu,
 * więc drugie kliknięcie „Utwórz podróż” z tym samym id nie tworzy drugiej podróży.
 * `miejsca` (id z katalogu) trafiają do „Do zaplanowania” (dzien: 0), każde najwyżej raz.
 * Zwraca { stan, utworzono }.
 */
export function utworzPodroz(stan, dane, { id, teraz, miejsca = [] }) {
  if (podroz(stan, id)) return { stan, utworzono: false };
  const nowa = {
    id,
    nazwa: dane.nazwa,
    kierunek: dane.kierunek,
    start: dane.start,
    koniec: dane.koniec,
    dniSzkicu: dane.dniSzkicu,
    opis: dane.opis,
    utworzono: teraz.toISOString(),
    punkty: [...new Set(miejsca)].map((m) => ({ miejsce: m, dzien: 0 }))
  };
  return { stan: { ...stan, podroze: [nowa, ...stan.podroze] }, utworzono: true };
}

/**
 * Zmienia dane podróży. Gdy podróż ma mniej dni niż wcześniej, punkty z usuniętych dni
 * wracają do „Do zaplanowania” na koniec listy (A6). Zwraca { stan, wrocilo: liczba takich punktów }.
 */
export function edytujPodroz(stan, id, dane) {
  const stara = podroz(stan, id);
  if (!stara) return { stan, wrocilo: 0 };
  const zmieniona = {
    ...stara,
    nazwa: dane.nazwa,
    kierunek: dane.kierunek,
    start: dane.start,
    koniec: dane.koniec,
    dniSzkicu: dane.dniSzkicu,
    opis: dane.opis
  };
  const dni = liczbaDni(zmieniona);
  const zostaja = stara.punkty.filter((pk) => pk.dzien <= dni);
  const wracaja = stara.punkty.filter((pk) => pk.dzien > dni).map((pk) => ({ ...pk, dzien: 0 }));
  zmieniona.punkty = [...zostaja, ...wracaja];
  return {
    stan: { ...stan, podroze: stan.podroze.map((p) => (p.id === id ? zmieniona : p)) },
    wrocilo: wracaja.length
  };
}

/** Usuwa podróż razem z jej punktami. Zapisane miejsca zostają (N2, A7). */
export function usunPodroz(stan, id) {
  return { ...stan, podroze: stan.podroze.filter((p) => p.id !== id) };
}

/**
 * Dodaje miejsce do „Do zaplanowania” w podróży (E3). Miejsce jest w podróży najwyżej raz (sekcja 6).
 * Zwraca { stan, dodano: false, gdy już było albo podróży nie ma }.
 */
export function dodajDoPodrozy(stan, idPodrozy, idMiejsca) {
  const p = podroz(stan, idPodrozy);
  if (!p || p.punkty.some((pk) => pk.miejsce === idMiejsca)) return { stan, dodano: false };
  const zmieniona = { ...p, punkty: [...p.punkty, { miejsce: idMiejsca, dzien: 0 }] };
  return {
    stan: { ...stan, podroze: stan.podroze.map((x) => (x.id === idPodrozy ? zmieniona : x)) },
    dodano: true
  };
}
