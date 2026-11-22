# F05 · Plan dni
**Status:** do zrobienia · **Priorytet:** MVP-1 · **Złożoność:** wysoka → poziom Wysoki — logika kolejności i przenoszenia z wieloma przypadkami brzegowymi
**Zależy od:** F04 · **Źródło:** brief (plan dzień po dniu), prototyp, specyfikacja-v1.md (US4), DEC-7, A3

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 5 (E7, E8), sekcja 6 (Punkt planu), sekcja 7 (N2, N5) · design.md: punkt planu, kolory dni, przyciski · prototyp.html: ekran podróży (kolumna planu), okno „Dodaj miejsca”

## Cel
Użytkownik rozkłada miejsca podróży na dni i ustala kolejność odwiedzania.

## Zachowanie
1. E7: nagłówek podróży (nazwa, kierunek, daty, liczba dni i miejsc, „Edytuj podróż”), lista „Do zaplanowania” z licznikiem i karty dni („Dzień 1 · pt., 4.12” albo „Dzień 1” bez dat), każda z liczbą miejsc i kolorem dnia z design.md.
2. Punkt w „Do zaplanowania”: nazwa, kategoria, miasto, lista „Przypisz do dnia…”, przycisk ×.
3. Punkt w dniu: numer w kolorze dnia, nazwa, kategoria, przyciski ↑ i ↓, lista „Przenieś do…” (inne dni i „Do zaplanowania”), przycisk ×.
4. × usuwa punkt z podróży z komunikatem „Usunięto „[nazwa]” z podróży. Miejsce zostaje w Zapisanych.” (gdy jest zapisane).
5. „+ Dodaj miejsca” otwiera E8: lista katalogu z wyszukiwaniem, zapisane miejsca na górze (♥), miejsca już w podróży zaznaczone i nieaktywne, przycisk „Dodaj (n)”. Dodane trafiają do „Do zaplanowania”.
6. Stany puste: „Wszystkie miejsca są przypisane do dni.” i w dniu „Brak punktów. Przypisz miejsca z listy „Do zaplanowania”.”

## Dane
Zmienia Punkt planu: dzień i pozycję; tworzy punkty (E8) i je usuwa. Numeracja w dniu zawsze od 1, bez luk.

## Kryteria akceptacji
- F05-KA1 [test]: Gdy wybiorę „Przypisz do dnia” → „Dzień 1” przy „Panteonie”, to Panteon ma w dniu 1 numer 1 i znika z „Do zaplanowania”.
- F05-KA2 [test]: Gdy dzień 1 ma punkty Koloseum (1) i Panteon (2) i kliknę ↓ przy Koloseum, to Panteon ma numer 1, a Koloseum 2; przycisk ↑ przy pierwszym punkcie jest nieaktywny.
- F05-KA3 [test]: Gdy przeniosę punkt 1 z dnia 1 do dnia 2, to trafia na koniec dnia 2, a numeracja w obu dniach jest od 1 bez luk.
- F05-KA4 [test]: Gdy kliknę × przy zapisanym miejscu, to punkt znika z podróży, a miejsce zostaje w Zapisanych (N2).
- F05-KA5 [test]: Gdy w E8 wybiorę 2 miejsca i kliknę „Dodaj (2)”, to oba są w „Do zaplanowania”; miejsca, które już są w podróży, nie dają się wybrać ponownie.
- F05-KA6 [test, ręcznie]: Gdy ułożę plan i odświeżę stronę, to przypisanie i kolejność są takie same (N5).

## Przypadki brzegowe i błędy
- Podróż bez dni do przypisania nie istnieje (minimum 1 dzień, A1).
- Szybkie podwójne kliknięcie ↓: punkt przesuwa się o jedną albo dwie pozycje, ale nigdy nie znika ani się nie dubluje.
- Błąd zapisu w przeglądarce: komunikat o błędzie; widok pokazuje stan, który naprawdę zapisano.

## Ochrona danych
P0. Brak danych osobowych. Testy na podróży „Testowy wyjazd: Rzym” z F00.

## Poza zakresem tej karty
Mapa (F06), planowanie automatyczne (F07, Później), godziny (DEC-7) i notatki (Później), przeciąganie myszą.

## Jak sprawdzić ręcznie
1. Załaduj zestaw testowy i otwórz „Testowy wyjazd: Rzym”.
2. Przypisz 3 miejsca do dni, zmień kolejność, przenieś jedno do innego dnia.
3. Usuń punkt i sprawdź Zapisane; odśwież stronę.
