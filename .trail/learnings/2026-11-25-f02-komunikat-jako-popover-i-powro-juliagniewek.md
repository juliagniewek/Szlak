---
title: "F02: komunikat jako popover i powrót fokusu po przebudowie widoku"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 15, tokens: 233927 }
id: l-3e9d00eb
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - docs/specyfikacja.md
  - docs/weryfikacja/F00.md
  - index.html
  - src/app.js
  - src/magazyn.js
  - src/stan.js
  - src/widoki/menu.js
  - src/widoki/miejsce.js
---

## Decided
Komunikat (`#toast` w `index.html`) ma atrybut `popover="manual"`, a `pokazKomunikat()` w `src/app.js` pokazuje go przez `showPopover()`. Powód: okno E3 to modalny `<dialog>`, który przykrywa resztę strony, więc zwykły element z `position: fixed` byłby pod nim niewidoczny po zapisie miejsca w oknie.

## Watch out
Po zapisie `render()` w `src/app.js` buduje ekran od nowa, więc przycisk z fokusem znika. `przelaczZapisMiejsca()` szuka serca ponownie po `data-id`, a gdy karty już nie ma (usunięcie na E4), przenosi fokus na nagłówek ekranu (`naglowekEkranu()`). Kliknięcie z klawiatury ma współrzędne 0,0, dlatego zamykanie okna sprawdza `target === okno` i dopiero potem prostokąt okna; samo sprawdzenie prostokąta zamykałoby okno po Enter na przycisku w środku.
