# design.md: szlak.

Aplikacja webowa do odkrywania miejsc i planowania podróży, używana głównie w przeglądarce na komputerze.
Charakter: nowoczesny magazyn podróżniczy połączony z moodboardem. Spokojny i ciepły, ale z wyraźną nawigacją.

## Zasady

1. **Zdjęcia sprzedają miejsce, ale nie przeszkadzają w planowaniu.** Duże zdjęcia są w Odkrywaj i w szczegółach miejsca. W planie i na mapie są tylko małe miniatury.
2. **Zawsze widać, gdzie jestem.** Aktywna sekcja w menu jest wyraźnie wyróżniona kolorem, tłem i ikoną (uwaga z peer testu).
3. **Każda sekcja i kategoria ma własną ikonę.** Ikona i podpis zawsze występują razem, nigdy sama ikona.
4. **Jedna główna akcja na ekranie.** Ma ciemny, wypełniony przycisk, a pozostałe akcje mają obrys.

## Kolory

| Token | Wartość | Użycie |
|---|---|---|
| `--cream` | `#F7F4EE` | tło strony |
| `--paper` | `#FFFDF9` | karty, okna, pola formularzy |
| `--sand` | `#E6DED1` | obramowania, tło aktywnej pozycji menu |
| `--taupe` | `#B6A58F` | obrys przycisków i pól, elementy pomocnicze |
| `--sage` | `#7B8069` | akcent: etykiety kategorii, liczniki, zaznaczenie |
| `--brown` | `#403A34` | tekst główny, przycisk główny |
| `--muted` | `#6F655B` | tekst pomocniczy (kontrast co najmniej 4,5:1 na kremowym tle) |
| `--danger` | `#9B3B2E` | usuwanie |

**Kolory sekcji** (po peer teście): każda sekcja ma własny akcent, użyty w menu, w nagłówku sekcji i w aktywnej zakładce.
- Odkrywaj: szałwia `#7B8069`
- Szukaj: niebieskoszary `#4F6D8A`
- Zapisane: terakota `#B5452F`
- Podróże: ciemny brąz `#403A34`

**Kolory dni na mapie i w planie**, w kolejności dni: `#7B8069`, `#B0703C`, `#4F6D8A`, `#8A5A7A`, `#403A34`, `#A68A3D`, `#5E8C7A`.

## Typografia

- **Nagłówki:** krój szeryfowy (Iowan Old Style, Palatino lub Georgia), grubość 600.
  - H1: 32–48 px
  - H2: 22 px
  - H3: 17 px
- **Tekst:** krój bezszeryfowy (system-ui, Segoe UI lub Roboto), 16 px, interlinia 1,5.
- **Etykiety kategorii:** 12 px, wersaliki, odstęp liter 0,1 em, kolor szałwiowy.

## Układ

- **Komputer** (główny cel, od 900 px):
  - stałe menu boczne o szerokości 220 px,
  - treść o maksymalnej szerokości 1180 px,
  - plan podróży w dwóch kolumnach: plan po lewej, mapa po prawej, przyklejona przy przewijaniu.
- **Telefon:**
  - menu dolne z 4 ikonami i podpisami,
  - plan i mapa przełączane zakładkami,
  - margines boczny 16 px, bez poziomego przewijania.
- **Siatka kart:** automatyczne kolumny, minimum 200 px na kartę, odstęp 16 px.

## Komponenty

- **Karta miejsca:**
  - zdjęcie 16:10 u góry,
  - serce do zapisu w prawym górnym rogu zdjęcia,
  - pod zdjęciem kategoria, nazwa i lokalizacja,
  - zaokrąglenie 14 px, cienka ramka w kolorze piaskowym,
  - po najechaniu karta lekko się unosi i dostaje cień.
- **Karta kierunku:** duże zdjęcie z ciemnym gradientem na dole, a na nim nazwa miasta (szeryfowa) i kraj.
- **Przyciski:** zaokrąglone w pigułkę.
  - Główny: ciemnobrązowy z kremowym tekstem.
  - Drugorzędny: biały z obrysem.
  - Usuwanie: czerwony tekst i obrys.
- **Menu:** ikona i podpis. Aktywna pozycja ma piaskowe tło, pogrubiony tekst i pasek w kolorze sekcji.
- **Chipy (kategorie, filtry, zakładki):** zaokrąglone. Aktywny chip jest wypełniony ciemnobrązowym kolorem.
- **Punkt planu:**
  - kolorowe kółko z numerem w kolorze dnia,
  - nazwa i kategoria,
  - przyciski ↑, ↓ i × oraz lista „Przenieś do…”.
- **Pinezka na mapie:** kółko w kolorze dnia z numerem. Aktywna pinezka jest większa, ma obwódkę i podpis z nazwą.
- **Komunikat (toast):** ciemna pigułka u dołu ekranu, znika po 3,5 s.
- **Przyciski-ikony (↑, ↓, ×, serce):** wyglądają jak w prototypie (34–38 px), ale obszar kliknięcia ma co najmniej 44×44 px — niewidoczne powiększenie wokół ikony.
- **Stopka:** mały tekst w kolorze pomocniczym na dole treści każdej sekcji: informacja, że dane zostają tylko w tej przeglądarce, i odnośnik „O danych”.

## Ikony

Proste ikony liniowe o jednolitej grubości kreski, jeden zestaw w całej aplikacji.
- **Sekcje:** Odkrywaj (kompas), Szukaj (lupa), Zapisane (serce), Podróże (walizka lub samolot).
- **Kategorie:** kultura (kolumna), miasta (budynki), natura (drzewo), punkty widokowe (góra), plaże (parasol), jedzenie (sztućce), kawiarnie (filiżanka), aktywności (flaga).

## Zdjęcia

- Prawdziwe zdjęcia miejsc w ciepłej, naturalnej kolorystyce, bez mocnych filtrów.
- Każde zdjęcie ma tekst alternatywny z nazwą miejsca.
- Gdy zdjęcia brakuje, karta pokazuje gradient w kolorze kategorii z jej ikoną.
- W szczegółach miejsca pod zdjęciem jest mały podpis „Zdjęcie: [autor], [licencja]” z odnośnikiem do strony pliku na Commons. Pełna lista źródeł jest pod odnośnikiem „Źródła zdjęć” na dole ekranu Odkrywaj.

## Dostępność

- Kontrast tekstu co najmniej 4,5:1.
- Każdy element klikalny ma obszar kliknięcia co najmniej 44×44 px.
- Widoczny fokus: obrys 2 px w kolorze szałwiowym.
- Wszystkie akcje działają z klawiatury, także pinezki na mapie.
- Każde pole formularza ma etykietę.
