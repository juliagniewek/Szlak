// E7 Podróż: plan dni (F05) i panel mapy (F06). Nagłówek podróży, lista „Do zaplanowania”, karty dni, mapa.
// Zmiany planu (listy i przyciski) obsługuje app.js przez data-akcja i data-zmiana;
// operacje na danych są w stan.js (przypiszDoDnia, przesun, przeniesDoDnia, usunPunkt, dodajPunkty),
// rzut współrzędnych w mapa.js.
import { html } from "../html.js";
import { KATEGORIE } from "../dane/katalog.js";
import { planDnia } from "../stan.js";
import { SZEROKOSC, WYSOKOSC, pokazMapy, wpisyMapy, danePanelu } from "../mapa.js";
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

// ---------- Panel mapy (F06) ----------

/** Stan ekranu E7, który trzyma app.js; nie jest zapisywany (F06: wybór dnia nie jest zapamiętywany). */
export const EKRAN_PODROZY = Object.freeze({ pokaz: "wszystko", aktywny: null, panel: "plan" });

export const OPIS_MAPY = "Mapa schematyczna bez podkładu. Trasa łączy punkty liniami prostymi w kolejności z planu, "
  + "osobno dla każdego dnia. Odległości i czasy przejazdu nie są wyznaczane.";
export const BRAK_PUNKTOW_NA_MAPIE = "Brak punktów do pokazania na mapie";
export const brakWspolrzednych = (nazwy) => `Brak współrzędnych, więc nie pokazano na mapie: ${nazwy.join(", ")}.`;

/** Położenie w procentach panelu (pinezki to przyciski HTML nad rysunkiem SVG o tych samych proporcjach). */
const procent = (v, calosc) => `${((v / calosc) * 100).toFixed(2)}%`;

/** Siatka co 40 jednostek: tło schematu bez podkładu. */
function siatka() {
  const linie = [];
  for (let x = 40; x < SZEROKOSC; x += 40) linie.push(html`<line x1="${x}" y1="0" x2="${x}" y2="${WYSOKOSC}"/>`);
  for (let y = 40; y < WYSOKOSC; y += 40) linie.push(html`<line x1="0" y1="${y}" x2="${SZEROKOSC}" y2="${y}"/>`);
  return html`<g class="siatka">${linie}</g>`;
}

/** Linia trasy jednego dnia: punkty w kolejności planu, kolor dnia. */
function trasa({ dzien, punkty }) {
  const wsp = punkty.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return html`<polyline class="trasa" data-dzien="${dzien}" points="${wsp}" style="stroke: var(--dzien-${((dzien - 1) % KOLORY_DNI) + 1})" vector-effect="non-scaling-stroke"/>`;
}

/** Opis pinezki dla czytnika ekranu. */
const opisPinezki = (x) => (x.dzien ? `Dzień ${x.dzien}, punkt ${x.numer}: ${x.nazwa}` : `Do zaplanowania: ${x.nazwa}`);

/** Kółko z numerem w kolorze dnia albo puste kółko „Do zaplanowania” (bez klasy `pusty`, learning z MVP-1). */
const kolko = (x) => (x.dzien
  ? html`<span class="numer" aria-hidden="true">${x.numer}</span>`
  : html`<span class="numer kolko-puste" aria-hidden="true"></span>`);

/** Strona podpisu aktywnej pinezki, żeby nazwa przy krawędzi nie wychodziła poza panel. */
function stronaPodpisu({ x, y }) {
  const poziomo = x < SZEROKOSC * 0.3 ? " od-lewej" : x > SZEROKOSC * 0.7 ? " od-prawej" : "";
  return `podpis-pinezki${poziomo}${y < WYSOKOSC * 0.25 ? " pod" : ""}`;
}

/** Pinezka: przycisk (Tab, Enter), kółko dnia z numerem z planu (N3); aktywna ma podpis z nazwą. */
function pinezka(x, aktywny) {
  const akt = x.id === aktywny;
  const styl = `left: ${procent(x.x, SZEROKOSC)}; top: ${procent(x.y, WYSOKOSC)};${x.dzien ? ` ${kolorDnia(x.dzien)}` : ""}`;
  return html`<button type="button" class="pinezka${akt ? " aktywna" : ""}" data-akcja="podswietl" data-klucz="${x.id}"
      style="${styl}" aria-pressed="${akt ? "true" : "false"}" aria-label="${opisPinezki(x)}">${kolko(x)}${akt
      ? html`<span class="${stronaPodpisu(x)}" aria-hidden="true">${x.nazwa}</span>` : ""}</button>`;
}

/** Punkt na liście pod mapą; kliknięcie podświetla jego pinezkę. */
function punktListy(x, aktywny, wszystko) {
  const akt = x.id === aktywny;
  const dopisek = !wszystko ? "" : x.dzien ? `Dzień ${x.dzien}` : "Do zaplanowania";
  return html`<li><button type="button" class="punkt-mapy${akt ? " aktywny" : ""}" data-akcja="podswietl" data-klucz="${x.id}"
      aria-pressed="${akt ? "true" : "false"}"${x.dzien ? html` style="${kolorDnia(x.dzien)}"` : ""}>${kolko(x)}
      <span>${x.dzien ? html`<span class="sr">Punkt ${x.numer}: </span>` : ""}${x.nazwa}${dopisek
        ? html` <span class="maly muted">· ${dopisek}</span>` : ""}</span></button></li>`;
}

/**
 * Zawartość panelu mapy (F06): wybór „Pokaż”, schemat z siatką, północą, trasami i pinezkami,
 * opis mapy, punkty bez współrzędnych i lista pokazanych punktów.
 * `wpisy` można podać w testach (np. punkt bez współrzędnych, F06-KA5); domyślnie z planu podróży.
 */
export function panelMapy(p, ekran = EKRAN_PODROZY, wpisy = null) {
  const pokaz = pokazMapy(p, ekran.pokaz);
  const wszystko = pokaz === "wszystko";
  const { pinezki, trasy, brak } = danePanelu(wpisy ?? wpisyMapy(p, pokaz));
  const dni = Array.from({ length: liczbaDni(p) }, (_, i) => i + 1);
  return html`
    <div class="naglowek-mapy">
      <h2 id="tytul-mapy">Mapa</h2>
      <label class="pokaz" for="pokaz-mapa">Pokaż
        <select id="pokaz-mapa" data-zmiana="pokaz-mapa">
          <option value="wszystko"${wszystko ? html` selected` : ""}>Cała podróż</option>
          ${dni.map((n) => html`<option value="${n}"${pokaz === n ? html` selected` : ""}>${nazwaDnia(p, n)}</option>`)}
        </select>
      </label>
    </div>
    <div class="mapa" role="group" aria-label="Mapa schematyczna: ${wszystko ? "Cała podróż" : `Dzień ${pokaz}`}">
      <svg viewBox="0 0 ${SZEROKOSC} ${WYSOKOSC}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        ${siatka()}
        ${trasy.map(trasa)}
      </svg>
      <span class="polnoc" aria-hidden="true">N ↑</span>
      ${pinezki.length
        ? pinezki.map((x) => pinezka(x, ekran.aktywny))
        : html`<p class="mapa-pusta">${BRAK_PUNKTOW_NA_MAPIE}</p>`}
    </div>
    <p class="maly muted opis-mapy">${OPIS_MAPY}</p>
    ${brak.length ? html`<p class="maly brak-wspolrzednych">${brakWspolrzednych(brak)}</p>` : ""}
    ${pinezki.length
      ? html`<ol class="lista-mapy" aria-label="Punkty na mapie">${pinezki.map((x) => punktListy(x, ekran.aktywny, wszystko))}</ol>`
      : ""}`;
}

/**
 * E7: plan dni podróży i panel mapy. `dzis` to dzisiejsza data „RRRR-MM-DD” (do statusu),
 * `ekran` to stan ekranu z app.js (wybór „Pokaż”, podświetlona pinezka, zakładka na telefonie).
 * Punkty z dniem spoza zakresu (uszkodzone dane) są w „Do zaplanowania” (stan.js, dzienPunktu).
 */
export function widokPodrozy(p, dzis, ekran = EKRAN_PODROZY) {
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
  const panel = ekran.panel === "mapa" ? "mapa" : "plan";
  return html`
    ${naglowek(p, dzis)}
    <div class="przelacznik-panelu" role="group" aria-label="Widok podróży">
      <button type="button" data-akcja="pokaz-panel" data-panel="plan" aria-pressed="${panel === "plan" ? "true" : "false"}">Plan dni</button>
      <button type="button" data-akcja="pokaz-panel" data-panel="mapa" aria-pressed="${panel === "mapa" ? "true" : "false"}">Mapa</button>
    </div>
    <div class="podroz-uklad" data-panel="${panel}" data-podroz="${p.id}">
    <div class="plan">
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
    <section class="karta-planu panel-mapy" id="panel-mapy" aria-labelledby="tytul-mapy">${panelMapy(p, ekran)}</section>
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
