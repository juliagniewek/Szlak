// Start aplikacji: wczytanie danych, ostrzeżenia, nawigacja po adresie (#/...), okno szczegółów, tryb deweloperski.
// Widoki (src/widoki/) zwracają HTML z szablonu html``; tylko ten plik wstawia go do strony.
import { html } from "./html.js";
import { wczytaj, zapisz, zatwierdz, atrapaBlokujaca, KOMUNIKATY } from "./magazyn.js";
import { zestawTestowy } from "./dane/zestaw-testowy.js";
import { miejsce } from "./dane/katalog.js";
import {
  przelaczZapis, czyZapisane, liczbaZapisanych, wPodrozy, zapisaneMiejsca,
  podroz, podrozeOdNajnowszej, podrozeZMiejscem, nowyIdPodrozy, utworzPodroz, edytujPodroz, usunPodroz, dodajDoPodrozy
} from "./stan.js";
import { walidujPodroz } from "./walidacja.js";
import { dzisiaj } from "./daty.js";
import { widokMenu, widokStopki, SEKCJE_MENU } from "./widoki/menu.js";
import { widokOdkrywaj } from "./widoki/odkrywaj.js";
import { widokMiejsca } from "./widoki/miejsce.js";
import { widokZapisane, wybraneMiejsca, komunikatZapisu } from "./widoki/zapisane.js";
import {
  widokPodroze, widokPodrozy, adresPodrozy, KOMUNIKATY_PODROZY, komunikatEdycji, komunikatUsuniecia,
  pytanieOUsuniecie, komunikatDodania
} from "./widoki/podroze.js";
import { widokFormularzaPodrozy, wartosciNowej, wartosciEdycji } from "./widoki/formularz-podrozy.js";

const DOMYSLNA = "odkrywaj";

// Tryb deweloperski: tylko lokalnie i tylko z ?dev w adresie (plan 3.5). Na GitHub Pages się nie włącza.
const parametry = new URLSearchParams(location.search);
const lokalnie = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const trybDev = lokalnie && parametry.has("dev");
const pamiec = trybDev && parametry.has("blokada") ? atrapaBlokujaca() : pobierzLocalStorage();

let { stan, ostrzezenie, trwaly } = wczytaj(pamiec);

const okno = document.getElementById("okno");
const oknoFormularza = document.getElementById("okno-formularza");
/** Zaznaczone miejsca na E4 (F04). Stan ekranu: nie jest zapisywany. */
let zaznaczone = new Set();
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
  if (sekcja === "zapisane") {
    // Zaznaczenie dotyczy tylko miejsc, które nadal są na E4.
    const naEkranie = new Set(zapisaneMiejsca(stan).map((m) => m.id));
    zaznaczone = new Set([...zaznaczone].filter((id) => naEkranie.has(id)));
    return widokZapisane(stan, zaznaczone);
  }
  // Podróże: lista E6 albo podróż E7 (#/podroze/<id>).
  if (parametr !== null) return widokPodrozy(podroz(stan, parametr), dzisiaj());
  return widokPodroze(stan, dzisiaj());
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
  okno.innerHTML = trescOknaMiejsca(m);
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

/** Treść okna E3 z bieżącym stanem zapisu i podróży. */
function trescOknaMiejsca(m) {
  return widokMiejsca(m, czyZapisane(stan, m.id), podrozeOdNajnowszej(stan), podrozeZMiejscem(stan, m.id)).toString();
}

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
    okno.innerHTML = trescOknaMiejsca(m);
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

// ---------- Podróże (F04) ----------

/** Dane otwartego formularza E5: { tryb, id, miejsca } (miejsca tylko przy nowej podróży). */
let formularz = null;
let elementPrzedFormularzem = null; // tu wraca fokus po zamknięciu formularza
let selektorPowrotu = null; // gdy ten element zniknie po przebudowie ekranu, szukamy go ponownie
let fokusNaNaglowek = false; // po utworzeniu podróży fokus trafia na nagłówek E7

/** Selektor przycisku po data-akcja i data-id, żeby znaleźć go po przebudowie ekranu. */
function selektorPrzycisku(el) {
  const { akcja, id } = el?.dataset ?? {};
  if (!akcja) return null;
  return `[data-akcja="${CSS.escape(akcja)}"]${id ? `[data-id="${CSS.escape(id)}"]` : ""}`;
}

function pokazFormularz(wartosci, bledy = {}, bladOgolny = null) {
  oknoFormularza.innerHTML = widokFormularzaPodrozy({ ...formularz, wartosci, bledy, bladOgolny }).toString();
}

/** Otwiera E5. `miejsca` to miejsca z katalogu do „Do zaplanowania”; `p` to podróż do edycji. */
function otworzFormularz({ miejsca = [], p = null, zrodlo = null }) {
  // Z okna E3 (bez podróży) najpierw zamykamy E3; po E5 fokus wraca na kartę miejsca.
  // Zdarzenie close przychodzi później, dlatego kartę bierzemy z elementPrzedOknem już teraz.
  const powrot = okno.contains(zrodlo) ? elementPrzedOknem : zrodlo;
  if (okno.open) okno.close();
  elementPrzedFormularzem = powrot;
  selektorPowrotu = selektorPrzycisku(powrot);
  formularz = p
    ? { tryb: "edycja", id: p.id, miejsca: [] }
    : { tryb: "nowa", id: nowyIdPodrozy(new Date()), miejsca };
  pokazFormularz(p ? wartosciEdycji(p) : wartosciNowej(miejsca));
  oknoFormularza.showModal();
  oknoFormularza.querySelector("#pole-nazwa")?.focus();
}

oknoFormularza.addEventListener("close", () => {
  oknoFormularza.innerHTML = "";
  formularz = null;
  // Po utworzeniu podróży fokus ustawia hashchange na nagłówku E7.
  if (!fokusNaNaglowek) {
    const cel = elementPrzedFormularzem?.isConnected
      ? elementPrzedFormularzem
      : (selektorPowrotu && document.querySelector(`#widok ${selektorPowrotu}`)) ?? naglowekEkranu();
    cel?.focus();
  }
  elementPrzedFormularzem = null;
  selektorPowrotu = null;
});

/** Pola formularza E5 jako teksty (do walidacji i do ponownego pokazania po błędzie). */
function polaFormularza(form) {
  const dane = new FormData(form);
  const pole = (n) => String(dane.get(n) ?? "");
  return {
    nazwa: pole("nazwa"), kierunek: pole("kierunek"), start: pole("start"),
    koniec: pole("koniec"), dniSzkicu: pole("dniSzkicu"), opis: pole("opis")
  };
}

function wyslijFormularzPodrozy(form) {
  if (!formularz || form.dataset.id !== formularz.id) return; // np. drugie kliknięcie po zamknięciu okna
  const pola = polaFormularza(form);
  const { bledy, dane } = walidujPodroz(pola);
  if (!dane) {
    pokazFormularz(pola, bledy);
    // Fokus na pierwsze pole z błędem; komunikat jest przy nim (aria-describedby).
    oknoFormularza.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  if (formularz.tryb === "nowa") {
    const { stan: nowy, utworzono } = utworzPodroz(stan, dane, {
      id: formularz.id, teraz: new Date(), miejsca: formularz.miejsca.map((m) => m.id)
    });
    if (!utworzono) return; // ta podróż już powstała (podwójne kliknięcie)
    if (!zatwierdz(pamiec, trwaly, nowy)) {
      // Błąd zapisu: formularz zostaje z wpisanymi danymi, bez komunikatu o sukcesie.
      pokazFormularz(pola, {}, KOMUNIKATY.bladZapisu);
      return;
    }
    stan = nowy;
    if (formularz.miejsca.length) zaznaczone = new Set();
    const cel = adresPodrozy(formularz.id);
    fokusNaNaglowek = true;
    oknoFormularza.close();
    if (location.hash === cel) {
      fokusNaNaglowek = false;
      render();
      naglowekEkranu()?.focus();
    } else {
      location.hash = cel; // hashchange pokaże E7
    }
    pokazKomunikat(KOMUNIKATY_PODROZY.utworzona);
    return;
  }

  const { stan: nowy, wrocilo } = edytujPodroz(stan, formularz.id, dane);
  if (!zatwierdz(pamiec, trwaly, nowy)) {
    pokazFormularz(pola, {}, KOMUNIKATY.bladZapisu);
    return;
  }
  stan = nowy;
  render();
  oknoFormularza.close();
  pokazKomunikat(komunikatEdycji(wrocilo));
}

function usunPodrozZPotwierdzeniem(id) {
  const p = podroz(stan, id);
  if (!p) return;
  // Usunięcia nie da się cofnąć (A7), dlatego pytamy. Anulowanie niczego nie zmienia.
  if (!window.confirm(pytanieOUsuniecie(p.nazwa))) return;
  const nowy = usunPodroz(stan, id);
  if (!zatwierdz(pamiec, trwaly, nowy)) {
    pokazKomunikat(KOMUNIKATY.bladZapisu);
    return;
  }
  stan = nowy;
  render();
  naglowekEkranu()?.focus();
  pokazKomunikat(komunikatUsuniecia(p.nazwa));
}

function dodajMiejsceDoPodrozy(form) {
  const idMiejsca = form.dataset.id;
  const p = podroz(stan, String(new FormData(form).get("podroz") ?? ""));
  const m = miejsce(idMiejsca);
  if (!p || !m) return;
  const { stan: nowy, dodano } = dodajDoPodrozy(stan, p.id, idMiejsca);
  if (dodano) {
    if (!zatwierdz(pamiec, trwaly, nowy)) {
      pokazKomunikat(KOMUNIKATY.bladZapisu);
      return;
    }
    stan = nowy;
    render();
    // Odświeżenie okna: lista „W podróżach”; wybrana podróż i fokus zostają.
    okno.innerHTML = trescOknaMiejsca(m);
    const lista = okno.querySelector("#pole-podroz");
    if (lista) lista.value = p.id;
    okno.querySelector('[data-formularz="dodaj-do-podrozy"] button')?.focus();
  }
  pokazKomunikat(komunikatDodania(p.nazwa, dodano));
}

/** Zaznaczanie na E4: przebudowa ekranu, fokus zostaje na tym samym polu. */
function zaznacz(id, wlacz) {
  if (wlacz) zaznaczone.add(id);
  else zaznaczone.delete(id);
  render();
  document.querySelector(`#widok [data-zmiana="zaznacz"][data-id="${CSS.escape(id)}"]`)?.focus();
}

function zaznaczWszystkie(wszystkie, przycisk) {
  zaznaczone = wszystkie ? new Set(zapisaneMiejsca(stan).map((m) => m.id)) : new Set();
  const selektor = selektorPrzycisku(przycisk);
  render();
  // „Odznacz” jest wyłączony przy zerze, wtedy fokus idzie na „Zaznacz wszystkie”.
  const cel = document.querySelector(`#widok ${selektor}:not(:disabled)`)
    ?? document.querySelector('#widok [data-akcja="zaznacz-wszystkie"]');
  cel?.focus();
}

oknoFormularza.addEventListener("click", (zdarzenie) => {
  if (zdarzenie.target !== oknoFormularza) return;
  const r = oknoFormularza.getBoundingClientRect();
  const { clientX: x, clientY: y } = zdarzenie;
  if (x < r.left || x > r.right || y < r.top || y > r.bottom) oknoFormularza.close();
});

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
  else if (akcja === "nowa-podroz") {
    const m = cel.dataset.id ? miejsce(cel.dataset.id) : null;
    otworzFormularz({ miejsca: m ? [m] : [], zrodlo: cel });
  } else if (akcja === "podroz-z-wybranych") otworzFormularz({ miejsca: wybraneMiejsca(stan, zaznaczone), zrodlo: cel });
  else if (akcja === "edytuj-podroz") {
    const p = podroz(stan, cel.dataset.id);
    if (p) otworzFormularz({ p, zrodlo: cel });
  } else if (akcja === "usun-podroz") usunPodrozZPotwierdzeniem(cel.dataset.id);
  else if (akcja === "zamknij-formularz") oknoFormularza.close();
  else if (akcja === "zaznacz-wszystkie") zaznaczWszystkie(true, cel);
  else if (akcja === "odznacz") zaznaczWszystkie(false, cel);
  else if (akcja === "zestaw-testowy" && trybDev) zaladujZestaw();
});

// Pola wyboru i listy (F04): zaznaczanie miejsc na E4, wybór kierunku z listy w E5.
document.addEventListener("change", (zdarzenie) => {
  const cel = zdarzenie.target.closest("[data-zmiana]");
  if (!cel) return;
  if (cel.dataset.zmiana === "zaznacz") zaznacz(cel.dataset.id, cel.checked);
  else if (cel.dataset.zmiana === "wybierz-kierunek" && cel.value) {
    // Wybór z listy wpisuje kierunek do pola (F04, pkt 3).
    const pole = oknoFormularza.querySelector("#pole-kierunek");
    if (pole) pole.value = cel.value;
  }
});

// Formularze: E5 (podróż) i „Dodaj do podróży” w E3. Strona nigdzie ich nie wysyła (CSP: form-action 'none').
document.addEventListener("submit", (zdarzenie) => {
  const form = zdarzenie.target;
  if (!form.dataset.formularz) return;
  zdarzenie.preventDefault();
  if (form.dataset.formularz === "podroz") wyslijFormularzPodrozy(form);
  else if (form.dataset.formularz === "dodaj-do-podrozy") dodajMiejsceDoPodrozy(form);
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
  if (oknoFormularza.open) oknoFormularza.close();
  render();
  window.scrollTo(0, 0);
  if (fokusNaNaglowek) {
    fokusNaNaglowek = false;
    naglowekEkranu()?.focus();
  }
});

pokazOstrzezenie(ostrzezenie);
render();
