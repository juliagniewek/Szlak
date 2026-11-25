---
title: "Faza C F00: krótkie nazwy Windows omijają blokadę plików ukrytych w serwerze"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 1, tokens: 3217 }
id: l-8292ec4f
scope: repo
status: active
src: agent
touches:
  - scripts/serwer.mjs
  - tests/bezpieczenstwo.test.js
---

## Watch out
Na Windows pliki i foldery z kropką mają też krótkie nazwy 8.3 (`.git` → `GIT~1`, `.claude` → `CLAUDE~1`), więc `scripts/serwer.mjs` wydaje np. `/GIT~1/config`, choć blokuje `/.git/config`. Sprawdzanie, czy część ścieżki zaczyna się od kropki, nie wystarcza. Test serwera w `tests/bezpieczenstwo.test.js` sprawdza tylko nazwy z kropką.

## Tried and ruled out
Utworzenie pustego `.env` poleceniem `touch` do sprawdzenia F00-KA4, także w kopii repozytorium poza projektem: reguły „deny” z `.claude/settings.json` to blokują, bo ścieżkę `.env` odnoszą do folderu projektu. KA4 sprawdza się przez `git check-ignore --no-index`.
