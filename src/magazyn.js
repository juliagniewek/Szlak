// JEDYNE miejsce zapisu i odczytu danych użytkownika w przeglądarce (plan 5.2–5.3).
// Dane nie opuszczają przeglądarki (N1) i zostają po odświeżeniu strony (N5).
// `storage` jest parametrem (localStorage albo atrapa), więc testy nie potrzebują przeglądarki.

/** Klucz własny aplikacji. Prototyp pod tym samym adresem używa „szlak-dane-v1” w innym formacie. */
export const KLUCZ = "szlak.app.dane";
/**
 * Tu trafia oryginalny tekst danych, których nie udało się odczytać (nie kasujemy ich po cichu).
 * Gdy ten klucz zawiera już inny tekst, kolejne kopie mają numery: szlak.app.kopia.2, .3… (plan 5.3).
 */
export const KLUCZ_KOPII = "szlak.app.kopia";
/** Zabezpieczenie przed nieskończoną pętlą przy dziwnej pamięci; w praktyce kopii jest najwyżej kilka. */
const MAKS_KOPII = 50;
const KLUCZ_PROBY = "szlak.app.proba";

/** Obecna wersja formatu danych. */
export const WERSJA = 1;

/**
 * Migracje: MIGRACJE[n] zmienia dane z wersji n na n+1.
 * Przy zmianie modelu danych: dodaj MIGRACJE[1], podnieś WERSJA do 2, dopisz test.
 */
export const MIGRACJE = {};

export const KOMUNIKATY = {
  blokada: "Ta przeglądarka nie pozwala zapisywać danych. Wszystko zniknie po zamknięciu strony.",
  uszkodzone: "Nie udało się odczytać zapisanych danych. Ich kopia została zachowana w przeglądarce.",
  uszkodzoneBezKopii: "Nie udało się odczytać zapisanych danych. Zmiany nie będą zapisywane, żeby ich nie nadpisać.",
  bladZapisu: "Nie udało się zapisać zmian. Spróbuj ponownie."
};

/** Puste dane użytkownika w obecnej wersji. */
export function pusteDane(wersja = WERSJA) {
  return { wersja, zapisane: [], podroze: [] };
}

function maPoprawnyKsztalt(dane, wersja) {
  return (
    dane !== null &&
    typeof dane === "object" &&
    !Array.isArray(dane) &&
    Number.isInteger(dane.wersja) &&
    dane.wersja >= 1 &&
    (dane.wersja < wersja || (Array.isArray(dane.zapisane) && Array.isArray(dane.podroze)))
  );
}

function zapisDziala(storage) {
  try {
    storage.setItem(KLUCZ_PROBY, "1");
    storage.removeItem(KLUCZ_PROBY);
    return true;
  } catch {
    return false;
  }
}

/** Klucz n-tej kopii: 1 → szlak.app.kopia, 2 → szlak.app.kopia.2 itd. */
function kluczKopii(n) {
  return n === 1 ? KLUCZ_KOPII : `${KLUCZ_KOPII}.${n}`;
}

/**
 * Zachowuje oryginalny tekst w pierwszej wolnej kopii (plan 5.3, weryfikacja F00 W2).
 * Istniejących kopii nie nadpisuje, a tekstu, który już jest w którejś kopii, nie zapisuje drugi raz.
 * Zwraca true, gdy tekst jest bezpieczny w kopii; false, gdy kopii nie da się zapisać.
 */
function zachowajKopie(storage, tekst) {
  try {
    for (let n = 1; n <= MAKS_KOPII; n++) {
      const istniejaca = storage.getItem(kluczKopii(n));
      if (istniejaca === tekst) return true;
      if (istniejaca === null) {
        storage.setItem(kluczKopii(n), tekst);
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Wczytuje dane użytkownika.
 * Zwraca { stan, ostrzezenie, trwaly }:
 * - stan: dane użytkownika (zawsze poprawny obiekt),
 * - ostrzezenie: tekst do pokazania albo null,
 * - trwaly: false = zmian nie zapisujemy (blokada zapisu albo danych nie dało się zabezpieczyć);
 *   aplikacja działa wtedy tylko w pamięci do zamknięcia strony (A5).
 * `opcje` służą testom migracji.
 */
export function wczytaj(storage, opcje = {}) {
  const wersja = opcje.wersja ?? WERSJA;
  const migracje = opcje.migracje ?? MIGRACJE;

  let tekst;
  try {
    if (!storage) throw new Error("Brak pamięci przeglądarki");
    tekst = storage.getItem(KLUCZ);
  } catch {
    return { stan: pusteDane(wersja), ostrzezenie: KOMUNIKATY.blokada, trwaly: false };
  }

  if (!zapisDziala(storage)) {
    // Odczyt działa, zapis nie: pokazujemy to, co jest, ale ostrzegamy, że zmiany znikną.
    const wynik = tekst === null ? null : odczytaj(tekst, wersja, migracje);
    return { stan: wynik ? wynik.dane : pusteDane(wersja), ostrzezenie: KOMUNIKATY.blokada, trwaly: false };
  }

  // Pierwsze uruchomienie: puste dane, bez komunikatu.
  if (tekst === null) return { stan: pusteDane(wersja), ostrzezenie: null, trwaly: true };

  const wynik = odczytaj(tekst, wersja, migracje);
  if (wynik === null) {
    if (zachowajKopie(storage, tekst)) {
      return { stan: pusteDane(wersja), ostrzezenie: KOMUNIKATY.uszkodzone, trwaly: true };
    }
    return { stan: pusteDane(wersja), ostrzezenie: KOMUNIKATY.uszkodzoneBezKopii, trwaly: false };
  }

  if (wynik.zmigrowano) {
    // Kopia sprzed migracji, gdyby migracja okazała się błędna.
    zachowajKopie(storage, tekst);
    zapisz(storage, wynik.dane);
  }
  return { stan: wynik.dane, ostrzezenie: null, trwaly: true };
}

/** Parsuje i migruje tekst. Zwraca { dane, zmigrowano } albo null, gdy danych nie da się bezpiecznie odczytać. */
function odczytaj(tekst, wersja, migracje) {
  let dane;
  try {
    dane = JSON.parse(tekst);
  } catch {
    return null;
  }
  if (!maPoprawnyKsztalt(dane, wersja)) return null;
  if (dane.wersja > wersja) return null; // dane z nowszej wersji aplikacji: nie ruszamy ich
  let zmigrowano = false;
  while (dane.wersja < wersja) {
    const migracja = migracje[dane.wersja];
    if (typeof migracja !== "function") return null;
    const poprzednia = dane.wersja;
    try {
      dane = migracja(dane);
    } catch {
      return null;
    }
    // Migracja musi podnieść wersję; inaczej pętla nigdy by się nie skończyła.
    if (!dane || !Number.isInteger(dane.wersja) || dane.wersja <= poprzednia) return null;
    zmigrowano = true;
  }
  if (!maPoprawnyKsztalt(dane, wersja)) return null;
  return { dane, zmigrowano };
}

/** Zapisuje dane. Zwraca true albo false (np. blokada, brak miejsca) — wtedy operacja nie jest przyjęta. */
export function zapisz(storage, stan) {
  try {
    storage.setItem(KLUCZ, JSON.stringify(stan));
    return true;
  } catch {
    return false;
  }
}

/** Atrapa pamięci przeglądarki trzymająca dane w obiekcie (testy, tryb tylko w pamięci). */
export function atrapaPamieci(poczatkowe = {}) {
  const dane = new Map(Object.entries(poczatkowe));
  return {
    getItem: (k) => (dane.has(k) ? dane.get(k) : null),
    setItem: (k, v) => void dane.set(k, String(v)),
    removeItem: (k) => void dane.delete(k),
    clear: () => dane.clear(),
    get length() {
      return dane.size;
    },
    key: (i) => [...dane.keys()][i] ?? null
  };
}

/**
 * Atrapa przeglądarki blokującej zapis (test A5 w F02; w aplikacji: ?dev&blokada na localhost).
 * Odczyt zwraca brak danych, każda próba zapisu rzuca błąd jak w Safari w trybie prywatnym.
 */
export function atrapaBlokujaca() {
  const blad = () => {
    const e = new Error("Zapis zablokowany przez przeglądarkę (atrapa)");
    e.name = "QuotaExceededError";
    throw e;
  };
  return {
    getItem: () => null,
    setItem: blad,
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  };
}
