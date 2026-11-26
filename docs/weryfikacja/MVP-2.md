# Weryfikacja MVP-2 · F03 Wyszukiwanie i filtry, F06 Mapa trasy
Faza C · poziom Wysoki · runda 1 · 26.11.2026 · sprawdzany zakres `d5247dd..bd123a0`: od „F03: Wyszukiwanie i filtry” do „F06: learning o pinezkach jako przyciskach HTML nad rysunkiem SVG” (5 commitów: F03, akceptacja układu filtrów, F06 i dwa learnings).
Weryfikator: agent w osobnej sesji, innej niż sesje budowy. Kod nie był zmieniany.

## Werdykt: WARNING

Wszystkie 11 kryteriów akceptacji (F03: 5, F06: 6) jest spełnionych, z dowodami w testach i w przeglądarce. Niezmienniki N1–N5 są prawdziwe; N3 sprawdziłem w przeglądarce prawdziwym kliknięciem ↓: numery pinezek zamieniają się razem z planem, a pinezki zostają w swoich miejscach. Testy: 147 z 147 przechodzi. `trail check` nie zgłasza konfliktów.

WARNING wynika z dwóch znalezisk dotyczących wyglądu mapy. Żadne nie dotyczy danych ani bezpieczeństwa.

| # | Znalezisko | Kiedy rozstrzygnąć |
|---|---|---|
| W1 | Pinezki w tym samym albo bliskim miejscu leżą jedna na drugiej, a puste kółko „Do zaplanowania” jest zawsze na wierzchu. W podróży „Rzym + Dolomity” przy „Cała podróż” w Rzymie widać tylko puste kółko: 4 pinezki z numerami są pod nim i nie da się ich kliknąć | przed publikacją MVP-2; decyzja właścicielki, jak daleko iść (kolejność warstw albo rozsuwanie pinezek) |
| W2 | Przełącznik „Plan dni / Mapa” na telefonie pokazuje wybraną zakładkę tylko jaśniejszym tłem (1,3:1 względem tła przełącznika). design.md mówi, że aktywna zakładka jest ciemnobrązowa | dowolnie; zmiana w CSS albo zapis w design.md, że przełącznik zostaje jak w prototypie |
| W3 | Znalezione po rundzie 1, przy poprawce W1: test F06 „wygląd: na telefonie…” przechodzi tylko wtedy, gdy `style.css` ma uniksowe końce linii. Po zwykłym pobraniu repozytorium na Windowsie (`core.autocrlf=true`, tak jest na tym komputerze) `npm test` daje 1 błąd | przed kolejną kartą; test do poprawy za zgodą właścicielki (oczekiwany wynik bez zmian) |

Uwagi I1–I5 nie wpływają na werdykt. Decyzje właścicielki po rundzie 1: na końcu raportu.

## Co sprawdziłem i jak
- Przeczytane: AGENTS.md, karty F03 i F06, docs/plan.md (sekcje 3, 4, 5.1, 5.4, 6 dla F03 i F06, 7, 9–11), design.md (układ, chipy, punkt planu, pinezka, dostępność), raport docs/weryfikacja/MVP.md (W1 → DEC-21, W2), learnings dotyczące zmienianych plików: „F03: hasło dopasowywane z obciętą końcówką…”, „F06: pinezki jako przyciski HTML…”, „F05: podwójne kliknięcie strzałki…”, „Faza C MVP-1: klasa pusty…” oraz starsze learnings F00, F01, F02, F04, które Trail-code wskazał przy odczycie plików.
- Kod: pełny przegląd `src/szukaj.js`, `src/widoki/szukaj.js`, `src/mapa.js`, diffu `src/app.js`, `src/widoki/plan.js`, `src/widoki/odkrywaj.js`, `src/widoki/menu.js`, `src/widoki/dodaj-miejsca.js`, `style.css`; testy `tests/szukaj.test.js`, `tests/mapa.test.js` i zmiana w `tests/odkrywaj.test.js`.
- Testy: `npm test` (Node 26.13.1): 147 przechodzi, 0 nie przechodzi. Bez celowych błędów w kodzie (polecenie: nie zmieniać kodu).
- Przeglądarka: wbudowana przeglądarka aplikacji Claude (Chromium), serwer z `.claude/launch.json` (`node scripts/serwer.mjs`). Port 8000 był zajęty (prawdopodobnie Twój własny `npm start`), więc serwer dostał port 8001. Szerokość 1024 px i 375 px.
- Dane w przeglądarce: wszystkie próby pod `http://127.0.0.1:8001`. Twoich danych pod `localhost:8000` nie otwierałem. Pod `127.0.0.1:8001` pamięć zawierała już dane (531 znaków, prawdopodobnie z sesji budowy F06). Nie czytałem ich: przed próbami skopiowałem je w przeglądarce pod osobny klucz, a na końcu przywróciłem bez zmian (zgodność sprawdzona porównaniem tekstu) i usunąłem kopię.
- Kliknięcia: prawdziwą myszą i klawiaturą dla wpisywania haseł, Enter w polu, „Wyczyść wyszukiwanie i filtry”, podpowiedzi, chipu kategorii, serca na E2, ↓ w planie, pinezek, punktów listy pod mapą, Tab / Enter / spacji na pinezkach, przełącznika „Plan dni / Mapa”. Zmiany list wyboru (filtry, „Pokaż”, „Przypisz do dnia…”) i okno E8 częściowo przez konsolę (to samo zdarzenie `change` albo `click`). Pomiary rozmiarów, kolorów i żądań przez konsolę.
- `trail check` (bez zmian względem `origin/main`) i `trail check --base d5247dd`.
- Przeszukanie diffu pod kątem kluczy, haseł, adresów e-mail, wywołań sieciowych i wstawiania HTML.
- `.env`: żadnego pliku `.env` nie utworzyłem ani nie odczytałem.

## Kryteria akceptacji

### F03 · Wyszukiwanie i filtry
| Kryterium | Wynik | Dowód |
|---|---|---|
| F03-KA1 [test] „rzym” → 9 wyników, wszystkie z Rzymu | spełnione | Test „KA1: …” przechodzi (także „9 miejsc” w HTML i 9 kart). W przeglądarce wpisane z klawiatury: po każdej literze zmienia się lista, na końcu „9 miejsc”, 9 kart z „Rzym, Włochy”, fokus zostaje w polu. |
| F03-KA2 [test] „punkt widokowy” → tylko „Punkty widokowe”, w tym „Kopiec Kościuszki” | spełnione | Test „KA2: …” przechodzi (wynik = wszystkie 8 miejsc tej kategorii). W przeglądarce „8 miejsc”, każda karta z etykietą „Punkty widokowe”, jest „Kopiec Kościuszki”. Dopasowanie: `slowaHasla()` obcina do 2 liter końcówki, zostawia co najmniej 4 (`src/szukaj.js`), więc „widokowy” pasuje do „widokowe”. |
| F03-KA3 [test] Polska + Kawiarnie → tylko „Kawiarnia z sernikiem na Kazimierzu” | spełnione | Test „KA3: …” przechodzi. W przeglądarce: „1 miejsce”, jedyna karta to „Kawiarnia z sernikiem na Kazimierzu”; fokus zostaje na zmienionej liście. |
| F03-KA4 [test] „xyz” → „Nic nie znaleźliśmy”, podpowiedzi, przycisk przywraca 41 | spełnione | Test „KA4: …” przechodzi (także przy ustawionych filtrach). W przeglądarce: „0 miejsc”, „Nic nie znaleźliśmy”, 5 podpowiedzi (Rzym, kawiarnia, natura, Lizbona, punkt widokowy) i przycisk; prawdziwe kliknięcie → „41 miejsc”, 41 kart, puste pole z fokusem. Kliknięcie podpowiedzi „Lizbona” → „9 miejsc”, filtry wyczyszczone. |
| F03-KA5 [test] alfabetycznie bez hasła → pierwsza „Alfama” | spełnione | Test „KA5: …” przechodzi (cała lista zgodna z polskim alfabetem). W przeglądarce strzałka ↓ na liście „Sortuj”: „Alfama, Alpe di Siusi, Bar mleczny z pierogami, …”, nadal 41 miejsc. |

Zachowanie z karty F03 (pkt 1–5): w menu sekcja „Szukaj” z lupą i kolorem `#4F6D8A`, aktywna na E2, w menu dolnym 4 pozycje; pole hasła z etykietą i 4 listy (kategoria, kraj, miasto lub region zależne od kraju, sortowanie bez „Wszystkie”); liczba wyników w stałym regionie `role="status"`; każde słowo musi pasować do nazwy, miasta, kraju albo kategorii („kawiarnia polska” → 1 wynik, test); chipy 8 kategorii na E1, prawdziwe kliknięcie „Kawiarnie” → `#/szukaj/kawiarnia`, E2 z kategorią „Kawiarnie” i „3 miejsca”. Stan wyszukiwania nie jest zapisywany: po wyjściu z E2 i powrocie hasło i filtry są puste; serce na E2 zachowuje hasło i filtry (sprawdzone kliknięciem, potem cofnięte). Enter w polu nie przeładowuje strony.

Przypadki brzegowe F03: miasto „Rzym”, potem kraj „Polska” → miasto wraca do „Wszystkie”, a lista miast ma tylko „Kraków” (test i przeglądarka); „  KRAKÓW  ” daje te same 8 wyników co „kraków” (test i przeglądarka).

Wygląd E2: pole i listy 44 px wysokości, tekst 16 px; etykiety 10,21:1, liczba wyników 5,19:1, tekst chipów 11,04:1; chip 44 px wysokości (DEC-14). Przy 1024 px pole hasła w osobnym wierszu nad 4 listami (zaakceptowane przez właścicielkę 26.11.2026).

### F06 · Mapa trasy
| Kryterium | Wynik | Dowód |
|---|---|---|
| F06-KA1 [test] dzień 1: Koloseum (1), Panteon (2) → 2 pinezki 1 i 2 w kolorze dnia 1, jedna linia | spełnione | Test „F06-KA1: …” przechodzi. W przeglądarce (zestaw testowy, oba miejsca przypisane do dnia 1, „Pokaż: Dzień 1”): 2 pinezki „1” Koloseum i „2” Panteon, tło `rgb(123, 128, 105)` = `--dzien-1`, jedna linia `polyline` w tym samym kolorze. Koloseum leży na prawo i niżej od Panteonu, zgodnie ze współrzędnymi (północ u góry). |
| F06-KA2 [test] zamiana w planie zamienia numery (N3) | spełnione | Test „F06-KA2: …” przechodzi (numery z tej samej funkcji `planDnia()`). W przeglądarce **prawdziwe kliknięcie ↓ przy Koloseum**: plan „1 Panteon, 2 Koloseum”, pinezki „Panteon = 1”, „Koloseum = 2” w tych samych miejscach na mapie, linia zaczyna się teraz od Panteonu, lista pod mapą „1 Panteon, 2 Koloseum”; wybór „Dzień 1” został. |
| F06-KA3 [test] „Cała podróż”, dwa dni → dwie osobne linie, „Do zaplanowania” jako puste kółka | spełnione | Test „F06-KA3: …” przechodzi. W przeglądarce dzień 1 (Panteon, Koloseum), dzień 2 (Fontanna di Trevi, Forum Romanum), w „Do zaplanowania” Taras widokowy Pincio: dwie linie, każda przez 2 pinezki swojego dnia, w kolorze swojego dnia; Pincio ma puste kółko 28×28 px z przerywanym obrysem `--muted` (5,19:1 na tle mapy), bez numeru i koloru dnia. Klasa `kolko-puste`, nie `pusty` (wniosek z MVP-1 zastosowany). |
| F06-KA4 [test] pinezka Panteonu podświetla Panteon na liście; Koloseum na liście podświetla pinezkę | spełnione | Test „F06-KA4: …” przechodzi. W przeglądarce prawdziwe kliknięcie pinezki Panteonu: pinezka większa (40 px), z obwódką i podpisem „Panteon”, `aria-pressed="true"`, na liście podświetlony Panteon; fokus zostaje na pinezce. Kliknięcie „Koloseum” na liście: podświetlona pinezka Koloseum z podpisem; drugie kliknięcie zdejmuje podświetlenie. Na telefonie podpis aktywnej pinezki mieści się w mapie. |
| F06-KA5 [test] punkt bez współrzędnych → brak pinezki i „Brak współrzędnych…” | spełnione | Test „F06-KA5: …” przechodzi (punkt bez współrzędnych podany w teście, bo w katalogu każde z 41 miejsc ma współrzędne, I3). W przeglądarce odtworzone jedyną drogą możliwą w aplikacji: punkt miejsca spoza katalogu dopisany w pamięci przeglądarki do dnia 1 i przeładowanie. Pod mapą „Brak współrzędnych, więc nie pokazano na mapie: Miejsce niedostępne.”, pinezki nadal „1 Panteon, 2 Koloseum”. |
| F06-KA6 [ręcznie] Tab po pinezkach: fokus widoczny, Enter podświetla | spełnione | Z listy „Pokaż” klawisz Tab przechodzi na pinezkę „Dzień 1, punkt 1: Panteon” (`:focus-visible`, obrys 2 px, 3,73:1 na tle mapy, kwadrat 44×44 px wokół kółka), drugi Tab na Koloseum; Enter podświetla Koloseum i punkt listy, spacja zdejmuje podświetlenie, fokus zostaje na pinezce. Kolejność Tab = kolejność listy pod mapą. |

Zachowanie z karty F06 (pkt 1–6): przy 1024 px panel mapy obok planu (kolumny 365 i 332 px), przyklejony (`position: sticky`); przy 375 px przełącznik „Plan dni / Mapa” (przyciski 44 px, `aria-pressed`), na starcie plan, prawdziwe kliknięcie „Mapa” pokazuje mapę i chowa plan, bez przewijania w bok (`scrollWidth` = 375). „Pokaż”: „Cała podróż” i „Dzień 1 · pt., 4.12” itd.; wybór nie jest zapamiętywany (po przeładowaniu „Cała podróż”). Siatka, „N ↑”, tekst o mapie schematycznej dosłownie jak w karcie, lista pokazanych punktów. Numer pinezki 19,2 px, pogrubiony, biały na kolorze dnia 4,02–4,09:1 (DEC-21 wymaga 3:1), obszar kliknięcia 44×44 px także na telefonie (DEC-14). Linie tras 3,66–3,73:1 na tle mapy.

Przypadki brzegowe F06: jeden punkt i kilka w tym samym miejscu → środek, bez dzielenia przez zero (testy `rzut`); dzień bez punktów → „Brak punktów do pokazania na mapie”, bez pinezek, listy i linii (test i przeglądarka); Rzym i Dolomity w jednej podróży → wszystkie pinezki mieszczą się w panelu (test i przeglądarka: każda pinezka w prostokącie mapy), ale zob. W1.

## Niezmienniki
| Niezmiennik | Wynik | Dowód |
|---|---|---|
| N1 dane nie opuszczają przeglądarki | prawdziwy | Testy statyczne N1, test CSP i „N1: wyszukiwanie niczego nie zapisuje ani nie wysyła” przechodzą. W `src/` brak `fetch(`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`; `src/szukaj.js` i `src/widoki/szukaj.js` nie używają `localStorage`. Mapa to własny SVG i przyciski HTML, bez podkładu i zewnętrznych serwisów (DEC-9). Formularz wyszukiwania ma `data-formularz`, więc `submit` jest zatrzymany (`preventDefault()`), a CSP ma `form-action 'none'` i `connect-src 'none'` (bez zmian). W przeglądarce żądania tylko do `127.0.0.1:8001` (pliki aplikacji); zdjęcia kart idą tylko do `upload.wikimedia.org`, na co pozwala CSP. |
| N2 punkt podróży i zapis miejsca są niezależne | prawdziwy | `src/stan.js` i `src/magazyn.js` bez zmian w zakresie. F03 nie zmienia danych, mapa F06 tylko je czyta (`wpisyMapy()` → `planDnia()`). Testy N2 z MVP-1 przechodzą. |
| N3 numery pinezek = kolejność w planie | prawdziwy | Numer pinezki pochodzi z `planDnia()` (`src/mapa.js`, `wpisyMapy()`), tej samej funkcji co numer w planie. Test F06-KA2 porównuje jedno z drugim; „Miejsce niedostępne” nie zmienia numeracji (test i przeglądarka). W przeglądarce po prawdziwym kliknięciu ↓ numery na mapie, w planie i na liście pod mapą zmieniły się razem. Ukrycie numerów przez nakładające się pinezki (W1) nie zmienia numerów, ale utrudnia ich odczyt. |
| N4 brak kluczy, haseł i `.env` | prawdziwy | Test N4 przechodzi. `git ls-files` bez `.env*`. W diffie `d5247dd..bd123a0` brak wzorców kluczy, haseł i adresów e-mail; jedyne trafienia to `tokens: …` w metadanych learnings Trail-code (licznik zużycia). Autor commitów: adres „noreply” GitHuba. |
| N5 dane zostają po odświeżeniu | prawdziwy | F03 i F06 niczego nie zapisują. W przeglądarce po przeładowaniu plan (dni, kolejność, „Do zaplanowania”) bez zmian, a mapa rysuje się z niego tak samo. Testy N5 z MVP-1 przechodzą. |

## Lista kontrolna weryfikacji (sekcja 7)
| Punkt | Wynik |
|---|---|
| Każde kryterium z dowodem | tak, 11 z 11 spełnionych (F03: 5, F06: 6) |
| N1–N5 prawdziwe, testy przechodzą | tak; 147 z 147 testów przechodzi |
| Testy nie zostały osłabione | tak. W zakresie usunięto 2 linie testów: w `tests/odkrywaj.test.js` (KA5 z F01) menu ma 4 sekcje zamiast 3 i 4 ikony zamiast 3. Powód jest uzasadniony i zapisany: karta F03 (pkt 1) dodaje sekcję Szukaj; w teście komentarz „zgoda właścicielki”, w planie wpis w „Następny krok” F03. Pozostałe zmiany w testach to nowe pliki `tests/szukaj.test.js` (14 testów) i `tests/mapa.test.js` (19 testów) |
| Brak kluczy, haseł i prawdziwych danych | tak (N4). Dane testowe: zestaw z F00 i miejsca z katalogu |
| Brak żądań z danymi użytkownika i zewnętrznych skryptów | tak (N1); brak nowych skryptów, CSP bez zmian |
| Tekst użytkownika jako tekst | tak. Hasło `<b>"x"</b>` wraca w polu jako `&lt;b&gt;&quot;x&quot;&lt;/b&gt;` (test). Cały nowy HTML powstaje z szablonu `html```; `surowy()` nie jest użyty w nowych plikach. `innerHTML` w nowych funkcjach `szukaj()` i `odswiezMape()` dostaje tylko wynik szablonu, a liczba wyników trafia przez `textContent` |
| Walidacja pól z sekcji 6 | nie dotyczy: F03 i F06 nie mają pól zapisywanych danych |
| Zgodność z design.md i sekcją 9 | częściowo: W2 (aktywna zakładka przełącznika). Pozostałe nowe elementy: tekst 16 px, mały tekst 14 px (opis mapy 5,60:1), numery pinezek zgodne z DEC-21, obszary kliknięcia 44×44 px, dwie kolumny od 900 px, mapa przyklejona, na telefonie zakładki, bez przewijania w bok |
| Brak zmian poza zakresem karty | tak. Zmiany spoza list plików w planie (`src/app.js` w F03 i F06, `src/widoki/dodaj-miejsca.js` w F03, `README.md`, `tests/odkrywaj.test.js`) wynikają z kroków kart i są opisane w planie (część F06 „Dodatkowo w sesji F06”, „Następny krok” F03, „Później”: wspólna `normalizuj()`). Podkładu mapy, odległości, podpowiedzi podczas pisania i wyszukiwania spoza katalogu nie ma |
| Learnings zgodne z kodem, bez danych osobowych; `trail check` | tak (sekcja „Learnings i Trail-code”) |

## Znaleziska

### W1 · WARNING · Pinezki w tym samym miejscu zasłaniają się; puste kółko przykrywa numery
**Co:** Każda pinezka to przycisk 44×44 px z `z-index: 1` (`style.css`, `.pinezka`), więc na wierzchu jest ta, która w HTML stoi później. `wpisyMapy()` (`src/mapa.js`) ustawia przy „Cała podróż” najpierw dni po kolei, a na końcu „Do zaplanowania”. Gdy pinezki leżą blisko siebie, puste kółko „Do zaplanowania” przykrywa pinezki z numerami.

Odtworzone w przeglądarce (dzień 1: Panteon, Koloseum; dzień 2: Fontanna di Trevi, Forum Romanum; dzień 3: Jezioro Braies, Cortina d'Ampezzo; „Do zaplanowania”: Taras widokowy Pincio; „Pokaż: Cała podróż”). Przy dużej skali (Rzym i Dolomity) wszystkie 5 pinezek z Rzymu leży w obrębie ok. 1 px. Na środku każdej z 4 pinezek z numerami `elementFromPoint` trafia w puste kółko Pincio. Na mapie widać w Rzymie tylko puste kółko, a w Dolomitach tylko „2” (Braies „1” jest pod Cortiną). Tak samo przy 375 px. Pinezek pod spodem nie da się kliknąć; da się je podświetlić z listy pod mapą, i wtedy aktywna (`z-index: 3`) wychodzi na wierzch.

Przy jednym mieście problem jest mniejszy: przy 1024 px panel mapy ma tylko 298×218 px i sąsiednie pinezki w Rzymie dzielą 40–43 px (kółka 32 px się nie stykają, obszary kliknięcia częściowo tak).

- Karta F06 (przypadki brzegowe) wymaga tylko, żeby punkty z Rzymu i Dolomitów „mieściły się w panelu” — to jest spełnione.
- Cel karty („widzi, gdzie leżą punkty dnia i w jakiej kolejności je odwiedzi”) przy „Cała podróż” w takiej podróży nie jest spełniony: numerów nie widać, a pusty znacznik sugeruje, że w Rzymie nic nie jest zaplanowane.

**Skutek:** tylko wygląd i obsługa mapy; dane i numery są poprawne (N3), lista pod mapą pokazuje wszystko. Najbardziej widoczne przy podróży z dwoma oddalonymi kierunkami albo przy kilku miejscach w tym samym punkcie.

**Jak odtworzyć:** `npm start` → `http://127.0.0.1:8000/?dev` (albo port z terminala) → „Załaduj zestaw testowy” → „Podróże” → „Otwórz”. Przypisz Koloseum i Panteon do dnia 1. „+ Dodaj miejsca” → wpisz „dolomity” → zaznacz dwa miejsca → „Dodaj (2)” → przypisz oba do dnia 3. Fontannę di Trevi zostaw w „Do zaplanowania”. W mapie „Pokaż: Cała podróż”: w dolnej części mapy widać tylko przerywane kółko, bez „1” i „2”.

**Propozycja do decyzji:** (a) minimum, 1–2 linie CSS lub zmiana kolejności: pinezki dni nad pustymi kółkami (np. `.pinezka:has(.kolko-puste) { z-index: 0 }` albo „Do zaplanowania” na początku listy pinezek); nie rozwiązuje zasłaniania się pinezek z numerami. (b) dodatkowo rozsuwanie pinezek, które wypadają zbyt blisko (np. przesunięcie o kilka pikseli po okręgu, gdy dzielą mniej niż 32 px) — wtedy położenie na schemacie jest lekko przybliżone; to zmiana zachowania, więc wymaga zapisu w karcie albo DEC. Do rozważenia też test: przy „Cała podróż” żadna pinezka z numerem nie jest zasłonięta pustym kółkiem.

### W2 · WARNING · Wybrana zakładka „Plan dni / Mapa” wyróżniona tylko jaśniejszym tłem
**Co:** Na telefonie przełącznik (`.przelacznik-panelu`, `style.css`) pokazuje wybraną zakładkę tłem `--paper` na tle `--sand`. Różnica jasności to ok. 1,3:1. design.md, „Chipy (kategorie, filtry, zakładki)”: „Aktywny chip jest wypełniony ciemnobrązowym kolorem”. Sekcja 9 specyfikacji wymaga WCAG AA, a WCAG 2.1 (1.4.11) chce kontrastu 3:1 dla wizualnego oznaczenia stanu elementu. Wygląd jest skopiowany z prototypu (`.pane-toggle` w `prototyp.html`), więc rozbieżność jest między prototypem a design.md, a sesja F06 przyjęła prototyp bez zapisu w planie.

**Skutek:** mały. Wybrany widok i tak widać po treści pod przełącznikiem, a czytnik ekranu dostaje `aria-pressed`. Osoba słabowidząca może nie odróżnić, która zakładka jest wybrana.

**Jak odtworzyć:** F12 → Ctrl+Shift+M → szerokość 375 → ekran podróży. Przycisk „Plan dni” jest biały, „Mapa” piaskowa; po kliknięciu „Mapa” kolory się zamieniają, bez ciemnobrązowego wypełnienia.

**Propozycja do decyzji:** (a) zgodnie z design.md: wybrana zakładka z tłem `--brown` i kremowym tekstem (1–2 linie CSS); albo (b) zostawić jak w prototypie i dopisać wyjątek do design.md.

### W3 · WARNING · Test F06 zależy od końców linii w style.css
**Co:** Test „wygląd: na telefonie widać jedną kolumnę, od 900 px obie; pinezka ma obszar 44 × 44 px” (`tests/mapa.test.js`) szuka w `style.css` tekstu `"@media (min-width: 900px) {\n  .przelacznik-panelu"`, czyli z uniksowym końcem linii `\n`. Repozytorium ma pliki z `\n`, ale na tym komputerze git ma `core.autocrlf=true` i przy każdym pobraniu albo przywróceniu pliku zapisuje końce linii Windowsa (`\r\n`). Wtedy `indexOf` zwraca −1 i test nie przechodzi, choć CSS jest poprawny.

Wyszło przypadkiem: przy sprawdzaniu poprawki W1 użyłam `git stash`, który zapisał `style.css` na nowo z `\r\n`, i ten test przestał przechodzić. Potwierdzone na czystej kopii `HEAD` (`git archive`, końce `\r\n`): jedyny prawdziwy błąd to ten test (2 inne testy nie przechodzą tam tylko dlatego, że kopia nie jest repozytorium git). Pliki w folderze projektu mają z powrotem `\n`, więc `npm test` tutaj przechodzi.

**Skutek:** tylko testy. Ktoś, kto pobierze repozytorium na Windowsie (albo przywróci `style.css` z gita), dostanie fałszywy błąd. Aplikacji nie dotyczy.

**Jak odtworzyć:** w Git Bash w folderze projektu: `sed -i 's/$/\r/' style.css` → `npm test` → 1 błąd w „wygląd: na telefonie…”. Cofnięcie: `sed -i 's/\r$//' style.css`.

**Propozycja:** w teście szukać `@media (min-width: 900px)` wyrażeniem regularnym, które dopuszcza `\r\n` (np. `/@media \(min-width: 900px\) \{\r?\n  \.przelacznik-panelu/`). Oczekiwany wynik testu bez zmian; AGENTS.md każe jednak zgłosić błędny test, więc czekam na zgodę. Dodatkowo do rozważenia plik `.gitattributes` z `* text=auto eol=lf`, żeby końce linii były zawsze uniksowe.

### Uwagi (INFO), bez wpływu na werdykt
**I1 · „Miejsce niedostępne” na mapie a plan 5.4.** Plan 5.4 mówi „Mapa i E8 je pomijają”, a F06 pokazuje je w zdaniu „Brak współrzędnych, więc nie pokazano na mapie: Miejsce niedostępne.”. Odejście jest zapisane w planie (część F06) i daje użytkownikowi więcej informacji; przy kilku takich punktach zdanie powtórzy „Miejsce niedostępne, Miejsce niedostępne”. Warto ujednolicić zdanie w 5.4 z częścią F06.

**I2 · Liczniki nadal liczą „Miejsce niedostępne”** (I2 z MVP-1, bez zmian): nagłówek E7 i licznik dnia („3 miejsca” przy 2 dostępnych). Mapa i numeracja je pomijają.

**I3 · KA5 F06 w praktyce dotyczy tylko „Miejsca niedostępnego”.** Wszystkie 41 miejsc katalogu ma współrzędne, więc punkt bez współrzędnych może dziś powstać tylko z miejsca usuniętego z katalogu. Test podaje taki punkt bezpośrednio (parametr `wpisy` w `panelMapy()`), co jest w porządku, ale kod tej ścieżki nie jest ćwiczony przez dane katalogu.

**I4 · Adres E2 zostaje z kategorią po podpowiedzi.** Po wejściu z chipu (`#/szukaj/kawiarnia`) i kliknięciu podpowiedzi albo „Wyczyść…” filtr kategorii jest pusty, ale adres nadal ma `/kawiarnia`; po odświeżeniu strony kategoria „Kawiarnie” wraca. Zgodne z kartą (stan nie jest zapamiętywany, a adres to wejście z chipu), ale może zaskoczyć.

**I5 · Wyszukiwanie w E2 i E8 działa różnie** (learning F03, „Później” w planie): „punkt widokowy” w oknie „Dodaj miejsca” nic nie znajduje. Czeka na decyzję właścicielki.

## Learnings i Trail-code
- Przeczytane learnings dotyczące plików MVP-2: „F03: hasło dopasowywane z obciętą końcówką…”, „F06: pinezki jako przyciski HTML…”, „Faza C MVP-1: klasa pusty…”, „F05: podwójne kliknięcie strzałki…” oraz F00 (zapis danych), F01 (zdjęcie zastępcze), F02 (komunikat jako popover), F04 (identyfikator podróży), Faza C F01.
- Zgodność z kodem:
  - F03: zmienna `szukanie` i `zacznijSzukanie()` w `src/app.js` (przy starcie i przy każdej zmianie adresu); `normalizuj()` w `src/szukaj.js`, a `src/widoki/dodaj-miejsca.js` tylko ją eksportuje dalej; `slowaHasla()` obcina końcówki, `miejscaDoDodania()` nie — wszystko się zgadza.
  - F06: pinezki to `<button>` w `pinezka()` (`src/widoki/plan.js`), położone w procentach nad SVG 600×440 (`SZEROKOSC`, `WYSOKOSC` w `src/mapa.js`), w SVG tylko siatka i linie; `odswiezMape()` szuka fokusu po `data-klucz` (`CSS.escape`); klasa `kolko-puste` z obrysem `--muted`. Zgadza się.
  - Faza C MVP-1: puste kółka na mapie nie używają klasy `pusty` (test i pomiar 28×28 px); weryfikacja pod 127.0.0.1 zastosowana.
  - F05: numer 19,2 px pogrubiony także na pinezkach (pomiar), zgodnie z DEC-21.
- Dane osobowe: brak. W polu autora jest nazwa właścicielki wpisana przez narzędzie, na co AGENTS.md pozwala. Kluczy brak.
- `trail check`: „nothing to check”, bo MVP-2 jest już na `origin/main`. `trail check --base d5247dd`: „no conflicts”, 5 pozycji „worth a look”. Wszystkie wskazują learning F06 („pinezki jako `<g tabindex="0" role="button">` wewnątrz SVG” odrzucone) i są fałszywym alarmem dopasowania słów: w `src/` nie ma `role="button"` ani `tabindex="0"`, a jedyny element `<g>` to siatka mapy.
- Propozycja learning z tej weryfikacji: w wiadomości do właścicielki; zapis dopiero po jej zgodzie.

## Decyzje właścicielki po rundzie 1 (26.11.2026)
- **W1 — wariant (a).** Puste kółko „Do zaplanowania” leży pod pinezkami z numerami: `.pinezka:has(.kolko-puste) { z-index: 0; }` w `style.css`, przed regułami najechania, fokusu i podświetlenia, więc te nadal wynoszą je na wierzch. Kolejność pinezek w HTML, lista pod mapą i kolejność Tab bez zmian. Rozsuwania pinezek (wariant b) nie ma: pinezki z numerami w tym samym miejscu nadal zasłaniają się nawzajem (widać tę, która jest później w planie), a zasłonięte da się podświetlić z listy pod mapą.
  - Nowy test „wygląd: puste kółko „Do zaplanowania” leży pod pinezkami z numerami (weryfikacja MVP-2, W1a)” w `tests/mapa.test.js`: sprawdza warstwy i kolejność reguł w CSS oraz to, że przy „Cała podróż” pinezki dni są w HTML przed pustymi kółkami. Bez poprawki w CSS test nie przechodzi.
  - W przeglądarce pod `127.0.0.1:8001` (zestaw testowy; dzień 1: Koloseum, Panteon; dzień 3: Jezioro Braies, Cortina d'Ampezzo; Fontanna di Trevi w „Do zaplanowania”; „Cała podróż”): puste kółko ma `z-index: 0`, na środku każdej pinezki z Rzymu `elementFromPoint` trafia teraz w Panteon („2”), nie w puste kółko; na mapie w Rzymie widać „2”. Tab na puste kółko: `z-index: 2`, jest na wierzchu z widoczną ramką; Enter: `z-index: 3`, podświetlone. Dane pod `127.0.0.1:8001` przywrócone jak wcześniej.
- **W2** — czeka na decyzję.
- **W3** (znalezione przy tej poprawce) — czeka na zgodę na poprawkę testu.
- Testy po zmianie: 148 z 148.

## Jak sprawdzić ręcznie (dla właścicielki)
1. **Start:** w terminalu w folderze projektu wpisz `npm start` i otwórz `http://127.0.0.1:8000/?dev` (to ta sama aplikacja co pod `localhost`, ale z osobną, pustą pamięcią, więc Twoje dane zostają nietknięte). Jeśli terminal pokaże `EADDRINUSE`, inny `npm start` już działa: użyj jego adresu, zamieniając `localhost` na `127.0.0.1`.
2. **Szukaj (F03):** kliknij „Szukaj” w menu. Wpisz „rzym”: nad kartami „9 miejsc”. Zmień na „punkt widokowy”: 8 kart, wszystkie z etykietą „Punkty widokowe”, jest „Kopiec Kościuszki”. Wpisz „xyz”: „Nic nie znaleźliśmy” i przycisk „Wyczyść wyszukiwanie i filtry”; kliknij go: „41 miejsc”.
3. **Filtry (F03):** ustaw miasto „Rzym”, potem kraj „Polska”: miasto wraca do „Wszystkie”. Ustaw kategorię „Kawiarnie”: jeden wynik, „Kawiarnia z sernikiem na Kazimierzu”. Wyczyść, ustaw „Sortuj: Alfabetycznie”: pierwsza „Alfama”.
4. **Chipy (F03):** na „Odkrywaj” kliknij chip „Kawiarnie”: otwiera się Szukaj z kategorią „Kawiarnie”.
5. **Mapa (F06):** w panelu na dole strony kliknij „Załaduj zestaw testowy” i „OK”. „Podróże” → „Otwórz”. Przypisz Koloseum i Panteon do „Dzień 1”, Fontannę di Trevi do „Dzień 2”. W mapie ustaw „Pokaż: Dzień 1”: dwie pinezki 1 i 2, jedna linia. Kliknij ↓ przy pierwszym punkcie w planie: numery pinezek się zamieniają, pinezki zostają na miejscu.
6. **Cała podróż (F06):** „+ Dodaj miejsca” → zaznacz „Forum Romanum” → „Dodaj (1)”; przypisz je do „Dzień 2”. „Pokaż: Cała podróż”: dwie linie w dwóch kolorach, które się nie łączą. Dodaj jeszcze jedno miejsce i zostaw je w „Do zaplanowania”: na mapie puste kółko.
7. **Podświetlanie i klawiatura (F06):** kliknij pinezkę: robi się większa z nazwą, a punkt na liście pod mapą jest podświetlony. Kliknij inny punkt na liście: podświetla się jego pinezka. Kliknij w listę „Pokaż”, naciśnij Tab: wokół pinezki widać ramkę; Enter ją podświetla.
8. **W1 (po poprawce):** dodaj dwa miejsca z Dolomitów, przypisz do „Dzień 3”, Fontannę di Trevi zostaw w „Do zaplanowania”. Przy „Cała podróż” w miejscu Rzymu widać pinezkę z numerem, nie przerywane kółko. Przed poprawką było tam tylko przerywane kółko.
9. **Telefon:** F12 → Ctrl+Shift+M → szerokość 375. Na ekranie podróży przełącznik „Plan dni / Mapa”; „Mapa” pokazuje mapę, strona nie przesuwa się w bok (W2: wybrana zakładka różni się tylko jasnością tła).
10. **Testy:** `npm test`; na końcu „pass 148” i „fail 0” (147 w chwili weryfikacji, plus test W1a). Jeśli wyjdzie 1 błąd w „wygląd: na telefonie…”, to W3: plik `style.css` ma końce linii Windowsa.

## Ograniczenia tej weryfikacji
- Przeglądarka oparta na Chromium (szerokość 1024 px i 375 px w emulacji), nie Edge, Firefox ani Safari.
- Serwer działał na porcie 8001 (8000 był zajęty), adres `127.0.0.1:8001`; aplikacja i pliki te same.
- Zmiany list wyboru (filtry poza sortowaniem, „Pokaż”, „Przypisz do dnia…”, „Przenieś do…”) i wybór miejsc w oknie E8 ustawiałem przez konsolę (to samo zdarzenie `change` albo `click`), nie rozwijając list myszą. Okno potwierdzenia zestawu testowego (`window.confirm`) zastąpiłem w konsoli odpowiedzią „OK”.
- „Miejsce niedostępne” (F06-KA5) wywołałem, dopisując w konsoli punkt miejsca spoza katalogu do pamięci przeglądarki pod `127.0.0.1:8001`; dane te zostały potem zastąpione kopią sprzed weryfikacji.
- Czytnika ekranu nie uruchamiałem; role, nazwy, `aria-pressed` i `role="status"` sprawdziłem w HTML i drzewie dostępności.
- Zgodnie z poleceniem bez celowych błędów w kodzie (bez sprawdzania, które błędy wykrywają testy).
- Kontrast policzyłem wzorem WCAG 2 z wartości obliczonych w przeglądarce.
- Zrzuty ekranu w tej przeglądarce czasem pokazywały stan sprzed ostatniej akcji; wyniki opieram na odczycie strony i konsoli, a zrzuty tylko je ilustrują.
