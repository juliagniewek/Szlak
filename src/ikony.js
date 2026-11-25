// Ikony liniowe z prototypu: jeden zestaw, jednolita grubość kreski (design.md, „Ikony”).
import { surowy } from "./html.js";

const KSZTALTY = {
  // Sekcje
  kompas: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  lupa: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  serce: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  walizka: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18"/>',
  // Kategorie
  kolumna: '<path d="M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18"/>',
  budynki: '<path d="M3 21h18M5 21V8l6-3v16M11 21V10h8v11M8 10v.01M8 14v.01M8 18v.01M15 14h1M15 18h1"/>',
  drzewo: '<path d="M12 3l-5 7h3l-4 6h12l-4-6h3zM12 16v5"/>',
  gora: '<path d="M3 20l6-10 4 6 2-3 6 7z"/><circle cx="17" cy="6" r="2"/>',
  parasol: '<path d="M3 12a9 9 0 0 1 18 0zM12 12v7a2 2 0 0 1-4 0"/>',
  sztucce: '<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M9 3v6M17 3c-2 2-2 6 0 8v10"/>',
  filizanka: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3"/>',
  flaga: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'
};

export const NAZWY_IKON = Object.keys(KSZTALTY);

/** Ikona SVG jako bezpieczny HTML. Ikona jest ozdobą (aria-hidden), podpis daje element obok. */
export function ikona(nazwa, rozmiar = 20, wypelniona = false) {
  const ksztalt = KSZTALTY[nazwa];
  if (!ksztalt) throw new Error(`Nieznana ikona: ${nazwa}`);
  const r = Number(rozmiar);
  return surowy(
    `<svg class="ikona" viewBox="0 0 24 24" width="${r}" height="${r}" fill="${wypelniona ? "currentColor" : "none"}" ` +
    `stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ksztalt}</svg>`
  );
}
