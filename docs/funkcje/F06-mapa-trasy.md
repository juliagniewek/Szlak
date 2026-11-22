# F06 · Mapa trasy
**Status:** do zrobienia · **Priorytet:** MVP-2 · **Złożoność:** wysoka → poziom Wysoki — rzut współrzędnych na schemat i synchronizacja z planem w obie strony
**Zależy od:** F05 · **Źródło:** brief (mapa), prototyp, specyfikacja-v1.md (US6), DEC-9, N3

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 6 (Miejsce: współrzędne; Punkt planu), sekcja 7 (N3), sekcja 9 (klawiatura) · design.md: pinezka, kolory dni, układ dwukolumnowy · prototyp.html: panel mapy na ekranie podróży

## Cel
Użytkownik widzi, gdzie leżą punkty dnia i w jakiej kolejności je odwiedzi.

## Zachowanie
1. Na E7 obok planu (na komputerze) albo po przełączeniu „Plan dni / Mapa” (na telefonie) jest panel mapy.
2. Wybór „Pokaż”: „Cała podróż” albo konkretny dzień.
3. Mapa schematyczna bez podkładu: siatka, oznaczenie północy, pinezki według współrzędnych dopasowane do panelu.
4. Pinezka dnia: kółko w kolorze dnia z numerem z planu; nieprzypisane (tylko przy „Cała podróż”): puste kółko bez numeru. Linia trasy łączy punkty jednego dnia w kolejności planu, osobno dla każdego dnia.
5. Kliknięcie pinezki (albo Enter na pinezce) podświetla ją wraz z nazwą i odpowiadający punkt na liście; kliknięcie punktu na liście pod mapą podświetla pinezkę.
6. Pod mapą tekst: „Mapa schematyczna bez podkładu. Trasa łączy punkty liniami prostymi w kolejności z planu, osobno dla każdego dnia. Odległości i czasy przejazdu nie są wyznaczane.” oraz lista pokazanych punktów.

## Dane
Czyta Punkty planu i współrzędne Miejsc. Niczego nie zapisuje (wybór dnia nie jest zapamiętywany).

## Kryteria akceptacji
- F06-KA1 [test]: Gdy dzień 1 ma Koloseum (1) i Panteon (2), a wybiorę „Dzień 1”, to widzę 2 pinezki z numerami 1 i 2 w kolorze dnia 1 i jedną linię między nimi.
- F06-KA2 [test]: Gdy zamienię Koloseum i Panteon w planie, to numery pinezek się zamieniają (N3).
- F06-KA3 [test]: Gdy wybiorę „Cała podróż” przy dwóch dniach z punktami, to są dwie osobne linie (żadna nie łączy dnia 1 z dniem 2), a miejsca „Do zaplanowania” są pustymi kółkami bez numeru.
- F06-KA4 [test]: Gdy kliknę pinezkę Panteonu, to Panteon jest podświetlony na liście pod mapą; gdy kliknę Koloseum na liście, to podświetla się jego pinezka.
- F06-KA5 [test]: Gdy punkt nie ma współrzędnych, to nie ma pinezki, a pod mapą jest „Brak współrzędnych, więc nie pokazano na mapie: [nazwa].”
- F06-KA6 [ręcznie]: Gdy przejdę po pinezkach klawiszem Tab, to fokus jest widoczny, a Enter podświetla pinezkę.

## Przypadki brzegowe i błędy
- Jeden punkt albo kilka punktów w tym samym miejscu: pinezka na środku, bez dzielenia przez zero.
- Dzień bez punktów: komunikat „Brak punktów do pokazania na mapie”.
- Punkty bardzo daleko od siebie (Rzym i Dolomity w jednej podróży): wszystkie mieszczą się w panelu.

## Ochrona danych
Nie dotyczy: brak danych osobowych i brak żądań sieciowych (N1); mapa nie korzysta z zewnętrznych serwisów (DEC-9).

## Poza zakresem tej karty
Podkład mapy, odległości, czasy przejazdu, optymalizacja kolejności (Później).

## Jak sprawdzić ręcznie
1. W podróży testowej przypisz 2 miejsca do dnia 1 i 1 do dnia 2.
2. Wybierz „Dzień 1”, zamień kolejność w planie i obserwuj numery.
3. Wybierz „Cała podróż” i sprawdź, że linie dni się nie łączą.
