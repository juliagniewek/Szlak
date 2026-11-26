// E7 Podróż: plan dni (F05). Nagłówek podróży, lista „Do zaplanowania” i karty dni.
// Zastępuje podgląd z F04. Zmiany planu (listy i przyciski) obsługuje app.js przez data-akcja i data-zmiana;
// operacje na danych są w stan.js (przypiszDoDnia, przesun, przeniesDoDnia, usunPunkt, dodajPunkty).
import { html } from "../html.js";
import { KATEGORIE } from "../dane/katalog.js";
import { planDnia } from "../stan.js";
import {
  liczbaDni, statusPodrozy, ETYKIETY_STATUSU, zakresDat, nazwaDnia, tekstDni, tekstMiejsc
} from "../daty.js";

/** Liczba kolorów dni w design.md; dzień 8 ma znowu kolor dnia 1. */
const KOLORY_DNI = 7;

/** Styl karty dnia: kolor z design.md (zmienne --dzien-1…--dzien-7 w style.css). */
export const kolorDnia = (n) => `--dzien: var(--dzien-${((n - 1) % KOLORY_DNI) + 1})`;

export const NIEDOSTEPNE = "Miejsce niedostępne";

/** Nazwa punktu: z katalogu albo „Miejsce niedostępne” (plan 5.4). */
const nazwaPunktu = (m) => m?.nazwa ?? NIEDOSTEPNE;

/** Przycisk × przy punkcie (w „Do zaplanowania” i w dniu). */
function przyciskUsun(id, nazwa) {
  return html`<button type="button" class="przycisk-ikona usun-punkt" data-akcja="usun-punkt" data-id="${id}"
    aria-label="Usuń z podróży: ${nazwa}" title="Usuń z podróży">×</button>`;
}

/** Punkt w „Do zaplanowania”: nazwa, kategoria, miasto, „Przypisz do dnia…”, ×. */
function punktDoZaplanowania(p, { punkt, miejsce: m }, dni) {
  const nazwa = nazwaPunktu(m);
  return html`
    <li class="punkt${m ? "" : " niedostepny"}">
      <span class="numer pusty" aria-hidden="true"></span>
      <div class="punkt-tresc">
        <p class="punkt-nazwa">${nazwa}</p>
        ${m ? html`<p class="maly muted">${KATEGORIE[m.kategoria].etykieta} · ${m.miasto}</p>` : ""}
      </div>
      <div class="punkt-akcje">
        ${m ? html`
          <select data-zmiana="przypisz" data-id="${punkt.miejsce}" aria-label="Przypisz do dnia: ${nazwa}">
            <option value="">Przypisz do dnia…</option>
            ${dni.map((n) => html`<option value="${n}">${nazwaDnia(p, n)}</option>`)}
          </select>` : ""}
        ${przyciskUsun(punkt.miejsce, nazwa)}
      </div>
    </li>`;
}

/** Punkt w dniu: numer w kolorze dnia, nazwa, kategoria, ↑, ↓, „Przenieś do…”, ×. */
function punktDnia(p, { punkt, miejsce: m, numer }, dzien, ostatni, dni) {
  const nazwa = nazwaPunktu(m);
  if (!m) {
    // Miejsca nie ma już w katalogu: bez numeru i strzałek, tylko × (plan 5.4).
    return html`
      <li class="punkt niedostepny">
        <span class="numer pusty" aria-hidden="true"></span>
        <div class="punkt-tresc"><p class="punkt-nazwa">${nazwa}</p></div>
        <div class="punkt-akcje">${przyciskUsun(punkt.miejsce, nazwa)}</div>
      </li>`;
  }
  return html`
    <li class="punkt">
      <span class="numer"><span class="sr">Punkt </span>${numer}</span>
      <div class="punkt-tresc">
        <p class="punkt-nazwa">${nazwa}</p>
        <p class="maly muted">${KATEGORIE[m.kategoria].etykieta}</p>
      </div>
      <div class="punkt-akcje">
        <button type="button" class="przycisk-ikona" data-akcja="przesun-wyzej" data-id="${punkt.miejsce}"
          aria-label="Przesuń wyżej: ${nazwa}"${numer === 1 ? html` disabled` : ""}>↑</button>
        <button type="button" class="przycisk-ikona" data-akcja="przesun-nizej" data-id="${punkt.miejsce}"
          aria-label="Przesuń niżej: ${nazwa}"${numer === ostatni ? html` disabled` : ""}>↓</button>
        <select data-zmiana="przenies" data-id="${punkt.miejsce}" aria-label="Przenieś do innego dnia: ${nazwa}">
          <option value="">Przenieś do…</option>
          ${dni.filter((n) => n !== dzien).map((n) => html`<option value="${n}">${nazwaDnia(p, n)}</option>`)}
          <option value="0">Do zaplanowania</option>
        </select>
        ${przyciskUsun(punkt.miejsce, nazwa)}
      </div>
    </li>`;
}

/** Nagłówek podróży z „Edytuj podróż” i „+ Dodaj miejsca”. */
function naglowek(p, dzis) {
  const status = statusPodrozy(p, dzis);
  return html`
    <header class="naglowek-sekcji">
      <a class="btn" href="#/podroze">← Moje podróże</a>
      <div class="naglowek-z-akcja">
        <div class="naglowek-podrozy">
          <p class="status status-${status}">${ETYKIETY_STATUSU[status]}</p>
          <h1 tabindex="-1">${p.nazwa}</h1>
          <p class="wstep">${p.kierunek} · ${zakresDat(p)} · ${tekstDni(liczbaDni(p))} · ${tekstMiejsc(p.punkty.length)}</p>
          ${p.opis ? html`<p class="opis-podrozy">${p.opis}</p>` : ""}
        </div>
        <div class="rzad-przyciskow akcje-podrozy">
          <button type="button" class="btn" data-akcja="edytuj-podroz" data-id="${p.id}">Edytuj podróż</button>
          <button type="button" class="btn glowny" data-akcja="dodaj-miejsca" data-id="${p.id}">+ Dodaj miejsca</button>
        </div>
      </div>
    </header>`;
}

/**
 * E7: plan dni podróży. `dzis` to dzisiejsza data „RRRR-MM-DD” (do statusu).
 * Punkty z dniem spoza zakresu (uszkodzone dane) są w „Do zaplanowania” (stan.js, dzienPunktu).
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
  const dni = Array.from({ length: liczbaDni(p) }, (_, i) => i + 1);
  const doZaplanowania = planDnia(p, 0);
  return html`
    ${naglowek(p, dzis)}
    <div class="plan" data-podroz="${p.id}">
      <section class="karta-planu do-zaplanowania" aria-labelledby="tytul-dnia-0">
        <div class="naglowek-dnia">
          <h2 id="tytul-dnia-0" tabindex="-1">Do zaplanowania <span class="znacznik">${doZaplanowania.length}</span></h2>
        </div>
        ${doZaplanowania.length
          ? html`<ul class="punkty">${doZaplanowania.map((x) => punktDoZaplanowania(p, x, dni))}</ul>`
          : html`<p class="maly muted">${p.punkty.length
            ? "Wszystkie miejsca są przypisane do dni."
            : "Ta podróż nie ma jeszcze miejsc. Dodaj je przyciskiem „+ Dodaj miejsca”."}</p>`}
      </section>
      ${dni.map((n) => {
        const punkty = planDnia(p, n);
        const ostatni = punkty.reduce((maks, x) => Math.max(maks, x.numer ?? 0), 0);
        return html`
          <section class="karta-planu dzien" style="${kolorDnia(n)}" aria-labelledby="tytul-dnia-${n}">
            <div class="naglowek-dnia">
              <h2 id="tytul-dnia-${n}" tabindex="-1">${nazwaDnia(p, n)}</h2>
              <span class="maly muted">${tekstMiejsc(punkty.length)}</span>
            </div>
            ${punkty.length
              ? html`<ol class="punkty">${punkty.map((x) => punktDnia(p, x, n, ostatni, dni))}</ol>`
              : html`<p class="maly muted">Brak punktów. Przypisz miejsca z listy „Do zaplanowania”.</p>`}
          </section>`;
      })}
    </div>
  `;
}

// ---------- Komunikaty (toast) ----------

/** Po × (F05, pkt 4): przy zapisanym miejscu przypomina, że zostaje w Zapisanych (N2). */
export function komunikatUsunieciaPunktu(nazwa, zapisane) {
  return zapisane
    ? `Usunięto „${nazwa}” z podróży. Miejsce zostaje w Zapisanych.`
    : `Usunięto „${nazwa}” z podróży.`;
}

/** Po „Dodaj (n)” w E8. */
export const komunikatDodaniaMiejsc = (n) => `Dodano ${tekstMiejsc(n)} do listy „Do zaplanowania”.`;
