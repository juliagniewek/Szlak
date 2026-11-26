---
title: "F03: hasło dopasowywane z obciętą końcówką na Szukaj, ale bez obcinania w oknie „Dodaj miejsca”"
author: Juliagniewek
date: 2026-11-26
branch: main
cost: { minutes: 8, tokens: 168497 }
id: l-3c498eaa
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - src/app.js
  - src/szukaj.js
  - src/widoki/dodaj-miejsca.js
  - src/widoki/menu.js
  - src/widoki/odkrywaj.js
  - src/widoki/szukaj.js
  - style.css
  - tests/odkrywaj.test.js
---

## Decided
Stan wyszukiwania trzyma `src/app.js` (zmienna `szukanie`) i ustawia go od nowa przy każdym wejściu na `#/szukaj` (`zacznijSzukanie()`). Powód: karta F03 mówi, że stan nie jest zapamiętywany, a przebudowa ekranu po kliknięciu serca zachowuje hasło. Funkcja `normalizuj()` jest teraz w `src/szukaj.js`; `src/widoki/dodaj-miejsca.js` tylko ją udostępnia dalej.

## Watch out
`slowaHasla()` w `src/szukaj.js` obcina do 2 liter końcówki, a okno „Dodaj miejsca” (`miejscaDoDodania()` w `src/widoki/dodaj-miejsca.js`) szuka bez obcinania. Dlatego „punkt widokowy” działa na Szukaj, a w tym oknie nic nie znajduje. Ujednolicenie zmieniłoby zachowanie F05, więc wymaga decyzji właścicielki projektu.
