// Start aplikacji: wczytanie danych, ostrzeżenia, nawigacja po adresie (#/...), okna (E3, E5, E8),
// zmiany planu dni (F05), panel mapy (F06), wyszukiwanie i filtry (F03), tryb deweloperski.
// Widoki (src/widoki/) zwracają HTML z szablonu html``; tylko ten plik wstawia go do strony.
import { html } from "./html.js";
import { wczytaj, zapisz, zatwierdz, atrapaBlokujaca, KOMUNIKATY } from "./magazyn.js";
import { zestawTestowy } from "./dane/zestaw-testowy.js";
import { miejsce } from "./dane/katalog.js";
import {
  przelaczZapis, czyZapisane, liczbaZapisanych, wPodrozy, zapisaneMiejsca,
  podroz, podrozeOdNajnowszej, podrozeZMiejscem, nowyIdPodrozy, utworzPodroz, edytujPodroz, usunPodroz, dodajDoPodrozy,
  przypiszDoDnia, przeniesDoDnia, przesun, usunPunkt, dodajPunkty
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
import { komunikatUsunieciaPunktu, komunikatDodaniaMiejsc, NIEDOSTEPNE, EKRAN_PODROZY, panelMapy } from "./widoki/plan.js";
import { przelaczPodswietlenie } from "./mapa.js";
import { widokDodawania, listaDodawania, przyciskiDodawania } from "./widoki/dodaj-miejsca.js";
import { widokSzukaj, listaWynikow, tekstLiczbyWynikow } from "./widoki/szukaj.js";
import { wynikiSzukania, pustyStanSzukania, zmienFiltr, wyczysc } from "./szukaj.js";

const DOMYSLNA = "odkrywaj";

// Tryb deweloperski: tylko lokalnie i tylko z ?dev w adresie (plan 3.5). Na GitHub Pages się nie włącza.
const parametry = new URLSearchParams(location.search);
const lokalnie = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const trybDev = lokalnie && parametry.has("dev");
const pamiec = trybDev && parametry.has("blokada") ? atrapaBlokujaca() : pobierzLocalStorage();

let { stan, ostrzezenie, trwaly } = wczytaj(pamiec);

const okno = document.getElementById("okno");
const oknoFormularza = document.getElementById("okno-formularza");
const oknoDodawania = document.getElementById("okno-dodawania");
/** Zaznaczone miejsca na E4 (F04). Stan ekranu: nie jest zapisywany. */
let zaznaczone = new Set();
let elementPrzedOknem = null; // tu wraca fokus po zamknięciu okna
let idWOknie = null; // miejsce pokazane w oknie E3
/** Hasło, filtry i sortowanie na E2 (F03). Stan ekranu: nie jest zapisywany; wejście na E2 zaczyna od nowa. */
let szukanie = pustyStanSzukania();
/** Wybór „Pokaż”, podświetlona pinezka i zakładka „Plan dni / Mapa” na E7 (F06). Nie jest zapisywany; wejście na E7 zaczyna od nowa. */
let ekranPodrozy = { ...EKRAN_PODROZY };

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
  if (sekcja === "szukaj") return widokSzukaj(szukanie, zbiorZapisanych());
  if (sekcja === "zapisane") {
    // Zaznaczenie dotyczy tylko miejsc, które nadal są na E4.
    const naEkranie = new Set(zapisaneMiejsca(stan).map((m) => m.id));
    zaznaczone = new Set([...zaznaczone].filter((id) => naEkranie.has(id)));
    return widokZapisane(stan, zaznaczone);
  }
  // Podróże: lista E6 albo podróż E7 (#/podroze/<id>).
  if (parametr !== null) return widokPodrozy(podroz(stan, parametr), dzisiaj(), ekranPodrozy);
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

// ---------- Plan dni (F05) ----------

/** Selektor elementu planu po rodzaju (data-akcja / data-zmiana) i id miejsca. */
const wPlanie = (atrybut, wartosc, id) => `#widok [${atrybut}="${wartosc}"][data-id="${CSS.escape(id)}"]`;

/**
 * Przyjmuje zmianę planu: zapis przez magazyn, przebudowa ekranu, fokus, komunikat.
 * Przy błędzie zapisu stan zostaje poprzedni, a ekran jest budowany od nowa, żeby lista wyboru
 * nie pokazywała dnia, którego nie zapisano (F05: widok pokazuje stan, który naprawdę zapisano).
 * `fokus(udalo)` wybiera element, na który trafia fokus po przebudowie.
 */
function zmienPlan({ stan: nowy, zmieniono }, fokus, komunikat = null) {
  const udalo = zmieniono && zatwierdz(pamiec, trwaly, nowy);
  if (udalo) stan = nowy;
  render();
  (fokus(udalo) ?? naglowekEkranu())?.focus();
  if (zmieniono && !udalo) pokazKomunikat(KOMUNIKATY.bladZapisu);
  else if (udalo && komunikat) pokazKomunikat(komunikat);
}

/** Id podróży, której plan jest na ekranie (E7). */
const podrozPlanu = (el) => el.closest("[data-podroz]")?.dataset.podroz;

/** ↑ / ↓: fokus zostaje na tej samej strzałce przy tym samym punkcie; gdy jest nieaktywna, na drugiej. */
function przesunPunkt(cel, kierunek) {
  const id = cel.dataset.id;
  const [ta, druga] = kierunek < 0 ? ["przesun-wyzej", "przesun-nizej"] : ["przesun-nizej", "przesun-wyzej"];
  zmienPlan(przesun(stan, podrozPlanu(cel), id, kierunek), () =>
    document.querySelector(`${wPlanie("data-akcja", ta, id)}:not(:disabled)`)
      ?? document.querySelector(`${wPlanie("data-akcja", druga, id)}:not(:disabled)`)
      ?? document.querySelector(wPlanie("data-zmiana", "przenies", id)));
}

/** „Przypisz do dnia…” i „Przenieś do…”: fokus idzie za punktem do jego nowego miejsca w planie. */
function zmienDzien(cel) {
  if (cel.value === "") return;
  const id = cel.dataset.id;
  const dzien = Number(cel.value);
  const operacja = cel.dataset.zmiana === "przypisz" ? przypiszDoDnia : przeniesDoDnia;
  const zrodlo = cel.dataset.zmiana;
  zmienPlan(operacja(stan, podrozPlanu(cel), id, dzien), (udalo) => {
    const lista = udalo ? (dzien === 0 ? "przypisz" : "przenies") : zrodlo;
    return document.querySelector(wPlanie("data-zmiana", lista, id));
  });
}

/** ×: punkt znika z podróży, zapis miejsca zostaje (N2). Fokus na × kolejnego punktu tej listy albo na jej nagłówek. */
function usunPunktZPodrozy(cel) {
  const id = cel.dataset.id;
  const sekcja = cel.closest("section")?.getAttribute("aria-labelledby");
  const pozycja = [...(cel.closest(".punkty")?.children ?? [])].indexOf(cel.closest("li"));
  const nazwa = miejsce(id)?.nazwa ?? NIEDOSTEPNE;
  const komunikat = komunikatUsunieciaPunktu(nazwa, czyZapisane(stan, id));
  zmienPlan(usunPunkt(stan, podrozPlanu(cel), id), (udalo) => {
    if (!udalo) return document.querySelector(wPlanie("data-akcja", "usun-punkt", id));
    const przyciski = [...document.querySelectorAll(`#widok section[aria-labelledby="${sekcja}"] [data-akcja="usun-punkt"]`)];
    return przyciski[Math.min(pozycja, przyciski.length - 1)] ?? document.getElementById(sekcja ?? "");
  }, komunikat);
}

// ---------- Mapa trasy (F06) ----------

/**
 * Buduje od nowa tylko panel mapy (plan obok zostaje, przewinięcie też) i ustawia fokus
 * na elemencie z tego samego selektora, bo poprzedni zniknął razem z panelem.
 */
function odswiezMape(cel, selektorFokusu) {
  const p = podroz(stan, podrozPlanu(cel) ?? "");
  const panel = document.getElementById("panel-mapy");
  if (!p || !panel) return;
  panel.innerHTML = panelMapy(p, ekranPodrozy).toString();
  (panel.querySelector(selektorFokusu) ?? panel.querySelector("#pokaz-mapa"))?.focus();
}

/** Pinezka albo punkt listy pod mapą: podświetla pinezkę i punkt listy (F06, pkt 5). Fokus zostaje na klikniętym. */
function podswietl(cel) {
  const klucz = cel.dataset.klucz;
  ekranPodrozy = { ...ekranPodrozy, aktywny: przelaczPodswietlenie(ekranPodrozy.aktywny, klucz) };
  const rodzaj = cel.classList.contains("pinezka") ? ".pinezka" : ".punkt-mapy";
  odswiezMape(cel, `${rodzaj}[data-klucz="${CSS.escape(klucz)}"]`);
}

/** „Pokaż”: Cała podróż albo dzień; podświetlenie znika. Fokus zostaje na liście wyboru. */
function pokazNaMapie(cel) {
  ekranPodrozy = { ...ekranPodrozy, pokaz: cel.value, aktywny: null };
  odswiezMape(cel, "#pokaz-mapa");
}

/** „Plan dni / Mapa” na telefonie: zmienia się widoczna kolumna, fokus zostaje na przycisku. */
function pokazPanel(cel) {
  ekranPodrozy = { ...ekranPodrozy, panel: cel.dataset.panel === "mapa" ? "mapa" : "plan" };
  const uklad = document.querySelector("#widok .podroz-uklad");
  if (!uklad) return;
  uklad.dataset.panel = ekranPodrozy.panel;
  for (const b of document.querySelectorAll('#widok [data-akcja="pokaz-panel"]')) {
    b.setAttribute("aria-pressed", String(b.dataset.panel === ekranPodrozy.panel));
  }
}

// ---------- Dodaj miejsca (E8, F05) ----------

/** Otwarte okno E8: { idPodrozy, fraza, wybrane }. Stan okna, nie jest zapisywany. */
let dodawanie = null;
let selektorPowrotuDodawania = null;

function otworzDodawanie(cel) {
  const p = podroz(stan, cel.dataset.id);
  if (!p) return;
  dodawanie = { idPodrozy: p.id, fraza: "", wybrane: new Set() };
  selektorPowrotuDodawania = selektorPrzycisku(cel);
  oknoDodawania.innerHTML = widokDodawania(stan, p, "", dodawanie.wybrane).toString();
  oknoDodawania.showModal();
  oknoDodawania.querySelector("#pole-szukaj-dodawanie")?.focus();
}

oknoDodawania.addEventListener("close", () => {
  oknoDodawania.innerHTML = "";
  dodawanie = null;
  // Fokus wraca na „+ Dodaj miejsca” (ekran mógł zostać zbudowany od nowa, więc szukamy przycisku ponownie).
  (selektorPowrotuDodawania && document.querySelector(`#widok ${selektorPowrotuDodawania}`) || naglowekEkranu())?.focus();
  selektorPowrotuDodawania = null;
});

/** Wpisywanie w wyszukiwarkę E8: zmienia się tylko lista, pole zostaje z fokusem. */
function szukajWDodawaniu(fraza) {
  const p = dodawanie && podroz(stan, dodawanie.idPodrozy);
  if (!p) return;
  dodawanie.fraza = fraza;
  oknoDodawania.querySelector("#lista-dodawania").innerHTML = listaDodawania(stan, p, fraza, dodawanie.wybrane).toString();
}

function wybierzDoDodania(cel) {
  if (!dodawanie || cel.disabled) return;
  if (cel.checked) dodawanie.wybrane.add(cel.dataset.id);
  else dodawanie.wybrane.delete(cel.dataset.id);
  oknoDodawania.querySelector("#akcje-dodawania").innerHTML =
    przyciskiDodawania(dodawanie.idPodrozy, dodawanie.wybrane.size).toString();
}

function potwierdzDodawanie() {
  if (!dodawanie) return; // np. drugie kliknięcie po zamknięciu okna
  const { stan: nowy, dodano } = dodajPunkty(stan, dodawanie.idPodrozy, [...dodawanie.wybrane]);
  if (dodano && !zatwierdz(pamiec, trwaly, nowy)) {
    // Błąd zapisu: okno zostaje z wyborem, bez komunikatu o sukcesie.
    pokazKomunikat(KOMUNIKATY.bladZapisu);
    return;
  }
  stan = nowy;
  render();
  oknoDodawania.close();
  if (dodano) pokazKomunikat(komunikatDodaniaMiejsc(dodano));
}

// ---------- Szukaj (E2, F03) ----------

/** Wejście na E2: puste hasło i filtry; #/szukaj/<kategoria> (chip na E1) wybiera kategorię. */
function zacznijSzukanie() {
  const adres = biezacyAdres();
  if (adres.sekcja === "szukaj") szukanie = pustyStanSzukania(adres.parametr ?? "");
}

/** Wpisywanie hasła: zmieniają się tylko liczba i karty, pole zostaje z fokusem (F03, pkt 3). */
function szukaj(fraza) {
  szukanie = { ...szukanie, fraza };
  const wyniki = wynikiSzukania(szukanie);
  document.getElementById("liczba-wynikow").textContent = tekstLiczbyWynikow(wyniki);
  document.getElementById("wyniki-szukania").innerHTML = listaWynikow(wyniki, zbiorZapisanych()).toString();
}

/** Zmiana filtra albo sortowania: lista miast zależy od kraju, więc ekran jest budowany od nowa. */
function zmienFiltrSzukania(cel) {
  szukanie = zmienFiltr(szukanie, cel.dataset.klucz, cel.value);
  render();
  document.getElementById(`filtr-${cel.dataset.klucz}`)?.focus();
}

/** Podpowiedź albo „Wyczyść wyszukiwanie i filtry”: nowy stan, fokus w polu hasła. */
function ustawSzukanie(nowy) {
  szukanie = nowy;
  render();
  document.getElementById("pole-szukaj")?.focus();
}

// ---------- Zamykanie okien kliknięciem obok ----------

// Kliknięcie w przyciemnione tło trafia w samo <dialog>. W <dialog> trafia jednak też kliknięcie
// w margines elementu wewnątrz okna, dlatego okno zamyka się tylko wtedy, gdy punkt kliknięcia
// leży poza prostokątem okna (weryfikacja F01, W1).
for (const o of [okno, oknoFormularza, oknoDodawania]) {
  o.addEventListener("click", (zdarzenie) => {
    if (zdarzenie.target !== o) return;
    const r = o.getBoundingClientRect();
    const { clientX: x, clientY: y } = zdarzenie;
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) o.close();
  });
}

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
  // ↑ / ↓: drugie kliknięcie szybkiego dwukliku (detail 2) trafiłoby po przebudowie w strzałkę innego punktu
  // i cofnęło ruch, więc liczy się tylko pierwsze. Klawiatura ma detail 0.
  else if (akcja === "przesun-wyzej" || akcja === "przesun-nizej") {
    if (zdarzenie.detail <= 1) przesunPunkt(cel, akcja === "przesun-wyzej" ? -1 : 1);
  } else if (akcja === "usun-punkt") usunPunktZPodrozy(cel);
  else if (akcja === "dodaj-miejsca") otworzDodawanie(cel);
  else if (akcja === "zamknij-dodawanie") oknoDodawania.close();
  else if (akcja === "potwierdz-dodawanie") potwierdzDodawanie();
  else if (akcja === "podswietl") podswietl(cel);
  else if (akcja === "pokaz-panel") pokazPanel(cel);
  else if (akcja === "podpowiedz") ustawSzukanie({ ...wyczysc(szukanie), fraza: cel.dataset.fraza ?? "" });
  else if (akcja === "wyczysc-szukanie") ustawSzukanie(wyczysc(szukanie));
  else if (akcja === "zestaw-testowy" && trybDev) zaladujZestaw();
});

// Pola wyboru i listy: zaznaczanie miejsc na E4 i kierunek w E5 (F04), dni w planie i wybór w E8 (F05).
document.addEventListener("change", (zdarzenie) => {
  const cel = zdarzenie.target.closest("[data-zmiana]");
  if (!cel) return;
  if (cel.dataset.zmiana === "zaznacz") zaznacz(cel.dataset.id, cel.checked);
  else if (cel.dataset.zmiana === "wybierz-kierunek" && cel.value) {
    // Wybór z listy wpisuje kierunek do pola (F04, pkt 3).
    const pole = oknoFormularza.querySelector("#pole-kierunek");
    if (pole) pole.value = cel.value;
  } else if (cel.dataset.zmiana === "przypisz" || cel.dataset.zmiana === "przenies") zmienDzien(cel);
  else if (cel.dataset.zmiana === "wybierz-miejsce") wybierzDoDodania(cel);
  else if (cel.dataset.zmiana === "filtr") zmienFiltrSzukania(cel);
  else if (cel.dataset.zmiana === "pokaz-mapa") pokazNaMapie(cel);
});

// Wpisywanie w wyszukiwarkę okna E8 (F05) i w pole hasła na E2 (F03).
document.addEventListener("input", (zdarzenie) => {
  const wpis = zdarzenie.target.dataset?.wpis;
  if (wpis === "szukaj-dodawanie") szukajWDodawaniu(zdarzenie.target.value);
  else if (wpis === "szukaj") szukaj(zdarzenie.target.value);
});

// Formularze: E5 (podróż), „Dodaj do podróży” w E3 i wyszukiwanie E2 (Enter niczego nie wysyła).
// Strona nigdzie ich nie wysyła (CSP: form-action 'none').
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
  if (oknoDodawania.open) oknoDodawania.close();
  zacznijSzukanie();
  ekranPodrozy = { ...EKRAN_PODROZY };
  render();
  window.scrollTo(0, 0);
  if (fokusNaNaglowek) {
    fokusNaNaglowek = false;
    naglowekEkranu()?.focus();
  }
});

pokazOstrzezenie(ostrzezenie);
zacznijSzukanie();
render();
