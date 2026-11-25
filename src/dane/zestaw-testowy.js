// Zestaw testowy danych użytkownika (F00). Dane fikcyjne, miejsca z katalogu.
// Służy do sprawdzania kolejnych kart: ładuje go przycisk w trybie deweloperskim (?dev na localhost)
// albo testy. Zastępuje dane użytkownika w przeglądarce.
import { WERSJA } from "../magazyn.js";

/** Zwraca nową kopię zestawu: 3 zapisane miejsca i podróż „Testowy wyjazd: Rzym” (04–06.12.2026). */
export function zestawTestowy() {
  return {
    wersja: WERSJA,
    zapisane: [
      { miejsce: "rzym-koloseum", zapisano: "2026-11-20T18:00:00.000Z" },
      { miejsce: "rzym-panteon", zapisano: "2026-11-20T18:05:00.000Z" },
      { miejsce: "rzym-trevi", zapisano: "2026-11-20T18:10:00.000Z" }
    ],
    podroze: [
      {
        id: "p-test-rzym",
        nazwa: "Testowy wyjazd: Rzym",
        kierunek: "Rzym",
        start: "2026-12-04",
        koniec: "2026-12-06",
        dniSzkicu: null,
        opis: "",
        utworzono: "2026-11-20T18:15:00.000Z",
        // dzien 0 = „Do zaplanowania”
        punkty: [
          { miejsce: "rzym-koloseum", dzien: 0 },
          { miejsce: "rzym-panteon", dzien: 0 },
          { miejsce: "rzym-trevi", dzien: 0 }
        ]
      }
    ]
  };
}
