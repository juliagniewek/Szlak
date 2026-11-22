# Brief prototypu: Planer podróży

Prototyp: jeden plik HTML w tym folderze, bez serwera, bazy danych i logowania, na danych fikcyjnych.

## 1. Problem

Osoba przed wyjazdem zaznacza na mapach miejsca, które chce zobaczyć, ale mapy nie pozwalają ułożyć z nich planu. Dlatego przepisuje te miejsca do Worda albo Excela i sama układa z nich plan.

## 2. Użytkownik

Osoba, która jedzie na wyjazd do konkretnego miasta, kraju albo większego obszaru i chce zaplanować zwiedzanie. Sięga po aplikację przed wyjazdem, kiedy nie wie, co dokładnie robić na miejscu i czym się zająć.

## 3. Wartość

Zamiast zaznaczać miejsca na mapach i ręcznie przepisywać je do Worda albo Excela, użytkownik podaje miejsce, liczbę dni, intensywność, charakter wyjazdu (zwiedzanie czy natura) i ewentualnie budżet. Może też zaznaczyć ulubione atrakcje i restauracje w tym miejscu. Aplikacja generuje mu gotowy plan na kilka dni, który uwzględnia te dane i ulubione. Plan można edytować, a kilka różnych wyjazdów zapisać w jednej aplikacji i do nich wracać.

## 4. Zakres

### Ścieżka prototypu

1. **Ekran: moje wyjazdy.** Lista zapisanych wyjazdów. Użytkownik może otworzyć wyjazd, usunąć go albo zacząć nowy.
2. **Ekran: parametry wyjazdu.** Użytkownik:
   - wybiera miejsce (z fikcyjnej listy),
   - podaje liczbę dni,
   - wybiera intensywność (od intensywnych dni do odpoczynku),
   - wybiera charakter wyjazdu: zwiedzanie albo natura,
   - opcjonalnie wybiera budżet: niski albo wysoki,
   - opcjonalnie zaznacza ulubione atrakcje i restauracje, które pojawiają się po wybraniu miejsca.
3. **Krok: generowanie.** Użytkownik klika przycisk generowania planu.
4. **Ekran: plan wyjazdu.** Aplikacja pokazuje plan dzień po dniu. Plan ma tyle dni, ile podał użytkownik, zawiera miejsca tylko z wybranego miejsca, liczba punktów na dzień odpowiada intensywności, a rodzaj punktów odpowiada wybranemu charakterowi wyjazdu. Jeśli budżet został podany, plan go uwzględnia. Każdy dzień zawiera też obiad i kolację w restauracjach z wybranego miejsca. Ulubione atrakcje i restauracje trafiają do planu w pierwszej kolejności i są oznaczone.
5. **Krok: edycja i zapis.** Użytkownik usuwa punkty z planu i dodaje nowe, zapisuje wyjazd i wraca do listy wyjazdów.

### Poza prototypem

- Nic: wszystkie funkcje z brain dumpu są w prototypie.

## 5. Co testujemy

### Założenie o użyteczności

Po wpisaniu miejsca, liczby dni i intensywności użytkownik dostaje plan zgodny z tymi danymi.

**Nie potwierdziło się, jeśli** plan nie zgadza się z podanymi danymi:
- jest za mało intensywny albo zbyt intensywny w stosunku do wybranej intensywności, albo
- zawiera miejsca z innego miejsca niż podane.

**Ulubione, edycja i zapis (propozycja do zatwierdzenia):** użytkownik bez pomocy zaznacza ulubione, dostaje plan, w którym one są, edytuje go, zapisuje wyjazd i odnajduje go na liście.

**Nie potwierdziło się, jeśli:**
- zaznaczonej ulubionej atrakcji lub restauracji nie ma ani w planie, ani w komunikacie o ulubionych, które się nie zmieściły, albo
- tester nie potrafi bez pomocy usunąć lub dodać punktu w planie, albo
- tester nie znajduje zapisanego wyjazdu na liście „Moje wyjazdy”.

### Założenie o technologii (propozycja do zatwierdzenia)

Jeden plik HTML z wbudowanymi danymi fikcyjnymi, otwarty w przeglądarce bez serwera i bez internetu, generuje plan dla każdej kombinacji miejsca, liczby dni, intensywności, charakteru wyjazdu i budżetu dostępnej w formularzu.

**Nie potwierdziło się, jeśli** dla którejś kombinacji z formularza:
- plan się nie wygeneruje, albo
- do wygenerowania planu potrzebny jest serwer lub połączenie z internetem.

**Zapis wyjazdów (propozycja do zatwierdzenia):** ten sam plik, bez serwera i bazy danych, zapamiętuje zapisane wyjazdy razem z edycjami w pamięci przeglądarki.

**Nie potwierdziło się, jeśli** po zamknięciu i ponownym otwarciu pliku w tej samej przeglądarce:
- zapisanego wyjazdu nie ma na liście, albo
- w otwartym wyjeździe brakuje wprowadzonych zmian, albo
- usunięty wyjazd znowu jest na liście.
