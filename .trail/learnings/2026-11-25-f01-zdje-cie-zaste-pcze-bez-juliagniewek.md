---
title: "F01: zdjęcie zastępcze bez onerror, bo CSP blokuje skrypty w atrybutach"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 8, tokens: 156528 }
id: l-61af2bd1
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - index.html
  - src/app.js
  - src/widoki/menu.js
  - src/widoki/miejsce.js
  - src/widoki/odkrywaj.js
  - style.css
  - tests/odkrywaj.test.js
---

## Decided
Gdy zdjęcie z Commons się nie wczyta, usuwa je nasłuch zdarzenia `error` w `src/app.js` (faza przechwytywania, tylko `img[data-zdjecie]`). Ikona kategorii jest zawsze pod zdjęciem w `zdjecieMiejsca()` (`src/widoki/odkrywaj.js`), więc po usunięciu obrazka zostaje gradient z ikoną (A4). Powód: jeden nasłuch obsługuje karty i okno E3 bez kodu w HTML.

## Watch out
Prototyp używa `onerror="this.remove()"`, ale CSP w `index.html` (`script-src 'self'`) blokuje skrypty wpisane w atrybuty HTML, więc przeniesiony kod przestałby działać po cichu. Dotyczy to też `onclick` i podobnych; zdarzenia obsługuje `src/app.js` przez `data-akcja`.
