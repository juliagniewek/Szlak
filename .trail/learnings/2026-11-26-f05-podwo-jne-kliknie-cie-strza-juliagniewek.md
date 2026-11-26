---
title: "F05: podwójne kliknięcie strzałki liczy się raz, a numer dnia to duży tekst"
author: Juliagniewek
date: 2026-11-26
branch: main
cost: { minutes: 28, tokens: 245136 }
id: l-c793faff
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - index.html
  - src/app.js
  - src/daty.js
  - src/stan.js
  - src/widoki/dodaj-miejsca.js
  - src/widoki/plan.js
  - src/widoki/podroze.js
  - style.css
---

## Decided
Przyciski ↑ i ↓ w planie dni biorą pod uwagę tylko pierwsze kliknięcie szybkiego dwukliku. Powód: po przebudowie ekranu drugie kliknięcie trafia w strzałkę sąsiedniego punktu i cofa ruch, a karta dopuszcza przesunięcie o jedną albo dwie pozycje. Operacje planu szukają punktu po identyfikatorze miejsca, nie po pozycji, więc nie mogą go zgubić ani zdublować.

## Watch out
Biały numer na kolorach dni z design.md ma tylko 3,3:1 (najjaśniejszy #A68A3D), czyli mniej niż 4,5:1. Dlatego numer ma 19,2 px i pogrubienie: to „duży tekst” w WCAG AA, dla którego wystarcza 3:1. Pinezki na mapie w F06 potrzebują tej samej zasady.

In the code: `src/app.js` (obsługa `przesun-wyzej` / `przesun-nizej`, warunek `zdarzenie.detail <= 1`), `src/stan.js` (`przesun`, `przeniesDoDnia`, `usunPunkt`, `planDnia`), `style.css` (`.numer`: `font-size: 1.2rem`, `font-weight: 700`), test kontrastu w `tests/plan.test.js`.
