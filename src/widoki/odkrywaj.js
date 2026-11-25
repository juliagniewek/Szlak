// E1 Odkrywaj (F01): kierunki, sekcje według oznaczeń, lista miejsc kierunku, źródła zdjęć (DEC-13).
// Widoki to funkcje „dane → HTML”; kliknięcia obsługuje app.js przez data-akcja i adresy #/...
import { html } from "../html.js";
import { ikona } from "../ikony.js";
import { MIEJSCA, KIERUNKI, KATEGORIE, adresZdjecia, adresStronyPliku } from "../dane/katalog.js";

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

/** Karta miejsca: zdjęcie 16:10, kategoria, nazwa, lokalizacja. Serce w prawym górnym rogu dochodzi w F02. */
export function kartaMiejsca(m) {
  return html`
    <article class="karta-miejsca">
      <button type="button" class="karta-zdjecie" data-akcja="otworz-miejsce" data-id="${m.id}" tabindex="-1" aria-hidden="true">${zdjecieMiejsca(m)}</button>
      <div class="karta-tresc">
        <p class="etykieta">${KATEGORIE[m.kategoria].etykieta}</p>
        <h3><button type="button" class="jak-link" data-akcja="otworz-miejsce" data-id="${m.id}">${m.nazwa}</button></h3>
        <p class="lokalizacja">${m.miasto}, ${m.kraj}</p>
      </div>
    </article>`;
}

function siatka(miejsca) {
  return html`<div class="siatka">${miejsca.map(kartaMiejsca)}</div>`;
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
      <p class="maly muted">Zdjęcia pochodzą z Wikimedia Commons. Odnośnik prowadzi do strony pliku z pełnym opisem licencji.</p>
      <ul>
        ${zrodlaZdjec().map((z) => html`
          <li>${z.podpis}: ${z.zdjecie.autor}, ${z.zdjecie.licencja} ·
            <a href="${adresStronyPliku(z.zdjecie)}" target="_blank" rel="noopener noreferrer">strona pliku</a></li>`)}
      </ul>
    </details>`;
}

/** E1 Odkrywaj. Gdy podano miasto, pokazuje listę wszystkich miejsc tego kierunku. */
export function widokOdkrywaj(miasto = null) {
  return miasto === null ? widokGlowny() : widokKierunku(miasto);
}

function widokGlowny() {
  return html`
    <header class="naglowek-sekcji">
      <p class="etykieta">Odkrywaj</p>
      <h1>Dokąd tym razem?</h1>
      <p class="wstep">Zbieraj miejsca, które Cię inspirują, a potem zamień je w plan wyjazdu.</p>
    </header>
    <section class="sekcja">
      <h2>Wyróżnione kierunki</h2>
      <div class="kierunki">${KIERUNKI.map(kartaKierunku)}</div>
    </section>
    ${SEKCJE_E1.map((s) => html`
      <section class="sekcja">
        <h2>${s.tytul}</h2>
        ${s.opis ? html`<p class="muted">${s.opis}</p>` : ""}
        ${siatka(miejscaSekcji(s.oznaczenie))}
      </section>`)}
    <p class="maly muted podpis-zdjec">Zdjęcia: Wikimedia Commons (licencje Creative Commons i domena publiczna).</p>
    ${widokZrodel()}
  `;
}

function widokKierunku(miasto) {
  const miejsca = miejscaKierunku(miasto);
  return html`
    <header class="naglowek-sekcji">
      <a class="btn" href="#/odkrywaj">← Wszystkie inspiracje</a>
      <p class="etykieta">Odkrywaj</p>
      <h1>Miejsca: ${miasto}</h1>
    </header>
    ${miejsca.length
      ? siatka(miejsca)
      : html`<p class="muted">Nie ma takiego kierunku w katalogu.</p>`}
    ${widokZrodel()}
  `;
}
