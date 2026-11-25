// Wygląd: wartości z design.md w style.css (F00, punkt 6) i kontrast tekstu (sekcja 9, DEC-18).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(KATALOG, "style.css"), "utf8");
const design = fs.readFileSync(path.join(KATALOG, "design.md"), "utf8");

/** Zmienne kolorów ze style.css, np. { "--cream": "#F7F4EE" }. */
const zmienne = Object.fromEntries(
  [...css.matchAll(/(--[\w-]+):\s*(#[0-9A-Fa-f]{6})\b/g)].map((m) => [m[1], m[2].toUpperCase()])
);

/** Współczynnik kontrastu WCAG 2 między dwoma kolorami #RRGGBB. */
function kontrast(a, b) {
  const jasnosc = (hex) => {
    const [r, g, n] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * n;
  };
  const [jasniejszy, ciemniejszy] = [jasnosc(a), jasnosc(b)].sort((x, y) => y - x);
  return (jasniejszy + 0.05) / (ciemniejszy + 0.05);
}

test("kolory z tabeli w design.md mają te same wartości w style.css", () => {
  const tabela = [...design.matchAll(/\|\s*`(--[\w-]+)`\s*\|\s*`(#[0-9A-Fa-f]{6})`/g)];
  assert.ok(tabela.length >= 9, "tabela kolorów w design.md");
  for (const [, nazwa, wartosc] of tabela) assert.equal(zmienne[nazwa], wartosc.toUpperCase(), nazwa);
});

test("tekst ma kontrast co najmniej 4,5:1 (sekcja 9, DEC-18)", () => {
  const pary = [
    ["--brown", "--cream"], ["--brown", "--paper"],
    ["--muted", "--cream"], ["--muted", "--paper"],
    ["--sage-dark", "--cream"], ["--sage-dark", "--paper"],
    ["--danger", "--paper"],
    ["--cream", "--brown"] // przycisk główny
  ];
  for (const [tekst, tlo] of pary) {
    const k = kontrast(zmienne[tekst], zmienne[tlo]);
    assert.ok(k >= 4.5, `${tekst} na ${tlo}: ${k.toFixed(2)}:1`);
  }
});

test("etykiety kategorii używają ciemnej szałwii, a nie --sage (DEC-18)", () => {
  const etykieta = css.match(/\.etykieta\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(etykieta, /color:\s*var\(--sage-dark\)/);
  assert.ok(kontrast(zmienne["--sage"], zmienne["--cream"]) < 4.5, "--sage nie nadaje się do małego tekstu");
});

test("podpisy menu mają 16 px na telefonie i komputerze (DEC-19)", () => {
  const rozmiary = [...css.matchAll(/\.menu-pozycja\s*\{[^}]*?font-size:\s*([\d.]+rem)/g)].map((m) => m[1]);
  assert.deepEqual(rozmiary, ["1rem", "1rem"]);
});
