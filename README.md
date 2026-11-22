# szlak.
Prosta aplikacja webowa dla osób, które same planują wyjazdy: zapisujesz inspirujące miejsca, zamieniasz je w podróż, rozkładasz na dni i oglądasz trasę na mapie, bez zakładania konta.

## Wypróbuj
- Aplikacja: [uzupełnia: właścicielka po publikacji]
- Klikalny prototyp (wzór, nie aplikacja): https://juliagniewek.github.io/Szlak/prototyp.html
- Konta testowe: nie dotyczy, aplikacja nie ma kont. Dane zapisują się tylko w Twojej przeglądarce.

## Główna ścieżka
Osoba planująca wyjazd → zapisuje miejsca na ekranie Odkrywaj → tworzy z nich podróż → rozkłada miejsca na dni i ustala kolejność → ogląda trasę dnia na mapie (MVP-2).

## Stan funkcji
| ID | Funkcja | Priorytet | Status | Weryfikacja |
|---|---|---|---|---|
| F00 | Fundament i zabezpieczenia | MVP-1 | do zrobienia | [uzupełnia: Faza C] |
| F01 | Układ aplikacji i Odkrywaj | MVP-1 | do zrobienia | [uzupełnia: Faza C] |
| F02 | Zapisywanie miejsc | MVP-1 | do zrobienia | [uzupełnia: Faza C] |
| F03 | Wyszukiwanie i filtry | MVP-2 | do zrobienia | [uzupełnia: Faza C] |
| F04 | Podróże | MVP-1 | do zrobienia | [uzupełnia: Faza C] |
| F05 | Plan dni | MVP-1 | do zrobienia | [uzupełnia: Faza C] |
| F06 | Mapa trasy | MVP-2 | do zrobienia | [uzupełnia: Faza C] |
| F07 | Planowanie automatyczne | Później | przeniesiona do „Później” (DEC-10) | — |

## Zmiany względem specyfikacji
- Brak.

## Znane ograniczenia
- Dane są tylko w jednej przeglądarce na jednym urządzeniu; wyczyszczenie danych przeglądarki je usuwa (R2).
- Mapa jest schematyczna: bez ulic, odległości i czasów przejazdu (DEC-9).
- Zdjęcia pochodzą z Wikimedia Commons i wymagają internetu; bez niego karty pokazują ikony kategorii.
- Nie sprawdzono jeszcze, czy testerzy przechodzą główną ścieżkę bez pomocy (R1).

## Bezpieczeństwo i dane
- Poziom ochrony danych: P0
- Bramka prawdziwych danych: jeszcze nie
- Weryfikacja całego MVP: [uzupełnia: Faza C — docs/weryfikacja/MVP.md]

## Jak uruchomić lokalnie
[uzupełnia: F00 — kroki od pobrania repozytorium, przez załadowanie zestawu testowego, po uruchomienie aplikacji i testów]

## Dokumentacja
- Brief, prototyp i testy prototypu: brief.md, prototyp.html, docs/wnioski-z-testow.md, specyfikacja-v1.md (wstępna)
- Wygląd: design.md
- Specyfikacja i karty funkcji: docs/specyfikacja.md, docs/funkcje/
- Plan techniczny: docs/plan.md
- Raporty weryfikacji: docs/weryfikacja/
- Wnioski z pracy z agentem: .trail/learnings/ (Trail-code)
