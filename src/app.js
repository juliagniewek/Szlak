// Start aplikacji: wczytanie danych, ostrzeżenia, nawigacja po adresie (#/...), tryb deweloperski.
// Ekrany sekcji budują kolejne karty (F01–F06); w F00 każda sekcja ma tylko nagłówek.
import { html } from "./html.js";
import { wczytaj, zapisz, atrapaBlokujaca, KOMUNIKATY } from "./magazyn.js";
import { zestawTestowy } from "./dane/zestaw-testowy.js";

const SEKCJE = {
  odkrywaj: { tytul: "Odkrywaj", opis: "Kierunki i miejsca do zapisania pojawią się tutaj." },
  zapisane: { tytul: "Zapisane", opis: "Tu będą miejsca oznaczone sercem." },
  podroze: { tytul: "Podróże", opis: "Tu będą Twoje podróże i plan dni." }
};
const DOMYSLNA = "odkrywaj";

// Tryb deweloperski: tylko lokalnie i tylko z ?dev w adresie (plan 3.5). Na GitHub Pages się nie włącza.
const parametry = new URLSearchParams(location.search);
const lokalnie = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const trybDev = lokalnie && parametry.has("dev");
const pamiec = trybDev && parametry.has("blokada") ? atrapaBlokujaca() : pobierzLocalStorage();

let { stan, ostrzezenie, trwaly } = wczytaj(pamiec);

function pobierzLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null; // przeglądarka zablokowała dostęp; wczytaj() pokaże ostrzeżenie A5
  }
}

function pokazOstrzezenie(tekst) {
  const el = document.getElementById("ostrzezenie");
  el.textContent = tekst ?? "";
  el.hidden = !tekst;
}

function biezacaSekcja() {
  const nazwa = location.hash.replace(/^#\/?/, "").split("/")[0];
  return SEKCJE[nazwa] ? nazwa : DOMYSLNA;
}

function render() {
  const nazwa = biezacaSekcja();
  const sekcja = SEKCJE[nazwa];
  document.getElementById("widok").innerHTML = html`
    <h1>${sekcja.tytul}</h1>
    <p class="muted">${sekcja.opis}</p>
    ${trybDev ? panelDev() : ""}
  `.toString();
  document.querySelectorAll("[data-sekcja]").forEach((el) => {
    if (el.dataset.sekcja === nazwa) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
}

function panelDev() {
  return html`
    <section class="panel-dev" aria-label="Tryb deweloperski">
      <p class="etykieta">Tryb deweloperski</p>
      <p class="maly">Dane w tej przeglądarce: zapisane miejsca ${stan.zapisane.length} · podróże ${stan.podroze.length}${trwaly ? "" : " (tylko w pamięci)"}.</p>
      <button type="button" class="btn" data-akcja="zestaw-testowy">Załaduj zestaw testowy</button>
    </section>
  `;
}

function zaladujZestaw() {
  const zgoda = window.confirm("Zestaw testowy zastąpi wszystkie dane zapisane w tej przeglądarce. Kontynuować?");
  if (!zgoda) return;
  const nowy = zestawTestowy();
  if (trwaly && !zapisz(pamiec, nowy)) {
    pokazOstrzezenie(KOMUNIKATY.bladZapisu);
    return;
  }
  stan = nowy;
  render();
}

document.addEventListener("click", (zdarzenie) => {
  const cel = zdarzenie.target.closest("[data-akcja]");
  if (!cel) return;
  if (cel.dataset.akcja === "zestaw-testowy" && trybDev) zaladujZestaw();
});
window.addEventListener("hashchange", render);

pokazOstrzezenie(ostrzezenie);
render();
