// F06 · Mapa trasy: rzut współrzędnych na schemat i dane panelu mapy. Czyste funkcje, bez DOM.
// Mapa jest schematyczna, bez podkładu i bez zewnętrznych serwisów (DEC-9).
import { planDnia } from "./stan.js";
import { liczbaDni } from "./daty.js";

/** Rozmiar schematu w jednostkach SVG (viewBox). Panel zachowuje te proporcje przy każdej szerokości. */
export const SZEROKOSC = 600;
export const WYSOKOSC = 440;
/** Margines od krawędzi, żeby pinezki i ich obszar kliknięcia mieściły się w panelu. */
export const MARGINES = 56;

/** Rozpiętość mniejsza niż ta (w stopniach) to „jedno miejsce”: punkt trafia na środek, bez dzielenia przez zero. */
const ZERO = 1e-9;

/**
 * Rzut równoodległościowy: x = długość · cos(środkowej szerokości), y = szerokość (północ u góry).
 * Wystarcza na skalę miasta i regionu. Wynik jest dopasowany do panelu z marginesem i wyśrodkowany;
 * proporcje odległości zostają (ta sama skala w poziomie i w pionie).
 * `wspolrzedne`: [[szerokość, długość], ...] → [{ x, y }, ...] w tej samej kolejności.
 */
export function rzut(wspolrzedne, { szerokosc = SZEROKOSC, wysokosc = WYSOKOSC, margines = MARGINES } = {}) {
  if (!wspolrzedne.length) return [];
  const szer = wspolrzedne.map(([s]) => s);
  const srodek = (Math.min(...szer) + Math.max(...szer)) / 2;
  const kx = Math.cos((srodek * Math.PI) / 180);
  const xs = wspolrzedne.map(([, d]) => d * kx);
  const ys = szer;
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const [spanX, spanY] = [maxX - minX, maxY - minY];
  const [polX, polY] = [szerokosc - 2 * margines, wysokosc - 2 * margines];
  // Skala z kierunku, w którym punkty się rozchodzą; gdy wszystkie są w jednym miejscu, skala nie jest potrzebna.
  const skala = Math.min(spanX > ZERO ? polX / spanX : Infinity, spanY > ZERO ? polY / spanY : Infinity);
  if (skala === Infinity) return wspolrzedne.map(() => ({ x: szerokosc / 2, y: wysokosc / 2 }));
  const odX = (szerokosc - spanX * skala) / 2;
  const odY = (wysokosc - spanY * skala) / 2;
  return xs.map((x, i) => ({ x: odX + (x - minX) * skala, y: odY + (maxY - ys[i]) * skala }));
}

/** Wybór „Pokaż”: numer dnia albo „wszystko” (Cała podróż). Dzień spoza podróży (np. po skróceniu) → „wszystko”. */
export function pokazMapy(p, wartosc) {
  const n = Number(wartosc);
  return Number.isInteger(n) && n >= 1 && n <= liczbaDni(p) ? n : "wszystko";
}

/**
 * Punkty do pokazania przy wyborze `pokaz`: [{ id, nazwa, dzien, numer, wsp }].
 * Dzień: jego punkty z numerami z planDnia (N3). „Cała podróż”: wszystkie dni po kolei,
 * potem „Do zaplanowania” (dzien 0, numer null). „Miejsce niedostępne” nie ma współrzędnych.
 */
export function wpisyMapy(p, pokaz) {
  const dni = pokaz === "wszystko" ? [...Array.from({ length: liczbaDni(p) }, (_, i) => i + 1), 0] : [pokaz];
  return dni.flatMap((dzien) =>
    planDnia(p, dzien).map(({ punkt, miejsce: m, numer }) => ({
      id: punkt.miejsce,
      nazwa: m?.nazwa ?? "Miejsce niedostępne",
      dzien,
      numer,
      wsp: m?.wsp ?? null
    }))
  );
}

/** Czy wpis ma poprawne współrzędne (dwie skończone liczby). */
const maWspolrzedne = (w) =>
  Array.isArray(w.wsp) && w.wsp.length === 2 && w.wsp.every((v) => typeof v === "number" && Number.isFinite(v));

/**
 * Dane panelu z wpisów: pinezki z położeniem, linie tras i nazwy bez współrzędnych.
 * - pinezki: [{ id, nazwa, dzien, numer, x, y }] w kolejności wpisów (też kolejność listy pod mapą),
 * - trasy: [{ dzien, punkty: [{ x, y }] }] osobno dla każdego dnia, w kolejności planu, tylko gdy dzień ma ≥ 2 pinezki,
 * - brak: nazwy punktów bez współrzędnych (F06-KA5).
 */
export function danePanelu(wpisy) {
  const zWsp = wpisy.filter(maWspolrzedne);
  const polozenia = rzut(zWsp.map((w) => w.wsp));
  const pinezki = zWsp.map(({ wsp, ...w }, i) => ({ ...w, ...polozenia[i] }));
  const dni = [...new Set(pinezki.filter((x) => x.dzien > 0).map((x) => x.dzien))];
  const trasy = dni
    .map((dzien) => ({ dzien, punkty: pinezki.filter((x) => x.dzien === dzien).map(({ x, y }) => ({ x, y })) }))
    .filter((t) => t.punkty.length > 1);
  return { pinezki, trasy, brak: wpisy.filter((w) => !maWspolrzedne(w)).map((w) => w.nazwa) };
}

/** Kliknięcie pinezki albo punktu listy: podświetla go, a drugie kliknięcie tego samego zdejmuje podświetlenie. */
export const przelaczPodswietlenie = (aktywny, klucz) => (aktywny === klucz ? null : klucz);
