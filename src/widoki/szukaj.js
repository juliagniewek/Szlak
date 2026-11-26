// E2 Szukaj (F03): pole wyszukiwania, filtry, liczba wyników, karty i stan pusty.
// Dopasowanie i filtry liczy src/szukaj.js; stan ekranu trzyma app.js (nie jest zapisywany).
import { html } from "../html.js";
import { KATEGORIE } from "../dane/katalog.js";
import { tekstMiejsc } from "../daty.js";
import { wynikiSzukania, kraje, miasta, SORTOWANIA } from "../szukaj.js";
import { siatka } from "./odkrywaj.js";

/** Podpowiedzi haseł w stanie pustym (jak w prototypie). */
export const PODPOWIEDZI = ["Rzym", "kawiarnia", "natura", "Lizbona", "punkt widokowy"];

function opcja(wartosc, podpis, wybrana) {
  return html`<option value="${wartosc}"${wartosc === wybrana ? html` selected` : ""}>${podpis}</option>`;
}

/** Lista wyboru filtra z „Wszystkie” na początku. `opcje`: [[wartość, podpis]]. */
function filtr(klucz, podpis, opcje, wybrana, zWszystkimi = true) {
  return html`
    <div class="pole">
      <label for="filtr-${klucz}">${podpis}</label>
      <select id="filtr-${klucz}" data-zmiana="filtr" data-klucz="${klucz}">
        ${zWszystkimi ? opcja("", "Wszystkie", wybrana) : ""}
        ${opcje.map(([w, p]) => opcja(w, p, wybrana))}
      </select>
    </div>`;
}

/** Karty wyników albo stan pusty. `wyniki` z wynikiSzukania(); wstawiane od nowa przy każdej zmianie. */
export function listaWynikow(wyniki, zapisane = new Set()) {
  if (wyniki.length) return siatka(wyniki, zapisane);
  return html`
    <div class="pusty">
      <h2>Nic nie znaleźliśmy</h2>
      <p class="muted">Sprawdź pisownię albo zmień filtry. Spróbuj na przykład:</p>
      <ul class="chipy">
        ${PODPOWIEDZI.map((p) => html`<li><button type="button" class="chip" data-akcja="podpowiedz" data-fraza="${p}">${p}</button></li>`)}
      </ul>
      <button type="button" class="btn" data-akcja="wyczysc-szukanie">Wyczyść wyszukiwanie i filtry</button>
    </div>`;
}

/** Liczba wyników nad kartami, np. „9 miejsc” (F03, pkt 3). */
export const tekstLiczbyWynikow = (wyniki) => tekstMiejsc(wyniki.length);

/** E2. `s`: { fraza, kategoria, kraj, miasto, sortowanie }; `zapisane`: zbiór id zapisanych miejsc. */
export function widokSzukaj(s, zapisane = new Set()) {
  const wyniki = wynikiSzukania(s);
  return html`
    <header class="naglowek-sekcji">
      <p class="etykieta">Szukaj</p>
      <h1 tabindex="-1">Znajdź miejsce</h1>
    </header>
    <form class="filtry" role="search" aria-label="Wyszukiwanie i filtry" data-formularz="szukaj">
      <div class="pole">
        <label for="pole-szukaj">Szukaj</label>
        <input type="search" id="pole-szukaj" data-wpis="szukaj" value="${s.fraza}" autocomplete="off"
          placeholder="Nazwa, miasto, kraj lub kategoria">
      </div>
      ${filtr("kategoria", "Kategoria", Object.entries(KATEGORIE).map(([id, k]) => [id, k.etykieta]), s.kategoria)}
      ${filtr("kraj", "Kraj", kraje().map((k) => [k, k]), s.kraj)}
      ${filtr("miasto", "Miasto lub region", miasta(s.kraj).map((m) => [m, m]), s.miasto)}
      ${filtr("sortowanie", "Sortuj", Object.entries(SORTOWANIA), s.sortowanie, false)}
    </form>
    <!-- Liczba wyników jest stałym regionem role="status", więc czytnik ekranu ogłasza ją po każdej zmianie. -->
    <p id="liczba-wynikow" class="liczba-wynikow" role="status">${tekstLiczbyWynikow(wyniki)}</p>
    <div id="wyniki-szukania">${listaWynikow(wyniki, zapisane)}</div>
  `;
}
