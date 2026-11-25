// Start aplikacji: wczytanie danych, ostrzeżenia, nawigacja po adresie (#/...), okno szczegółów, tryb deweloperski.
// Widoki (src/widoki/) zwracają HTML z szablonu html``; tylko ten plik wstawia go do strony.
import { html } from "./html.js";
import { wczytaj, zapisz, zatwierdz, atrapaBlokujaca, KOMUNIKATY } from "./magazyn.js";
import { zestawTestowy } from "./dane/zestaw-testowy.js";
import { miejsce } from "./dane/katalog.js";
import { przelaczZapis, czyZapisane, liczbaZapisanych, wPodrozy } from "./stan.js";
import { widokMenu, widokStopki, SEKCJE_MENU } from "./widoki/menu.js";
import { widokOdkrywaj } from "./widoki/odkrywaj.js";
import { widokMiejsca } from "./widoki/miejsce.js";
import { widokZapisane, komunikatZapisu } from "./widoki/zapisane.js";

// Sekcje, których ekrany zbudują kolejne karty (F04).
const ZASLEPKI = {
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
let idWOknie = null; // miejsce pokazane w oknie E3

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

/** Zbiór id zapisanych miejsc (wypełnione serca na kartach). */
function zbiorZapisanych() {
  return new Set(stan.zapisane.map((z) => z.miejsce));
}

function widokSekcji({ sekcja, parametr }) {
  if (sekcja === "odkrywaj") return widokOdkrywaj(parametr, zbiorZapisanych());
  if (sekcja === "zapisane") return widokZapisane(stan);
  const z = ZASLEPKI[sekcja];
  return html`<h1>${z.tytul}</h1><p class="muted">${z.opis}</p>`;
}

function render() {
  const adres = biezacyAdres();
  document.getElementById("menu").innerHTML = widokMenu(adres.sekcja, liczbaZapisanych(stan)).toString();
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
  idWOknie = id;
  okno.innerHTML = widokMiejsca(m, czyZapisane(stan, id)).toString();
  okno.showModal(); // fokus trafia na przycisk ×; Esc zamyka okno sam (zdarzenie cancel)
}

okno.addEventListener("close", () => {
  okno.innerHTML = "";
  // Po zapisie w oknie ekran pod spodem jest zbudowany od nowa: szukamy karty tego miejsca jeszcze raz.
  const cel = elementPrzedOknem?.isConnected
    ? elementPrzedOknem
    : document.querySelector(`#widok .jak-link[data-id="${CSS.escape(idWOknie ?? "")}"]`) ?? naglowekEkranu();
  cel?.focus();
  elementPrzedOknem = null;
  idWOknie = null;
});

/** Nagłówek bieżącego ekranu (fokus, gdy element, na którym był, zniknął, np. karta usunięta z Zapisanych). */
function naglowekEkranu() {
  const h1 = document.querySelector("#widok h1");
  if (h1 && !h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
  return h1;
}

// ---------- Zapisywanie miejsc (F02) ----------

let czasKomunikatu;
/** Komunikat (toast) u dołu ekranu, znika po 3,5 s (design.md). Region role="status" czyta go czytnikowi ekranu. */
function pokazKomunikat(tekst) {
  const el = document.getElementById("toast");
  clearTimeout(czasKomunikatu);
  // Ponowne pokazanie przenosi komunikat na wierzch, także nad okno otwarte po nim.
  if (el.matches(":popover-open")) el.hidePopover();
  el.textContent = "";
  el.showPopover();
  el.textContent = tekst; // tekst po pokazaniu, żeby czytnik ekranu go ogłosił
  czasKomunikatu = setTimeout(() => {
    el.hidePopover();
    el.textContent = "";
  }, 3500);
}

function przelaczZapisMiejsca(id, przycisk) {
  const m = miejsce(id);
  if (!m) return;
  const { stan: nowy, zapisano } = przelaczZapis(stan, id, new Date());
  // Błąd zapisu: operacja nie jest przyjęta, serce zostaje bez zmian, bez komunikatu o sukcesie (plan 5.3).
  if (!zatwierdz(pamiec, trwaly, nowy)) {
    pokazKomunikat(KOMUNIKATY.bladZapisu);
    return;
  }
  stan = nowy;

  const wOknie = okno.contains(przycisk);
  const mialFokus = document.activeElement === przycisk;
  render();
  if (okno.open) {
    const przewiniecie = okno.scrollTop;
    okno.innerHTML = widokMiejsca(m, czyZapisane(stan, idWOknie)).toString();
    okno.scrollTop = przewiniecie;
  }
  // Fokus zostaje na tym samym sercu po przebudowie widoku; gdy karta zniknęła (E4), trafia na nagłówek.
  if (mialFokus || wOknie) {
    const kontener = wOknie ? okno : document.getElementById("widok");
    const serce = kontener.querySelector(`[data-akcja="przelacz-zapis"][data-id="${CSS.escape(id)}"]`);
    (serce ?? naglowekEkranu())?.focus();
  }
  pokazKomunikat(komunikatZapisu(m.nazwa, zapisano, wPodrozy(stan, id)));
}

// Kliknięcie w przyciemnione tło trafia w samo <dialog>. W <dialog> trafia jednak też kliknięcie
// w margines elementu wewnątrz okna, dlatego okno zamyka się tylko wtedy, gdy punkt kliknięcia
// leży poza prostokątem okna (weryfikacja F01, W1).
okno.addEventListener("click", (zdarzenie) => {
  if (zdarzenie.target !== okno) return;
  const r = okno.getBoundingClientRect();
  const { clientX: x, clientY: y } = zdarzenie;
  const poza = x < r.left || x > r.right || y < r.top || y > r.bottom;
  if (poza) okno.close();
});

// ---------- Zdarzenia ----------

document.addEventListener("click", (zdarzenie) => {
  const cel = zdarzenie.target.closest("[data-akcja]");
  if (!cel) return;
  const akcja = cel.dataset.akcja;
  if (akcja === "otworz-miejsce") otworzMiejsce(cel.dataset.id, cel);
  else if (akcja === "zamknij-okno") okno.close();
  else if (akcja === "przelacz-zapis") przelaczZapisMiejsca(cel.dataset.id, cel);
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
