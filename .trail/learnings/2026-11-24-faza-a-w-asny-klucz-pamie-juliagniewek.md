---
title: "Faza A: własny klucz pamięci i tylko standardowe szerokości zdjęć"
author: Juliagniewek
date: 2026-11-24
branch: main
cost: { minutes: 11, tokens: 137089 }
id: l-841b27cd
scope: repo
status: active
src: agent
touches:
  - docs/plan.md
---

## Decided
Dane aplikacji są pod kluczem `szlak.app.dane` w `src/magazyn.js`, a nie `szlak-dane-v1`. Powód: prototyp i aplikacja działają pod tym samym adresem `juliagniewek.github.io` i dzielą pamięć przeglądarki, a prototyp ma inny format danych.

## Watch out
Wikimedia odrzuca bezpośrednie żądania miniatur o niestandardowej szerokości (błąd 429). W kodzie używamy tylko 500 i 960 px (lista szerokości w docs/plan.md, sekcja 2).
