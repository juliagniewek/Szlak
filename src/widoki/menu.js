// Układ aplikacji: menu sekcji (F01, W1) i stopka o danych na każdym ekranie (DEC-15).
import { html } from "../html.js";
import { ikona } from "../ikony.js";

/** Sekcje menu w kolejności z design.md (Szukaj od F03). */
export const SEKCJE_MENU = [
  { id: "odkrywaj", tytul: "Odkrywaj", ikona: "kompas" },
  { id: "szukaj", tytul: "Szukaj", ikona: "lupa" },
  { id: "zapisane", tytul: "Zapisane", ikona: "serce" },
  { id: "podroze", tytul: "Podróże", ikona: "walizka" }
];

/** Pozycje menu; tylko aktywna sekcja ma aria-current="page" (wyróżnienie tłem, pogrubieniem i paskiem). */
export function widokMenu(aktywna, liczbaZapisanych = 0) {
  return html`
    <p class="logo">szlak<span>.</span></p>
    ${SEKCJE_MENU.map((s) => html`
      <a class="menu-pozycja" href="#/${s.id}" data-sekcja="${s.id}" style="--sekcja: var(--sekcja-${s.id})"${
        s.id === aktywna ? html` aria-current="page"` : ""}>
        ${ikona(s.ikona)}<span>${s.tytul}${s.id === "zapisane" ? licznik(liczbaZapisanych) : ""}</span>
      </a>`)}
  `;
}

/** Licznik zapisanych miejsc przy „Zapisane” (F02); przy zerze go nie ma, jak w prototypie. */
function licznik(liczba) {
  if (!liczba) return "";
  return html` <span class="licznik"><span class="sr">(zapisane miejsca: </span>${liczba}<span class="sr">)</span></span>`;
}

export const TEKST_STOPKI = "Twoje dane zostają tylko w tej przeglądarce i znikną po jej wyczyszczeniu.";

/** Stopka na dole treści każdej sekcji: informacja o danych i rozwijane „O danych” (DEC-15). */
export function widokStopki() {
  return html`
    <footer class="stopka">
      <p>${TEKST_STOPKI}</p>
      <details class="rozwijane">
        <summary>O danych</summary>
        <ul>
          <li>Zapisane miejsca i podróże są przechowywane tylko w pamięci tej przeglądarki. Aplikacja nie wysyła ich nigdzie i nie ma kont.</li>
          <li>Wyczyszczenie danych przeglądarki usuwa je na stałe. Inna przeglądarka lub inne urządzenie ich nie widzi.</li>
          <li>Stronę udostępnia GitHub (GitHub Pages), który zapisuje adresy IP odwiedzających ze względów bezpieczeństwa.</li>
          <li>Zdjęcia pochodzą z Wikimedia Commons. Przy ich pobieraniu serwery Wikimedia widzą Twój adres IP i adres tej strony.</li>
        </ul>
      </details>
    </footer>
  `;
}
