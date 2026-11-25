// E5 Formularz podróży (F04): treść okna <dialog id="okno-formularza"> z index.html.
// Nowa podróż (od zera albo z zaznaczonych miejsc) i edycja. Wysłanie i błędy obsługuje app.js.
import { html } from "../html.js";
import { KIERUNKI } from "../dane/katalog.js";
import { liczbaDni, DOMYSLNE_DNI_SZKICU, MAKS_DNI, tekstMiejsc } from "../daty.js";

/** Kraje kierunków z katalogu (4: Włochy, Portugalia, Polska, Hiszpania), bez powtórzeń. */
export const KRAJE = [...new Set(KIERUNKI.map((k) => k.kraj))];

/**
 * Najczęstsze miasto wśród miejsc (podpowiedź kierunku, F04 pkt 3).
 * Przy remisie wygrywa miasto, które pojawia się pierwsze. Brak miejsc → "".
 */
export function najczestszeMiasto(miejsca) {
  const liczby = new Map();
  for (const m of miejsca) liczby.set(m.miasto, (liczby.get(m.miasto) ?? 0) + 1);
  let najlepsze = "";
  let ile = 0;
  for (const [miasto, n] of liczby) {
    if (n > ile) [najlepsze, ile] = [miasto, n];
  }
  return najlepsze;
}

/** Wartości startowe pól nowej podróży: kierunek z miejsc i nazwa „Wyjazd: [kierunek]”. */
export function wartosciNowej(miejsca = []) {
  const kierunek = najczestszeMiasto(miejsca);
  return {
    nazwa: kierunek ? `Wyjazd: ${kierunek}` : "",
    kierunek,
    start: "",
    koniec: "",
    dniSzkicu: String(DOMYSLNE_DNI_SZKICU),
    opis: ""
  };
}

/** Wartości pól przy edycji podróży. Liczba dni szkicu = obecna liczba dni (gdy ktoś usunie daty). */
export function wartosciEdycji(p) {
  return {
    nazwa: p.nazwa ?? "",
    kierunek: p.kierunek ?? "",
    start: p.start ?? "",
    koniec: p.koniec ?? "",
    dniSzkicu: String(p.dniSzkicu ?? liczbaDni(p)),
    opis: p.opis ?? ""
  };
}

/** Atrybuty pola z błędem: aria-invalid i odwołanie do komunikatu przy polu (sekcja 9). */
function atrybutyBledu(pole, bledy) {
  return bledy[pole] ? html` aria-invalid="true" aria-describedby="blad-${pole}"` : "";
}
function bladPola(pole, bledy) {
  return bledy[pole] ? html`<p class="blad-pola" id="blad-${pole}">${bledy[pole]}</p>` : "";
}

function opcja(wartosc, podpis, wybrany) {
  return html`<option value="${wartosc}"${wartosc === wybrany ? html` selected` : ""}>${podpis}</option>`;
}

/**
 * Treść okna E5.
 * - `tryb`: "nowa" albo "edycja";
 * - `id`: id podróży (nowej: nadane przy otwarciu, żeby podwójne kliknięcie nie tworzyło dwóch podróży);
 * - `miejsca`: miejsca z katalogu, które trafią do „Do zaplanowania” (tylko nowa);
 * - `wartosci`: teksty pól; `bledy`: pole → komunikat; `bladOgolny`: np. błąd zapisu w przeglądarce.
 */
export function widokFormularzaPodrozy({ tryb, id, miejsca = [], wartosci, bledy = {}, bladOgolny = null }) {
  const edycja = tryb === "edycja";
  const tytul = edycja ? "Edytuj podróż" : miejsca.length ? `Nowa podróż: ${tekstMiejsc(miejsca.length)}` : "Nowa podróż";
  const v = wartosci;
  return html`
    <button type="button" class="przycisk-ikona zamknij" data-akcja="zamknij-formularz" aria-label="Zamknij">×</button>
    <div class="okno-tresc formularz-podrozy">
      <p class="etykieta">Podróże</p>
      <h2 id="formularz-tytul">${tytul}</h2>
      ${miejsca.length ? html`<p class="maly muted">${miejsca.map((m) => m.nazwa).join(", ")}</p>` : ""}
      <form data-formularz="podroz" data-tryb="${edycja ? "edycja" : "nowa"}" data-id="${id}" novalidate>
        <div class="pole">
          <label for="pole-nazwa">Nazwa podróży</label>
          <input type="text" id="pole-nazwa" name="nazwa" value="${v.nazwa}" autocomplete="off"${atrybutyBledu("nazwa", bledy)}>
          ${bladPola("nazwa", bledy)}
        </div>
        <div class="pole">
          <label for="pole-kierunek">Kierunek</label>
          <input type="text" id="pole-kierunek" name="kierunek" value="${v.kierunek}" autocomplete="off"
            aria-describedby="${bledy.kierunek ? "blad-kierunek " : ""}podpowiedz-kierunek"${bledy.kierunek ? html` aria-invalid="true"` : ""}>
          ${bladPola("kierunek", bledy)}
          <p class="maly muted" id="podpowiedz-kierunek">Wpisz własny albo wybierz z listy poniżej.</p>
          <label class="maly" for="pole-lista-kierunkow">Kierunek z listy</label>
          <select id="pole-lista-kierunkow" data-zmiana="wybierz-kierunek">
            <option value="">Wybierz z listy…</option>
            <optgroup label="Miasta i regiony">${KIERUNKI.map((k) => opcja(k.miasto, `${k.miasto} (${k.kraj})`, v.kierunek))}</optgroup>
            <optgroup label="Kraje">${KRAJE.map((k) => opcja(k, k, v.kierunek))}</optgroup>
          </select>
        </div>
        <div class="dwa-pola">
          <div class="pole">
            <label for="pole-start">Data rozpoczęcia</label>
            <input type="date" id="pole-start" name="start" value="${v.start}"${atrybutyBledu("start", bledy)}>
            ${bladPola("start", bledy)}
          </div>
          <div class="pole">
            <label for="pole-koniec">Data zakończenia</label>
            <input type="date" id="pole-koniec" name="koniec" value="${v.koniec}"${atrybutyBledu("koniec", bledy)}>
            ${bladPola("koniec", bledy)}
          </div>
        </div>
        <div class="pole">
          <label for="pole-dni">Liczba dni szkicu (gdy nie podasz dat)</label>
          <input type="number" id="pole-dni" name="dniSzkicu" min="1" max="${MAKS_DNI}" step="1" value="${v.dniSzkicu}"${atrybutyBledu("dniSzkicu", bledy)}>
          ${bladPola("dniSzkicu", bledy)}
        </div>
        <div class="pole">
          <label for="pole-opis">Opis (opcjonalnie)</label>
          <textarea id="pole-opis" name="opis" rows="3"${atrybutyBledu("opis", bledy)}>${v.opis}</textarea>
          ${bladPola("opis", bledy)}
        </div>
        ${bladOgolny ? html`<p class="blad-pola" role="alert">${bladOgolny}</p>` : ""}
        <div class="okno-akcje">
          <button type="submit" class="btn glowny">${edycja ? "Zapisz zmiany" : "Utwórz podróż"}</button>
          <button type="button" class="btn" data-akcja="zamknij-formularz">Anuluj</button>
        </div>
      </form>
    </div>
  `;
}
