---
title: "F00: serwer sprawdza prawdziwą ścieżkę pliku, bo Windows ma krótkie nazwy"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 1, tokens: 30214 }
id: l-5931d628
scope: repo
status: active
replaces: l-8292ec4f
src: agent
touches:
  - scripts/serwer.mjs
  - tests/bezpieczenstwo.test.js
---

## Decided
`scripts/serwer.mjs` (funkcja `zabroniona`) sprawdza ścieżkę także po `fs.promises.realpath`. Powód: na Windows pliki z kropką mają też krótkie nazwy 8.3 (`.git` → `GIT~1`), które omijały sprawdzanie kropki; natywny `realpath` zamienia je na pełne nazwy i rozwija dowiązania.

## Tried and ruled out
Rozważone i odrzucone: lista dozwolonych plików (trzeba by ją zmieniać przy każdym nowym pliku) i odrzucanie nazw z „~” (nie obejmuje dowiązań).

## Watch out
Reguły „deny” z `.claude/settings.json` blokują utworzenie `.env` także w kopii repozytorium poza projektem, więc F00-KA4 sprawdza się przez `git check-ignore --no-index`.
