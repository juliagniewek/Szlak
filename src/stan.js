// Operacje na danych użytkownika (plan 5.2). Czyste funkcje: dostają stan i zwracają nowy,
// niczego nie zapisują i nie zmieniają przekazanego obiektu. Zapis robi app.js przez magazyn.js.
import { miejsce } from "./dane/katalog.js";

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
