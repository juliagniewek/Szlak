// E4 Zapisane (F02, F04): karty zapisanych miejsc, najnowsze na górze, i stan pusty.
// F04: pole zaznaczenia na każdej karcie i pasek „Zaznaczone: n” z „Utwórz podróż z wybranych”.
import { html } from "../html.js";
import { zapisaneMiejsca } from "../stan.js";
import { siatka } from "./odkrywaj.js";

/** Pasek zaznaczania nad kartami (F04, pkt 1). */
function pasekZaznaczenia(liczba) {
  const brak = liczba ? "" : html` disabled`;
  return html`
    <div class="pasek-zaznaczenia" role="group" aria-label="Zaznaczone miejsca">
      <strong aria-live="polite">Zaznaczone: ${liczba}</strong>
      <button type="button" class="btn glowny" data-akcja="podroz-z-wybranych"${brak}>Utwórz podróż z wybranych</button>
      <button type="button" class="btn" data-akcja="zaznacz-wszystkie">Zaznacz wszystkie</button>
      <button type="button" class="btn" data-akcja="odznacz"${brak}>Odznacz</button>
    </div>`;
}

/** E4. `zaznaczone`: zbiór id zaznaczonych miejsc (stan ekranu w app.js, nie jest zapisywany). */
export function widokZapisane(stan, zaznaczone = new Set()) {
  const miejsca = zapisaneMiejsca(stan);
  const zapisane = new Set(miejsca.map((m) => m.id));
  const wybrane = new Set([...zaznaczone].filter((id) => zapisane.has(id)));
  return html`
    <header class="naglowek-sekcji">
      <p class="etykieta">Zapisane</p>
      <h1 tabindex="-1">Twoje inspiracje</h1>
      <p class="wstep">Miejsca oznaczone sercem, najnowsze na górze. Zaznacz kilka, żeby utworzyć z nich podróż.</p>
    </header>
    <div class="sekcja">
      ${miejsca.length
        ? html`${pasekZaznaczenia(wybrane.size)}${siatka(miejsca, zapisane, wybrane)}`
        : html`
          <div class="pusty">
            <h2>Nie masz jeszcze zapisanych miejsc</h2>
            <p class="muted">Kliknij serce przy miejscu w zakładce Odkrywaj.</p>
            <a class="btn glowny" href="#/odkrywaj">Odkrywaj miejsca</a>
          </div>`}
    </div>
  `;
}

/** Zaznaczone miejsca w kolejności z ekranu E4 (do formularza podróży). */
export function wybraneMiejsca(stan, zaznaczone) {
  return zapisaneMiejsca(stan).filter((m) => zaznaczone.has(m.id));
}

/** Komunikat (toast) po kliknięciu serca (F02, pkt 1–2; N2: zapis i podróż są niezależne). */
export function komunikatZapisu(nazwa, zapisano, wPodrozy = false) {
  if (zapisano) return `Zapisano „${nazwa}”. Znajdziesz je w zakładce Zapisane.`;
  return wPodrozy
    ? `Usunięto „${nazwa}” z Zapisanych. W podróży nadal zostaje.`
    : `Usunięto „${nazwa}” z Zapisanych.`;
}
