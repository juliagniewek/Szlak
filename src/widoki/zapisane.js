// E4 Zapisane (F02): karty zapisanych miejsc, najnowsze na górze, i stan pusty.
// Zaznaczanie miejsc i „Utwórz podróż z wybranych” dochodzą w F04.
import { html } from "../html.js";
import { zapisaneMiejsca } from "../stan.js";
import { siatka } from "./odkrywaj.js";

export function widokZapisane(stan) {
  const miejsca = zapisaneMiejsca(stan);
  const zapisane = new Set(miejsca.map((m) => m.id));
  return html`
    <header class="naglowek-sekcji">
      <p class="etykieta">Zapisane</p>
      <h1 tabindex="-1">Twoje inspiracje</h1>
      <p class="wstep">Miejsca oznaczone sercem, najnowsze na górze.</p>
    </header>
    <div class="sekcja">
      ${miejsca.length
        ? siatka(miejsca, zapisane)
        : html`
          <div class="pusty">
            <h2>Nie masz jeszcze zapisanych miejsc</h2>
            <p class="muted">Kliknij serce przy miejscu w zakładce Odkrywaj.</p>
            <a class="btn glowny" href="#/odkrywaj">Odkrywaj miejsca</a>
          </div>`}
    </div>
  `;
}

/** Komunikat (toast) po kliknięciu serca (F02, pkt 1–2; N2: zapis i podróż są niezależne). */
export function komunikatZapisu(nazwa, zapisano, wPodrozy = false) {
  if (zapisano) return `Zapisano „${nazwa}”. Znajdziesz je w zakładce Zapisane.`;
  return wPodrozy
    ? `Usunięto „${nazwa}” z Zapisanych. W podróży nadal zostaje.`
    : `Usunięto „${nazwa}” z Zapisanych.`;
}
