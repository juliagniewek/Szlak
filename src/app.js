// Start aplikacji: wczytanie danych, ostrzeżenia, nawigacja po adresie (#/...), okno szczegółów, tryb deweloperski.
// Widoki (src/widoki/) zwracają HTML z szablonu html``; tylko ten plik wstawia go do strony.
import { html } from "./html.js";
import { wczytaj, zapisz, atrapaBlokujaca, KOMUNIKATY } from "./magazyn.js";
import { zestawTestowy } from "./dane/zestaw-testowy.js";
import { miejsce } from "./dane/katalog.js";
import { widokMenu, widokStopki, SEKCJE_MENU } from "./widoki/menu.js";
import { widokOdkrywaj } from "./widoki/odkrywaj.js";
import { widokMiejsca } from "./widoki/miejsce.js";

// Sekcje, których ekrany zbudują kolejne karty (F02, F04).
const ZASLEPKI = {
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

const okno = document.getElementById("okno");
let elementPrzedOknem = null; // tu wraca fokus po zamknięciu okna

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

/** Adres #/odkrywaj/Lizbona → { sekcja: "odkrywaj", reszta: "Lizbona" }. Nieznana sekcja → Odkrywaj. */
function biezacyAdres() {
  const [nazwa, ...reszta] = location.hash.replace(/^#\/?/, "").split("/");
  const znana = SEKCJE_MENU.some((s) => s.id === nazwa);
  let parametr = null;
  if (znana && reszta.length && reszta[0] !== "") {
    try {
      parametr = decodeURIComponent(reszta.join("/"));
    } catch {
      parametr = null; // zepsuty adres → zwykły ekran sekcji
    }
  }
  return { sekcja: znana ? nazwa : DOMYSLNA, parametr };
}

function widokSekcji({ sekcja, parametr }) {
  if (sekcja === "odkrywaj") return widokOdkrywaj(parametr);
  const z = ZASLEPKI[sekcja];
  return html`<h1>${z.tytul}</h1><p class="muted">${z.opis}</p>`;
}

function render() {
  const adres = biezacyAdres();
  document.getElementById("menu").innerHTML = widokMenu(adres.sekcja).toString();
  document.getElementById("widok").innerHTML = html`
    ${widokSekcji(adres)}
    ${trybDev ? panelDev() : ""}
  `.toString();
  document.getElementById("stopka").innerHTML = widokStopki().toString();
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

// ---------- Okno szczegółów miejsca (E3) ----------

function otworzMiejsce(id, zrodlo) {
  const m = miejsce(id);
  if (!m) return;
  // Fokus wraca na nazwę w karcie (zdjęcie w karcie nie jest osiągalne klawiszem Tab).
  elementPrzedOknem = zrodlo.closest("article")?.querySelector(".jak-link") ?? zrodlo;
  okno.innerHTML = widokMiejsca(m).toString();
  okno.showModal(); // fokus trafia na przycisk ×; Esc zamyka okno sam (zdarzenie cancel)
}

okno.addEventListener("close", () => {
  okno.innerHTML = "";
  if (elementPrzedOknem?.isConnected) elementPrzedOknem.focus();
  elementPrzedOknem = null;
});

// Kliknięcie poza oknem trafia w samo <dialog> (jego tło), bo treść wypełnia okno bez marginesu.
okno.addEventListener("click", (zdarzenie) => {
  if (zdarzenie.target === okno) okno.close();
});

// ---------- Zdarzenia ----------

document.addEventListener("click", (zdarzenie) => {
  const cel = zdarzenie.target.closest("[data-akcja]");
  if (!cel) return;
  const akcja = cel.dataset.akcja;
  if (akcja === "otworz-miejsce") otworzMiejsce(cel.dataset.id, cel);
  else if (akcja === "zamknij-okno") okno.close();
  else if (akcja === "zestaw-testowy" && trybDev) zaladujZestaw();
});

// Zdjęcie, które się nie wczytało (brak internetu, plik usunięty z Commons), znika i zostaje gradient z ikoną (A4).
// Nasłuch zamiast onerror w HTML, bo CSP blokuje skrypty wpisane w atrybuty.
document.addEventListener("error", (zdarzenie) => {
  if (zdarzenie.target instanceof HTMLImageElement && zdarzenie.target.hasAttribute("data-zdjecie")) {
    zdarzenie.target.remove();
  }
}, true);

window.addEventListener("hashchange", () => {
  if (okno.open) okno.close();
  render();
  window.scrollTo(0, 0);
});

pokazOstrzezenie(ostrzezenie);
render();
