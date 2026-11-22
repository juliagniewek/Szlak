# Specyfikacja v1: szlak. (wersja podstawowa)

Aplikacja webowa do odkrywania miejsc, zapisywania inspiracji i planowania podróży.
Podstawa: [brief.md](brief.md), prototyp [prototyp.html](prototyp.html) i notatki z peer testu.

## 1. Karta decyzji: uwagi z peer testu

| Uwaga testerów | Decyzja | Powód |
|---|---|---|
| Trudno przeskakiwać między sekcjami (Odkrywaj, Szukaj, Zapisane, Podróże). | **Zmienia wygląd** | Funkcje są, ale nawigacja jest za mało widoczna: aktywna sekcja słabo się wyróżnia, a ikony są mało czytelne. |
| Sekcje powinny mieć lepsze kolory i być bardziej czytelne. | **Zmienia wygląd** | Paleta jest zbyt jednolita i sekcje zlewają się ze sobą. Trzeba zwiększyć kontrast i wyraźniej je rozdzielić. |

## 2. Kontekst spoza prototypu

- **Aplikacja działa głównie w przeglądarce na komputerze, a nie jako aplikacja na telefon.** Zmienia się priorytet układu: najpierw projektujemy szeroki ekran (menu boczne, plan obok mapy). Na telefonie strona ma działać, ale nie jest głównym celem.
- **Ważne są wyraźne ikony i zdjęcia miejsc.** Zmienia się zakres: zdjęcia miejsc przechodzą z listy „poza zakresem” do must-have. Zmieniają się ekrany Odkrywaj, Szukaj, Zapisane i Szczegóły miejsca oraz kryteria z sekcji 5.

## 3. Zakres

### Must-have

1. Odkrywanie miejsc ze zdjęciami i zapisywanie ich sercem.
2. Wyszukiwanie i filtry.
3. Utworzenie podróży z zapisanych miejsc albo od zera, z kierunkiem wybieranym z listy.
4. Plan dzień po dniu: przypisywanie, kolejność, przenoszenie i usuwanie punktów.
5. Automatyczne planowanie („Rozłóż” i „Zaplanuj automatycznie”) z możliwością cofnięcia. Bez cofnięcia użytkownik nie naprawi nietrafionego planu automatycznego i nie domknie ścieżki.
6. Mapa z pinezkami i trasą każdego dnia.
7. Czytelna nawigacja między sekcjami, z ikonami i wyraźnie zaznaczoną aktywną sekcją.

### Nice-to-have

- Kolekcje miejsc.
- Archiwizowanie i duplikowanie podróży.
- Notatka przy punkcie planu.

### Poza zakresem v1

- **Konto i logowanie.** Do sprawdzenia ścieżki wystarczy zapis w przeglądarce.
- **Prawdziwa mapa z ulicami, odległościami i czasami.** Wymaga zewnętrznych serwisów, a kolejność punktów sprawdzimy na mapie schematycznej. Zastąpienie jej mapą schematyczną zaproponował agent.
- **Przycisk „Wyczyść dane”.** Służy tylko do testów, użytkownik go nie potrzebuje. Zaproponował go agent.
- **Współdzielenie i wspólna edycja podróży.** To dopiero Etap 3 według specyfikacji produktu.
- **Rezerwacje i płatności.** Specyfikacja produktu wyklucza je z pierwszej wersji.

## 4. Ekrany głównej ścieżki i wygląd

1. **Odkrywaj**: zdjęcia kierunków i miejsc, przy każdym miejscu serce do zapisu.
2. **Szczegóły miejsca**: zdjęcie, opis, lokalizacja, „Zapisz”, „Dodaj do podróży”.
3. **Zapisane**: zaznaczanie miejsc i „Utwórz podróż z wybranych”.
4. **Nowa podróż**: nazwa, kierunek z listy albo wpisany, daty, liczba atrakcji dziennie.
5. **Plan dni**: lista „Do zaplanowania” i karty dni z punktami.
6. **Mapa**: obok planu, z wyborem dnia.
7. **Podróże**: lista podróży użytkownika.

**Wygląd:** [design.md](design.md). Ciepły, magazynowy styl ze zdjęciami, ikonami i osobnym kolorem dla każdej sekcji pasuje do osoby, która szuka inspiracji w przeglądarce na komputerze i chce łatwo się w niej orientować.

## 5. User stories i kryteria akceptacji

**US1. Zapis miejsca**
Jako osoba szukająca inspiracji chcę zapisać miejsce, które mi się podoba, żeby mieć je pod ręką przy planowaniu.
- Klikam serce przy miejscu → serce się wypełnia, a licznik przy „Zapisane” rośnie o 1.
  *Sprawdzę:* klikam serce i patrzę na licznik w menu.
- Wchodzę w „Zapisane” → miejsce jest na liście ze zdjęciem.
  *Sprawdzę:* otwieram zakładkę po zapisaniu.

**US2. Wyszukiwanie**
Jako użytkownik chcę wyszukać miejsce po nazwie, mieście lub kategorii, żeby szybko znaleźć to, czego szukam.
- Wpisuję „Rzym” → widzę tylko miejsca z Rzymu.
  *Sprawdzę:* wpisuję hasło i przeglądam wyniki.
- Wpisuję hasło bez wyników → widzę komunikat z podpowiedziami innych haseł.
  *Sprawdzę:* wpisuję „xyz”.

**US3. Podróż z zapisanych**
Jako planujący wyjazd chcę zamienić zapisane miejsca w podróż, żeby nie przepisywać ich ręcznie.
- Zaznaczam 3 miejsca i klikam „Utwórz podróż z wybranych” → otwiera się formularz z podpowiedzianym kierunkiem.
  *Sprawdzę:* zaznaczam miejsca i klikam przycisk.
- Podaję daty z 3 dni → podróż ma 3 dni, a miejsca są na liście „Do zaplanowania”.
  *Sprawdzę:* liczę karty dni i pozycje na liście.

**US4. Plan dni**
Jako planujący chcę ułożyć miejsca w dni i kolejność, żeby wiedzieć, co robię każdego dnia.
- Wybieram „Przypisz do dnia” → miejsce pojawia się w karcie dnia z numerem.
  *Sprawdzę:* przypisuję miejsce i patrzę na kartę dnia.
- Klikam ↓ przy punkcie 1 → zamienia się z punktem 2.
  *Sprawdzę:* porównuję kolejność przed kliknięciem i po nim.
- Klikam × → punkt znika z podróży, ale zostaje w Zapisanych.
  *Sprawdzę:* usuwam punkt i otwieram Zapisane.

**US5. Planowanie automatyczne**
Jako osoba, która nie wie, co zobaczyć, chcę, żeby aplikacja sama ułożyła plan, żeby mieć punkt wyjścia do poprawek.
- Klikam „Zaplanuj automatycznie” przy 3 dniach i 3 atrakcjach dziennie → każdy dzień ma 3 punkty z wybranego kierunku.
  *Sprawdzę:* liczę punkty w kartach dni.
- Klikam „Cofnij” → plan wraca do stanu sprzed automatycznego planowania.
  *Sprawdzę:* porównuję plan przed planowaniem i po cofnięciu.

**US6. Mapa**
Jako planujący chcę zobaczyć punkty dnia na mapie, żeby ocenić, czy trasa ma sens.
- Wybieram „Dzień 1” → widzę tylko pinezki dnia 1 z numerami zgodnymi z planem.
  *Sprawdzę:* porównuję numery pinezek z listą dnia.
- Zmieniam kolejność w planie → numery i linia trasy na mapie od razu się zmieniają.
  *Sprawdzę:* zmieniam kolejność i patrzę na mapę.

**US7. Nawigacja**
Jako użytkownik chcę łatwo przechodzić między sekcjami, żeby się nie gubić.
- Klikam sekcję w menu → otwiera się ona, a jej pozycja w menu jest wyraźnie wyróżniona kolorem i ikoną.
  *Sprawdzę:* przechodzę przez wszystkie 4 sekcje i patrzę na menu.
- Nowy tester trafia z Odkrywaj do Podróży bez pytania o drogę.
  *Sprawdzę:* obserwuję jedną osobę na teście.
