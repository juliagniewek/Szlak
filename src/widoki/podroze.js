// E6 Podróże (F04): lista podróży z etykietą statusu (DEC-16) i stan pusty.
// Podróż (E7) z planem dni jest w plan.js (F05); widokPodrozy jest tu ponownie eksportowany dla app.js i testów F04.
import { html } from "../html.js";
import { podrozeOdNajnowszej } from "../stan.js";
import {
  liczbaDni, statusPodrozy, ETYKIETY_STATUSU, zakresDat, odmiana, tekstDni, tekstMiejsc
} from "../daty.js";

export { widokPodrozy } from "./plan.js";

/** Adres podróży (E7), np. #/podroze/p-test-rzym. */
export function adresPodrozy(id) {
  return `#/podroze/${encodeURIComponent(id)}`;
}

function kartaPodrozy(p, dzis) {
  const status = statusPodrozy(p, dzis);
  const nazwa = html`<span class="sr">: ${p.nazwa}</span>`;
  return html`
    <article class="karta-podrozy">
      <div class="karta-podrozy-tresc">
        <p class="status status-${status}">${ETYKIETY_STATUSU[status]}</p>
        <h2><a href="${adresPodrozy(p.id)}">${p.nazwa}</a></h2>
        <p class="muted">${p.kierunek} · ${zakresDat(p)}</p>
        <p class="znaczniki"><span class="znacznik">${tekstDni(liczbaDni(p))}</span><span class="znacznik">${tekstMiejsc(p.punkty.length)}</span></p>
      </div>
      <div class="karta-podrozy-akcje">
        <a class="btn" href="${adresPodrozy(p.id)}">Otwórz${nazwa}</a>
        <button type="button" class="btn" data-akcja="edytuj-podroz" data-id="${p.id}">Edytuj${nazwa}</button>
        <button type="button" class="btn usun" data-akcja="usun-podroz" data-id="${p.id}">Usuń${nazwa}</button>
      </div>
    </article>`;
}

/** E6. `dzis` to dzisiejsza data „RRRR-MM-DD” (do statusu). */
export function widokPodroze(stan, dzis) {
  const lista = podrozeOdNajnowszej(stan);
  return html`
    <header class="naglowek-sekcji naglowek-z-akcja">
      <div>
        <p class="etykieta">Podróże</p>
        <h1 tabindex="-1">Moje podróże</h1>
      </div>
      ${lista.length ? html`<button type="button" class="btn glowny" data-akcja="nowa-podroz">+ Nowa podróż</button>` : ""}
    </header>
    <div class="sekcja">
      ${lista.length
        ? html`<div class="lista-podrozy">${lista.map((p) => kartaPodrozy(p, dzis))}</div>`
        : html`
          <div class="pusty">
            <h2>Nie masz jeszcze podróży</h2>
            <p class="muted">Utwórz podróż od zera albo zaznacz miejsca w zakładce Zapisane i wybierz „Utwórz podróż z wybranych”.</p>
            <div class="rzad-przyciskow">
              <button type="button" class="btn glowny" data-akcja="nowa-podroz">+ Nowa podróż</button>
              <a class="btn" href="#/zapisane">Przejdź do Zapisanych</a>
            </div>
          </div>`}
    </div>
  `;
}

// ---------- Komunikaty (toast) ----------

export const KOMUNIKATY_PODROZY = {
  utworzona: "Podróż utworzona. Przypisz miejsca do dni.",
  zapisano: "Zapisano zmiany."
};

/** Komunikat po edycji; gdy punkty wróciły z usuniętych dni, mówi ile (A6). */
export function komunikatEdycji(wrocilo) {
  if (!wrocilo) return KOMUNIKATY_PODROZY.zapisano;
  return `Zapisano zmiany. ${tekstMiejsc(wrocilo)} z usuniętych dni ${odmiana(wrocilo, "wróciło", "wróciły", "wróciło")} do „Do zaplanowania”.`;
}

export const komunikatUsuniecia = (nazwa) => `Usunięto podróż „${nazwa}”.`;

export const pytanieOUsuniecie = (nazwa) =>
  `Usunąć podróż „${nazwa}”? Tej operacji nie da się cofnąć. Zapisane miejsca zostaną w Zapisanych.`;

export function komunikatDodania(nazwaPodrozy, dodano) {
  return dodano
    ? `Dodano do podróży „${nazwaPodrozy}”, do listy „Do zaplanowania”.`
    : `To miejsce jest już w podróży „${nazwaPodrozy}”.`;
}
