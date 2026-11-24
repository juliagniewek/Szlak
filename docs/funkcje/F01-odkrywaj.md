# F01 · Układ aplikacji i Odkrywaj
**Status:** do zrobienia · **Priorytet:** MVP-1 · **Złożoność:** średnia → poziom Średni — tylko odczyt katalogu i nawigacja, bez zapisu danych
**Zależy od:** F00 · **Źródło:** brief (Odkrywaj), prototyp, W1, W2, DEC-3, DEC-4, DEC-5

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 5 (E1, E3, menu), sekcja 6 (Miejsce), sekcja 9 · design.md: zasady, kolory sekcji, układ, karta miejsca, karta kierunku, menu, ikony, zdjęcia · prototyp.html: ekran Odkrywaj, okno szczegółów miejsca

## Cel
Użytkownik ogląda inspiracje ze zdjęciami, otwiera szczegóły miejsca i zawsze wie, w której sekcji jest.

## Zachowanie
1. Menu z sekcjami Odkrywaj, Zapisane, Podróże (Szukaj dochodzi w F03), z ikoną i kolorem sekcji; aktywna sekcja wyróżniona tłem, pogrubieniem i paskiem (W1). Na komputerze menu boczne, na telefonie dolne.
2. E1 Odkrywaj: nagłówek, „Wyróżnione kierunki” (5 kart ze zdjęciem), „Popularne miejsca”, „Na jesień i zimę”, „Mniej znane miejsca” (po najwyżej 8 kart, według oznaczeń), podpis o źródle zdjęć.
3. Kliknięcie kierunku pokazuje na E1 listę wszystkich miejsc tego kierunku z nagłówkiem „Miejsca: Lizbona” i przyciskiem powrotu.
4. Kliknięcie karty miejsca otwiera E3: zdjęcie, kategoria, nazwa, miasto i kraj, opis, współrzędne. Zamknięcie: przycisk ×, klawisz Esc, kliknięcie poza oknem.
5. Karta miejsca: zdjęcie 16:10, kategoria, nazwa, lokalizacja. Miejsce na serce zostaje (F02).
6. Podpisy zdjęć (DEC-13): w E3 pod zdjęciem „Zdjęcie: [autor], [licencja]” z odnośnikiem do strony pliku na Commons; na dole E1 odnośnik „Źródła zdjęć” z listą wszystkich zdjęć (miejsce, autor, licencja, odnośnik).
7. Stopka na każdym ekranie (DEC-15): „Twoje dane zostają tylko w tej przeglądarce i znikną po jej wyczyszczeniu.” i odnośnik „O danych”, który pokazuje: co zostaje w przeglądarce, że GitHub (hosting) zapisuje adresy IP odwiedzających, że Wikimedia widzi adres IP przy pobieraniu zdjęć.
8. Przyciski-ikony mają obszar kliknięcia co najmniej 44×44 px przy wyglądzie z prototypu (DEC-14).

## Dane
Czyta Miejsca i kierunki z danych startowych. Niczego nie zapisuje.

## Kryteria akceptacji
- F01-KA1 [ręcznie]: Gdy otworzę aplikację, to widzę E1 z czterema sekcjami i 5 kierunkami, a „Odkrywaj” w menu jest wyróżnione tłem, pogrubieniem i paskiem w kolorze sekcji.
- F01-KA2 [test]: Gdy kliknę kierunek „Lizbona”, to widzę dokładnie 9 miejsc, wszystkie z Lizbony.
- F01-KA3 [test, ręcznie]: Gdy kliknę kartę „Koloseum”, to otwiera się E3 z kategorią „Kultura”, lokalizacją „Rzym, Włochy” i współrzędnymi „41.8902, 12.4922”.
- F01-KA4 [test]: Gdy miejsce nie ma zdjęcia (np. „Ogród Pomarańczowy na Awentynie”) albo zdjęcie się nie wczyta, to karta pokazuje gradient i ikonę kategorii, bez ikony zepsutego obrazka (A4).
- F01-KA5 [ręcznie]: Gdy przejdę kolejno przez wszystkie sekcje menu, to za każdym razem wyróżniona jest tylko aktywna sekcja (W1).
- F01-KA6 [ręcznie]: Gdy ustawię szerokość okna na 375 px, to strona nie przewija się w poziomie, a menu jest na dole.
- F01-KA7 [test]: Gdy otworzę E3 „Koloseum”, to pod zdjęciem jest podpis z autorem i licencją oraz odnośnik do strony pliku na Commons; „Źródła zdjęć” wymienia każde zdjęcie z katalogu (DEC-13).
- F01-KA8 [test]: Gdy otworzę dowolną sekcję, to widzę stopkę „Twoje dane zostają tylko w tej przeglądarce i znikną po jej wyczyszczeniu.”, a „O danych” wymienia GitHub i Wikimedia (DEC-15).

## Przypadki brzegowe i błędy
- Długa nazwa („Trattoria z domowym makaronem na Zatybrzu”) zawija się w karcie, nie wychodzi poza nią.
- Nazwa z apostrofem („Cortina d'Ampezzo”) wyświetla się poprawnie.
- Bez internetu: wszystkie karty z ikoną kategorii, reszta działa.

## Ochrona danych
Nie dotyczy: funkcja nie zapisuje danych. Zdjęcia ładowane z Wikimedia Commons; brak innych żądań sieciowych (N1).

## Poza zakresem tej karty
Serce i zapisywanie (F02), wyszukiwanie i kategorie jako filtry (F03), „Dodaj do podróży” w E3 (F04).

## Jak sprawdzić ręcznie
1. Otwórz aplikację, przejrzyj E1 i kliknij kierunek „Lizbona”.
2. Otwórz szczegóły Koloseum i zamknij je klawiszem Esc.
3. Wyłącz internet, odśwież stronę i sprawdź, że karty pokazują ikony.
4. Zmniejsz okno do szerokości telefonu.
