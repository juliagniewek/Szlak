# F04 · Podróże
**Status:** do zrobienia · **Priorytet:** MVP-1 · **Złożoność:** średnia → poziom Średni — formularz z walidacją i zapis w przeglądarce, bez usług zewnętrznych
**Zależy od:** F02 · **Źródło:** brief, prototyp, specyfikacja-v1.md (US3), DEC-6, A1, A2, A6, A7

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 5 (E4, E5, E6), sekcja 6 (Podróż, Punkt planu), sekcja 11 (A1, A2, A6, A7) · design.md: formularze, przyciski, kolor sekcji Podróże · prototyp.html: Zapisane (zaznaczanie), okno „Nowa podróż”, ekran Podróże

## Cel
Użytkownik zamienia zapisane miejsca w podróż albo tworzy podróż od zera, a potem ją edytuje lub usuwa.

## Zachowanie
1. Na E4 każda karta ma pole zaznaczenia; pasek: „Zaznaczone: 3”, „Utwórz podróż z wybranych”, „Zaznacz wszystkie”, „Odznacz”.
2. „Utwórz podróż z wybranych” albo „+ Nowa podróż” na E6 otwiera E5: nazwa, kierunek (lista „Wybierz z listy…” z 5 kierunkami i 4 krajami oraz pole do wpisania), data rozpoczęcia i zakończenia, liczba dni szkicu (gdy bez dat), opis.
3. Przy tworzeniu z wybranych kierunek podpowiada najczęstsze miasto zaznaczonych miejsc, a nazwa „Wyjazd: [kierunek]”. Wybór z listy wpisuje kierunek do pola.
4. Zapis tworzy podróż; zaznaczone miejsca trafiają do „Do zaplanowania”; aplikacja otwiera E7 z komunikatem „Podróż utworzona. Przypisz miejsca do dni.”
5. E6: lista podróży (najnowsza na górze): nazwa, kierunek, daty albo „Szkic bez dat”, liczba dni i miejsc, przyciski „Otwórz”, „Edytuj”, „Usuń”. Stan pusty: „Nie masz jeszcze podróży” z przyciskami „+ Nowa podróż” i „Przejdź do Zapisanych”.
6. E3 (szczegóły miejsca) dostaje „Dodaj do podróży” z listą podróży; miejsce trafia do „Do zaplanowania”.

## Dane
Tworzy, zmienia i usuwa Podróż; tworzy Punkty planu z dniem „do zaplanowania”. Walidacja według sekcji 6 i A1–A2.

## Kryteria akceptacji
- F04-KA1 [test]: Gdy zaznaczę 3 zapisane miejsca z Rzymu i kliknę „Utwórz podróż z wybranych”, to formularz ma kierunek „Rzym” i nazwę „Wyjazd: Rzym”.
- F04-KA2 [test, ręcznie]: Gdy podam daty 04.12.2026–06.12.2026 i zapiszę, to podróż ma 3 dni, 3 miejsca są w „Do zaplanowania”, a po odświeżeniu strony wszystko zostaje (N5).
- F04-KA3 [test]: Gdy zostawię pustą nazwę, to widzę „Podaj nazwę podróży.” i podróż nie powstaje; nazwa z 60 znaków zostaje zapisana, z 61 — nie.
- F04-KA4 [test]: Gdy podam tylko jedną datę, to widzę „Podaj obie daty albo zostaw obie puste.”; gdy koniec jest przed początkiem — „Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.”; 30 dni zostaje zapisane, 31 dni — „Podróż może mieć najwyżej 30 dni.”
- F04-KA5 [test]: Gdy skrócę podróż z 3 do 2 dni, a dzień 3 miał 2 punkty, to oba wracają do „Do zaplanowania” i widzę „Zapisano zmiany. 2 miejsca z usuniętych dni wróciły do „Do zaplanowania”.” (A6).
- F04-KA6 [test]: Gdy usunę podróż i potwierdzę, to znika z E6, a jej miejsca zostają w Zapisanych (N2, A7); gdy anuluję, nic się nie zmienia.
- F04-KA7 [test]: Gdy nazwa podróży to `<b>test</b>`, to na liście widać dokładnie ten tekst, a nie pogrubienie.

## Przypadki brzegowe i błędy
- Kierunek spoza listy („Paryż”): zapis możliwy.
- Dwukrotne kliknięcie „Utwórz podróż”: powstaje jedna podróż.
- Błąd zapisu w przeglądarce: komunikat o błędzie, formularz zostaje otwarty z wpisanymi danymi, bez komunikatu „Podróż utworzona”.

## Ochrona danych
P0. Opis może zawierać dane wpisane przez użytkownika; zostaje tylko w przeglądarce (N1). Testy na zestawie testowym z F00.

## Poza zakresem tej karty
Plan dni (F05), archiwum i duplikowanie (Później), „Utwórz i zaplanuj automatycznie” (F07, Później).

## Jak sprawdzić ręcznie
1. Zapisz 3 miejsca z Rzymu, zaznacz je i utwórz podróż na 3 dni.
2. Spróbuj zapisać podróż z pustą nazwą i z jedną datą.
3. Skróć podróż o dzień, potem ją usuń i sprawdź Zapisane.
