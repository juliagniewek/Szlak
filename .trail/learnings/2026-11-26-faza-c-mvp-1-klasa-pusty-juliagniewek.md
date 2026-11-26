---
title: "Faza C MVP-1: klasa pusty rozpycha znacznik punktu, a weryfikacja w przeglądarce idzie na 127.0.0.1"
author: Juliagniewek
date: 2026-11-26
branch: main
cost: { minutes: 14, tokens: 292387 }
id: l-fe3ba040
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - docs/weryfikacja/MVP.md
  - src/widoki/plan.js
  - style.css
  - scripts/serwer.mjs
  - src/app.js
  - src/stan.js
  - src/walidacja.js
  - src/daty.js
---

## Decided
Weryfikację w przeglądarce robimy pod http://127.0.0.1:8000, a nie pod localhost:8000. Powód: to ta sama aplikacja z osobną pamięcią przeglądarki, więc dane właścicielki zapisane pod localhost zostają nietknięte i nie trzeba ich czytać.

## Watch out
Znacznik punktu „Do zaplanowania” ma klasy `numer pusty`, więc dostaje też styl stanu pustego `.pusty` (padding 40px 16px). Przy box-sizing: border-box rozpycha go to do owalu 36×84 px zamiast kółka 28 px, a same wartości width i height w CSS tego nie pokazują; trzeba zmierzyć getBoundingClientRect. Pinezki „Do zaplanowania” w F06 nie powinny używać klasy `pusty`.

In the code: `src/widoki/plan.js` (`punktDoZaplanowania()`, `<span class="numer pusty">`), `style.css` (`.pusty` w stanie pustym E4/E6, `.numer.pusty`), `scripts/serwer.mjs` (słucha na 127.0.0.1), `src/app.js` (tryb `?dev` działa na localhost i 127.0.0.1).
