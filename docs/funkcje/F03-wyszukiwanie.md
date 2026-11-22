# F03 · Wyszukiwanie i filtry
**Status:** do zrobienia · **Priorytet:** MVP-2 · **Złożoność:** niska → poziom Średni — filtrowanie danych startowych w przeglądarce, bez zapisu
**Zależy od:** F01 · **Źródło:** brief (Szukaj), prototyp, specyfikacja-v1.md (US2)

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 5 (E2), sekcja 6 (Miejsce: kategoria) · design.md: chipy, pola formularzy, kolor sekcji Szukaj · prototyp.html: ekran Szukaj

## Cel
Użytkownik szybko znajduje miejsce po nazwie, mieście, kraju albo kategorii.

## Zachowanie
1. W menu dochodzi sekcja Szukaj (ikona lupy, kolor sekcji z design.md).
2. E2: pole wyszukiwania i filtry: kategoria, kraj, miasto lub region (lista zależna od kraju), sortowanie (popularne, alfabetycznie).
3. Wyniki zmieniają się podczas pisania; nad nimi liczba wyników („9 miejsc”).
4. Każde słowo hasła musi pasować do nazwy, miasta, kraju albo nazwy kategorii; wielkość liter i polskie znaki nie mają znaczenia, a odmiana słowa jest dopuszczalna („punkt widokowy” znajduje kategorię „Punkty widokowe”).
5. Na E1 dochodzą chipy kategorii; kliknięcie otwiera E2 z wybraną kategorią.

## Dane
Czyta Miejsca. Niczego nie zapisuje (stan wyszukiwania nie jest zapamiętywany).

## Kryteria akceptacji
- F03-KA1 [test]: Gdy wpiszę „rzym”, to widzę 9 wyników, wszystkie z Rzymu.
- F03-KA2 [test]: Gdy wpiszę „punkt widokowy”, to wszystkie wyniki mają kategorię „Punkty widokowe”, a „Kopiec Kościuszki” jest wśród nich.
- F03-KA3 [test]: Gdy wybiorę kraj „Polska” i kategorię „Kawiarnie”, to jedynym wynikiem jest „Kawiarnia z sernikiem na Kazimierzu”.
- F03-KA4 [test]: Gdy wpiszę „xyz”, to widzę „Nic nie znaleźliśmy”, podpowiedzi haseł i przycisk „Wyczyść wyszukiwanie i filtry”, który przywraca 41 wyników.
- F03-KA5 [test]: Gdy wybiorę sortowanie alfabetyczne bez hasła, to pierwszym wynikiem jest „Alfama”.

## Przypadki brzegowe i błędy
- Zmiana kraju na taki, w którym nie ma wybranego miasta: filtr miasta wraca do „Wszystkie”.
- Hasło ze spacjami na początku i końcu działa jak bez nich.

## Ochrona danych
Nie dotyczy: funkcja nie zapisuje danych i nie wysyła haseł nigdzie (N1).

## Poza zakresem tej karty
Wyszukiwanie miejsc spoza katalogu, podpowiedzi podczas pisania.

## Jak sprawdzić ręcznie
1. Wpisz „Rzym”, potem „punkt widokowy”, potem „xyz”.
2. Ustaw kraj „Polska” i kategorię „Kawiarnie”.
