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
| F00 | Fundament i zabezpieczenia | MVP-1 | zbudowana, zweryfikowana (2 rundy); W3b rozstrzygnięte: podpisy menu 16 px (DEC-19) | runda 2 (ostatnia): WARNING, 25.11.2026 — W1, W2 i kontrast z W3 naprawione ([docs/weryfikacja/F00.md](docs/weryfikacja/F00.md)) |
| F01 | Układ aplikacji i Odkrywaj | MVP-1 | zbudowana, zweryfikowana (runda 1); W1 i W2 poprawione 25.11.2026 | WARNING, 25.11.2026: [docs/weryfikacja/F01.md](docs/weryfikacja/F01.md); W1 i W2 potwierdzone w weryfikacji MVP-1 (26.11.2026) |
| F02 | Zapisywanie miejsc | MVP-1 | zbudowana 25.11.2026, zweryfikowana | MVP-1: WARNING, 26.11.2026, kryteria 6/6 spełnione ([docs/weryfikacja/MVP.md](docs/weryfikacja/MVP.md)) |
| F03 | Wyszukiwanie i filtry | MVP-2 | do zrobienia | [uzupełnia: Faza C] |
| F04 | Podróże | MVP-1 | zbudowana 25.11.2026; ekran podróży (E7) z planem dni od F05; zweryfikowana | MVP-1: WARNING, 26.11.2026, kryteria 8/8 spełnione ([docs/weryfikacja/MVP.md](docs/weryfikacja/MVP.md)) |
| F05 | Plan dni | MVP-1 | zbudowana 26.11.2026: przypisywanie do dni, kolejność ↑/↓, przenoszenie, usuwanie z podróży, okno „Dodaj miejsca”; zweryfikowana | MVP-1: WARNING, 26.11.2026, kryteria 6/6 spełnione; do decyzji W1 (kontrast numeru dnia) i W2 (owalne puste kółko) ([docs/weryfikacja/MVP.md](docs/weryfikacja/MVP.md)) |
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
- Weryfikacja MVP-1 (F02, F04, F05, poprawki F01): WARNING, 26.11.2026 — [docs/weryfikacja/MVP.md](docs/weryfikacja/MVP.md); MVP-2 (F03, F06) jeszcze nie

## Jak uruchomić lokalnie
Potrzebne: [Node.js](https://nodejs.org) w wersji 22 lub nowszej (bez instalowania dodatkowych pakietów) i git.

1. Pobierz repozytorium i wejdź do jego folderu:
   ```
   git clone https://github.com/juliagniewek/Szlak.git
   cd Szlak
   ```
2. Uruchom aplikację:
   ```
   npm start
   ```
   W terminalu pojawi się „szlak. działa: http://localhost:8000”. Otwórz ten adres w Chrome albo Edge.
   Dwuklik w `index.html` nie wystarczy — przeglądarka blokuje wtedy skrypty aplikacji.
   Zatrzymanie: Ctrl+C w terminalu.
3. Zestaw testowy (3 zapisane miejsca i podróż „Testowy wyjazd: Rzym”, 04–06.12.2026): otwórz
   http://localhost:8000/?dev i kliknij „Załaduj zestaw testowy”. Zestaw zastępuje dane zapisane w tej przeglądarce.
   Tryb deweloperski działa tylko na `localhost`, nie na opublikowanej stronie.
4. Atrapa przeglądarki blokującej zapis: http://localhost:8000/?dev&blokada — u góry pojawia się ostrzeżenie, a zmiany znikają po zamknięciu strony.
5. Testy (w drugim terminalu, w folderze projektu):
   ```
   npm test
   ```
   Na końcu powinno być „fail 0”.

Jeśli terminal pisze, że nie zna polecenia `npm` albo `node`, zamknij go i otwórz nowy (po instalacji Node.js stary terminal go nie widzi).

## Dokumentacja
- Brief, prototyp i testy prototypu: brief.md, prototyp.html, docs/wnioski-z-testow.md, specyfikacja-v1.md (wstępna)
- Wygląd: design.md
- Specyfikacja i karty funkcji: docs/specyfikacja.md, docs/funkcje/
- Plan techniczny: docs/plan.md
- Raporty weryfikacji: docs/weryfikacja/
- Wnioski z pracy z agentem: .trail/learnings/ (Trail-code)
