# Publikacja MVP na GitHub Pages · plan
26.11.2026 · po weryfikacji MVP-1 (docs/weryfikacja/MVP.md) i MVP-2 (docs/weryfikacja/MVP-2.md) · podstawa: specyfikacja sekcja 7 („Bramka prawdziwych danych”), sekcja 13 (zadania właścicielki), DEC-12, DEC-15, DEC-17, docs/plan.md sekcje 2 i 3.2

## Najważniejsze: aplikacja już jest publiczna
GitHub Pages w repozytorium `Szlak` publikuje gałąź `main` z katalogu głównego (tak działa już prototyp). Dlatego **każdy `git push` na `main` od razu publikuje zmiany**, zwykle w ciągu 1–2 minut. Osobnego „włączania” nie trzeba.

Sprawdzone 26.11.2026 w przeglądarce, tylko odczyt:
- `https://juliagniewek.github.io/Szlak/` pokazuje aplikację w wersji z commitu `0b22169`: 4 sekcje menu (z Szukaj), chipy kategorii, mapa, poprawka W1 z MVP-2.
- Nie ma tam jeszcze 3 późniejszych commitów (learning, W3, W2), bo są tylko na Twoim komputerze.
- Stopka i „O danych” są na stronie: dane tylko w przeglądarce, wyczyszczenie je usuwa, GitHub zapisuje adresy IP, Wikimedia widzi adres IP przy pobieraniu zdjęć (DEC-15).
- `?dev` na opublikowanej stronie nie włącza trybu deweloperskiego (brak „Załaduj zestaw testowy”).
- Prototyp działa dalej pod `https://juliagniewek.github.io/Szlak/prototyp.html` (DEC-17).

Wniosek: technicznie publikacja już się stała. Zostaje to, co specyfikacja każe zrobić **przed udostępnieniem linku ludziom**: bramka prawdziwych danych i test z 2–3 osobami (R1). Do tego czasu nie rozsyłaj adresu.

W ustawieniach GitHuba nic nie trzeba zmieniać. Jeśli chcesz to sprawdzić: repozytorium `Szlak` → Settings → Pages. Powinno być „Deploy from a branch”, gałąź `main`, folder `/ (root)`. Plik `.nojekyll` jest w repozytorium, więc GitHub publikuje pliki bez zmian.

## Kroki, po kolei
Każdy krok to jedna decyzja albo jedna czynność. Kroki 1–3 może przygotować agent; decyzje i wysłanie na GitHub należą do Ciebie.

### 1. Decyzja: odnośnik do licencji zdjęć (I3 z weryfikacji F01)
Podpis zdjęcia ma dziś nazwę licencji jako tekst („CC BY-SA 4.0”) i odnośnik do strony pliku na Commons. Licencje CC 2.0 i 3.0 (są w katalogu) mówią wprost o podaniu adresu licencji. Do wyboru:
- (a) zostawić tak jak jest (zgodne z DEC-13; strona pliku na Commons ma odnośnik do licencji);
- (b) nazwa licencji w podpisie i w „Źródłach zdjęć” staje się odnośnikiem do jej strony na creativecommons.org. Mała zmiana w kodzie i w DEC-13. CSP nie trzeba zmieniać: to zwykły odnośnik, a CSP ogranicza pobieranie plików, nie przejścia po kliknięciu.

To nie jest porada prawna. Bezpieczniejszy jest wariant (b).

**Zrobione 26.11.2026: wariant (b), DEC-22.** Nazwa licencji w podpisie i w „Źródłach zdjęć” prowadzi do tekstu licencji (7 adresów, wszystkie sprawdzone). Szczegóły w docs/weryfikacja/F01.md, „Decyzje właścicielki”.

### 2. Bramka prawdziwych danych (specyfikacja, sekcja 7)
Trzy punkty. Wynik zapisujemy w docs/weryfikacja/MVP.md jako „Bramka prawdziwych danych: odhaczona 26.11.2026” (albo inna data) i w README („Bramka prawdziwych danych: tak, …”).

| Punkt | Stan 26.11.2026 | Co robisz Ty |
|---|---|---|
| Repozytorium bez kluczy i prawdziwych danych (N4) | sprawdzone przez agenta: w całej historii git nie ma pliku `.env` ani `.trail/cache/`; brak wzorców kluczy i haseł; jedyne adresy e-mail to „noreply” GitHuba; test N4 przechodzi | potwierdzasz, że w treściach (opisy, notatki, learnings) nie ma nic o prawdziwych osobach |
| Informacja na stronie, że dane zostają tylko w przeglądarce | jest na opublikowanej stronie (stopka i „O danych”, 4 punkty) | otwierasz stronę, rozwijasz „O danych”, czytasz |
| Lista usług zewnętrznych z warunkami w aktualnej wersji | GitHub Pages i Wikimedia Commons sprawdzone 24.11.2026 (docs/plan.md, sekcja 2, ze źródłami) | czytasz politykę prywatności GitHuba i Wikimedia Foundation (odnośniki w docs/plan.md, sekcja 2) — plan zostawił to Tobie |

### 3. Wysłanie zaległych commitów (to jest publikacja)
Po krokach 1–2 (i ewentualnej zmianie z kroku 1) w swoim terminalu, w folderze projektu:
```bash
git push
```
Przed każdym `git push` obowiązuje zadanie 3 z sekcji 13 specyfikacji: przegląd pod kątem kluczy i prawdziwych danych (agent robi go razem z commitem). Po 1–2 minutach otwórz `https://juliagniewek.github.io/Szlak/` i odśwież stronę klawiszami Ctrl+F5. Na telefonie (albo F12 → Ctrl+Shift+M, szerokość 375) w podróży wybrana zakładka „Mapa” ma być ciemnobrązowa — to znak, że nowa wersja już działa.

### 4. Test z 2–3 osobami (R1), zanim ogłosisz link
Specyfikacja (R1 i tabela „Zawartość repozytorium”) wymaga testu głównej ścieżki z ludźmi po zbudowaniu MVP, z wynikami w `docs/wnioski-z-testow-aplikacji.md` (obserwacje oddzielone od interpretacji). Agent może przygotować scenariusz testu: zadania dla osoby testującej, na co patrzysz, gdzie zapisujesz obserwacje. Osoby testujące korzystają z adresu publicznego; ich dane zostają w ich przeglądarkach, Ty ich nie widzisz.

### 5. Uzupełnienie README
- „Wypróbuj → Aplikacja”: `https://juliagniewek.github.io/Szlak/` (dziś „[uzupełnia: właścicielka po publikacji]”).
- „Bramka prawdziwych danych”: data z kroku 2.
- „Znane ograniczenia”: wynik R1 po kroku 4.

## Co warto wiedzieć
- **`git push` = publikacja.** Nie wysyłaj na `main` niczego, co ma jeszcze nie być publiczne. Na próby lepsza jest osobna gałąź (GitHub Pages jej nie publikuje).
- **Adresy IP.** GitHub zapisuje adres IP każdej osoby odwiedzającej stronę; nie da się tego wyłączyć. Informuje o tym „O danych”.
- **Wspólna pamięć z prototypem.** Prototyp i aplikacja są pod tym samym adresem `juliagniewek.github.io`, więc dzielą pamięć przeglądarki. Aplikacja ma własny klucz (`szlak.app.dane`), więc dane się nie mieszają, ale wyczyszczenie danych strony usuwa jedne i drugie (R-T4).
- **Zdjęcia.** Mogą kiedyś zniknąć z Commons (R3); wtedy karty pokazują ikonę.
- **Powrót do poprzedniej wersji.** Gdyby po wysłaniu coś nie działało: agent przygotowuje commit, który cofa zmianę (`git revert`), a Ty go wysyłasz. Historia zostaje, strona wraca do poprzedniej wersji po 1–2 minutach.
