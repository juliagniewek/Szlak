# Brief prototypu: szlak.

Aplikacja do odkrywania miejsc, zapisywania inspiracji i planowania podróży. „szlak.” to nazwa robocza.
Droga użytkownika: odkryj miejsce → zapisz je → dodaj do podróży → ułóż plan dni → zobacz trasę na mapie.

Prototyp to jeden plik HTML w tym folderze. Działa bez serwera, bazy danych, logowania i internetu. Zawiera przykładowe miejsca z prawdziwych krajów i miast, ale bez adresów i nazw firm.

## 1. Problem

Osoba planująca city break ma inspiracje zapisane w kilku różnych aplikacjach, zakładkach i notatkach. Kiedy przychodzi do ułożenia wyjazdu, nie ma ich w jednym miejscu. Nie widzi też, gdzie te miejsca leżą ani jak połączyć je w logiczną trasę.

## 2. Użytkownik

Podróżnik indywidualny, para albo znajomi, którzy sami planują city break, wakacje lub krótki wyjazd. Po aplikację sięgają w dwóch sytuacjach:
- kiedy trafią na ciekawe miejsce i chcą je zapisać, nawet bez ustalonego terminu wyjazdu,
- kiedy z zebranych inspiracji chcą ułożyć konkretną podróż i zobaczyć ją na mapie.

## 3. Wartość

- Inspiracje są zebrane w jednym miejscu i uporządkowane w kolekcjach.
- Zapisane miejsca można szybko zamienić w podróż i rozpisać je dzień po dniu.
- Mapa pokazuje, gdzie leżą punkty i w jakiej kolejności je odwiedzić.
- Zmiany w planie od razu widać na mapie.
- Usunięcie miejsca z podróży nie usuwa go z zapisanych inspiracji.

## 4. Zakres

### Ścieżka prototypu (Etap 1, MVP)

1. **Odkrywaj.** Wyróżnione kierunki, kategorie, popularne miejsca, sezonowe inspiracje i mniej znane miejsca. Karta miejsca ma obrazek kategorii, nazwę, lokalizację, kategorię i serce do zapisu. Szczegóły miejsca zawierają opis, lokalizację, kategorię, współrzędne oraz akcje „Zapisz”, „Dodaj do kolekcji” i „Dodaj do podróży”.
2. **Szukaj.** Wyszukiwanie po nazwie, mieście, kraju i kategorii. Filtry: kategoria, kraj i miasto. Sortowanie: popularne albo alfabetycznie. Gdy nic nie pasuje, aplikacja podsuwa inne hasła.
3. **Zapisane.** Lista zapisanych miejsc oraz własne kolekcje, które można tworzyć, zmieniać ich nazwę i usuwać. Jedno miejsce może należeć do wielu kolekcji. Po zaznaczeniu kilku miejsc użytkownik wybiera „Utwórz podróż z wybranych”.
4. **Podróże.** Zakładki: nadchodzące, w trakcie, zakończone, szkice i archiwum. Podróż ma nazwę, kierunek, daty i opcjonalny opis. Kierunek można wybrać z listy albo wpisać własny. Można ją utworzyć od zera, edytować, zduplikować, zarchiwizować i usunąć.
5. **Plan dzień po dniu.** Dni powstają z zakresu dat. Bez dat powstaje szkic z wybraną liczbą dni. Użytkownik:
   - przypisuje miejsca do dni,
   - dodaje i usuwa punkty,
   - przenosi punkty między dniami i zmienia ich kolejność,
   - opcjonalnie wpisuje notatkę.

   **Dodatki spoza specyfikacji:**
   - „Rozłóż automatycznie” rozdziela nieprzypisane miejsca na dni według wybranej liczby atrakcji dziennie i grupuje punkty leżące blisko siebie.
   - „Zaplanuj automatycznie” najpierw dobiera brakujące miejsca z katalogu dla kierunku podróży (najpierw zapisane, potem popularne), a potem je rozkłada. Ten przycisk jest też w formularzu nowej podróży.
   - Automatyczny plan można cofnąć, a każdy jego punkt edytować jak zwykły punkt planu.
6. **Mapa.** Mapa obok planu, a na telefonie przełączana z planem. Pokazuje:
   - pinezki wszystkich miejsc podróży,
   - numery zgodne z kolejnością w danym dniu,
   - linię trasy liczoną osobno dla każdego dnia,
   - filtr „cała podróż” albo wybrany dzień.

   Kliknięcie pinezki podświetla punkt na liście i odwrotnie.

### Poza prototypem

- **Konto:** rejestracja, logowanie, profil i usuwanie konta. Dane zapisują się tylko w przeglądarce.
- **Prawdziwa mapa:** podkład OpenStreetMap, geokodowanie i wyznaczanie tras przez serwis trasowania. Mapa jest schematyczna, a trasa to linie proste między punktami, bez odległości i czasów.
- **Zdjęcia i galerie:** zamiast nich są kolorowe obrazki kategorii.
- **Etap 2:** optymalizacja kolejności punktów i import miejsc.
- **Etap 3:** współdzielenie podróży, zapraszanie znajomych, wspólna edycja, komentarze, inne tryby transportu i integracje.
- **Poza pierwszą wersją według specyfikacji:**
  - rezerwacje,
  - płatności i przeliczanie walut,
  - sieć społecznościowa,
  - idealna optymalizacja planu,
  - nawigacja głosowa.

## 5. Co testujemy

### Założenie o użyteczności

Użytkownik bez pomocy przechodzi całą drogę: zapisuje miejsca, tworzy z nich podróż, przypisuje miejsca do dni i ogląda trasę dnia na mapie.

**Nie potwierdziło się, jeśli:**
- tester nie potrafi bez pomocy utworzyć podróży z zapisanych miejsc, albo
- tester nie potrafi bez pomocy przypisać miejsc do dni ani zmienić ich kolejności.

### Założenie o technologii

Jeden plik HTML bez serwera i internetu zapamiętuje zapisane miejsca, kolekcje i podróże w pamięci przeglądarki. Rysuje też mapę z pinezkami i trasą każdego dnia na podstawie współrzędnych miejsc.

**Nie potwierdziło się, jeśli:**
- po zamknięciu i ponownym otwarciu pliku zapisanych miejsc albo podróży nie ma, albo
- po zmianie kolejności lub usunięciu punktu mapa nie zmienia numerów i trasy, albo
- usunięcie miejsca z podróży usuwa je też z Zapisanych, albo
- podstawowe widoki nie działają na telefonie.
