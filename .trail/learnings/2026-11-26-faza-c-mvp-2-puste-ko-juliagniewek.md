---
title: "Faza C MVP-2: puste kółka mapy pod pinezkami z numerami, a testy CSS bez założenia o końcach linii"
author: Juliagniewek
date: 2026-11-26
branch: main
cost: { minutes: 20, tokens: 314288 }
id: l-639e24d7
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/plan.md
  - docs/weryfikacja/MVP-2.md
  - style.css
  - tests/mapa.test.js
  - src/mapa.js
---

## Decided
Puste kółko „Do zaplanowania” na mapie leży pod pinezkami z numerami. Powód: pinezki mają tę samą warstwę, a puste kółka są w HTML na końcu, więc przy „Cała podróż” przykrywały numery w tym samym miejscu (podróż Rzym + Dolomity: w Rzymie było widać tylko puste kółko). Decyzja właścicielki projektu: wariant (a), bez rozsuwania pinezek; pinezki z numerami w tym samym miejscu nadal się zasłaniają, ale da się je podświetlić z listy pod mapą.

## Watch out
Na tym komputerze git ma `core.autocrlf=true`, więc każde przywrócenie pliku z gita (`git stash`, `checkout`, świeże pobranie) zapisuje końce linii Windowsa. Test, który szuka w CSS tekstu z `\n`, wtedy nie przechodzi, choć CSS jest poprawny (W3 w raporcie MVP-2, czeka na zgodę na poprawkę). Pliki projektu mają końce uniksowe; nie używaj `git stash` przy sprawdzaniu, a nowe testy CSS pisz z `\r?\n` albo `\s`.

In the code: `style.css` (`.pinezka:has(.kolko-puste) { z-index: 0; }` przed regułami `:hover`, `:focus-visible` i `.aktywna`), `src/mapa.js` (`wpisyMapy()` stawia „Do zaplanowania” na końcu), `tests/mapa.test.js` (test „wygląd: puste kółko…” i kruchy test „wygląd: na telefonie…” z `indexOf("@media (min-width: 900px) {\n  .przelacznik-panelu")`), `docs/weryfikacja/MVP-2.md` (W1, W3).
