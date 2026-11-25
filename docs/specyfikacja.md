# Specyfikacja MVP: szlak.
Wersja 1.2 · 25.11.2026 · Źródła: brief.md, prototyp.html, design.md, specyfikacja-v1.md (wstępna specyfikacja z kartą decyzji), docs/wnioski-z-testow.md, odpowiedzi właścicielki projektu w rozmowie (22.11.2026), odpowiedzi na pytania z Fazy A (24.11.2026, DEC-13–DEC-17), decyzja po weryfikacji F00 (25.11.2026, DEC-18, DEC-19)

## 1. Cel i użytkownicy
szlak. to prosta aplikacja webowa dla osób, które same planują city break, wakacje albo krótki wyjazd, często w kilka osób. Dziś zapisują inspiracje w kilku aplikacjach, zakładkach i notatkach, a potem ręcznie przepisują je do planu i nie widzą, gdzie leżą zapisane miejsca. W aplikacji odkrywają i zapisują miejsca, zamieniają je w podróż, rozkładają na dni i oglądają trasę dnia na mapie. Wszystko w jednym miejscu, w przeglądarce na komputerze, bez zakładania konta.

## 2. Co pokazały testy
Testy: 4 osoby z grupy docelowej (same planują wyjazdy), peer test klikalnego prototypu. Nie zanotowano, ilu testerów zgłosiło każdą uwagę ani czy przeszli całą ścieżkę bez pomocy (R1).

| ID | Obserwacja | Wniosek | Decyzja | Gdzie |
|---|---|---|---|---|
| W1 | Testerzy mieli trudność z przechodzeniem między sekcjami (liczby nie zanotowano) | Nawigacja słabo pokazuje, w której sekcji jest użytkownik | Zmiana: aktywna sekcja wyróżniona tłem, pogrubieniem i paskiem w kolorze sekcji; każda sekcja ma ikonę (DEC-5) | menu, F01 |
| W2 | Testerzy prosili o lepsze kolory i większą czytelność sekcji (liczby nie zanotowano) | Sekcje zlewają się ze sobą | Zmiana: osobny kolor każdej sekcji, mocniejszy kontrast, ikony liniowe (design.md, DEC-5) | design.md, F01 |

## 3. Zakres MVP
**Główna ścieżka MVP:** osoba planująca wyjazd → zapisuje miejsca na ekranie Odkrywaj → tworzy z zapisanych miejsc podróż → rozkłada miejsca na dni i ustala kolejność → (MVP-2) ogląda trasę dnia na mapie.
**Czas na pierwszą wersję:** mniej niż tydzień, wieczorami. Wersja ma być bardzo prosta, bez trudnych połączeń (DEC-10).
**W MVP:**
- MVP-1: F00 Fundament, F01 Układ aplikacji i Odkrywaj, F02 Zapisywanie miejsc, F04 Podróże, F05 Plan dni.
- MVP-2 (jeśli zostanie czas): F03 Wyszukiwanie i filtry, F06 Mapa trasy.

**Później:**
- F07 Planowanie automatyczne („Rozłóż” i „Zaplanuj automatycznie” z cofaniem): było w prototypie, ale ma dużo przypadków brzegowych i nie mieści się w czasie (DEC-10).
- Kolekcje miejsc, archiwum i duplikowanie podróży, notatki przy punktach planu: nie są potrzebne do przejścia głównej ścieżki (odpowiedź właścicielki, 22.11).
- Konta, logowanie i te same dane na kilku urządzeniach: wymagałyby bazy danych w usłudze (DEC-1).
- Prawdziwa mapa z ulicami, odległościami i czasami przejazdu: wymaga zewnętrznych serwisów (DEC-9).
- Współdzielenie podróży, rezerwacje, płatności: poza pierwszą wersją według specyfikacji produktu.

## 4. Role i uprawnienia
| Rola | Co widzi | Co tworzy | Co zmienia | Co usuwa |
|---|---|---|---|---|
| Użytkownik (osoba przy tej przeglądarce) | katalog miejsc, swoje zapisane miejsca i podróże | zapisane miejsca, podróże, punkty planu | swoje podróże i plan | swoje zapisane miejsca, podróże, punkty planu |

Kont nie ma (DEC-1). Dane należą do przeglądarki, w której je zapisano; inna osoba na innym urządzeniu ma własne, puste dane.

## 5. Ekrany i ścieżki
| ID | Ekran | Rola | Z prototypu | Funkcje |
|---|---|---|---|---|
| E1 | Odkrywaj | użytkownik | zmieniony (W1, W2) | F01, F02 |
| E2 | Szukaj | użytkownik | bez zmian | F03 |
| E3 | Szczegóły miejsca (okno) | użytkownik | zmieniony: bez kolekcji (DEC-10) | F01, F02, F04 |
| E4 | Zapisane | użytkownik | zmieniony: bez kolekcji (DEC-10) | F02, F04 |
| E5 | Formularz podróży (okno) | użytkownik | zmieniony: bez „Utwórz i zaplanuj automatycznie” (DEC-10) | F04 |
| E6 | Podróże | użytkownik | zmieniony: jedna lista bez zakładek i archiwum (DEC-10) | F04 |
| E7 | Podróż: plan dni i mapa | użytkownik | zmieniony: bez planowania automatycznego i notatek (DEC-10) | F05, F06 |
| E8 | Dodaj miejsca (okno) | użytkownik | bez zmian | F05 |

Menu: Odkrywaj, Szukaj (od F03), Zapisane, Podróże. Na komputerze menu boczne, na telefonie dolne (design.md).

Główna ścieżka: E1 (serce przy miejscu, szczegóły w E3) → E4 (zaznaczenie miejsc, „Utwórz podróż z wybranych”) → E5 (nazwa, kierunek, daty) → E7 (przypisanie do dni, kolejność, usuwanie, dodawanie przez E8) → E7, panel mapy (MVP-2). Stany puste i błędy opisują karty.

## 6. Model danych
Wszystkie dane użytkownika są zapisywane w pamięci przeglądarki (DEC-2). Katalog miejsc jest częścią danych startowych aplikacji.

### Miejsce
Pozycja katalogu: prawdziwe miejsce w prawdziwym mieście lub regionie, z opisem napisanym dla aplikacji. Dodaje je właścicielka projektu w danych startowych; w MVP nie ma ekranu do ich edycji (DEC-11).

| Pole | Znaczenie | Typ | Wymagane | Przykład fikcyjny | Kategoria danych | Kto ustawia | Kto widzi |
|---|---|---|---|---|---|---|---|
| identyfikator | stały klucz miejsca | tekst, bez spacji | tak | rzym-koloseum | zwykłe | właścicielka (dane startowe) | aplikacja |
| nazwa | nazwa miejsca | tekst | tak | Koloseum | zwykłe | właścicielka | każdy |
| miasto lub region | gdzie leży | tekst | tak | Rzym | zwykłe | właścicielka | każdy |
| kraj | kraj | tekst | tak | Włochy | zwykłe | właścicielka | każdy |
| kategoria | rodzaj miejsca | wybór: kultura, miasta i dzielnice, natura, punkty widokowe, plaże, jedzenie, kawiarnie, aktywności | tak | kultura | zwykłe | właścicielka | każdy |
| opis | krótki opis | tekst, do 200 znaków | tak | „Największy amfiteatr starożytnego Rzymu.” | zwykłe | właścicielka | każdy |
| współrzędne | położenie na mapie | dwie liczby (szerokość, długość) | nie | 41.8902, 12.4922 | zwykłe | właścicielka | każdy |
| oznaczenia | do sekcji ekranu Odkrywaj | tak/nie: popularne, na jesień i zimę, mniej znane | nie | popularne | zwykłe | właścicielka | aplikacja |
| zdjęcie | zdjęcie z Wikimedia Commons | adres pliku | nie | Colosseo_2020.jpg | zwykłe | właścicielka | każdy |
| autor zdjęcia | twórca zdjęcia według strony pliku na Commons (DEC-13) | tekst | tak, gdy jest zdjęcie | (z Commons) | zwykłe | właścicielka | każdy |
| licencja zdjęcia | licencja według strony pliku na Commons (DEC-13) | tekst | tak, gdy jest zdjęcie | CC BY-SA 4.0 | zwykłe | właścicielka | każdy |

Kierunek (do ekranu Odkrywaj i listy w formularzu) to miasto lub region z katalogu plus kraj. Dane startowe: 41 miejsc, 5 kierunków (Rzym, Lizbona, Kraków, Barcelona, Dolomity) z prototypu. Miejsca nie mają adresów ani nazw firm (DEC-8).

### Zapisane miejsce
Miejsce z katalogu oznaczone sercem przez użytkownika.

| Pole | Znaczenie | Typ | Wymagane | Przykład fikcyjny | Kategoria danych | Kto ustawia | Kto widzi |
|---|---|---|---|---|---|---|---|
| miejsce | które miejsce | odwołanie do Miejsca | tak | rzym-koloseum | zwykłe | użytkownik | użytkownik tej przeglądarki |
| data zapisu | do kolejności na liście | data i godzina | tak | 22.11.2026, 20:15 | zwykłe | aplikacja | aplikacja |

Duplikaty: miejsce można zapisać tylko raz; ponowne kliknięcie serca usuwa zapis.

### Podróż
Plan jednego wyjazdu.

| Pole | Znaczenie | Typ | Wymagane | Przykład fikcyjny | Kategoria danych | Kto ustawia | Kto widzi |
|---|---|---|---|---|---|---|---|
| identyfikator | stały klucz | tekst | tak | (nadaje aplikacja) | zwykłe | aplikacja | aplikacja |
| nazwa | nazwa podróży | tekst, do 60 znaków (A2) | tak | Wyjazd: Rzym | zwykłe | użytkownik | użytkownik tej przeglądarki |
| kierunek | dokąd | tekst, do 60 znaków, z listy albo wpisany (DEC-6) | tak | Rzym | zwykłe | użytkownik | j.w. |
| data rozpoczęcia | początek | data | nie, ale obie daty albo żadna | 04.12.2026 | zwykłe | użytkownik | j.w. |
| data zakończenia | koniec | data, nie wcześniejsza niż rozpoczęcie | nie | 06.12.2026 | zwykłe | użytkownik | j.w. |
| liczba dni szkicu | liczba dni, gdy nie ma dat | liczba 1–30, domyślnie 3 (A1) | gdy brak dat | 3 | zwykłe | użytkownik | j.w. |
| opis | notatka o wyjeździe | tekst, do 300 znaków (A2) | nie | „Weekend z przyjaciółmi” | zwykłe; użytkownik może wpisać dane osobowe | użytkownik | j.w. |
| data utworzenia | do kolejności listy | data i godzina | tak | 22.11.2026, 20:30 | zwykłe | aplikacja | aplikacja |

Liczba dni: z dat (najwyżej 30, A1) albo z pola „liczba dni szkicu”. Status na liście (nadchodząca, w trakcie, zakończona, szkic bez dat) aplikacja wylicza z dat i dzisiejszej daty; nie jest zapisywany.

### Punkt planu
Miejsce dodane do podróży.

| Pole | Znaczenie | Typ | Wymagane | Przykład fikcyjny | Kategoria danych | Kto ustawia | Kto widzi |
|---|---|---|---|---|---|---|---|
| podróż | do której podróży należy | odwołanie do Podróży | tak | Wyjazd: Rzym | zwykłe | aplikacja | użytkownik tej przeglądarki |
| miejsce | które miejsce | odwołanie do Miejsca | tak | rzym-panteon | zwykłe | użytkownik | j.w. |
| dzień | który dzień | liczba od 1 do liczby dni albo „do zaplanowania” | tak | 1 | zwykłe | użytkownik | j.w. |
| pozycja | kolejność w dniu | liczba od 1 | tak | 2 | zwykłe | użytkownik | j.w. |

Powiązania: podróż ma wiele punktów planu; jedno miejsce może być w wielu podróżach, ale w jednej podróży tylko raz.

Usuwanie:
- Usunięcie podróży (po potwierdzeniu) usuwa ją trwale razem z punktami planu; zapisane miejsca zostają (N2, A7).
- Usunięcie punktu planu nie usuwa zapisanego miejsca; usunięcie zapisu nie usuwa punktów planu (N2, A3).
- Skrócenie podróży: punkty z usuniętych dni wracają do „do zaplanowania” (A6).
- Wyczyszczenie danych przeglądarki usuwa wszystkie dane użytkownika (sekcja 7, Ograniczenia).

## 7. Ochrona danych i bezpieczeństwo
**Poziom:** P0 — aplikacja nie ma kont i nie zbiera danych osobowych; dane użytkownika (zapisane miejsca, podróże) zostają w jego przeglądarce i nie są nigdzie wysyłane.
**Dane osobowe w MVP:** brak pól osobowych. Pole „opis” podróży to wolny tekst, w który użytkownik może sam wpisać dane osobowe; zostaje ono tylko w jego przeglądarce.
**Usługi zewnętrzne przetwarzające dane:**
- GitHub Pages (hosting) → GitHub zapisuje i przechowuje adres IP każdej osoby odwiedzającej stronę, w celach bezpieczeństwa; właścicielka nie może tego wyłączyć (sprawdzone 24.11.2026, źródła w docs/plan.md, sekcja 2).
- Wikimedia Commons (zdjęcia) → przeglądarka pobiera zdjęcia, więc serwery Wikimedia widzą adres IP i adres strony. Dane użytkownika nie są tam wysyłane. Warunki: osadzanie zdjęć jest dozwolone, ale wymaga podania autora i licencji (DEC-13); działają tylko standardowe szerokości miniatur (sprawdzone 24.11.2026, docs/plan.md, sekcja 2).

**Niezmienniki:**
- N1: Zapisane miejsca, podróże i punkty planu nigdy nie opuszczają przeglądarki — test: przy zapisie miejsca, utworzeniu podróży i zmianie planu aplikacja nie wysyła żadnego żądania sieciowego (jedyne żądania to pobieranie zdjęć).
- N2: Zapis miejsca i jego obecność w podróży są niezależne — test: usunięcie punktu z podróży zostawia miejsce w Zapisanych, a usunięcie zapisu zostawia punkt w podróży.
- N3: Numery pinezek na mapie zawsze odpowiadają kolejności w planie dnia — test: po zamianie kolejności w planie numery na mapie się zamieniają (od F06).
- N4: W repozytorium nie ma kluczy, haseł ani pliku `.env` — test: przeszukanie repozytorium przed każdym commitem.
- N5: Dane użytkownika zostają po odświeżeniu strony i ponownym otwarciu przeglądarki — test: zapis, przeładowanie, odczyt.

**Zasady dla agenta programującego:**
1. Dane w testach i danych startowych są fikcyjne albo pochodzą z katalogu (prawdziwe miejsca bez adresów i nazw firm). Żadnych danych prawdziwych osób.
2. Jedno środowisko: lokalne i GitHub Pages; aplikacja nie ma bazy ani serwera, więc nie ma środowiska produkcyjnego z danymi.
3. Aplikacja nie używa kluczy. Gdyby kiedyś były potrzebne: `.env` w `.gitignore`, `.env.example` bez wartości, agent nie czyta `.env` (blokada w F00).
4. Brak kluczy w kodzie przeglądarki; brak płatnych API.
5. Aplikacja nie wysyła danych użytkownika poza przeglądarkę (N1); nie dodajesz analityki, liczników odwiedzin ani zewnętrznych skryptów.
6. Treść wpisana przez użytkownika (nazwa, kierunek, opis) jest wyświetlana jako tekst, nigdy jako kod strony.
7. Nie wklejasz do rozmowy danych z przeglądarki właścicielki; błędy odtwarzasz na danych testowych z F00.
8. Nic prawdziwego w repozytorium (N4).
9. Minimalizacja: aplikacja nie zbiera pól, których nie ma w sekcji 6.
10. Bezpieczne wartości domyślne: bez internetu aplikacja działa dalej (zdjęcia zastępuje ikona, A4); gdy przeglądarka blokuje zapis, aplikacja ostrzega zamiast udawać, że zapisała (A5).

**Funkcje z modelem AI:** Nie dotyczy, bo MVP nie wywołuje modeli AI.
**Ograniczenia:** dane widzi każdy, kto ma dostęp do tego urządzenia i profilu przeglądarki. Wyczyszczenie danych przeglądarki albo okno prywatne usuwa dane bez kopii zapasowej. Dane nie przenoszą się między urządzeniami. Zdjęcia z zewnętrznego serwera mogą kiedyś zniknąć.
**Lista kontrolna weryfikacji (przy każdej karcie):**
- każde kryterium akceptacji karty z dowodem: spełnione, niespełnione albo nie da się sprawdzić;
- niezmienniki N1–N5 nadal prawdziwe, a ich testy przechodzą;
- testy nie zostały osłabione: żaden oczekiwany wynik nie zmienił się bez uzasadnienia;
- brak kluczy, haseł i prawdziwych danych w zmienionych plikach i w commicie;
- brak nowych żądań sieciowych z danymi użytkownika i brak zewnętrznych skryptów;
- tekst wpisany przez użytkownika wyświetla się jako tekst (próba z nazwą `<b>test</b>`);
- walidacja pól z sekcji 6 działa w aplikacji, nie tylko przez atrybuty formularza;
- zgodność z design.md i wymaganiami z sekcji 9;
- brak zmian poza zakresem karty;
- learnings z sesji karty zgodne z kodem i bez danych osobowych; `trail check` bez nierozwiązanych konfliktów.

**Bramka prawdziwych danych:** aplikacja nie przyjmuje danych osobowych, więc przed publikacją i testami z ludźmi właścicielka sprawdza tylko:
- repozytorium bez kluczy i prawdziwych danych (N4);
- informację na stronie, że dane zostają wyłącznie w przeglądarce i znikają po jej wyczyszczeniu;
- listę usług zewnętrznych (GitHub Pages, Wikimedia Commons) z warunkami sprawdzonymi w aktualnej wersji.

## 8. Założenia techniczne
**Kierunek:** frontend-first, czyli aplikacja działająca w przeglądarce bez własnej bazy i serwera, bo dane należą do jednej osoby na jednym urządzeniu, a wersja ma być prosta (DEC-2, DEC-10). Publikacja na GitHub Pages z publicznego repozytorium `Szlak` (DEC-12).
**Usługi:** GitHub (repozytorium i hosting), Wikimedia Commons (zdjęcia). Bez kont, bazy, e-maili, płatności i modeli AI.
**Urządzenia i przeglądarki:** głównie komputer, aktualne Chrome i Edge (DEC-3); na telefonie (od 375 px szerokości) wszystko działa, bez przewijania w poziomie. Aplikacja działa bez internetu poza zdjęciami.
**Język interfejsu:** polski.
**Czego nie budujemy sami:** logowania, map z podkładem, wyznaczania tras.
**Decyzje dla Fazy A:**
- struktura projektu i to, czy aplikacja zostaje jednym plikiem, czy kilkoma, przy zachowaniu działania na GitHub Pages bez kroku budowania (jeśli się da);
- jak uruchamiać testy jednym poleceniem i jak testować zapis w przeglądarce, w tym atrapę przeglądarki blokującej zapis;
- format zapisu danych w przeglądarce i jego wersja (żeby późniejsza zmiana modelu danych nie skasowała zapisanych podróży);
- jak aplikacja zachowuje się, gdy zapisane dane wskazują miejsce usunięte z katalogu;
- warunki GitHub Pages i Wikimedia Commons (limity, wymagania co do podpisu zdjęć) — do sprawdzenia w aktualnej dokumentacji, ze źródłem;
- adres publikacji aplikacji (np. osobny plik obok prototypu albo zastąpienie prototypu).

## 9. Wymagania ogólne
- Wygląd zgodny z design.md: paleta, kolory sekcji, typografia, karty, ikony liniowe, zdjęcia z zastępczą ikoną kategorii.
- Dostępność: kontrast WCAG AA, tekst co najmniej 16 px, elementy klikalne co najmniej 44×44 px, obsługa klawiatury (także pinezek na mapie), widoczny fokus, etykieta przy każdym polu formularza, tekst alternatywny zdjęć.
- Komunikaty błędów zrozumiałe dla użytkownika, po polsku, przy polu, którego dotyczą.
- Brak połączenia: aplikacja działa, zdjęcia zastępuje ikona kategorii (A4).
- Krótki komunikat (toast) po zapisie, usunięciu i utworzeniu podróży.
- Przyciski-ikony (strzałki, ×, serce) wyglądają jak w prototypie (34–38 px), ale ich obszar kliknięcia ma co najmniej 44×44 px (DEC-14, dopisane do design.md).
- Stopka z informacją o danych i odnośnikiem „O danych” na każdym ekranie (DEC-15).

## 10. Funkcje
| ID | Funkcja | Priorytet | Złożoność → poziom | Zależy od | Karta |
|---|---|---|---|---|---|
| F00 | Fundament i zabezpieczenia | MVP-1 | wysoka → Wysoki | — | docs/funkcje/F00-fundament.md |
| F01 | Układ aplikacji i Odkrywaj | MVP-1 | średnia → Średni | F00 | docs/funkcje/F01-odkrywaj.md |
| F02 | Zapisywanie miejsc | MVP-1 | średnia → Średni | F01 | docs/funkcje/F02-zapisywanie-miejsc.md |
| F03 | Wyszukiwanie i filtry | MVP-2 | niska → Średni | F01 | docs/funkcje/F03-wyszukiwanie.md |
| F04 | Podróże | MVP-1 | średnia → Średni | F02 | docs/funkcje/F04-podroze.md |
| F05 | Plan dni | MVP-1 | wysoka → Wysoki | F04 | docs/funkcje/F05-plan-dni.md |
| F06 | Mapa trasy | MVP-2 | wysoka → Wysoki | F05 | docs/funkcje/F06-mapa-trasy.md |
| F07 | Planowanie automatyczne | Później (DEC-10) | — | F05 | brak karty |

## 11. Decyzje i założenia
- DEC-1 · 22.11.2026: Bez kont i logowania — właścicielka: „nie chcę na razie konta i logowania” — odrzucone: baza i logowanie w usłudze (np. Supabase) — źródło: właścicielka.
- DEC-2 · 22.11.2026: Dane użytkownika w przeglądarce, kierunek frontend-first — wynika z DEC-1 i prostoty — odrzucone: baza w usłudze — źródło: właścicielka.
- DEC-3 · 22.11.2026: Aplikacja głównie w przeglądarce na komputerze; telefon jako drugi wariant — źródło: właścicielka (kontekst w specyfikacja-v1.md).
- DEC-4 · 22.11.2026: Zdjęcia miejsc i wyraźne ikony są w MVP; zdjęcia z Wikimedia Commons — „ważne, aby miała fajne ikonki i zdjęcia” — źródło: właścicielka.
- DEC-5 · 22.11.2026: Każda sekcja ma kolor i ikonę, aktywna sekcja jest wyraźnie wyróżniona — źródło: W1, W2, design.md.
- DEC-6 · 22.11.2026: Kierunek podróży wybierany z listy albo wpisywany — źródło: właścicielka.
- DEC-7 · 22.11.2026: Punkt planu nie ma godziny — „usuń godzinę” — źródło: właścicielka.
- DEC-8 · 22.11.2026: Prawdziwe kraje, miasta i miejsca, bez adresów i nazw firm — źródło: właścicielka.
- DEC-9 · 22.11.2026: Mapa schematyczna bez podkładu, trasa jako linie proste — odrzucone: prawdziwa mapa z serwisem tras — źródło: właścicielka (wybór jednego pliku bez serwera).
- DEC-10 · 22.11.2026: Bardzo prosta wersja w mniej niż tydzień: planowanie automatyczne, kolekcje, archiwum, duplikowanie i notatki trafiają do „Później”; wyszukiwanie i mapa są MVP-2 — „bez jakichś trudnych rzeczy, taka podstawowa aplikacja” — źródło: właścicielka; podział na MVP-1 i MVP-2 zaproponował agent (Q1). Zmienia brief: brief miał „Rozłóż/Zaplanuj automatycznie” i mapę w ścieżce prototypu.
- DEC-11 · 22.11.2026: Katalog miejsc jest w danych startowych, bez ekranu edycji — źródło: prototyp.
- DEC-12 · 22.11.2026: Repozytorium publiczne, bo GitHub Pages na darmowym planie tego wymaga; w repozytorium nie ma danych ani kluczy — źródło: właścicielka (repozytorium Szlak).
- DEC-13 · 24.11.2026: Każde zdjęcie ma w katalogu autora i licencję; w oknie szczegółów miejsca pod zdjęciem jest podpis „Zdjęcie: [autor], [licencja]” z odnośnikiem do strony pliku na Commons, a na dole ekranu Odkrywaj odnośnik „Źródła zdjęć” z pełną listą. Zdjęcie bez jasnej licencji zostaje usunięte (karta pokazuje ikonę, A4) — powód: licencje CC wymagają podania autora i licencji — źródło: właścicielka (P1 z Fazy A).
- DEC-14 · 24.11.2026: Przyciski-ikony zachowują wygląd z prototypu, a obszar kliknięcia ma co najmniej 44×44 px — źródło: właścicielka (P2 z Fazy A).
- DEC-15 · 24.11.2026: Stopka „Twoje dane zostają tylko w tej przeglądarce i znikną po jej wyczyszczeniu.” z odnośnikiem „O danych” (co zostaje w przeglądarce, że GitHub zapisuje adresy IP odwiedzających, że Wikimedia widzi adres IP przy pobieraniu zdjęć) — w F01 — powód: wymaga tego bramka prawdziwych danych — źródło: właścicielka (P3 z Fazy A).
- DEC-16 · 24.11.2026: Lista podróży pokazuje status (nadchodząca, w trakcie, zakończona, szkic bez dat) jako małą etykietę — w F04 — źródło: właścicielka (P4 z Fazy A).
- DEC-17 · 24.11.2026: Mapa trasy (F06) zostaje w MVP-2 (odpowiedź na Q1); aplikacja będzie pod adresem `juliagniewek.github.io/Szlak/`, prototyp zostaje pod `/Szlak/prototyp.html` — źródło: właścicielka (P5 z Fazy A).
- DEC-18 · 25.11.2026: Mały tekst w kolorze szałwii (etykiety kategorii, liczniki, mały tekst w kolorze sekcji Odkrywaj) ma ciemniejszy odcień `--sage-dark` #666B57 (kontrast 5,03:1 na kremowym tle); `--sage` #7B8069 zostaje dla ikon, pasków, obrysów i fokusu (dopisane do design.md) — powód: `--sage` ma na kremowym tle 3,73:1 zamiast wymaganych 4,5:1 (sekcja 9) — źródło: właścicielka (W3 z weryfikacji F00).
- DEC-19 · 25.11.2026: Podpisy w menu mają 16 px na komputerze i telefonie, zgodnie z wymogiem tekstu co najmniej 16 px z sekcji 9 (prototyp miał 12,5–15 px; dopisane do design.md) — źródło: właścicielka (W3b z weryfikacji F00).
- DEC-20 · 25.11.2026: Wyjątek od „tekst co najmniej 16 px” i „elementy klikalne co najmniej 44×44 px” (sekcja 9): etykiety mogą mieć 12 px, a mały tekst pomocniczy (lokalizacja, podpisy zdjęć, stopka, źródła zdjęć, tekst na kartach kierunków) 12,8–14 px, przy kontraście co najmniej 4,5:1; odnośniki w zdaniu lub na liście nie muszą mieć 44 px wysokości (dopisane do design.md) — powód: zgodne z design.md, prototypem i WCAG AA — źródło: właścicielka (W3 z weryfikacji F01).
- A1: Podróż ma od 1 do 30 dni; szkic bez dat ma domyślnie 3 dni — zaakceptowane: 22.11.2026
- A2: Nazwa i kierunek do 60 znaków, opis do 300 znaków — zaakceptowane: 22.11.2026
- A3: Usunięcie zapisu miejsca nie usuwa go z podróży, a usunięcie z podróży nie usuwa zapisu — zaakceptowane: 22.11.2026
- A4: Bez internetu albo gdy zdjęcie się nie wczyta, karta pokazuje gradient i ikonę kategorii — zaakceptowane: 22.11.2026
- A5: Gdy przeglądarka blokuje zapis, aplikacja pokazuje ostrzeżenie „Ta przeglądarka nie pozwala zapisywać danych. Wszystko zniknie po zamknięciu strony.” i działa do zamknięcia strony — zaakceptowane: 22.11.2026
- A6: Po skróceniu podróży punkty z usuniętych dni wracają do „Do zaplanowania”, a aplikacja mówi, ile ich jest — zaakceptowane: 22.11.2026
- A7: Usunięcie podróży wymaga potwierdzenia i nie da się go cofnąć — zaakceptowane: 22.11.2026

## 12. Pytania otwarte i ryzyka
- Q1: Czy mapa trasy (F06) ma być w MVP-1, skoro brief kończy ścieżkę na trasie, czy zostaje w MVP-2 jak proponuje agent? — odpowiedź 24.11.2026: MVP-2 (DEC-17).
- R1: Nie wiadomo, czy testerzy przeszli główną ścieżkę bez pomocy — założenie o użyteczności z briefu jest niesprawdzone — sprawdzamy w teście MVP z 2–3 osobami przed publikacją.
- R2: Dane tylko w jednej przeglądarce — użytkownik może je stracić przy czyszczeniu przeglądarki — informacja na stronie i w README; kopie i synchronizacja są w „Później”.
- R3: Zdjęcia z zewnętrznego serwera — mogą zniknąć albo się zmienić — ikona zastępcza (A4).
- R4: Mało czasu — jeśli F05 zajmie więcej niż jeden wieczór, F03 i F06 przechodzą do „Później”; decyduje właścicielka.

## 13. Jak budować z tą specyfikacją
**Zadania właściciela poza kodem:**
1. Instalacja Trail-code w nowej sesji (prompt „Instalacja i stosowanie Trail-code” 1.3) — przed Fazą A. Wymaga Node.js.
2. Odpowiedź na Q1 — przed Fazą A. Zrobione 24.11.2026 (DEC-17).
3. Przegląd repozytorium pod kątem kluczy i prawdziwych danych przed każdym wysłaniem kodu (push) — repozytorium jest publiczne (DEC-12).
4. Decyzja, pod jakim adresem GitHub Pages będzie aplikacja — przed publikacją. Zrobione 24.11.2026: `juliagniewek.github.io/Szlak/` (DEC-17).

**Przed Fazą A — Trail-code.** Instalacja w nowej sesji. Jeśli się nie uda, praca idzie dalej bez narzędzia, a wnioski trafiają do sekcji „Wnioski” w docs/plan.md.

**Faza A — Plan techniczny (poziom Najwyższy, raz, przed budową).** Nowa sesja. Agent czyta AGENTS.md, całą specyfikację i wszystkie karty, nie pisze kodu. Zaczyna od przeglądu specyfikacji (PASS / WARNING / FAIL), sprawdza założenia o usługach w aktualnej dokumentacji i podaje źródła. Tworzy docs/plan.md: kierunek, struktura projektu (jedno miejsce w kodzie dla zapisu danych w przeglądarce), model danych w wersji technicznej, kolejność kart, 3–7 kroków na kartę, pliki, sposób testowania, ryzyka, statusy oraz sekcje „Później” i „Następny krok”.

**Faza B — Budowa funkcji (poziom z karty).** Jedna karta w jednej nowej sesji. Agent szuka kodu przez mapę Trail-code. Commit po każdej karcie („F02: Zapisywanie miejsc”), razem z learnings z tej sesji.

**Faza C — Weryfikacja (poziom Najwyższy).** Nowa sesja, inna niż ta, w której powstał kod. Agent sprawdza kryteria, niezmienniki i listę kontrolną z sekcji 7, nie poprawia kodu i zapisuje raport w docs/weryfikacja/F02.md z werdyktem PASS / WARNING / FAIL. Najwyżej dwie rundy na kartę.

```
Faza A · poziom Najwyższy
Przeczytaj AGENTS.md, docs/specyfikacja.md i wszystkie karty w docs/funkcje/. Zacznij od przeglądu specyfikacji (PASS / WARNING / FAIL) i sprawdź w aktualnej dokumentacji założenia o usługach. Potem przygotuj docs/plan.md według sekcji 13 specyfikacji. Nie pisz kodu. Jeśli coś w specyfikacji jest niejasne lub sprzeczne, wypisz pytania na końcu planu i zatrzymaj się.
```

```
Faza B · poziom z karty
Zbuduj funkcję F02 według docs/funkcje/F02-zapisywanie-miejsc.md i części F02 w docs/plan.md. Przestrzegaj AGENTS.md. Zacznij od planu w 3–5 punktach.
```

```
Faza C · poziom Najwyższy
Zweryfikuj funkcję F02. Przeczytaj AGENTS.md, docs/funkcje/F02-zapisywanie-miejsc.md, sekcję 7 docs/specyfikacja.md, zmiany z commita „F02: …” i wnioski dotyczące zmienionych plików. Sprawdź każde kryterium akceptacji z dowodem, niezmienniki i listę kontrolną weryfikacji. Nie poprawiaj kodu. Zapisz raport z werdyktem PASS / WARNING / FAIL i sposobem odtworzenia każdego znaleziska w docs/weryfikacja/F02.md.
```

(W poleceniach Fazy B i C zmieniasz F02 i nazwę pliku na kartę, którą budujesz.)

**Zawartość repozytorium:**
| Element | Ścieżka | Powstaje | Kryterium |
|---|---|---|---|
| README | README.md | specyfikacja, prowadzony do końca budowy | sekcje według wzoru; brak znaczników „[uzupełnia: …]”; tabela „Stan funkcji” zgodna z docs/plan.md; brak haseł, kluczy i danych osobowych |
| Materiały wejściowe | brief.md, prototyp.html, specyfikacja-v1.md, docs/wnioski-z-testow.md, wersje v1 | przed specyfikacją | wnioski oddzielają obserwacje od interpretacji |
| Wygląd | design.md | przed specyfikacją | aplikacja z niego korzysta |
| Specyfikacja i karty | docs/specyfikacja.md, docs/funkcje/ | specyfikacja | wersja i data w nagłówku; karta dla każdej funkcji MVP z sekcji 10 |
| Zasady dla agentów | AGENTS.md, CLAUDE.md | specyfikacja | zasady ochrony danych i niezmienniki |
| Plan techniczny | docs/plan.md | Faza A | aktualne statusy kart; sekcje „Później” i „Następny krok” |
| Wnioski z pracy z agentem | .trail/learnings/ | od instalacji Trail-code | tytuły od ID karty albo fazy; brak danych osobowych i kluczy |
| Raporty weryfikacji | docs/weryfikacja/F00.md… | Faza C | raport z werdyktem dla każdej zrobionej karty |
| Testy aplikacji z ludźmi | docs/wnioski-z-testow-aplikacji.md | po zbudowaniu MVP | obserwacje oddzielone od interpretacji; odpowiedź na R1 |
| Weryfikacja całego MVP | docs/weryfikacja/MVP.md | przed publikacją | werdykt; bramka prawdziwych danych odhaczona z datą |
| Kod i testy automatyczne | według docs/plan.md | Faza B | testy uruchamiane jednym poleceniem przechodzą |
| Konfiguracja | .gitignore, konfiguracja Trail-code i Claude Code | F00 | .gitignore obejmuje .env; konfiguracja bez kluczy |
| Historia zmian | historia git | Faza B | osobny commit dla każdej karty („F03: …”) |

Czego w repozytorium nie ma, także w historii: pliku `.env`, kluczy i haseł, prawdziwych danych osób, eksportów ani lokalnej mapy kodu Trail-code (`.trail/cache/`).
