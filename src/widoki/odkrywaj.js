// E1 Odkrywaj (F01): chipy kategorii (F03), kierunki, sekcje według oznaczeń, lista miejsc kierunku, źródła zdjęć (DEC-13).
// Widoki to funkcje „dane → HTML”; kliknięcia obsługuje app.js przez data-akcja i adresy #/...
import { html } from "../html.js";
import { ikona } from "../ikony.js";
import { MIEJSCA, KIERUNKI, KATEGORIE, adresZdjecia, adresStronyPliku, adresLicencji } from "../dane/katalog.js";

/**
 * Nazwa licencji zdjęcia jako odnośnik do jej tekstu na creativecommons.org (DEC-22);
 * licencja spoza listy w katalogu zostaje zwykłym tekstem. Używa jej też podpis zdjęcia w E3 (miejsce.js).
 */
export function nazwaLicencji(licencja) {
  const adres = adresLicencji(licencja);
  if (!adres) return licencja;
  return html`<a href="${adres}" target="_blank" rel="license noopener noreferrer">${licencja}</a>`;
}

/** Najwięcej kart w jednej sekcji E1. */
export const KART_W_SEKCJI = 8;

const SEKCJE_E1 = [
  { oznaczenie: "popularne", tytul: "Popularne miejsca", opis: "" },
  { oznaczenie: "jesien-zima", tytul: "Na jesień i zimę", opis: "Sezonowe inspiracje na chłodniejsze miesiące." },
  { oznaczenie: "mniej-znane", tytul: "Mniej znane miejsca", opis: "Tam, gdzie zwykle jest mniej turystów." }
];

/** Miejsca z danym oznaczeniem, w kolejności katalogu, najwyżej 8. */
export function miejscaSekcji(oznaczenie) {
  return MIEJSCA.filter((m) => m.oznaczenia.includes(oznaczenie)).slice(0, KART_W_SEKCJI);
}

/** Wszystkie miejsca kierunku (miasta lub regionu) w kolejności katalogu. */
export function miejscaKierunku(miasto) {
  return MIEJSCA.filter((m) => m.miasto === miasto);
}

/** Adres E2 z wybraną kategorią, np. #/szukaj/kawiarnia (F03, pkt 5). */
export function adresKategorii(kategoria) {
  return `#/szukaj/${encodeURIComponent(kategoria)}`;
}

/** Chipy kategorii na E1: kliknięcie otwiera E2 z wybraną kategorią (F03, pkt 5). */
export function chipyKategorii() {
  return html`
    <ul class="chipy">
      ${Object.entries(KATEGORIE).map(([id, k]) => html`
        <li><a class="chip" href="${adresKategorii(id)}">${ikona(k.ikona, 18)}${k.etykieta}</a></li>`)}
    </ul>`;
}

/** Adres listy miejsc kierunku, np. #/odkrywaj/Lizbona. */
export function adresKierunku(miasto) {
  return `#/odkrywaj/${encodeURIComponent(miasto)}`;
}

/**
 * Zdjęcie miejsca: gradient kategorii z ikoną zawsze pod spodem, zdjęcie z Commons na wierzchu.
 * Gdy zdjęcia brak albo się nie wczyta (app.js usuwa <img data-zdjecie> po błędzie), widać gradient i ikonę (A4).
 */
export function zdjecieMiejsca(m, duze = false) {
  const kat = KATEGORIE[m.kategoria];
  const adres = adresZdjecia(m.zdjecie, duze ? 960 : 500);
  return html`
    <div class="zdjecie${duze ? " duze" : ""}" style="background: ${kat.tlo}">
      ${ikona(kat.ikona, duze ? 64 : 44)}
      ${adres ? html`<img src="${adres}" alt="${m.nazwa}" loading="lazy" data-zdjecie>` : ""}
    </div>`;
}

/**
 * Serce na karcie (F02): przycisk-ikona 44×44 px w prawym górnym rogu zdjęcia.
 * Stan zapisu jest w aria-pressed, a podpis stały, więc czytnik ekranu mówi np. „Zapisz: Koloseum, wciśnięty”.
 */
export function serce(m, zapisane) {
  return html`
      <button type="button" class="przycisk-ikona serce" data-akcja="przelacz-zapis" data-id="${m.id}"
        aria-pressed="${zapisane ? "true" : "false"}" aria-label="Zapisz: ${m.nazwa}"
        title="${zapisane ? "Usuń z Zapisanych" : "Zapisz"}">${ikona("serce", 20, zapisane)}</button>`;
}

/**
 * Pole zaznaczenia na karcie (E4, F04): lewy górny róg zdjęcia, obszar kliknięcia 44×44 px.
 * Nazwa miejsca w podpisie dla czytnika ekranu.
 */
function poleZaznaczenia(m, zaznaczone) {
  return html`
      <label class="zaznacz">
        <input type="checkbox" data-zmiana="zaznacz" data-id="${m.id}"${zaznaczone ? html` checked` : ""}>
        <span class="sr">Zaznacz: ${m.nazwa}</span>
      </label>`;
}

/**
 * Karta miejsca: zdjęcie 16:10 z sercem, kategoria, nazwa, lokalizacja. `zapisane` to zbiór id zapisanych miejsc.
 * `zaznaczone` (tylko E4, F04): zbiór id zaznaczonych miejsc; gdy podany, karta ma pole zaznaczenia.
 */
export function kartaMiejsca(m, zapisane = new Set(), zaznaczone = null) {
  const zaznaczona = zaznaczone?.has(m.id) ?? false;
  return html`
    <article class="karta-miejsca${zaznaczona ? " zaznaczona" : ""}">
      <button type="button" class="karta-zdjecie" data-akcja="otworz-miejsce" data-id="${m.id}" tabindex="-1" aria-hidden="true">${zdjecieMiejsca(m)}</button>
      ${serce(m, zapisane.has(m.id))}
      ${zaznaczone ? poleZaznaczenia(m, zaznaczona) : ""}
      <div class="karta-tresc">
        <p class="etykieta">${KATEGORIE[m.kategoria].etykieta}</p>
        <h3><button type="button" class="jak-link" data-akcja="otworz-miejsce" data-id="${m.id}">${m.nazwa}</button></h3>
        <p class="lokalizacja">${m.miasto}, ${m.kraj}</p>
      </div>
    </article>`;
}

/** Siatka kart miejsc. `zaznaczone`: jak w kartaMiejsca (E4). */
export function siatka(miejsca, zapisane = new Set(), zaznaczone = null) {
  return html`<div class="siatka">${miejsca.map((m) => kartaMiejsca(m, zapisane, zaznaczone))}</div>`;
}

function kartaKierunku(k) {
  // Pod zdjęciem gradient kategorii pierwszego miejsca kierunku, gdyby zdjęcie się nie wczytało.
  const pierwsze = miejscaKierunku(k.miasto)[0];
  const tlo = KATEGORIE[pierwsze?.kategoria ?? "miasta"].tlo;
  const adres = adresZdjecia(k.zdjecie, 500);
  return html`
    <a class="kierunek" href="${adresKierunku(k.miasto)}" style="background-image: ${adres ? `url("${adres}"), ` : ""}${tlo}">
      <span class="kierunek-kraj">${k.kraj}</span>
      <span class="kierunek-nazwa">${k.miasto}</span>
      <span class="kierunek-tekst">${k.tekst}</span>
    </a>`;
}

/** Wszystkie zdjęcia katalogu do listy „Źródła zdjęć”: miejsca, potem kierunki. */
export function zrodlaZdjec() {
  return [
    ...MIEJSCA.filter((m) => m.zdjecie).map((m) => ({ podpis: `${m.nazwa} (${m.miasto})`, zdjecie: m.zdjecie })),
    ...KIERUNKI.filter((k) => k.zdjecie).map((k) => ({ podpis: `Kierunek: ${k.miasto}`, zdjecie: k.zdjecie }))
  ];
}

function widokZrodel() {
  return html`
    <details class="rozwijane zrodla">
      <summary>Źródła zdjęć</summary>
      <p class="maly muted">Zdjęcia pochodzą z Wikimedia Commons. Nazwa licencji prowadzi do jej tekstu, a „strona pliku” do opisu zdjęcia na Commons.</p>
      <ul>
        ${zrodlaZdjec().map((z) => html`
          <li>${z.podpis}: ${z.zdjecie.autor}, ${nazwaLicencji(z.zdjecie.licencja)} ·
            <a href="${adresStronyPliku(z.zdjecie)}" target="_blank" rel="noopener noreferrer">strona pliku</a></li>`)}
      </ul>
    </details>`;
}

/**
 * E1 Odkrywaj. Gdy podano miasto, pokazuje listę wszystkich miejsc tego kierunku.
 * `zapisane` to zbiór id zapisanych miejsc (wypełnione serca, F02).
 */
export function widokOdkrywaj(miasto = null, zapisane = new Set()) {
  return miasto === null ? widokGlowny(zapisane) : widokKierunku(miasto, zapisane);
}

function widokGlowny(zapisane) {
  return html`
    <header class="naglowek-sekcji">
      <p class="etykieta">Odkrywaj</p>
      <h1>Dokąd tym razem?</h1>
      <p class="wstep">Zbieraj miejsca, które Cię inspirują, a potem zamień je w plan wyjazdu.</p>
    </header>
    <section class="sekcja">
      <h2>Kategorie</h2>
      ${chipyKategorii()}
    </section>
    <section class="sekcja">
      <h2>Wyróżnione kierunki</h2>
      <div class="kierunki">${KIERUNKI.map(kartaKierunku)}</div>
    </section>
    ${SEKCJE_E1.map((s) => html`
      <section class="sekcja">
        <h2>${s.tytul}</h2>
        ${s.opis ? html`<p class="muted">${s.opis}</p>` : ""}
        ${siatka(miejscaSekcji(s.oznaczenie), zapisane)}
      </section>`)}
    <p class="maly muted podpis-zdjec">Zdjęcia: Wikimedia Commons (licencje Creative Commons i domena publiczna).</p>
    ${widokZrodel()}
  `;
}

function widokKierunku(miasto, zapisane) {
  const miejsca = miejscaKierunku(miasto);
  return html`
    <header class="naglowek-sekcji">
      <a class="btn" href="#/odkrywaj">← Wszystkie inspiracje</a>
      <p class="etykieta">Odkrywaj</p>
      <h1>Miejsca: ${miasto}</h1>
    </header>
    ${miejsca.length
      ? siatka(miejsca, zapisane)
      : html`<p class="muted">Nie ma takiego kierunku w katalogu.</p>`}
    ${widokZrodel()}
  `;
}
