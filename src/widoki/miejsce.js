// E3 Szczegóły miejsca (F01): treść okna <dialog id="okno"> z index.html.
// Otwieranie, zamykanie (×, Esc, kliknięcie poza oknem) i powrót fokusu obsługuje app.js.
// Serce (przycisk zapisu, F02) jest pod danymi miejsca, pod nim „Dodaj do podróży” (F04).
import { html } from "../html.js";
import { ikona } from "../ikony.js";
import { KATEGORIE, adresStronyPliku } from "../dane/katalog.js";
import { zdjecieMiejsca, nazwaLicencji } from "./odkrywaj.js";

/** Współrzędne w formacie „41.8902, 12.4922”; null, gdy miejsce ich nie ma. */
export function formatWspolrzednych(wsp) {
  if (!wsp) return null;
  return `${wsp[0].toFixed(4)}, ${wsp[1].toFixed(4)}`;
}

/**
 * Podpis zdjęcia „Zdjęcie: autor, licencja” z odnośnikiem do strony pliku na Commons (DEC-13);
 * nazwa licencji prowadzi do jej tekstu (DEC-22).
 */
function podpisZdjecia(zdjecie) {
  if (!zdjecie) return "";
  return html`
    <p class="podpis-zdjecia">Zdjęcie: ${zdjecie.autor}, ${nazwaLicencji(zdjecie.licencja)} ·
      <a href="${adresStronyPliku(zdjecie)}" target="_blank" rel="noopener noreferrer">strona pliku na Wikimedia Commons</a></p>`;
}

/** Przycisk zapisu w E3: serce i tekst; stan zapisu w aria-pressed (F02). */
function przyciskZapisu(m, zapisane) {
  return html`
    <button type="button" class="btn${zapisane ? "" : " glowny"} zapisz" data-akcja="przelacz-zapis" data-id="${m.id}"
      aria-pressed="${zapisane ? "true" : "false"}">${ikona("serce", 18, zapisane)}${zapisane ? "Zapisano · usuń z Zapisanych" : "Zapisz"}</button>`;
}

/**
 * „Dodaj do podróży” (F04, pkt 6): lista podróży i przycisk; miejsce trafia do „Do zaplanowania”.
 * Bez podróży: przycisk „Utwórz podróż” otwiera formularz E5 z tym miejscem.
 * `podroze`: podróże do wyboru (najnowsza pierwsza), `wPodrozach`: podróże, w których miejsce już jest.
 */
function dodajDoPodrozy(m, podroze, wPodrozach) {
  return html`
    <section class="dodaj-do-podrozy" aria-labelledby="dodaj-tytul">
      <h3 id="dodaj-tytul">Dodaj do podróży</h3>
      ${podroze.length
        ? html`
          <form class="rzad-przyciskow" data-formularz="dodaj-do-podrozy" data-id="${m.id}">
            <label class="sr" for="pole-podroz">Podróż</label>
            <select id="pole-podroz" name="podroz">${podroze.map((p) => html`<option value="${p.id}">${p.nazwa}</option>`)}</select>
            <button type="submit" class="btn">Dodaj</button>
          </form>`
        : html`
          <p class="maly muted">Nie masz jeszcze podróży.</p>
          <button type="button" class="btn" data-akcja="nowa-podroz" data-id="${m.id}">Utwórz podróż</button>`}
      ${wPodrozach.length
        ? html`<p class="maly muted">W podróżach: ${wPodrozach.map((p) => `„${p.nazwa}”`).join(", ")}</p>`
        : ""}
    </section>`;
}

/**
 * Treść okna E3. `zapisane` = czy miejsce jest zapisane (F02).
 * `podroze` i `wPodrozach` (F04): podróże do wyboru i te, w których miejsce już jest.
 */
export function widokMiejsca(m, zapisane = false, podroze = [], wPodrozach = []) {
  const kategoria = KATEGORIE[m.kategoria].etykieta;
  const lokalizacja = `${m.miasto}, ${m.kraj}`;
  return html`
    <button type="button" class="przycisk-ikona zamknij" data-akcja="zamknij-okno" aria-label="Zamknij">×</button>
    ${zdjecieMiejsca(m, true)}
    ${podpisZdjecia(m.zdjecie)}
    <div class="okno-tresc">
      <p class="etykieta">${kategoria}</p>
      <h2 id="okno-tytul">${m.nazwa}</h2>
      <p class="muted lokalizacja">${lokalizacja}</p>
      <p>${m.opis}</p>
      <dl class="dane-miejsca">
        <dt>Kategoria</dt><dd>${kategoria}</dd>
        <dt>Lokalizacja</dt><dd>${lokalizacja}</dd>
        <dt>Współrzędne</dt><dd>${formatWspolrzednych(m.wsp) ?? "brak"}</dd>
      </dl>
      <div class="okno-akcje">${przyciskZapisu(m, zapisane)}</div>
      ${dodajDoPodrozy(m, podroze, wPodrozach)}
    </div>
  `;
}
