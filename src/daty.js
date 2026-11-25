// Daty podróży (F04, plan 5.2): liczba dni, status, format „04.12.2026”, odmiana liczebników.
// Daty to teksty „RRRR-MM-DD” (jak w polu <input type="date">). Różnice liczymy w UTC,
// żeby zmiana czasu letniego nie zmieniała liczby dni. „Dzisiaj” podaje wywołujący (testy).

/** Najwięcej dni w podróży (A1). */
export const MAKS_DNI = 30;
/** Domyślna liczba dni szkicu bez dat (A1). */
export const DOMYSLNE_DNI_SZKICU = 3;

const DZIEN_MS = 24 * 60 * 60 * 1000;

/** Data „RRRR-MM-DD” jako liczba milisekund w UTC; null, gdy tekst nie jest prawdziwą datą (np. 2026-02-30). */
function wUtc(tekst) {
  if (typeof tekst !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(tekst)) return null;
  const [r, m, d] = tekst.split("-").map(Number);
  const czas = Date.UTC(r, m - 1, d);
  const data = new Date(czas);
  if (data.getUTCFullYear() !== r || data.getUTCMonth() !== m - 1 || data.getUTCDate() !== d) return null;
  return czas;
}

/** Czy tekst to poprawna data „RRRR-MM-DD”. */
export function poprawnaData(tekst) {
  return wUtc(tekst) !== null;
}

/** Liczba dni od początku do końca włącznie (04.12–06.12 → 3). Zakłada poprawne daty. */
export function dniMiedzy(start, koniec) {
  return Math.round((wUtc(koniec) - wUtc(start)) / DZIEN_MS) + 1;
}

/** Czy podróż ma poprawne daty (obie, koniec nie przed początkiem). */
export function maDaty(podroz) {
  return poprawnaData(podroz.start) && poprawnaData(podroz.koniec) && podroz.koniec >= podroz.start;
}

/** Liczba dni podróży: z dat albo z liczby dni szkicu (sekcja 6). Uszkodzone dane → 3 dni (A1). */
export function liczbaDni(podroz) {
  if (maDaty(podroz)) return dniMiedzy(podroz.start, podroz.koniec);
  const n = podroz.dniSzkicu;
  return Number.isInteger(n) && n >= 1 && n <= MAKS_DNI ? n : DOMYSLNE_DNI_SZKICU;
}

/** Dzisiejsza data w strefie czasowej przeglądarki jako „RRRR-MM-DD”. */
export function dzisiaj(teraz = new Date()) {
  const dwie = (n) => String(n).padStart(2, "0");
  return `${teraz.getFullYear()}-${dwie(teraz.getMonth() + 1)}-${dwie(teraz.getDate())}`;
}

/** Status podróży (DEC-16): liczony z dat i dzisiejszej daty, nie jest zapisywany. */
export function statusPodrozy(podroz, dzis) {
  if (!maDaty(podroz)) return "szkic";
  if (podroz.start > dzis) return "nadchodzaca";
  if (podroz.koniec < dzis) return "zakonczona";
  return "w-trakcie";
}

export const ETYKIETY_STATUSU = {
  nadchodzaca: "Nadchodząca",
  "w-trakcie": "W trakcie",
  zakonczona: "Zakończona",
  szkic: "Szkic"
};

/** „2026-12-04” → „04.12.2026”. */
export function formatDaty(tekst) {
  const [r, m, d] = tekst.split("-");
  return `${d}.${m}.${r}`;
}

/** „04.12.2026 – 06.12.2026” albo „Szkic bez dat”. */
export function zakresDat(podroz) {
  return maDaty(podroz) ? `${formatDaty(podroz.start)} – ${formatDaty(podroz.koniec)}` : "Szkic bez dat";
}

/** Data n-tego dnia podróży (od 1) jako „04.12”; null w szkicu bez dat. */
export function dataDnia(podroz, n) {
  if (!maDaty(podroz)) return null;
  const d = new Date(wUtc(podroz.start) + (n - 1) * DZIEN_MS);
  const dwie = (x) => String(x).padStart(2, "0");
  return `${dwie(d.getUTCDate())}.${dwie(d.getUTCMonth() + 1)}`;
}

/** Odmiana po liczbie: odmiana(1, "miejsce", "miejsca", "miejsc") → „miejsce”, 2 → „miejsca”, 5 → „miejsc”. */
export function odmiana(n, jedna, kilka, wiele) {
  if (n === 1) return jedna;
  const j = n % 10;
  const d = n % 100;
  return j >= 2 && j <= 4 && (d < 12 || d > 14) ? kilka : wiele;
}

/** „1 dzień”, „3 dni”. */
export const tekstDni = (n) => `${n} ${n === 1 ? "dzień" : "dni"}`;
/** „1 miejsce”, „3 miejsca”, „5 miejsc”. */
export const tekstMiejsc = (n) => `${n} ${odmiana(n, "miejsce", "miejsca", "miejsc")}`;
