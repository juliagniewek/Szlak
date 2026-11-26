// E8 Dodaj miejsca (F05): treść okna <dialog id="okno-dodawania"> z index.html.
// Lista katalogu z wyszukiwaniem, zapisane miejsca (♥) na górze, miejsca już w podróży zaznaczone
// i nieaktywne, przycisk „Dodaj (n)”. Wybór i wpisany tekst trzyma app.js; dodaje stan.js (dodajPunkty).
import { html } from "../html.js";
import { MIEJSCA, KATEGORIE } from "../dane/katalog.js";
import { czyZapisane } from "../stan.js";

/** Tekst do porównania: małe litery, bez polskich znaków i akcentów („Łódź” → „lodz”). */
export function normalizuj(tekst) {
  return String(tekst)
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Miejsca do listy E8: każde słowo frazy musi wystąpić w nazwie, mieście, kraju albo kategorii
 * (jak w prototypie). Najpierw zapisane, potem alfabetycznie.
 * Zwraca [{ miejsce, zapisane, wPodrozy }].
 */
export function miejscaDoDodania(stan, p, fraza = "") {
  const slowa = normalizuj(fraza).split(/\s+/).filter(Boolean);
  const wPodrozy = new Set(p.punkty.map((pk) => pk.miejsce));
  return MIEJSCA
    .filter((m) => {
      const tekst = normalizuj(`${m.nazwa} ${m.miasto} ${m.kraj} ${KATEGORIE[m.kategoria].etykieta}`);
      return slowa.every((s) => tekst.includes(s));
    })
    .map((m) => ({ miejsce: m, zapisane: czyZapisane(stan, m.id), wPodrozy: wPodrozy.has(m.id) }))
    .sort((a, b) => Number(b.zapisane) - Number(a.zapisane) || a.miejsce.nazwa.localeCompare(b.miejsce.nazwa, "pl"));
}

/** Lista z polami wyboru. `wybrane`: Set id miejsc wybranych w tym oknie. */
export function listaDodawania(stan, p, fraza, wybrane) {
  const lista = miejscaDoDodania(stan, p, fraza);
  if (!lista.length) return html`<p class="muted">Brak wyników.</p>`;
  return html`
    <ul class="lista-wyboru">
      ${lista.map(({ miejsce: m, zapisane, wPodrozy }) => html`
        <li>
          <label class="${wPodrozy ? "wybor nieaktywny" : "wybor"}">
            <input type="checkbox" data-zmiana="wybierz-miejsce" data-id="${m.id}"${wPodrozy || wybrane.has(m.id) ? html` checked` : ""}${wPodrozy ? html` disabled` : ""}>
            <span>
              ${zapisane ? html`<span class="serduszko" aria-hidden="true">♥ </span><span class="sr">Zapisane: </span>` : ""}${m.nazwa}
              <span class="maly muted">· ${m.miasto}${wPodrozy ? " · już w podróży" : ""}</span>
            </span>
          </label>
        </li>`)}
    </ul>`;
}

/** Przyciski u dołu okna: „Dodaj (n)” (nieaktywny przy zerze) i „Anuluj”. */
export function przyciskiDodawania(idPodrozy, liczba) {
  return html`
    <button type="button" class="btn glowny" data-akcja="potwierdz-dodawanie" data-id="${idPodrozy}"${liczba ? "" : html` disabled`}>Dodaj (${liczba})</button>
    <button type="button" class="btn" data-akcja="zamknij-dodawanie">Anuluj</button>`;
}

/** Cała treść okna E8. */
export function widokDodawania(stan, p, fraza = "", wybrane = new Set()) {
  return html`
    <button type="button" class="przycisk-ikona zamknij" data-akcja="zamknij-dodawanie" aria-label="Zamknij">×</button>
    <div class="okno-tresc dodawanie">
      <p class="etykieta">${p.nazwa}</p>
      <h2 id="dodawanie-tytul">Dodaj miejsca</h2>
      <p class="maly muted">Zapisane miejsca (♥) są na górze listy. Dodane trafią do „Do zaplanowania”.</p>
      <div class="pole">
        <label for="pole-szukaj-dodawanie">Szukaj w katalogu</label>
        <input type="search" id="pole-szukaj-dodawanie" data-wpis="szukaj-dodawanie" value="${fraza}" autocomplete="off"
          placeholder="np. Rzym, kawiarnia">
      </div>
      <div id="lista-dodawania">${listaDodawania(stan, p, fraza, wybrane)}</div>
      <div class="okno-akcje" id="akcje-dodawania">${przyciskiDodawania(p.id, wybrane.size)}</div>
    </div>`;
}
