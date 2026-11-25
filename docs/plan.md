# Plan techniczny: szlak.
Wersja 1.1 · 24.11.2026 · Faza A · Podstawa: docs/specyfikacja.md (v1.1, 24.11.2026), karty F00–F06, AGENTS.md, design.md, prototyp.html

Pierwszeństwo bez zmian: decyzje DEC > specyfikacja > karta > ten plan. Ten plan dopowiada tylko to, co specyfikacja zostawiła Fazie A (sekcja 8, „Decyzje dla Fazy A”). Pytania z Fazy A i odpowiedzi właścicielki są na końcu (sekcja 12); decyzje trafiły do specyfikacji jako DEC-13–DEC-17.

## 1. Przegląd specyfikacji

Werdykt ogólny: **WARNING** — specyfikację można budować. Stan po odpowiedziach z 24.11.2026: FAIL 9 i WARNING 6, 10, 11, 12 rozwiązane decyzjami DEC-13–DEC-17 w specyfikacji v1.1.

| # | Obszar | Wynik | Uzasadnienie |
|---|---|---|---|
| 1 | Cel, użytkownik, główna ścieżka | PASS | Jasne, spójne z briefem i DEC-10. |
| 2 | Zakres MVP-1 / MVP-2 / Później | PASS | Q1 bez odpowiedzi; przyjęto MVP-2 dla F06 (sekcja 4 planu). |
| 3 | Model danych (sekcja 6) | PASS | Kompletny dla MVP; brakuje tylko pól podpisu zdjęć (wiersz 9). |
| 4 | Dane katalogu a kryteria kart | PASS | Sprawdzone na prototypie: 41 miejsc, 5 kierunków, 4 kraje; Lizbona 9 miejsc (F01-KA2), Rzym 9 (F03-KA1); Polska + Kawiarnie = tylko „Kawiarnia z sernikiem na Kazimierzu” (F03-KA3); pierwsze alfabetycznie „Alfama” (F03-KA5); „Ogród Pomarańczowy na Awentynie” nie ma zdjęcia (F01-KA4); „Kopiec Kościuszki” ma kategorię Punkty widokowe (F03-KA2). |
| 5 | Ochrona danych, niezmienniki N1–N5 | PASS | Każdy niezmiennik ma test; plan dodaje blokadę sieci w przeglądarce (CSP, sekcja 3.6). |
| 6 | GitHub Pages | WARNING | Warunki sprawdzone (sekcja 2): darmowy plan wymaga publicznego repozytorium (zgodne z DEC-12); GitHub **zapisuje adresy IP odwiedzających** — specyfikacja miała „do sprawdzenia”, teraz to fakt, który trzeba podać w informacji na stronie. |
| 7 | Wspólne źródło danych z prototypem | WARNING | Prototyp i aplikacja będą pod tym samym adresem `juliagniewek.github.io`, więc dzielą pamięć przeglądarki. Prototyp używa klucza `szlak-dane-v1` w innym formacie. Rozwiązanie: aplikacja używa własnego klucza (sekcja 5). |
| 8 | Rozmiary zdjęć z Wikimedia | WARNING | Od 2026 Wikimedia odrzuca bezpośrednie żądania miniatur o niestandardowej szerokości (błąd 429). Prototyp używa 500 i 960 px — obie są standardowe. Reguła w planie: tylko szerokości z listy. |
| 9 | Podpisy zdjęć (licencje) | **FAIL** | Zdjęcia CC BY / CC BY-SA wymagają podania autora i licencji, także przy osadzaniu z serwerów Wikimedia. Specyfikacja ma w modelu tylko „adres pliku”, a prototyp tylko ogólny podpis „Zdjęcia: Wikimedia Commons”. To nie wystarcza przed publikacją. Propozycja w pytaniu P1. |
| 10 | Informacja „dane zostają w przeglądarce” | WARNING | Bramka prawdziwych danych jej wymaga, ale żadna karta jej nie buduje. Pytanie P3. |
| 11 | 44×44 px a design.md | WARNING | Sekcja 9 ma propozycję zmiany design.md bez decyzji. Pytanie P2 (propozycja domyślna: większy obszar kliknięcia bez zmiany wyglądu). |
| 12 | Status podróży na liście | WARNING | Sekcja 6 mówi o statusie (nadchodząca, w trakcie, zakończona, szkic), karta F04 pokazuje tylko „Szkic bez dat”. Pytanie P4. |
| 13 | Testy „kliknięć” bez bibliotek | WARNING | Bez zewnętrznych bibliotek nie ma symulacji przeglądarki w Node. Kryteria [test] sprawdzamy na poziomie logiki i wygenerowanego HTML (sekcja 7); prawdziwe kliknięcia zostają w krokach [ręcznie]. |
| 14 | Czas (< tydzień wieczorami) | PASS | Szacunek MVP-1: ok. 4,5 wieczoru; MVP-2: ok. 1,5 wieczoru (sekcja 4). R4 bez zmian. |

## 2. Usługi zewnętrzne — sprawdzone 24.11.2026

**GitHub Pages**
- Limity: opublikowana strona do 1 GB, transfer ok. 100 GB miesięcznie (miękki limit), do 10 publikacji na godzinę, publikacja przerywana po 10 min. Aplikacja ma kilkaset KB, więc limity nie są problemem. Źródło: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- Dane odwiedzających: „visitor's IP address is logged and stored for security purposes” — niezależnie od tego, czy osoba jest zalogowana. Właścicielka nie może tego wyłączyć. Źródła: [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [GitHub General Privacy Statement](https://docs.github.com/en/github/site-policy/github-privacy-statement).
- Darmowy plan: Pages tylko z repozytorium publicznego — zgodne z DEC-12.
- Pages domyślnie przepuszcza pliki przez Jekyll; plik `.nojekyll` w katalogu głównym wyłącza ten krok, więc pliki idą na stronę bez zmian.

**Wikimedia Commons**
- Osadzanie zdjęć bezpośrednio z serwerów Wikimedia jest dozwolone, ale odradzane (plik może zostać zmieniony albo usunięty — to już jest R3). Warunki licencji obowiązują tak samo jak przy kopii: trzeba podać autora (twórcę, nie osobę, która wgrała plik) i licencję, z odnośnikiem, gdy licencja tego wymaga. Źródło: [Commons: Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia).
- Miniatury: bezpośrednie żądania działają tylko dla standardowych szerokości: 20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840 px; inne kończą się błędem 429. Źródła: [Common thumbnail sizes](https://www.mediawiki.org/wiki/Common_thumbnail_sizes) (edycja 20.10.2026), [T414805](https://phabricator.wikimedia.org/T414805).
- Serwery Wikimedia widzą adres IP i adres strony, z której pobrano zdjęcie (domyślnie przeglądarka wysyła tylko domenę `juliagniewek.github.io`). Zasady przechowywania: [Wikimedia Foundation Privacy Policy](https://foundation.wikimedia.org/wiki/Policy:Privacy_policy) — do przeczytania przez właścicielkę przed bramką prawdziwych danych.

## 3. Kierunek i struktura projektu

### 3.1 Kierunek
Aplikacja statyczna: HTML, CSS i JavaScript w modułach ES, bez kroku budowania, bez bibliotek, bez serwera i bazy (DEC-2, DEC-10). Dane użytkownika w `localStorage`. Publikacja: katalog główny gałęzi `main` na GitHub Pages.

### 3.2 Adres publikacji (DEC-17)
- Aplikacja: `index.html` w katalogu głównym → `https://juliagniewek.github.io/Szlak/`.
- Prototyp zostaje bez zmian pod `.../Szlak/prototyp.html`.

### 3.3 Pliki
```
index.html                 strona aplikacji (jedyny HTML), meta CSP
style.css                  wartości z design.md jako zmienne CSS
.nojekyll                  GitHub Pages publikuje pliki bez Jekylla
package.json               tylko skrypty "test" i "start"; bez zależności
src/
  app.js                   start, nawigacja (#/odkrywaj, #/zapisane, #/podroze, #/podroz/<id>, #/szukaj), zdarzenia, toast
  magazyn.js               JEDYNE miejsce zapisu i odczytu danych użytkownika (localStorage), wersja, migracje, atrapa blokady
  stan.js                  operacje na danych użytkownika jako czyste funkcje (zapis miejsca, podróże, plan)
  walidacja.js             reguły pól z sekcji 6 i A1–A2, komunikaty błędów
  daty.js                  liczba dni, status, format „pt., 4.12”
  html.js                  szablon html`` z automatycznym zamienianiem znaków < > & " ' (tekst użytkownika nigdy jako kod)
  ikony.js                 ikony liniowe (z prototypu)
  dane/katalog.js          41 miejsc, 5 kierunków, kategorie, zdjęcia (dane przeniesione z prototypu)
  dane/zestaw-testowy.js   zestaw testowy z F00
  widoki/menu.js, odkrywaj.js, miejsce.js, zapisane.js, podroze.js, formularz-podrozy.js, plan.js, dodaj-miejsca.js
  szukaj.js                (F03) dopasowanie haseł i filtry
  mapa.js                  (F06) rzut współrzędnych na schemat
scripts/serwer.mjs         lokalny serwer plików (node:http, ok. 30 linii, bez zależności)
tests/*.test.js            testy node:test
```
Widoki to funkcje „dane → HTML” (jak w prototypie), więc da się je testować w Node bez przeglądarki. `app.js` wstawia HTML do strony i obsługuje kliknięcia przez atrybuty `data-akcja`.

### 3.4 Uruchamianie
- Lokalnie: `npm start` → `http://localhost:8000`. Serwer jest potrzebny, bo Chrome i Edge blokują moduły ES otwierane jako plik (dwuklik w `index.html` nie zadziała).
- Testy: `npm test` (= `node --test`). Node 26 jest zainstalowany w `C:\Program Files\nodejs`; w starej powłoce może nie być w PATH — wtedy zamknąć i otworzyć terminal.

### 3.5 Tryb deweloperski
Tylko gdy adres to `localhost` i ma `?dev`:
- przycisk „Załaduj zestaw testowy” (z potwierdzeniem, bo zastępuje dane),
- `?dev&blokada` uruchamia aplikację z atrapą przeglądarki blokującej zapis (A5).
Na GitHub Pages tryb się nie włącza.

### 3.6 Bezpieczeństwo w kodzie
- Meta CSP w `index.html`: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://upload.wikimedia.org; connect-src 'none'; form-action 'none'; base-uri 'none'`. Przeglądarka sama zablokuje każde żądanie z danymi (N1) i każdy obcy skrypt. `'unsafe-inline'` tylko dla stylów (kolory dni w atrybutach `style`).
- Cały tekst do HTML przechodzi przez `html.js`. Zakaz wstawiania tekstu użytkownika inaczej (sprawdza test statyczny).
- Zdjęcia: tylko szerokości 500 (karty) i 960 (okno szczegółów); `alt` z nazwą miejsca; przy błędzie wczytania karta pokazuje gradient i ikonę kategorii (A4).

## 4. Kolejność kart i szacunek czasu
Q1: F06 w MVP-2 (DEC-17).

| Kolejność | Karta | Poziom | Szacunek | Status |
|---|---|---|---|---|
| 1 | F00 Fundament i zabezpieczenia | Wysoki | 1 wieczór | zbudowana, czeka na weryfikację |
| 2 | F01 Układ aplikacji i Odkrywaj | Średni | 1 wieczór | do zrobienia |
| 3 | F02 Zapisywanie miejsc | Średni | 0,5 wieczoru | do zrobienia |
| 4 | F04 Podróże | Średni | 1 wieczór | do zrobienia |
| 5 | F05 Plan dni | Wysoki | 1 wieczór | do zrobienia |
| 6 | F03 Wyszukiwanie i filtry (MVP-2) | Średni | 0,5 wieczoru | do zrobienia |
| 7 | F06 Mapa trasy (MVP-2) | Wysoki | 1 wieczór | do zrobienia |
| — | F07 Planowanie automatyczne | — | — | Później (DEC-10) |

Jeśli F05 zajmie więcej niż wieczór, F03 i F06 idą do „Później” (R4, decyduje właścicielka).

## 5. Model danych — wersja techniczna

### 5.1 Katalog (`src/dane/katalog.js`, tylko odczyt)
```js
{ id: "rzym-koloseum", nazwa: "Koloseum", miasto: "Rzym", kraj: "Włochy",
  kategoria: "kultura",            // kultura | miasta | natura | punkt | plaza | jedzenie | kawiarnia | aktywnosc
  opis: "…",                       // do 200 znaków
  wsp: [41.8902, 12.4922] | null,  // szerokość, długość
  oznaczenia: ["popularne"],       // popularne | jesien-zima | mniej-znane
  zdjecie: { plik: "d/de/Colosseo_2020.jpg", autor: "…", licencja: "CC BY-SA 4.0" } | null }  // autor i licencja: DEC-13
```
Kierunki: `{ miasto, kraj, tekst, zdjecie }`. Sortowanie „Popularne” w F03 jak w prototypie: najpierw miejsca z oznaczeniem „popularne”, potem reszta, w kolejności katalogu.

### 5.2 Dane użytkownika (`localStorage`, klucz `szlak.app.dane`)
```js
{ wersja: 1,
  zapisane: [ { miejsce: "rzym-koloseum", zapisano: "2026-11-22T19:15:00.000Z" } ],
  podroze: [ {
    id: "p-lq3k9x-4f2a",           // czas + losowy przyrostek
    nazwa: "Wyjazd: Rzym",         // 1–60 znaków po obcięciu spacji
    kierunek: "Rzym",              // 1–60 znaków
    start: "2026-12-04" | null,    // obie daty albo żadna
    koniec: "2026-12-06" | null,
    dniSzkicu: 3 | null,           // 1–30, gdy brak dat
    opis: "",                      // 0–300 znaków
    utworzono: "2026-11-22T19:30:00.000Z",
    punkty: [ { miejsce: "rzym-panteon", dzien: 1 } ]   // dzien: 0 = „Do zaplanowania”, 1..liczba dni
  } ] }
```
- **Pozycja w dniu** (sekcja 6) wynika z kolejności w tablicy `punkty` wśród punktów tego samego dnia. Dzięki temu numeracja jest zawsze od 1 bez luk (F05) i nie trzeba jej przeliczać.
- Liczba dni: z dat (włącznie, liczona w UTC, żeby zmiana czasu nie psuła wyniku) albo `dniSzkicu`. Status liczony z dat i „dzisiaj” podawanego do funkcji (testowalne).
- Jedno miejsce w podróży najwyżej raz; zapis miejsca najwyżej raz (operacje są idempotentne — podwójne kliknięcie nie tworzy duplikatu).
- Własny klucz `szlak.app.dane` — nie `szlak-dane-v1` prototypu, bo oba działają pod tym samym adresem GitHub Pages i dzielą pamięć przeglądarki.

### 5.3 Wersje i uszkodzone dane (`magazyn.js`)
- Brak klucza → puste dane, bez komunikatu.
- `wersja` mniejsza niż obecna → migracja krok po kroku (`migracje[1]` zmienia 1→2 itd.), potem zapis.
- Niepoprawny JSON, nieznany kształt albo `wersja` większa niż obecna → oryginalny tekst trafia do klucza `szlak.app.kopia` (jeśli kopii jeszcze nie ma), aplikacja startuje z pustymi danymi i pokazuje: „Nie udało się odczytać zapisanych danych. Ich kopia została zachowana w przeglądarce.” Dane nie są kasowane po cichu (F00).
- Przeglądarka blokuje zapis (próbny zapis przy starcie się nie udaje) → tryb tylko w pamięci i ostrzeżenie z A5.
- Błąd zapisu w trakcie (np. brak miejsca) → operacja nie zostaje przyjęta: stan wraca do poprzedniego, komunikat „Nie udało się zapisać zmian. Spróbuj ponownie.”, bez komunikatu o sukcesie (F02, F04, F05).
- API: `wczytaj(storage) → { stan, ostrzezenie }`, `zapisz(storage, stan) → true | false`. `storage` jest parametrem, więc testy podają atrapę.

### 5.4 Miejsce usunięte z katalogu
- Zapis i punkty planu zostają w pamięci (nic nie jest kasowane).
- E4 Zapisane i licznik w menu pomijają takie miejsce.
- W planie dnia punkt pokazuje się jako „Miejsce niedostępne” z przyciskiem × (żeby dało się go usunąć), bez numeru i bez strzałek; numeracja liczy tylko dostępne punkty, więc numery pinezek nadal odpowiadają planowi (N3).
- Mapa i E8 je pomijają.

## 6. Kroki na kartę

### F00 · Fundament i zabezpieczenia
1. Pliki z sekcji 3.3 (puste widoki), `package.json`, `scripts/serwer.mjs`, `.nojekyll`, `index.html` z CSP i menu, `style.css` z wartościami design.md.
2. `src/dane/katalog.js`: 41 miejsc i 5 kierunków z `PLACES`, `DESTS`, `PHOTOS` prototypu; autor i licencja każdego zdjęcia z Commons (DEC-13) (pobrane jednorazowo przez agenta; zdjęcie bez jasnej licencji zostaje usunięte i karta pokazuje ikonę).
3. `magazyn.js` z wersją, migracjami, kopią uszkodzonych danych, atrapą blokady; `zestaw-testowy.js` i przycisk w trybie `?dev`.
4. `.gitignore` (dopisać brakujące wpisy Trail-code, jeśli są), reguły „deny” dla `.env` w `.claude/settings.json` dopisane obok hooka Trail-code (składnia z aktualnej dokumentacji Claude Code).
5. Testy: katalog (KA2, KA6, KA8), zestaw testowy (KA3), `.env` ignorowany (KA4), magazyn (pusty start, uszkodzone dane, blokada), testy statyczne N1/N4 (sekcja 7).
6. README: „Jak uruchomić lokalnie”.
Pliki: wszystkie z 3.3 poza widokami F01+, `.gitignore`, `.claude/settings.json`, README.md.

### F01 · Układ aplikacji i Odkrywaj
1. `widoki/menu.js`: 3 sekcje (Szukaj od F03), ikona, kolor, wyróżnienie aktywnej; menu boczne / dolne (375 px).
2. `widoki/odkrywaj.js`: kierunki, 3 sekcje po 8 kart, lista miejsc kierunku z powrotem; „Źródła zdjęć” (DEC-13); stopka z „O danych” na każdym ekranie (DEC-15).
3. Karta miejsca ze zdjęciem 500 px, zastępczy gradient z ikoną; miejsce na serce.
4. `widoki/miejsce.js`: okno E3 (960 px) z podpisem zdjęcia (DEC-13), zamykanie ×, Esc, kliknięcie poza oknem, fokus wraca na kartę. Przyciski-ikony z obszarem 44×44 px (DEC-14).
5. Testy KA2–KA4, KA7, KA8 na HTML z widoków; apostrof i długa nazwa.
Pliki: `src/widoki/menu.js`, `odkrywaj.js`, `miejsce.js`, `src/app.js`, `style.css`, `tests/odkrywaj.test.js`.

### F02 · Zapisywanie miejsc
1. `stan.js`: `przelaczZapis(stan, idMiejsca, teraz)`.
2. Serce na kartach i w E3 (`aria-pressed`), licznik w menu, toasty z karty.
3. `widoki/zapisane.js`: najnowsze na górze, stan pusty.
4. Obsługa A5 i błędu zapisu przez `magazyn.js`.
5. Testy KA1–KA6 (KA6: atrapy `fetch`, `XMLHttpRequest`, `sendBeacon` nie zostają wywołane).
Pliki: `src/stan.js`, `src/widoki/zapisane.js`, `menu.js`, `odkrywaj.js`, `miejsce.js`, `src/app.js`, `tests/zapisane.test.js`.

### F04 · Podróże
1. `walidacja.js` i `daty.js`: reguły i komunikaty z KA3–KA4, liczba dni, status.
2. `stan.js`: utwórz, edytuj (skracanie → punkty do dnia 0, licznik do komunikatu A6, odmiana „1 miejsce wróciło / 2 miejsca wróciły / 5 miejsc wróciło”), usuń.
3. Zaznaczanie na E4 i pasek akcji; `widoki/formularz-podrozy.js` (E5) z podpowiedzią kierunku i nazwy.
4. `widoki/podroze.js` (E6) z etykietą statusu (DEC-16), stan pusty, potwierdzenie usunięcia; „Dodaj do podróży” w E3.
5. Testy KA1–KA8, w tym `<b>test</b>` i podwójne kliknięcie „Utwórz”.
Pliki: `src/walidacja.js`, `src/daty.js`, `src/stan.js`, `src/widoki/zapisane.js`, `formularz-podrozy.js`, `podroze.js`, `miejsce.js`, `tests/podroze.test.js`.

### F05 · Plan dni
1. `stan.js`: `przypiszDoDnia`, `przesun(góra/dół)`, `przeniesDoDnia` (na koniec dnia), `usunPunkt`, `dodajPunkty`.
2. `widoki/plan.js` (E7): nagłówek, „Do zaplanowania”, karty dni z kolorami i datami „pt., 4.12”.
3. `widoki/dodaj-miejsca.js` (E8): wyszukiwanie, zapisane na górze, miejsca z podróży nieaktywne, „Dodaj (n)”.
4. Stany puste, komunikaty, punkt „Miejsce niedostępne” (5.4).
5. Testy KA1–KA6 i przypadki brzegowe (podwójne ↓).
Pliki: `src/stan.js`, `src/widoki/plan.js`, `dodaj-miejsca.js`, `src/app.js`, `tests/plan.test.js`.

### F03 · Wyszukiwanie i filtry (MVP-2)
1. `szukaj.js`: normalizacja (małe litery, bez polskich znaków), każde słowo musi pasować, obcięcie końcówki jak w prototypie, filtry, sortowanie.
2. `widoki/szukaj.js` (E2): pole, filtry, licznik, stan pusty z „Wyczyść wyszukiwanie i filtry”.
3. Sekcja Szukaj w menu; chipy kategorii na E1.
4. Testy KA1–KA5 i przypadki brzegowe.
Pliki: `src/szukaj.js`, `src/widoki/szukaj.js`, `menu.js`, `odkrywaj.js`, `tests/szukaj.test.js`.

### F06 · Mapa trasy (MVP-2)
1. `mapa.js`: rzut równoodległościowy z poprawką cos(szerokości), dopasowanie do panelu z marginesem; jeden punkt albo wszystkie w jednym miejscu → środek (bez dzielenia przez zero).
2. Mapa jako SVG: siatka, północ, linie osobno dla każdego dnia, pinezki z numerem (N3), puste kółka dla „Do zaplanowania”.
3. Wybór „Pokaż”, lista pod mapą, podświetlanie w obie strony, pinezki jako przyciski (Tab, Enter).
4. Przełącznik „Plan dni / Mapa” na telefonie; tekst o mapie schematycznej.
5. Testy KA1–KA5 na funkcjach `mapa.js` i HTML panelu.
Pliki: `src/mapa.js`, `src/widoki/plan.js`, `style.css`, `tests/mapa.test.js`.

## 7. Testowanie
- Jedno polecenie: `npm test` (`node --test`, wbudowane w Node 26, bez bibliotek).
- Co testujemy automatycznie: czyste funkcje (`stan.js`, `walidacja.js`, `daty.js`, `szukaj.js`, `mapa.js`, `magazyn.js`) i HTML zwracany przez widoki (np. „serce ma `aria-pressed="true"`, licznik w menu to 1”). Kryterium „[test]” z kliknięciem = test operacji, którą wywołuje kliknięcie, plus test HTML po niej.
- Pamięć przeglądarki w testach: atrapa `localStorage` (obiekt w pamięci) i atrapa blokująca (`setItem` rzuca błąd). N5 = zapis → nowe `wczytaj()` z tej samej atrapy → te same dane.
- Testy stałe od F00:
  - N1: test statyczny — w `src/` nie ma `fetch(`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `<script src="http`; `index.html` ma CSP z `connect-src 'none'`. W testach operacji atrapy funkcji sieciowych nie są wywoływane.
  - N2, N3, N5: testy w kartach F02/F04/F05/F06.
  - N4: test — w repozytorium (`git ls-files`) nie ma `.env*` poza `.env.example` ani napisów wyglądających na klucze.
  - Tekst użytkownika: `<b>test</b>` wraca w HTML jako `&lt;b&gt;test&lt;/b&gt;`.
- Ręcznie (kroki z kart): wygląd, 375 px, klawiatura, brak internetu, odświeżenie przeglądarki.
- Daty w testach: „dzisiaj” podawane do funkcji, np. 24.11.2026; zestaw testowy z F00.

## 8. Ryzyka
- R-T1: Licencje zdjęć — rozwiązane DEC-13; F00 musi odczytać autora i licencję każdego pliku, a Faza C to sprawdzić.
- R-T2: Wikimedia zmienia zasady miniatur (już raz zmieniło w 2025–2026) albo adres serwera — zdjęcia znikną, zostaną ikony (A4). Gdyby zdjęcia przestały działać, w CSP trzeba dopuścić nowy adres.
- R-T3: Moduły ES nie działają po dwukliku w plik — README musi jasno mówić „`npm start`”.
- R-T4: Wspólna pamięć przeglądarki z prototypem i innymi stronami `juliagniewek.github.io` — rozwiązane własnym kluczem; czyszczenie danych jednej strony czyści wszystkie.
- R-T5: Testy nie klikają prawdziwej strony — błędy w obsłudze zdarzeń wyłapuje tylko sprawdzenie ręczne.
- R-T6: Czas (R4) — F05 jest najtrudniejsza z MVP-1.
- R1–R3 ze specyfikacji bez zmian.

## 9. Statusy
| ID | Funkcja | Priorytet | Status |
|---|---|---|---|
| F00 | Fundament i zabezpieczenia | MVP-1 | zbudowana, czeka na weryfikację (Faza C) |
| F01 | Układ aplikacji i Odkrywaj | MVP-1 | do zrobienia |
| F02 | Zapisywanie miejsc | MVP-1 | do zrobienia |
| F04 | Podróże | MVP-1 | do zrobienia |
| F05 | Plan dni | MVP-1 | do zrobienia |
| F03 | Wyszukiwanie i filtry | MVP-2 | do zrobienia |
| F06 | Mapa trasy | MVP-2 | do zrobienia |
| F07 | Planowanie automatyczne | Później | przeniesiona (DEC-10) |

## 10. Później
- F07 Planowanie automatyczne; kolekcje, archiwum, duplikowanie, notatki (DEC-10).
- Eksport i import danych do pliku (kopia zapasowa) — odpowiedź na R2.
- Zdjęcia skopiowane do repozytorium zamiast osadzania z Wikimedia (zalecane przez Commons, usuwa R3 i R-T2).
- Automatyczne testy w prawdziwej przeglądarce (wymagałyby narzędzia spoza DEC-10).
- Konta i synchronizacja (DEC-1), prawdziwa mapa (DEC-9).

## 11. Następny krok
Nowa sesja Fazy C: weryfikacja F00 (kryteria F00-KA1–KA8, lista kontrolna ze specyfikacji, sekcja 7). Potem nowa sesja Fazy B: F01 · poziom Średni.

## Wnioski
Trail-code działa; wnioski z sesji są w `.trail/learnings/`.

## 12. Pytania z Fazy A — odpowiedzi właścicielki (24.11.2026)
- P1 podpisy zdjęć: tak → DEC-13 (sekcja 6 specyfikacji, F00, F01, design.md).
- P2 obszar kliknięcia 44×44 px: tak, dopisane do design.md → DEC-14 (F01).
- P3 stopka i „O danych”: tak, w F01 → DEC-15.
- P4 status podróży: tak, jako mała etykieta → DEC-16 (F04).
- P5 mapa w MVP-2, adres `juliagniewek.github.io/Szlak/`, prototyp zostaje: tak → DEC-17.

Otwartych pytań brak.
