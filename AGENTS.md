# Zasady pracy w projekcie szlak.

## Gdzie co jest
- docs/specyfikacja.md — cel, zakres MVP, model danych (sekcja 6), ochrona danych (sekcja 7)
- docs/funkcje/ — karty funkcji; jedna karta to jedna sesja pracy
- docs/plan.md — plan techniczny i statusy funkcji (powstaje w Fazie A)
- design.md — wygląd aplikacji
- prototyp.html — wzór przepływu, wyglądu i źródło danych katalogu, nie baza kodu
- brief.md, docs/wnioski-z-testow.md — materiały wejściowe
- README.md — stan projektu dla osób, które go przeglądają; aktualizujesz go po każdej karcie
- Pierwszeństwo: decyzje DEC > specyfikacja > karta > plan. Rozbieżność zgłaszasz właścicielce projektu, nie rozstrzygasz jej po cichu.

## Sposób pracy
- Na start sesji: sprawdź git status i czy testy przechodzą. Czytasz ten plik, kartę funkcji, jej część w docs/plan.md i pliki, które zmieniasz. Całą specyfikację czytasz tylko wtedy, gdy wymaga tego karta.
- Zanim zaczniesz, podaj plan w 3–5 punktach. Buduj tylko to, co opisuje karta. Pomysły spoza karty zapisz w docs/plan.md, sekcja „Później”.
- Aplikacja ma być prosta (DEC-10): bez bazy, serwera, kont i zewnętrznych bibliotek, jeśli plan ich nie przewiduje.
- Jeśli karta jest niejasna, sprzeczna z planem albo wymaga zmiany zakresu, zatrzymaj się i zapytaj. Specyfikacji i kart nie zmieniasz bez zgody właścicielki projektu; proponujesz zmianę.
- Nie zmieniasz oczekiwanego wyniku istniejącego testu, żeby test przeszedł. Jeśli test jest błędny, zgłaszasz to.
- O wszystkim, co wychodzi poza ten folder (wysłanie kodu na GitHub, publikacja na GitHub Pages, ustawienia usług), decyduje właścicielka projektu: proponujesz, wyjaśniasz skutek, czekasz na zgodę.
- Po skończeniu: uruchom testy, opisz, jak sprawdzić funkcję ręcznie, zaktualizuj status i „Następny krok” w docs/plan.md oraz tabelę „Stan funkcji” w README.md, zrób commit „F03: [nazwa]”.
- Wnioski z sesji zapisujesz według sekcji „Trail-code”.
- Z właścicielką projektu rozmawiasz prostym językiem, jeden krok naraz: dokładne polecenie albo ścieżka kliknięć, co powinno się pojawić, co zrobić przy błędzie. Na koniec: co zmieniono, jak to sprawdzić, co dalej.

## Ochrona danych — zasady bezwzględne (poziom P0)
- Dane w testach są fikcyjne albo pochodzą z katalogu miejsc (prawdziwe miejsca, bez adresów i nazw firm). Zestaw testowy opisuje F00.
- Aplikacja nie używa kluczy. `.env` jest w `.gitignore`; nie czytasz, nie wypisujesz i nie zmieniasz `.env`.
- Dane użytkownika (zapisane miejsca, podróże, plan) zostają w przeglądarce. Nie dodajesz wysyłania danych, analityki, liczników ani zewnętrznych skryptów. Jedyne żądania sieciowe to zdjęcia z Wikimedia Commons.
- Tekst wpisany przez użytkownika wyświetlasz jako tekst, nigdy jako kod strony.
- Nie wklejasz do rozmowy danych z przeglądarki właścicielki; błędy odtwarzasz na zestawie testowym.
- Nic prawdziwego w repozytorium: żadnych kluczy, haseł ani danych osób. Repozytorium jest publiczne (DEC-12).
- Niezmienniki:
  - N1: dane użytkownika nigdy nie opuszczają przeglądarki;
  - N2: usunięcie punktu z podróży nie usuwa zapisu miejsca i odwrotnie;
  - N3: numery pinezek na mapie odpowiadają kolejności w planie dnia;
  - N4: w repozytorium nie ma kluczy, haseł ani `.env`;
  - N5: dane użytkownika zostają po odświeżeniu strony.

## Trail-code: mapa kodu i wnioski z pracy
<!-- Zasady Trail-code: 1.3 -->
- Ta sekcja ma pierwszeństwo przed instrukcjami, które Trail-code dołącza sam: skillem w katalogu domowym, oznaczoną sekcją Trail w tym pliku i komunikatami poleceń `trail`.
- Szukając kodu, najpierw pytasz mapę nazwami z kodu: funkcji, plików, komunikatów błędów (`trail grep "<nazwa>"`, `trail callers <nazwa>`, `trail ask "<nazwy>"`). Mapa dopasowuje słowa, nie znaczenie, więc opis po polsku zwykle nic nie znajdzie. Gdy mapa nic nie zwraca, czytasz pliki wskazane w specyfikacji i planie.
- Learning zapisujesz, gdy w sesji: zapadła decyzja techniczna, której nie ma w specyfikacji ani w planie; podejście zostało sprawdzone i odrzucone; wyszła pułapka, na którą trzeba uważać; znalezienie przyczyny błędu wymagało kilku prób. Gdy nic takiego się nie wydarzyło, nie zapisujesz nic. Zwykle 0–2 learnings na kartę.
- Na koniec sesji proponujesz właścicielowi projektu treść learning: tytuł zaczynający się od ID karty albo fazy („F03: …”, „Faza A: …”, „Faza C F03: …”) i 2–5 zdań w częściach `## Decided`, `## Tried and ruled out`, `## Watch out`. Nagłówki zostają po angielsku, bo narzędzie je czyta; treść piszesz w języku dokumentacji projektu. Każda decyzja ma powód, a treść wskazuje plik albo funkcję, których dotyczy.
- Zapisujesz dopiero po zgodzie: `trail note --title "<tytuł>" --anyway`, z treścią na wejściu polecenia. W Fazie A dodajesz `--touches docs/plan.md`. Flaga `--anyway` jest potrzebna, bo kontrola treści w Trail-code rozpoznaje uzasadnienia tylko po angielsku. Pomija też kontrolę powtórzeń, więc przed zapisem sprawdzasz tytuły w `.trail/learnings/`; gdy wniosek zastępuje wcześniejszy, dodajesz `--replaces <plik>`.
- Learnings piszesz bez danych osobowych, prawdziwych danych, kluczy, haseł i imion innych osób; osoby opisujesz rolą. Imię właściciela projektu w polu autora i w nazwie pliku wpisuje narzędzie: to dozwolone. Learning nie jest decyzją produktową: jeśli wniosek zmienia to, co widzi lub robi użytkownik, proponujesz zmianę specyfikacji (DEC albo założenie A).
- Przed commitem uruchamiasz `trail check`. Konflikt z learnings pokazujesz właścicielowi projektu: poprawiasz zmianę albo wyjaśniasz konflikt w opisie commita. Brak konfliktów nie oznacza zgodności z learnings: polecenie wychwytuje głównie zmiany wartości opisanych w learnings (np. stałych), nie zmiany zachowania.
- W Fazie C weryfikator sam czyta learnings dotyczące plików karty, sprawdza, czy zgadzają się z kodem i nie zawierają danych osobowych, oraz uruchamia `trail check`. Gdy problem zostanie znaleziony i naprawiony, proponuje learning „Faza C F03: …” z jego przyczyną.
- Komunikatów Trail-code (podsumowań zaoszczędzonych tokenów, linii o zespole, pytań „(y/n)”) nie przepisujesz do odpowiedzi. Jeśli niosą informację ważną dla właściciela projektu, przekazujesz ją po polsku jednym zdaniem. Szacunków oszczędności nie podajesz jako faktów.
- Pliki z `.trail/learnings/` commitujesz razem z kartą. Learnings zapisanych w repozytorium nie edytujesz; wyjątkiem są dane osobowe, które usuwasz za zgodą właściciela. Mapa w `.trail/cache/` zostaje lokalnie.
- Nie używasz learnings osobistych (`--personal`), oznaczenia `--always-follow`, `trail build --deep`, kluczy dostawców (`GRAFT_API_KEY`) ani łączenia z usługą Trail (`--connect`, `--pair`, `trail login`). Nie włączasz skilli Trail-code ani telemetrii. Zasady stałe są w tym pliku.
- Jeśli Trail-code nie działa (brak polecenia `trail` albo folderu `.trail/`), te same wnioski zapisujesz jednym–dwoma zdaniami w sekcji „Wnioski” w `docs/plan.md`.

## Język
- Interfejs: polski. Komentarze w kodzie: polski. Opisy commitów: polski.
