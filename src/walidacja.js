// Walidacja formularza podróży (F04, E5): reguły z sekcji 6 specyfikacji i A1–A2.
// Dostaje teksty z pól formularza, zwraca błędy przy polach albo gotowe dane podróży.
import { poprawnaData, dniMiedzy, MAKS_DNI } from "./daty.js";

/** Najdłuższe teksty (A2). */
export const LIMITY = { nazwa: 60, kierunek: 60, opis: 300 };

export const BLEDY = {
  brakNazwy: "Podaj nazwę podróży.",
  dlugaNazwa: `Nazwa może mieć najwyżej ${LIMITY.nazwa} znaków.`,
  brakKierunku: "Podaj kierunek podróży.",
  dlugiKierunek: `Kierunek może mieć najwyżej ${LIMITY.kierunek} znaków.`,
  dlugiOpis: `Opis może mieć najwyżej ${LIMITY.opis} znaków.`,
  jednaData: "Podaj obie daty albo zostaw obie puste.",
  zlaData: "Podaj poprawną datę.",
  koniecPrzedStartem: "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.",
  zaDlugo: `Podróż może mieć najwyżej ${MAKS_DNI} dni.`,
  dniSzkicu: `Liczba dni szkicu musi być liczbą od 1 do ${MAKS_DNI}.`
};

/** Liczba znaków tak, jak widzi ją użytkownik (emoji = 1 znak). */
const znaki = (tekst) => Array.from(tekst).length;

/**
 * Sprawdza pola formularza podróży: { nazwa, kierunek, start, koniec, dniSzkicu, opis } (teksty).
 * Zwraca { bledy, dane }: `bledy` to obiekt pole → komunikat (pusty, gdy wszystko w porządku),
 * `dane` to podróż do zapisu albo null, gdy są błędy.
 */
export function walidujPodroz(pola) {
  const tekst = (w) => (typeof w === "string" ? w : "");
  const nazwa = tekst(pola.nazwa).trim();
  const kierunek = tekst(pola.kierunek).trim();
  const opis = tekst(pola.opis).trim();
  const start = tekst(pola.start).trim();
  const koniec = tekst(pola.koniec).trim();
  const bledy = {};

  if (!nazwa) bledy.nazwa = BLEDY.brakNazwy;
  else if (znaki(nazwa) > LIMITY.nazwa) bledy.nazwa = BLEDY.dlugaNazwa;

  if (!kierunek) bledy.kierunek = BLEDY.brakKierunku;
  else if (znaki(kierunek) > LIMITY.kierunek) bledy.kierunek = BLEDY.dlugiKierunek;

  if (znaki(opis) > LIMITY.opis) bledy.opis = BLEDY.dlugiOpis;

  // Daty: obie albo żadna (sekcja 6); błąd przy polu, którego dotyczy (sekcja 9).
  let dniSzkicu = null;
  if (start && !poprawnaData(start)) bledy.start = BLEDY.zlaData;
  else if (koniec && !poprawnaData(koniec)) bledy.koniec = BLEDY.zlaData;
  else if (start && !koniec) bledy.koniec = BLEDY.jednaData;
  else if (!start && koniec) bledy.start = BLEDY.jednaData;
  else if (start && koniec) {
    if (koniec < start) bledy.koniec = BLEDY.koniecPrzedStartem;
    else if (dniMiedzy(start, koniec) > MAKS_DNI) bledy.koniec = BLEDY.zaDlugo;
  } else {
    // Bez dat liczy się liczba dni szkicu (A1).
    const surowe = tekst(pola.dniSzkicu).trim();
    const n = Number(surowe);
    if (!/^\d+$/.test(surowe) || n < 1 || n > MAKS_DNI) bledy.dniSzkicu = BLEDY.dniSzkicu;
    else dniSzkicu = n;
  }

  if (Object.keys(bledy).length) return { bledy, dane: null };
  return {
    bledy,
    dane: { nazwa, kierunek, start: start || null, koniec: koniec || null, dniSzkicu, opis }
  };
}
