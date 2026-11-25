---
title: "F00: zapis danych bez nadpisywania i autorzy zdjęć z Commons"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 13, tokens: 201458 }
id: l-252f7364
scope: repo
status: active
src: agent
touches:
  - src/html.js
  - src/ikony.js
  - src/magazyn.js
  - src/dane/zestaw-testowy.js
  - src/app.js
  - index.html
  - style.css
  - scripts/serwer.mjs
  - package.json
  - tests/katalog.test.js
---

## Decided
`wczytaj()` w `src/magazyn.js` zwraca oprócz `stan` i `ostrzezenie` także flagę `trwaly`. Gdy jest `false`, aplikacja nie zapisuje zmian. Dzieje się tak, gdy przeglądarka blokuje zapis (A5) albo gdy uszkodzonych danych nie dało się skopiować do `szlak.app.kopia`. Powód: lepiej nie zapisać zmian niż nadpisać jedyną kopię danych. `scripts/serwer.mjs` słucha tylko na 127.0.0.1 i nie wydaje plików ani folderów zaczynających się od kropki, bo serwuje cały folder projektu razem z `.git` i ewentualnym `.env`.

## Watch out
Na Commons pole autora (`Artist`) bywa puste albo zawiera długi tekst z prośbami autora. Wtedy autora trzeba ustalić ręcznie ze strony pliku: tak było przy trzech zdjęciach w `src/dane/katalog.js` (zamek św. Jerzego, Forum Romanum, Alpe di Siusi). W API nazwy plików mają spacje zamiast podkreśleń.
