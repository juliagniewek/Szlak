---
title: "F06: pinezki jako przyciski HTML nad rysunkiem SVG, bo SVG skaluje numer i obszar kliknięcia"
author: Juliagniewek
date: 2026-11-26
branch: main
cost: { minutes: 14, tokens: 242845 }
id: l-ee5392f9
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - src/app.js
  - src/mapa.js
  - src/widoki/plan.js
  - style.css
  - tests/mapa.test.js
---

## Decided
Pinezki mapy to przyciski HTML położone w procentach nad rysunkiem SVG o tych samych proporcjach (600 × 440); w SVG są tylko siatka i linie tras. Powód: rysunek SVG skaluje się z panelem, więc numer w SVG miałby na telefonie ok. 10 px i przestałby być „dużym tekstem” z DEC-21, a obszar kliknięcia byłby mniejszy niż 44 × 44 px (DEC-14).

## Tried and ruled out
Pinezki jako `<g tabindex="0" role="button">` wewnątrz SVG, jak w prototypie: oprócz skalowania wymagają własnej obsługi Enter i spacji.

## Watch out
Kliknięcie pinezki albo punktu listy buduje od nowa tylko panel mapy, więc fokus trzeba szukać ponownie po `data-klucz`. Puste kółko „Do zaplanowania” ma klasę `kolko-puste` i obrys `--muted`, bo `--taupe` ma na kremowym tle mapy tylko 2,2:1.

In the code: `src/widoki/plan.js` (`panelMapy()`, `pinezka()`), `src/mapa.js` (`SZEROKOSC`, `WYSOKOSC`, `rzut()`), `src/app.js` (`odswiezMape()`, `podswietl()`), `style.css` (`.mapa`, `.pinezka`, `.numer.kolko-puste`).
