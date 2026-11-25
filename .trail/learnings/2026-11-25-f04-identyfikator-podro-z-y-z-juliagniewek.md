---
title: "F04: identyfikator podróży z formularza i podgląd E7 do czasu F05"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 13, tokens: 236158 }
id: l-3c07bed1
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
  - src/walidacja.js
  - src/widoki/formularz-podrozy.js
  - src/widoki/miejsce.js
  - src/widoki/odkrywaj.js
---

## Decided
Identyfikator nowej podróży powstaje przy otwarciu formularza (`data-id`, `nowyIdPodrozy()` w `src/stan.js`), a `utworzPodroz()` nie tworzy drugiej podróży z tym samym identyfikatorem. Powód: podwójne kliknięcie „Utwórz podróż” daje jedną podróż bez blokowania przycisku. Adres podróży to `#/podroze/<id>`, bo `biezacyAdres()` w `src/app.js` zna tylko sekcje menu. `widokPodrozy()` w `src/widoki/podroze.js` to tymczasowy podgląd E7, który F05 zastępuje.

## Watch out
Zdarzenie `close` okna `<dialog>` przychodzi później niż wywołanie `close()`. Dlatego `otworzFormularz()` w `src/app.js` bierze element powrotu fokusu z `elementPrzedOknem` przed zamknięciem E3, a po utworzeniu podróży flaga `fokusNaNaglowek` przekazuje fokus do obsługi `hashchange`.
