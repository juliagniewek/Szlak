---
title: "Faza C F01: kliknięcia w marginesy okna i zaokrąglenie przycisku zmieniają obszar kliknięcia"
author: Juliagniewek
date: 2026-11-25
branch: main
cost: { minutes: 1, tokens: 1940 }
id: l-9e810eec
scope: repo
status: active
src: agent
touches:
  - src/app.js
  - style.css
---

## Watch out
Zamykanie okna przez `zdarzenie.target === okno` w `src/app.js` łapie też kliknięcia w marginesy elementów wewnątrz `<dialog>`, bo margines należy do rodzica. Podpis zdjęcia ma margines 20 px (`.podpis-zdjecia` w `style.css`), więc kliknięcie obok podpisu zamyka okno; to samo spotka okna E5 i E8, jeśli dostaną elementy z marginesem. Z kolei `border-radius: 50%` na `.przycisk-ikona` przycina obszar kliknięcia do koła, więc przycisk 44×44 px ma klikalne tylko koło o średnicy 44 px (DEC-14). Pomiar `getBoundingClientRect` tego nie pokazuje; róg trzeba sprawdzić przez `document.elementFromPoint`.
