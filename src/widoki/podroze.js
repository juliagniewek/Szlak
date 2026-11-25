// E6 Podróże (F04): lista podróży z etykietą statusu (DEC-16) i stan pusty.
// Tu jest też prosty podgląd podróży (E7) tylko do odczytu: pełny plan dni buduje F05.
import { html } from "../html.js";
import { miejsce } from "../dane/katalog.js";
import { podrozeOdNajnowszej } from "../stan.js";
import {
  liczbaDni, statusPodrozy, ETYKIETY_STATUSU, zakresDat, dataDnia, odmiana, tekstDni, tekstMiejsc
} from "../daty.js";

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

/** Nazwa punktu planu: z katalogu albo „Miejsce niedostępne” (plan 5.4). */
function nazwaPunktu(pk) {
  return miejsce(pk.miejsce)?.nazwa ?? "Miejsce niedostępne";
}

function listaPunktow(punkty, pusty) {
  return punkty.length
    ? html`<ul class="lista-punktow">${punkty.map((pk) => html`<li>${nazwaPunktu(pk)}</li>`)}</ul>`
    : html`<p class="maly muted">${pusty}</p>`;
}

/**
 * Podgląd podróży (E7) do czasu F05: nagłówek, „Do zaplanowania” i dni z miejscami, bez edycji planu.
 * Punkty z dniem spoza zakresu (uszkodzone dane) pokazuje w „Do zaplanowania”.
 */
export function widokPodrozy(p, dzis) {
  if (!p) {
    return html`
      <header class="naglowek-sekcji">
        <a class="btn" href="#/podroze">← Moje podróże</a>
        <p class="etykieta">Podróże</p>
        <h1 tabindex="-1">Nie ma takiej podróży</h1>
        <p class="wstep">Mogła zostać usunięta.</p>
      </header>`;
  }
  const dni = liczbaDni(p);
  const status = statusPodrozy(p, dzis);
  const doZaplanowania = p.punkty.filter((pk) => !(pk.dzien >= 1 && pk.dzien <= dni));
  const numeryDni = Array.from({ length: dni }, (_, i) => i + 1);
  return html`
    <header class="naglowek-sekcji">
      <a class="btn" href="#/podroze">← Moje podróże</a>
      <p class="status status-${status}">${ETYKIETY_STATUSU[status]}</p>
      <h1 tabindex="-1">${p.nazwa}</h1>
      <p class="wstep">${p.kierunek} · ${zakresDat(p)} · ${tekstDni(dni)}</p>
      ${p.opis ? html`<p class="opis-podrozy">${p.opis}</p>` : ""}
    </header>
    <section class="sekcja">
      <h2>Do zaplanowania <span class="znacznik">${doZaplanowania.length}</span></h2>
      ${listaPunktow(doZaplanowania, "Brak miejsc do zaplanowania.")}
    </section>
    <section class="sekcja">
      <h2>Dni</h2>
      <p class="maly muted">Przypisywanie miejsc do dni i ustalanie kolejności pojawi się w kolejnej wersji.</p>
      <div class="lista-dni">
        ${numeryDni.map((n) => html`
          <div class="dzien" style="--dzien: var(--dzien-${((n - 1) % 7) + 1})">
            <h3>Dzień ${n}${dataDnia(p, n) ? ` · ${dataDnia(p, n)}` : ""}</h3>
            ${listaPunktow(p.punkty.filter((pk) => pk.dzien === n), "Brak miejsc w tym dniu.")}
          </div>`)}
      </div>
    </section>
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
