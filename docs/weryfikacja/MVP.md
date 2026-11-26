# Weryfikacja MVP-1 · F02, F04, F05 oraz poprawki W1 i W2 z F01
Faza C · poziom Wysoki · runda 1 · 26.11.2026 · sprawdzany zakres `46be604..0377262`: od „F01: decyzje właścicielki po weryfikacji (W1–W3, DEC-20)” do „F05: learning o podwójnym kliknięciu strzałki i numerze dnia” (6 commitów: F02, F04, F05 i ich learnings).
Weryfikator: agent w osobnej sesji, innej niż sesje budowy. Kod nie był zmieniany.

## Werdykt: WARNING

Wszystkie 20 kryteriów akceptacji (F02: 6, F04: 8, F05: 6) jest spełnionych, z dowodami w testach i w przeglądarce. Poprawki W1 i W2 z weryfikacji F01 działają, sprawdzone prawdziwymi kliknięciami. Niezmienniki N1, N2, N4 i N5 są prawdziwe; N3 sprawdza dopiero F06 (mapa), a numeracja w planie, z której F06 ma brać numery, działa poprawnie. Testy: 113 z 113 przechodzi. `trail check` nie zgłasza konfliktów.

WARNING wynika z dwóch znalezisk dotyczących wyglądu i dokumentów. Żadne nie dotyczy danych ani bezpieczeństwa.

| # | Znalezisko | Kiedy rozstrzygnąć |
|---|---|---|
| W1 | Numer punktu w kolorze dnia ma kontrast od 3,3:1 do 4,1:1. Sekcja 9 („WCAG AA”) na to pozwala, bo to duży tekst, ale design.md wymaga „co najmniej 4,5:1” bez wyjątku. Sesja F05 rozstrzygnęła to sama, bez DEC | przed F06: pinezki na mapie mają ten sam problem |
| W2 | Puste kółko przy punktach „Do zaplanowania” jest owalem 36×84 px zamiast kółka 28 px. Klasa `pusty` łapie styl stanu pustego (`padding: 40px 16px`) | dowolnie, poprawka w 1 linii CSS; najlepiej przed F06 (puste kółka „Do zaplanowania” są też na mapie) |

Uwagi I1–I4 nie wpływają na werdykt.

## Co sprawdziłem i jak
- Przeczytane: AGENTS.md, karty F02, F04, F05, sekcje 7 i 9 oraz DEC-14, DEC-18, DEC-20 specyfikacji, docs/plan.md (sekcje 4, 5, 6, 7, 9–11), design.md (kolory, punkt planu, dostępność), raport docs/weryfikacja/F01.md (W1, W2 i decyzje właścicielki), learnings dotyczące zmienianych plików (F00 „zapis danych”, Faza C F01, F02, F04, F05).
- Kod: pełny przegląd `src/app.js`, `src/stan.js`, `src/walidacja.js`, `src/daty.js`, widoków `zapisane.js`, `podroze.js`, `formularz-podrozy.js`, `plan.js`, `dodaj-miejsca.js`, `miejsce.js`, `menu.js`, diffu `src/magazyn.js`, `src/widoki/odkrywaj.js`, `index.html` i reguł CSS dla przycisków, okien i planu.
- Testy: `npm test` (Node 26.13.1): 113 przechodzi, 0 nie przechodzi. Zgodnie z poleceniem właścicielki nie wprowadzałem celowych błędów (bez sprawdzania siły testów).
- Przeglądarka: wbudowana przeglądarka aplikacji Claude (Chromium), serwer z `.claude/launch.json` (`node scripts/serwer.mjs`, to samo co `npm start`) na porcie 8000. Szerokość 1024 px i 375 px.
- Dane w przeglądarce: pod `http://localhost:8000` pamięć przeglądarki zawierała już dane (468 znaków). Nie czytałem ich i nie zmieniałem. Wszystkie próby robiłem pod `http://127.0.0.1:8000`: to ten sam serwer, ale osobna pamięć przeglądarki. Była pusta na starcie; na końcu ją wyczyściłem.
- Kliknięcia: prawdziwą myszą i klawiaturą (narzędzie przeglądarki) dla serca, rogów przycisków, marginesów okien, pól zaznaczenia, formularza, ↓, ×, okna E8. Część zmian list wyboru i potwierdzenie usunięcia (`window.confirm` zastąpione w konsoli odpowiedzią „Anuluj”, potem „OK”) przez konsolę. Pomiary rozmiarów, kolorów i żądań sieciowych przez konsolę.
- `trail check` (bez zmian względem `origin/main`) i `trail check --base 46be604`.
- Przeszukanie diffu pod kątem kluczy, haseł, adresów e-mail i niebezpiecznego wstawiania HTML.
- `.env`: żadnego pliku `.env` nie utworzyłem ani nie odczytałem.

## Poprawki z weryfikacji F01

| Znalezisko | Wynik | Dowód |
|---|---|---|
| W1 · kliknięcie wewnątrz okna zamyka okno | **poprawione** | `src/app.js:487–494`: okno zamyka się tylko, gdy celem jest samo `<dialog>` **i** punkt kliknięcia leży poza jego prostokątem; obejmuje wszystkie trzy okna (E3, E5, E8). W oknie Koloseum punkt 10 px od lewej krawędzi na wysokości podpisu zdjęcia nadal trafia w `<dialog>` (`elementFromPoint` → `okno`), ale prawdziwe kliknięcie w ten punkt **nie zamknęło** okna. Kliknięcie w przyciemnione tło zamknęło je, a fokus wrócił na nazwę „Koloseum” w karcie. Enter na przycisku „Zapisano · usuń z Zapisanych” wewnątrz okna (kliknięcie z klawiatury ma współrzędne 0,0) zmienił zapis i **nie** zamknął okna; Esc zamknął okno z powrotem fokusu. W formularzu E5 kliknięcie przy prawej krawędzi wewnątrz okna też go nie zamknęło. |
| W2 · obszar kliknięcia × to koło 44 px | **poprawione** | `.przycisk-ikona` (`style.css:276–286`) nie ma już `border-radius`; koło rysuje tylko tło `radial-gradient`. Obliczone `border-radius: 0px` dla serca i ×. Wszystkie cztery rogi serca 44×44 px (1 px od krawędzi) należą do przycisku (`elementFromPoint`), także róg × w oknie. Prawdziwe kliknięcie w lewy górny róg serca „Panteon” (ok. 4 px od rogu) zapisało miejsce. Ten sam przycisk mają ↑, ↓ i × w planie dni: 44×44 px. Fokus z klawiatury ma obrys 2 px w kolorze szałwii (teraz kwadratowy, jak przewidział raport F01). |

## Kryteria akceptacji

### F02 · Zapisywanie miejsc
| Kryterium | Wynik | Dowód |
|---|---|---|
| F02-KA1 [test] serce przy „Koloseum” wypełnione, licznik 0 → 1 | spełnione | Test „KA1: …” przechodzi. W przeglądarce kliknięcie serca: `aria-pressed="true"`, serce wypełnione terakotą, licznik „1” przy „Zapisane” (przy zerze go nie ma, jak w prototypie), komunikat „Zapisano „Koloseum”. Znajdziesz je w zakładce Zapisane.” |
| F02-KA2 [test] „Panteon” pierwszy, „Koloseum” drugi na E4 | spełnione | Test „KA2: …” przechodzi. W przeglądarce kolejność na E4 zawsze od najnowszego zapisu (sprawdzone dla 2 i 3 miejsc, także po ponownym zapisie Koloseum, które wróciło na górę). |
| F02-KA3 [test, ręcznie] miejsce zostaje po odświeżeniu (N5) | spełnione | Test „KA3 / N5: …” przechodzi. W przeglądarce po przeładowaniu strony (`performance` → `reload`) E4 ma te same miejsca w tej samej kolejności i licznik „2”. Zamknięcia całej przeglądarki nie sprawdzałem (ograniczenia). |
| F02-KA4 [test] ponowne kliknięcie usuwa, licznik maleje; dwa szybkie kliknięcia nie dublują | spełnione | Test „KA4: …” przechodzi. `przelaczZapis()` (`src/stan.js:17–27`) przełącza zapis, więc dwa kliknięcia dają zapis i usunięcie, nigdy dwa zapisy. W przeglądarce: licznik 2 → 1 → 2, w pamięci zawsze najwyżej jeden zapis miejsca. |
| F02-KA5 [test] blokada zapisu → ostrzeżenie, zapisywanie działa do zamknięcia strony | spełnione | Test „KA5: …” przechodzi. `?dev&blokada`: nad treścią „Ta przeglądarka nie pozwala zapisywać danych. Wszystko zniknie po zamknięciu strony.”, zapis serca działa (licznik 1, panel dev „(tylko w pamięci)”), pamięć przeglądarki bez zmian. |
| F02-KA6 [test] brak żądań sieciowych przy zapisie i usuwaniu (N1) | spełnione | Test „KA6 / N1: …” przechodzi (atrapy `fetch`, `XMLHttpRequest`, `sendBeacon` nie są wywoływane). W przeglądarce: patrz N1. |

Przypadki brzegowe F02: miejsce spoza katalogu nie psuje E4 i nie liczy się w menu (test, `zapisaneMiejsca()` i `liczbaZapisanych()` w `src/stan.js`); błąd zapisu → „Nie udało się zapisać zmian. Spróbuj ponownie.”, bez „Zapisano”, serce bez zmian (test; `przelaczZapisMiejsca()` w `src/app.js:177–203` przyjmuje stan dopiero po udanym `zatwierdz()`). Stan pusty E4 z „Odkrywaj miejsca” (test). Komunikat jest widoczny także nad otwartym oknem (popover, sprawdzone w przeglądarce).

### F04 · Podróże
| Kryterium | Wynik | Dowód |
|---|---|---|
| F04-KA1 [test] 3 miejsca z Rzymu → kierunek „Rzym”, nazwa „Wyjazd: Rzym” | spełnione | Test „KA1: …” przechodzi. W przeglądarce: zaznaczenie trzech kart na E4 myszą („Zaznaczone: 3”), „Utwórz podróż z wybranych” → okno „Nowa podróż: 3 miejsca”, nazwa „Wyjazd: Rzym”, kierunek „Rzym”, lista kierunków ustawiona na „Rzym (Włochy)”, fokus w polu nazwy. |
| F04-KA2 [test, ręcznie] 04.12–06.12.2026 → 3 dni, 3 miejsca w „Do zaplanowania”, zostaje po odświeżeniu | spełnione | Test „KA2 / N5: …” przechodzi. W przeglądarce zapis otworzył E7 z „Rzym · 04.12.2026 – 06.12.2026 · 3 dni · 3 miejsca”, „Do zaplanowania 3” i komunikatem „Podróż utworzona. Przypisz miejsca do dni.”; fokus na nagłówku. Po przeładowaniu dane bez zmian. Zmiana oczekiwanego wyniku tego testu w F05 (format dnia): patrz lista kontrolna. |
| F04-KA3 [test] pusta nazwa → „Podaj nazwę podróży.”; 60 znaków tak, 61 nie | spełnione | Test „KA3: …” przechodzi. W przeglądarce po wyczyszczeniu nazwy i „Utwórz podróż”: komunikat przy polu, `aria-invalid`, `aria-describedby="blad-nazwa"`, fokus w polu, podróż nie powstała. Formularz ma `novalidate` i nie ma `maxlength`, więc walidacja działa w aplikacji (`src/walidacja.js`). |
| F04-KA4 [test] jedna data / koniec przed początkiem / 30 i 31 dni | spełnione | Test „KA4: …” przechodzi. W przeglądarce: tylko data rozpoczęcia → „Podaj obie daty albo zostaw obie puste.” przy dacie zakończenia; 01.12 przed 04.12 → „Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.”. Po błędzie pola zachowują wpisane wartości. Limit 30/31 dni sprawdziłem tylko testem. |
| F04-KA5 [test] skrócenie z 3 do 2 dni → 2 punkty wracają, komunikat A6 | spełnione | Test „KA5: …” przechodzi. W przeglądarce dzień 3 z Koloseum i Fontanną di Trevi, „Edytuj podróż” → koniec 05.12 → „Zapisano zmiany. 2 miejsca z usuniętych dni wróciły do „Do zaplanowania”.”; oba punkty w „Do zaplanowania”, zostały 2 karty dni, punkty z dnia 2 bez zmian. |
| F04-KA6 [test] usunięcie po potwierdzeniu; miejsca zostają w Zapisanych; anulowanie nic nie zmienia | spełnione | Test „KA6 / N2 / A7: …” przechodzi. W przeglądarce pytanie „Usunąć podróż „…”? Tej operacji nie da się cofnąć. Zapisane miejsca zostaną w Zapisanych.”; „Anuluj” → podróż jest dalej; „OK” → stan pusty E6, komunikat „Usunięto podróż „…”.”, Zapisane bez zmian, fokus na nagłówku. |
| F04-KA7 [test] nazwa `<b>test</b>` jako tekst | spełnione | Test „KA7: …” przechodzi. W przeglądarce nazwa `<b>test</b>` wpisana w formularz: na E6, w nagłówku E7, w liście „Dodaj do podróży” w E3, w „W podróżach: …”, w oknie E8 i w komunikatach widać dosłowny tekst; 0 elementów `<b>` na stronie (`&lt;b&gt;test&lt;/b&gt;` w HTML). |
| F04-KA8 [test] statusy przy dacie 24.11.2026 | spełnione | Test „KA8 / DEC-16: …” przechodzi. `statusPodrozy()` w `src/daty.js:51–56`. W przeglądarce (dziś 26.11.2026) podróż 04–06.12 ma etykietę „Nadchodząca” na E6 i E7. |

Zachowanie z karty F04 (pkt 1–6): pasek zaznaczania z wyłączonymi „Utwórz…” i „Odznacz” przy zerze; lista kierunków „Wybierz z listy…” z 5 kierunkami (grupa „Miasta i regiony”) i 4 krajami, wybór wpisuje kierunek do pola; E6 od najnowszej z nazwą, kierunkiem, datami albo „Szkic bez dat”, etykietą statusu, liczbą dni i miejsc oraz „Otwórz / Edytuj / Usuń” (przyciski z nazwą podróży dla czytnika ekranu); stan pusty z „+ Nowa podróż” i „Przejdź do Zapisanych”; w E3 „Dodaj do podróży” z listą podróży, a bez podróży „Utwórz podróż” z tym miejscem. Wszystko zgodne.

Przypadki brzegowe F04: „Paryż” (test); **dwuklik „Utwórz podróż” prawdziwą myszą utworzył jedną podróż** (identyfikator nadany przy otwarciu formularza, learning F04); błąd zapisu → formularz zostaje z danymi i komunikatem `role="alert"`, bez „Podróż utworzona” (test i kod `src/app.js:280–284`). Dodanie tego samego miejsca z E3 drugi raz → „To miejsce jest już w podróży „…”.”, bez drugiego punktu.

### F05 · Plan dni
| Kryterium | Wynik | Dowód |
|---|---|---|
| F05-KA1 [test] „Przypisz do dnia” → Dzień 1 przy Panteonie: numer 1, znika z „Do zaplanowania” | spełnione | Test „KA1: …” przechodzi. W przeglądarce lista ma „Dzień 1 · pt., 4.12”, „Dzień 2 · sob., 5.12”, „Dzień 3 · niedz., 6.12” (daty zgodne z kalendarzem 2026). Po wyborze punkt ma numer w dniu, licznik „Do zaplanowania” maleje, fokus idzie za punktem (lista „Przenieś do…” w nowym dniu). |
| F05-KA2 [test] ↓ przy Koloseum → Panteon 1, Koloseum 2; ↑ przy pierwszym nieaktywne | spełnione | Test „KA2: …” przechodzi. W przeglądarce dzień 1: „1 Koloseum, 2 Panteon”, ↑ przy Koloseum ma `disabled`. **Szybki dwuklik ↓ prawdziwą myszą** → „1 Panteon, 2 Koloseum”: przesunięcie o jedną pozycję, nic nie zniknęło ani się nie zdublowało (przypadek brzegowy z karty). |
| F05-KA3 [test] punkt 1 z dnia 1 do dnia 2 → koniec dnia 2, numeracja bez luk | spełnione | Test „KA3: …” przechodzi. W przeglądarce dzień 2 miał „1 Forum Romanum”; Panteon przeniesiony „Przenieś do…” → dzień 2: „1 Forum Romanum, 2 Panteon”, dzień 1: „1 Koloseum”. |
| F05-KA4 [test] × przy zapisanym miejscu → znika z podróży, zostaje w Zapisanych (N2) | spełnione | Test „KA4 / N2: …” przechodzi. W przeglądarce × przy Koloseum (prawdziwe kliknięcie): komunikat „Usunięto „Koloseum” z podróży. Miejsce zostaje w Zapisanych.”, Koloseum nadal w `zapisane`, fokus na nagłówku dnia (lista pusta). |
| F05-KA5 [test] E8: 2 miejsca → „Dodaj (2)”; miejsca z podróży nie do wybrania | spełnione | Test „KA5: …” przechodzi. W przeglądarce okno „Dodaj miejsca”, fokus w polu wyszukiwania, fraza „rzym”: zapisane (♥) na górze, Forum Romanum i Panteon zaznaczone, nieaktywne, z dopiskiem „już w podróży”; kliknięcie w nie niczego nie zmienia. „Dodaj (0)” nieaktywny; po wyborze Koloseum i Fontanny di Trevi „Dodaj (2)” → oba na końcu „Do zaplanowania”, komunikat „Dodano 2 miejsca do listy „Do zaplanowania”.”, fokus wraca na „+ Dodaj miejsca”. |
| F05-KA6 [test, ręcznie] plan zostaje po odświeżeniu (N5) | spełnione | Test „KA6 / N5: …” przechodzi. W przeglądarce po przeładowaniu E7: „Do zaplanowania: Koloseum, Fontanna di Trevi”, „Dzień 2: 1 Forum Romanum, 2 Panteon” — tak jak przed odświeżeniem. |

Zachowanie z karty F05 (pkt 1–6): nagłówek z nazwą, kierunkiem, datami, liczbą dni i miejsc, „Edytuj podróż”; karty dni z paskiem w kolorze dnia i liczbą miejsc; punkt w „Do zaplanowania” z nazwą, kategorią, miastem, listą i ×; punkt w dniu z numerem, nazwą, kategorią, ↑, ↓, „Przenieś do…” (inne dni i „Do zaplanowania”) i ×; stany puste „Wszystkie miejsca są przypisane do dni.” i „Brak punktów. Przypisz miejsca z listy „Do zaplanowania”.”. Zestaw testowy (`?dev` → „Załaduj zestaw testowy”) daje „Testowy wyjazd: Rzym”, 04–06.12.2026, 3 dni, 3 miejsca. Wyjątek od wyglądu: W1 i W2.

Przypadki brzegowe F05: podróż ma zawsze co najmniej 1 dzień (walidacja A1, `liczbaDni()` z wartością zapasową 3); podwójne ↓ (wyżej); błąd zapisu → komunikat, ekran zbudowany od nowa ze stanu, który zapisano (`zmienPlan()` w `src/app.js:379–386`, test). „Miejsce niedostępne” (plan 5.4) bez numeru i strzałek, z × (test).

## Niezmienniki
| Niezmiennik | Wynik | Dowód |
|---|---|---|
| N1 dane nie opuszczają przeglądarki | prawdziwy | Testy statyczne N1, test CSP i testy operacji (F02-KA6, „N1: zmiany planu…”) przechodzą. W `src/` brak `fetch(`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`. Formularze E5 i „Dodaj do podróży” mają `preventDefault()`, a CSP ma `form-action 'none'` i `connect-src 'none'` (bez zmian w MVP-1). W przeglądarce, w sesji z zapisem miejsc, utworzeniem i edycją podróży, zmianami planu i E8: żądania tylko do `127.0.0.1:8000` (18, pliki aplikacji) i `upload.wikimedia.org` (31, zdjęcia). |
| N2 punkt podróży i zapis miejsca są niezależne | prawdziwy | Oba kierunki: × w planie zostawia Koloseum w Zapisanych (F05-KA4); usunięcie serca Panteonu na E4 zostawia punkt w podróży i daje komunikat „Usunięto „Panteon” z Zapisanych. W podróży nadal zostaje.”; usunięcie podróży zostawia Zapisane (F04-KA6). W kodzie `przelaczZapis()` nie dotyka `podroze`, a `usunPunkt()` i `usunPodroz()` nie dotykają `zapisane` (`src/stan.js`). Testy N2 przechodzą. |
| N3 numery pinezek = kolejność w planie | nie dotyczy MVP-1 | Mapa to F06. Podstawa jest gotowa: `planDnia()` (`src/stan.js:159–168`) numeruje od 1 bez luk i pomija „Miejsce niedostępne”; zgodność numerów na ekranie sprawdzona w przeglądarce po każdej zmianie planu. |
| N4 brak kluczy, haseł i `.env` | prawdziwy | Test N4 przechodzi. `git ls-files` bez `.env*`. W diffie `46be604..0377262` brak wzorców kluczy, haseł i adresów e-mail; jedyne trafienia to `tokens: …` w metadanych learnings Trail-code (licznik zużycia). Autor commitów: adres „noreply” GitHuba. |
| N5 dane zostają po odświeżeniu | prawdziwy | Testy N5 (F02-KA3, F04-KA2, F05-KA6) przechodzą; w przeglądarce trzy przeładowania z kontrolą Zapisanych, listy podróży i planu dni. Każda operacja zapisuje przez `zatwierdz()` w `src/magazyn.js` i przyjmuje stan dopiero po udanym zapisie. |

## Lista kontrolna weryfikacji (sekcja 7)
| Punkt | Wynik |
|---|---|
| Każde kryterium z dowodem | tak, 20 z 20 spełnionych (F02: 6, F04: 8, F05: 6) |
| N1–N5 prawdziwe, testy przechodzą | tak dla N1, N2, N4, N5; N3 sprawdza F06. 113 z 113 testów przechodzi |
| Testy nie zostały osłabione | tak. W całym zakresie usunięto 2 linie testów: w `tests/podroze.test.js` (KA2 z F04) format „Dzień 1 · 04.12” zmienił się na „Dzień 1 · pt., 4.12”. Powód jest uzasadniony i zapisany: F04 miało tymczasowy podgląd E7, a format „Dzień 1 · pt., 4.12” wymaga karta F05 (pkt 1); w teście jest komentarz o decyzji właścicielki z 26.11.2026, a w planie wpis w części F05. `tests/magazyn.test.js` tylko zyskał testy (+45 linii), a `odkrywaj`, `katalog`, `bezpieczenstwo` i `wyglad` są bez zmian |
| Brak kluczy, haseł i prawdziwych danych | tak (N4). Dane testowe: zestaw z F00 i miejsca z katalogu |
| Brak żądań z danymi użytkownika i zewnętrznych skryptów | tak (N1); brak nowych skryptów, CSP bez zmian |
| `<b>test</b>` jako tekst | tak, w każdym miejscu, gdzie pojawia się nazwa podróży (F04-KA7). Cały HTML powstaje z szablonu `html```, który zamienia znaki specjalne; `surowy()` jest użyty tylko dla stałych ikon (`src/ikony.js`). Nazwa podróży w `confirm()` i w komunikatach trafia przez `textContent`, więc też jako tekst |
| Walidacja pól z sekcji 6 działa w aplikacji | tak: `novalidate` w formularzu, brak `maxlength`, reguły w `src/walidacja.js`; w przeglądarce pusta nazwa, jedna data i koniec przed początkiem zatrzymały zapis z komunikatem przy polu |
| Zgodność z design.md i sekcją 9 | częściowo: W1 (kontrast numeru dnia wobec design.md), W2 (owalne puste kółko). Pozostałe nowe teksty: licznik w menu 12 px, 5,44:1; etykieta statusu 12 px, 5,03:1; mały tekst w planie 14 px, 5,60:1; znacznik liczby 14 px, 8,40:1; × w planie 6,76:1 — w granicach DEC-20. Przyciski-ikony 44×44 px (DEC-14). Przy 375 px: E4, E5, E6, E7 i E8 bez przewijania w poziomie (`scrollWidth` = 375), okna na całą szerokość, menu na dole |
| Brak zmian poza zakresem karty | tak. Zmiany spoza list plików w planie (`style.css`, `index.html`, `src/magazyn.js`, `src/daty.js`, `tests/podroze.test.js`) są opisane w częściach „Dodatkowo w sesji …” planu i wynikają z kroków kart albo z decyzji po F00/F01 (I2, W1, W2). Kolekcji, przeciągania, godzin, mapy i wyszukiwarki E2 nie ma |
| Learnings zgodne z kodem, bez danych osobowych; `trail check` | tak (sekcja „Learnings i Trail-code”) |

## Znaleziska

### W1 · WARNING · Kontrast numeru dnia: sekcja 9 pozwala, design.md nie
**Co:** Numer punktu w planie to biały tekst na kolorze dnia (`.numer`, `style.css:545–556`). Kontrast z kolorami z design.md wynosi od 3,3:1 (dzień 6, `#A68A3D`) do ok. 4,1:1 (dzień 1, zmierzone w przeglądarce: 4,09:1). Sesja F05 uznała numer za „duży tekst” (19,2 px, pogrubiony), dla którego WCAG AA wymaga tylko 3:1, i zapisała to w planie (część F05), w learning F05 i w teście `tests/plan.test.js:393` („kontrast co najmniej 3:1”).

- Sekcja 9 specyfikacji: „kontrast WCAG AA” — rozwiązanie jest z nią **zgodne**.
- design.md, sekcja dostępności: „Kontrast tekstu co najmniej 4,5:1” — bez wyjątku dla dużego tekstu; tak samo test `tests/wyglad.test.js:35` („tekst ma kontrast co najmniej 4,5:1 (sekcja 9, DEC-18)”), który jednak numerów nie sprawdza.

AGENTS.md mówi: „Rozbieżność zgłaszasz właścicielce projektu, nie rozstrzygasz jej po cichu”. Rozwiązanie nie jest ciche (jest w planie), ale nie ma DEC ani zmiany design.md, więc dokumenty mówią dziś co innego.

**Skutek:** dla osób czytających jest czytelne (duża, gruba cyfra), WCAG AA jest spełnione. Problem jest głównie w dokumentach. F06 doda pinezki z numerem na tych samych kolorach (design.md: „kółko w kolorze dnia z numerem”) i będzie musiało przyjąć tę samą zasadę.

**Jak odtworzyć:** `npm start` → `http://localhost:8000/?dev` → „Załaduj zestaw testowy” → „Podróże” → „Otwórz” → przypisz miejsce do dnia 1 → F12 → prawym przyciskiem na kółku z „1” → „Zbadaj” → „Obliczone” (Computed): `color` biały, `background-color` `rgb(123, 128, 105)`, `font-size` 19.2px. Kontrast policzony wzorem WCAG 2.

**Propozycja do decyzji (DEC-21):** (a) wyjątek w design.md: duży tekst (od 18,66 px pogrubionego albo 24 px) może mieć kontrast 3:1, zgodnie z WCAG AA; dotyczy numerów w planie i pinezek F06. Kod bez zmian. Albo (b) cały tekst 4,5:1: numer w kolorze dnia na białym tle z kolorowym obrysem albo ciemniejsze kolory dni (zmienia wygląd z prototypu i design.md).

### W2 · WARNING · Puste kółko „Do zaplanowania” jest owalem 36×84 px
**Co:** Punkt w „Do zaplanowania” ma znacznik `<span class="numer pusty">` (`src/widoki/plan.js`, `punktDoZaplanowania()`). Klasa `pusty` jest też nazwą stanu pustego E4/E6 (`style.css:376–381`: `.pusty { padding: 40px 16px; border: 1px dashed …; border-radius: var(--promien); text-align: center }`). Reguła `.numer.pusty` (`style.css:557`) ustawia szerokość i wysokość 28 px, ale nie zeruje `padding`, a przy `box-sizing: border-box` wypełnienie 40 px góra/dół i 16 px po bokach rozpycha znacznik. Zmierzone w przeglądarce: 36×84 px, `border-radius: 50%`, czyli wysoki, przerywany owal zamiast kółka. To samo dotyczy punktów „Miejsce niedostępne”.

Prototyp ma tę samą kolizję nazw (`.empty` i `.num.empty`), więc wygląd mógł przejść stamtąd. design.md mówi jednak o „kółku”, a owal wydłuża każdy punkt w „Do zaplanowania” (na telefonie dobrze widać to na zrzucie ekranu).

**Skutek:** tylko wygląd: punkty w „Do zaplanowania” są wyższe, a znacznik wygląda jak błąd. Danych nie dotyczy. F06 ma pokazywać „puste kółka dla „Do zaplanowania”” na mapie, więc łatwo powtórzyć tę samą klasę.

**Jak odtworzyć:** `npm start` → `http://localhost:8000/?dev` → „Załaduj zestaw testowy” → „Podróże” → „Otwórz”. Przy każdym miejscu w „Do zaplanowania” po lewej jest wysoki przerywany owal. W konsoli (F12 → Console): `document.querySelector('.numer.pusty').getBoundingClientRect()` → `width: 36, height: 84`.

**Propozycja:** dopisać `padding: 0` (i ewentualnie `text-align: initial`) do `.numer.pusty` albo zmienić nazwę klasy znacznika (np. `numer-pusty`), żeby nie łapała stylu stanu pustego. Dobrze też dodać do testu wyglądu sprawdzenie, że `.numer.pusty` nie dziedziczy `padding`.

### Uwagi (INFO), bez wpływu na werdykt
**I1 · Nieaktualna tabela w docs/plan.md, sekcja 4.** Kolumna „Status” w tabeli „Kolejność kart i szacunek czasu” mówi nadal „F01 … czeka na decyzje właścicielki” i „F02 … do zrobienia”, choć sekcja 9 planu i README mają statusy aktualne. Poprawione razem z tym raportem (aktualizacja statusów po weryfikacji).

**I2 · Liczniki miejsc liczą też „Miejsce niedostępne”.** Nagłówek E7 („… · 4 miejsca”), karta E6 i licznik dnia („2 miejsca”) biorą `p.punkty.length` albo wszystkie punkty dnia, razem z miejscami usuniętymi z katalogu. Numeracja (N3), E4 i licznik w menu je pomijają (plan 5.4). Dotyczy tylko sytuacji, gdy miejsce zniknie z katalogu, i nie psuje danych; warto zdecydować przy F06, czy liczniki mają pokazywać tylko dostępne miejsca.

**I3 · Powtórzony punkt w uszkodzonych danych.** `pominUszkodzone()` w `src/magazyn.js` odrzuca powtórzone zapisy miejsca, ale nie powtórzone punkty tego samego miejsca w jednej podróży. Aplikacja sama takich danych nie tworzy (wszystkie operacje są idempotentne), mogą powstać tylko po ręcznej zmianie pamięci przeglądarki. Wtedy plan pokaże miejsce dwa razy, a × usunie oba punkty naraz. Ryzyko małe; do rozważenia razem z I2 z F00, jeśli magazyn będzie zmieniany.

**I4 · Fokus po dwukliku ↓ myszą.** Po szybkim dwukliku ↓ fokus trafia na strzałkę sąsiedniego punktu, bo drugie naciśnięcie przycisku myszy ustawia fokus na elemencie, który po przebudowie jest pod kursorem (samo kliknięcie jest pomijane, zgodnie z learning F05). Plan jest poprawny, a z klawiatury fokus idzie za punktem. Bez działania.

## Learnings i Trail-code
- Przeczytane learnings dotyczące plików MVP-1: „F00: zapis danych bez nadpisywania…”, „Faza C F01: kliknięcia w marginesy okna…”, „F02: komunikat jako popover…”, „F04: identyfikator podróży z formularza…”, „F05: podwójne kliknięcie strzałki…”.
- Zgodność z kodem:
  - F02: `#toast` ma `popover="manual"` (`index.html`), `pokazKomunikat()` używa `showPopover()` (`src/app.js:163–175`); komunikat był widoczny nad oknem E3. Powrót fokusu po przebudowie (`naglowekEkranu()`) działa. Opis „zamykanie sprawdza `target === okno` i dopiero potem prostokąt” zgadza się z `src/app.js:487–494`.
  - F04: `nowyIdPodrozy()` przy otwarciu formularza, `utworzPodroz()` odrzuca drugi raz to samo id — dwuklik dał jedną podróż. Adres `#/podroze/<id>`. Zdanie o tymczasowym podglądzie E7 w `src/widoki/podroze.js` jest już historyczne: F05 przeniosło `widokPodrozy()` do `src/widoki/plan.js`, a `podroze.js` tylko go eksportuje. To naturalny skutek kolejnej karty, opisany w planie (część F05); learning F05 tego nie zastępuje, ale treść nie wprowadza w błąd co do zachowania.
  - F05: warunek `zdarzenie.detail <= 1` w `src/app.js:518–520`, operacje po id miejsca w `src/stan.js`, `.numer` 1,2 rem i pogrubienie, test kontrastu 3:1 — wszystko się zgadza. Rozbieżność z design.md: W1.
  - Faza C F01: oba ostrzeżenia rozwiązane (W1 i W2 wyżej).
- Dane osobowe: brak. W polu autora jest nazwa właścicielki wpisana przez narzędzie, na co AGENTS.md pozwala. Kluczy brak.
- `trail check`: „nothing to check”, bo MVP-1 jest już na `origin/main`. `trail check --base 46be604`: zmiany „follows” learnings, „no conflicts”.
- Propozycja learning z tej weryfikacji: w wiadomości do właścicielki; zapis dopiero po jej zgodzie.

## Decyzje właścicielki po rundzie 1 (26.11.2026)
- **W1 — wyjątek dla dużego tekstu.** DEC-21 w specyfikacji (v1.3, sekcje 9 i 11) i w design.md (Dostępność, Punkt planu): duży tekst (co najmniej 18,66 px pogrubiony albo 24 px) ma kontrast co najmniej 3:1 zgodnie z WCAG AA; dotyczy numeru dnia w planie i pinezek F06. Kolory dni i kod bez zmian; test `tests/plan.test.js` („… co najmniej 3:1 (WCAG AA, DEC-21)”) sprawdza tę zasadę.
- **W2 — poprawić.** `.numer.pusty` w `style.css` ma teraz `padding: 0` i `border-radius: 50%` (z komentarzem o kolizji z `.pusty`). W przeglądarce pod `127.0.0.1:8000` (zestaw testowy, „Testowy wyjazd: Rzym”): znacznik ma 28×28 px, `padding: 0px`, `border-radius: 50%`, czyli kółko z przerywanym obrysem. Nowy test „wygląd: puste kółko „Do zaplanowania” nie bierze wypełnienia stanu pustego .pusty …” w `tests/plan.test.js`.
- Testy po zmianach: 114 z 114. Druga runda weryfikacji nie jest potrzebna: obie zmiany są małe i sprawdzone wyżej; F06 i tak przejdzie własną weryfikację.

## Jak sprawdzić ręcznie (dla właścicielki)
1. **Start:** w terminalu w folderze projektu wpisz `npm start` i otwórz `http://localhost:8000`. Jeśli terminal pokaże `EADDRINUSE`, inny `npm start` już działa: zamknij tamten terminal albo otwórz adres, który on podaje.
2. **Serce (F02, W2):** na Odkrywaj kliknij serce przy „Koloseum”, potem przy „Panteon”, celując w róg wokół białego kółka. Serca się wypełniają, przy „Zapisane” pojawia się „2”, na dole komunikat. Otwórz „Zapisane”: Panteon pierwszy. Odśwież stronę (F5): oba miejsca zostają.
3. **Okno (W1):** kliknij „Koloseum”. W oknie kliknij w jasne pole tuż na lewo od napisu „Zdjęcie: FeaturedPics…”. Okno ma zostać otwarte. Kliknij w ciemne tło obok okna: okno się zamyka.
4. **Podróż (F04):** zapisz jeszcze „Forum Romanum”, w „Zapisane” zaznacz trzy karty (kwadrat w lewym górnym rogu) i kliknij „Utwórz podróż z wybranych”. Powinno być „Rzym” i „Wyjazd: Rzym”. Usuń nazwę i kliknij „Utwórz podróż”: „Podaj nazwę podróży.”. Wpisz `<b>test</b>`, podaj tylko datę rozpoczęcia: „Podaj obie daty albo zostaw obie puste.”. Podaj 04.12.2026–06.12.2026 i zapisz: widzisz plan z 3 dniami i 3 miejscami w „Do zaplanowania”, a nazwę dokładnie jako `<b>test</b>`.
5. **Plan (F05):** przypisz dwa miejsca do „Dzień 1”, kliknij ↓ przy pierwszym (numery się zamieniają), przenieś jedno do dnia 2 („Przenieś do…”), usuń jedno krzyżykiem. W „Zapisane” to miejsce nadal jest. Kliknij „+ Dodaj miejsca”, wpisz „rzym”, zaznacz dwa miejsca i „Dodaj (2)”. Odśwież stronę: plan jest taki sam.
6. **Skracanie i usuwanie (F04):** zostaw dwa miejsca w dniu 3, kliknij „Edytuj podróż” i zmień koniec na 05.12.2026: komunikat „… 2 miejsca z usuniętych dni wróciły …”. Na liście „Podróże” kliknij „Usuń”, potem „Anuluj” (nic się nie zmienia), potem „Usuń” i „OK”. „Zapisane” są bez zmian.
7. **W2 (po poprawce):** przy miejscach w „Do zaplanowania” po lewej jest małe kółko z przerywanym obrysem, nie wysoki owal.
8. **Telefon:** F12 → Ctrl+Shift+M → szerokość 375. Zapisane, Podróże, plan i okna nie przesuwają się w bok, menu jest na dole.
9. **Testy:** `npm test`; na końcu „pass 114” i „fail 0” (113 w chwili weryfikacji, plus test W2).

Uwaga: kroki 2–6 zmieniają dane w Twojej przeglądarce pod `localhost:8000`. Jeśli chcesz zachować swoje dane, otwórz zamiast tego `http://127.0.0.1:8000` — to ta sama aplikacja z osobną, pustą pamięcią.

## Ograniczenia tej weryfikacji
- Przeglądarka oparta na Chromium (szerokość 1024 px i 375 px w emulacji), nie Edge, Firefox ani Safari.
- Nie zamykałem całej przeglądarki (N5 sprawdzone przeładowaniem strony i testami ponownego wczytania z tej samej pamięci).
- Błędu zapisu w trakcie (np. brak miejsca) nie wywoływałem w przeglądarce; sprawdziły go testy i przegląd kodu. Tryb blokady (A5) sprawdziłem w przeglądarce.
- Okno potwierdzenia usunięcia (`window.confirm`) zastąpiłem w konsoli odpowiedzią „Anuluj”, a potem „OK”, bo narzędzie nie klika okien systemowych przeglądarki. Treść pytania odczytałem z wywołania.
- Część zmian list wyboru („Przypisz do dnia…”, „Przenieś do…”) ustawiałem narzędziem formularza albo przez konsolę (to samo zdarzenie `change`), nie rozwijając listy myszą.
- Czytnika ekranu nie uruchamiałem; role, nazwy i `aria-*` sprawdziłem w HTML i drzewie dostępności.
- Zgodnie z poleceniem bez celowych błędów w kodzie (bez sprawdzania, które błędy wykrywają testy).
- Kontrast policzyłem wzorem WCAG 2 z wartości obliczonych w przeglądarce.
