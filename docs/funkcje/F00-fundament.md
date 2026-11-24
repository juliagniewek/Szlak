# F00 · Fundament i zabezpieczenia
**Status:** do zrobienia · **Priorytet:** MVP-1 · **Złożoność:** wysoka → poziom Wysoki — ustawia zabezpieczenia, dane startowe i testy, na których opierają się wszystkie kolejne karty
**Zależy od:** — · **Źródło:** prompt specyfikacji (karta F00), DEC-2, DEC-11

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 6 (wszystkie encje), sekcja 7 (zasady i niezmienniki), sekcja 8 · design.md: kolory, typografia, układ · prototyp.html: tablica `PLACES`, `PHOTOS`, `DESTS` (tylko jako źródło danych katalogu)

## Cel
Pusty, ale działający szkielet aplikacji, z danymi katalogu, stylami z design.md, testami uruchamianymi jednym poleceniem i zabezpieczeniami, zanim powstanie pierwsza funkcja.

## Zachowanie
1. Szkielet projektu według docs/plan.md (Faza A), uruchamiany lokalnie w przeglądarce.
2. Dane startowe katalogu: 41 miejsc i 5 kierunków przeniesionych z prototypu (dane, nie kod), z polami z sekcji 6, w tym autor i licencja każdego zdjęcia odczytane ze strony pliku na Commons (DEC-13). Zdjęcie bez jasnej licencji zostaje usunięte z danych.
3. Zestaw testowy danych użytkownika do sprawdzania kolejnych kart: 3 zapisane miejsca (Koloseum, Panteon, Fontanna di Trevi) i podróż „Testowy wyjazd: Rzym” z datami 04–06.12.2026, z tymi miejscami w „Do zaplanowania”. Ładuje się jednym poleceniem lub przyciskiem dostępnym tylko w trybie deweloperskim.
4. Jedno miejsce zapisu danych użytkownika w przeglądarce, z numerem wersji formatu.
5. Atrapa przeglądarki blokującej zapis (do testu A5 w F02).
6. Wartości z design.md w stylach aplikacji (paleta, kolory sekcji, typografia).
7. `.gitignore` z wpisami `.env`, `.env.*`, `!.env.example`, `node_modules/`, `.DS_Store`, `Thumbs.db` oraz wpisami Trail-code; istniejące wpisy zostają.
8. Blokada odczytu `.env` w `.claude/settings.json` (reguły „deny”; składnia z aktualnej dokumentacji Claude Code), dopisana do ustawień Trail-code, a nie zamiast nich.
9. W README sekcja „Jak uruchomić lokalnie”.

## Dane
Tworzy dane startowe Miejsc (tylko do odczytu) i zestaw testowy Zapisanych miejsc, Podróży i Punktów planu. Aplikacja nie ma kont; dane należą do przeglądarki.

## Kryteria akceptacji
- F00-KA1 [ręcznie]: Gdy właścicielka uruchomi aplikację krokami z README, to widzi stronę z kremowym tłem, nagłówkiem szeryfowym i menu z sekcjami Odkrywaj, Zapisane, Podróże.
- F00-KA2 [test]: Gdy uruchomi się polecenie testów, to wszystkie testy przechodzą, w tym test danych startowych: katalog ma 41 miejsc, 5 kierunków, każde miejsce ma nazwę, miasto, kraj i kategorię z listy.
- F00-KA3 [test]: Gdy załaduje się zestaw testowy, to dane użytkownika zawierają 3 zapisane miejsca i 1 podróż z 3 dniami.
- F00-KA4 [test]: Gdy w folderze projektu powstanie plik `.env`, to `git status` go nie pokazuje.
- F00-KA5 [ręcznie]: Gdy agent spróbuje odczytać `.env`, to narzędzie odmawia.
- F00-KA6 [test]: Gdy miejsce w katalogu nie ma współrzędnych albo zdjęcia, to dane startowe ładują się bez błędu.
- F00-KA8 [test]: Gdy miejsce albo kierunek ma zdjęcie, to ma też niepusty autor i licencję (DEC-13).
- F00-KA7 [ręcznie]: Gdy projekt używa Trail-code, to `trail status` działa, a `trail map` pokazuje nowe pliki projektu.

## Przypadki brzegowe i błędy
- Pierwsze uruchomienie bez żadnych danych w przeglądarce: aplikacja startuje z pustymi danymi użytkownika, bez błędu.
- Dane w przeglądarce w starszej wersji formatu albo uszkodzone: aplikacja nie kasuje ich po cichu; zachowanie ustala docs/plan.md.

## Ochrona danych
P0. Żadnych danych osób w danych startowych i testach. Brak kluczy i zewnętrznych skryptów (sekcja 7, zasady 3–5).

## Poza zakresem tej karty
Ekrany i funkcje użytkownika (F01–F06), zdjęcia na kartach (F01).

## Jak sprawdzić ręcznie
1. Uruchom aplikację według README i sprawdź wygląd.
2. Uruchom testy jednym poleceniem z README.
3. Utwórz pusty plik `.env` i sprawdź, że `git status` go nie pokazuje; potem go usuń.
