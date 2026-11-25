// Szablon html`` — jedyny sposób budowania HTML w aplikacji.
// Każda wstawiana wartość jest zamieniana na tekst (< > & " ' stają się encjami),
// więc tekst wpisany przez użytkownika nigdy nie staje się kodem strony (sekcja 7, zasada 6).

/** HTML, któremu ufamy, bo powstał z szablonu html`` (albo z surowy() dla stałych w kodzie). */
export class BezpiecznyHtml {
  constructor(tekst) {
    this.tekst = tekst;
  }
  toString() {
    return this.tekst;
  }
}

const ENCJE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Zamienia znaki specjalne HTML na encje. */
export function escapuj(wartosc) {
  return String(wartosc).replace(/[&<>"']/g, (znak) => ENCJE[znak]);
}

function wstaw(wartosc) {
  if (wartosc === null || wartosc === undefined || wartosc === false) return "";
  if (wartosc instanceof BezpiecznyHtml) return wartosc.tekst;
  if (Array.isArray(wartosc)) return wartosc.map(wstaw).join("");
  return escapuj(wartosc);
}

/** Szablon: html`<p>${tekst}</p>` zwraca BezpiecznyHtml z wartościami zamienionymi na tekst. */
export function html(czesci, ...wartosci) {
  let wynik = czesci[0];
  for (let i = 0; i < wartosci.length; i++) {
    wynik += wstaw(wartosci[i]) + czesci[i + 1];
  }
  return new BezpiecznyHtml(wynik);
}

/** Tylko dla stałego HTML zapisanego w kodzie aplikacji (np. ikony). Nigdy dla tekstu użytkownika. */
export function surowy(staly) {
  return new BezpiecznyHtml(staly);
}
