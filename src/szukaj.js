// Wyszukiwanie i filtry (F03): dopasowanie haseł, filtry, sortowanie. Czyste funkcje na katalogu.
// Stan wyszukiwania trzyma app.js tylko na czas oglądania ekranu; nic nie jest zapisywane (F03, „Dane”).
import { MIEJSCA, KATEGORIE } from "./dane/katalog.js";

/** Tekst do porównania: małe litery, bez polskich znaków i akcentów („Łódź” → „lodz”). */
export function normalizuj(tekst) {
  return String(tekst)
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // znaki diakrytyczne po rozłożeniu (é → e)
}

/**
 * Słowa hasła po normalizacji, z obciętą końcówką jak w prototypie: najwyżej 2 litery,
 * ale zostają co najmniej 4 („widokowy” → „widoko”, więc pasuje do „widokowe”; „rzym” bez zmian).
 */
export function slowaHasla(fraza) {
  return normalizuj(fraza).trim().split(/\s+/).filter(Boolean)
    .map((s) => s.slice(0, Math.max(4, s.length - 2)));
}

/** Każde słowo hasła musi wystąpić w nazwie, mieście, kraju albo nazwie kategorii (F03, pkt 4). */
export function pasujeDoHasla(m, slowa) {
  const tekst = normalizuj(`${m.nazwa} ${m.miasto} ${m.kraj} ${KATEGORIE[m.kategoria].etykieta}`);
  return slowa.every((s) => tekst.includes(s));
}

export const SORTOWANIA = { popularne: "Popularne", alfabetycznie: "Alfabetycznie" };

/** Stan ekranu E2 bez hasła i filtrów. `kategoria` z chipu na E1 (F03, pkt 5). */
export function pustyStanSzukania(kategoria = "") {
  return { fraza: "", kategoria: KATEGORIE[kategoria] ? kategoria : "", kraj: "", miasto: "", sortowanie: "popularne" };
}

const alfabetycznie = (a, b) => a.localeCompare(b, "pl");

/** Kraje z katalogu, alfabetycznie. */
export function kraje() {
  return [...new Set(MIEJSCA.map((m) => m.kraj))].sort(alfabetycznie);
}

/** Miasta i regiony z katalogu, alfabetycznie; gdy wybrano kraj, tylko z tego kraju. */
export function miasta(kraj = "") {
  return [...new Set(MIEJSCA.filter((m) => !kraj || m.kraj === kraj).map((m) => m.miasto))].sort(alfabetycznie);
}

/**
 * Zmiana jednego filtra. Po zmianie kraju miasto spoza tego kraju wraca do „Wszystkie”
 * (F03, przypadki brzegowe). Zwraca nowy stan, nie zmienia przekazanego.
 */
export function zmienFiltr(s, klucz, wartosc) {
  const nowy = { ...s, [klucz]: String(wartosc ?? "") };
  if (klucz === "kraj" && nowy.miasto && !miasta(nowy.kraj).includes(nowy.miasto)) nowy.miasto = "";
  return nowy;
}

/** Wyczyszczenie hasła i filtrów; sortowanie zostaje (jak w prototypie). */
export function wyczysc(s) {
  return { ...pustyStanSzukania(), sortowanie: s.sortowanie };
}

/**
 * Wyniki wyszukiwania. Popularne: najpierw miejsca z oznaczeniem „popularne”, potem reszta,
 * w kolejności katalogu (plan 5.1). Alfabetycznie: po nazwie, według polskiego alfabetu.
 */
export function wynikiSzukania(s) {
  const slowa = slowaHasla(s.fraza ?? "");
  const wyniki = MIEJSCA.filter((m) =>
    (!s.kategoria || m.kategoria === s.kategoria) &&
    (!s.kraj || m.kraj === s.kraj) &&
    (!s.miasto || m.miasto === s.miasto) &&
    pasujeDoHasla(m, slowa));
  if (s.sortowanie === "alfabetycznie") return wyniki.sort((a, b) => alfabetycznie(a.nazwa, b.nazwa));
  const popularne = (m) => Number(m.oznaczenia.includes("popularne"));
  return wyniki.sort((a, b) => popularne(b) - popularne(a)); // sortowanie stabilne: reszta w kolejności katalogu
}
