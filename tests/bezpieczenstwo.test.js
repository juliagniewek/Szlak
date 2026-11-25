// Zabezpieczenia stałe od F00: .env poza repozytorium (KA4, N4), brak wysyłania danych (N1),
// tekst użytkownika jako tekst, blokada .env dla agenta, serwer bez plików ukrytych.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { html, escapuj, surowy } from "../src/html.js";
import { ikona, NAZWY_IKON } from "../src/ikony.js";
import { KATEGORIE } from "../src/dane/katalog.js";

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const git = (...arg) => execFileSync("git", arg, { cwd: KATALOG, encoding: "utf8" });

/** true, gdy git ignoruje podaną ścieżkę (czyli `git status` jej nie pokaże). */
function ignorowany(sciezka) {
  try {
    execFileSync("git", ["check-ignore", "-q", "--no-index", sciezka], { cwd: KATALOG });
    return true;
  } catch {
    return false;
  }
}

/** Pliki repozytorium: śledzone i nowe, nieignorowane (czyli te, które mogą trafić do commita). */
function plikiRepozytorium() {
  return git("ls-files", "--cached", "--others", "--exclude-standard").split("\n").filter(Boolean)
    .filter((p) => fs.existsSync(path.join(KATALOG, p)));
}

function plikiZrodlowe(katalog) {
  return fs.readdirSync(path.join(KATALOG, katalog), { recursive: true })
    .filter((p) => p.endsWith(".js"))
    .map((p) => path.join(katalog, p));
}

test("KA4: plik .env i jego odmiany nie pojawiają się w git status", () => {
  for (const p of [".env", ".env.local", ".env.production", "src/.env"]) assert.ok(ignorowany(p), p);
  assert.ok(!ignorowany(".env.example"), ".env.example może trafić do repozytorium");
  for (const p of ["node_modules/x.js", ".DS_Store", "Thumbs.db", ".trail/cache/INDEX.md", ".trail/statusline.cjs"]) {
    assert.ok(ignorowany(p), p);
  }
});

test("N4: w repozytorium nie ma pliku .env ani napisów wyglądających na klucze lub hasła", () => {
  const pliki = plikiRepozytorium();
  const envy = pliki.filter((p) => /(^|\/)\.env(\.|$)/.test(p) && !p.endsWith(".env.example"));
  assert.deepEqual(envy, []);
  const wzory = [
    /AKIA[0-9A-Z]{16}/,                       // klucz AWS
    /AIza[0-9A-Za-z_-]{35}/,                  // klucz Google
    /sk-[A-Za-z0-9_-]{20,}/,                  // klucze w stylu OpenAI/Anthropic
    /gh[pousr]_[A-Za-z0-9]{36}/,              // token GitHub
    /xox[abprs]-[A-Za-z0-9-]{10,}/,           // token Slack
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,     // klucz prywatny
    /(password|haslo|hasło|secret|api[_-]?key)\s*[:=]\s*["'][^"']{6,}["']/i
  ];
  const znalezione = [];
  for (const p of pliki) {
    const tresc = fs.readFileSync(path.join(KATALOG, p), "utf8");
    for (const w of wzory) if (w.test(tresc)) znalezione.push(`${p}: ${w}`);
  }
  assert.deepEqual(znalezione, []);
});

test("N1: kod aplikacji nie zawiera funkcji wysyłających dane ani obcych skryptów", () => {
  const zakazane = ["fetch(", "XMLHttpRequest", "sendBeacon", "WebSocket", "EventSource", "importScripts", "<script src=\"http"];
  for (const plik of [...plikiZrodlowe("src"), "index.html"]) {
    const tresc = fs.readFileSync(path.join(KATALOG, plik), "utf8");
    for (const z of zakazane) assert.ok(!tresc.includes(z), `${plik} zawiera ${z}`);
  }
});

test("N1: index.html ma blokadę sieci (CSP) i ładuje tylko własne pliki", () => {
  const strona = fs.readFileSync(path.join(KATALOG, "index.html"), "utf8");
  const csp = strona.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] ?? "";
  for (const regula of [
    "default-src 'self'", "script-src 'self'", "img-src 'self' https://upload.wikimedia.org",
    "connect-src 'none'", "form-action 'none'", "base-uri 'none'"
  ]) assert.ok(csp.includes(regula), `CSP bez: ${regula}`);
  assert.ok(!/script-src[^;]*unsafe/.test(csp), "skrypty bez 'unsafe-*'");
  const zrodla = [...strona.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  for (const z of zrodla) assert.ok(!/^(https?:)?\/\//.test(z), `zewnętrzny zasób: ${z}`);
});

test("tekst użytkownika trafia do HTML jako tekst: <b>test</b>", () => {
  const nazwa = "<b>test</b>";
  assert.equal(html`<h1>${nazwa}</h1>`.toString(), "<h1>&lt;b&gt;test&lt;/b&gt;</h1>");
  assert.equal(escapuj(`"'&`), "&quot;&#39;&amp;");
  assert.equal(html`<a title="${`" onmouseover="x`}">`.toString(), '<a title="&quot; onmouseover=&quot;x">');
  // Listy i zagnieżdżone szablony: wstawione bez podwójnego zamieniania, tekst nadal jako tekst.
  const lista = html`<ul>${["<i>", "a"].map((t) => html`<li>${t}</li>`)}</ul>`;
  assert.equal(lista.toString(), "<ul><li>&lt;i&gt;</li><li>a</li></ul>");
  assert.equal(html`${null}${undefined}${false}${0}`.toString(), "0");
  assert.equal(html`${surowy("<br>")}`.toString(), "<br>");
});

test("HTML wstawia do strony tylko app.js (reszta kodu buduje go przez html``)", () => {
  for (const plik of plikiZrodlowe("src")) {
    const tresc = fs.readFileSync(path.join(KATALOG, plik), "utf8");
    if (path.basename(plik) === "app.js") continue;
    for (const z of ["innerHTML", "outerHTML", "insertAdjacentHTML", "document.write"]) {
      assert.ok(!tresc.includes(z), `${plik} zawiera ${z}`);
    }
  }
});

test("każda kategoria ma ikonę z zestawu, a ikony są dekoracją (aria-hidden)", () => {
  for (const k of Object.values(KATEGORIE)) assert.ok(NAZWY_IKON.includes(k.ikona), k.ikona);
  assert.match(ikona("kompas").toString(), /aria-hidden="true"/);
  assert.throws(() => ikona("brak"), /Nieznana ikona/);
});

test("KA5 (konfiguracja): Claude Code ma zakaz odczytu i edycji .env, a hook Trail-code zostaje", () => {
  const ustawienia = JSON.parse(fs.readFileSync(path.join(KATALOG, ".claude/settings.json"), "utf8"));
  const deny = ustawienia.permissions?.deny ?? [];
  for (const r of ["Read(./.env)", "Read(./.env.*)", "Edit(./.env)", "Edit(./.env.*)"]) assert.ok(deny.includes(r), r);
  assert.ok(JSON.stringify(ustawienia.hooks?.SessionStart).includes(".trail/hook.cjs"));
});

test("lokalny serwer nie wydaje plików ukrytych (.env, .git) ani spoza projektu", async (t) => {
  const port = 8700 + Math.floor(Math.random() * 200);
  const proces = spawn(process.execPath, ["scripts/serwer.mjs"], { cwd: KATALOG, env: { ...process.env, PORT: String(port) } });
  t.after(() => proces.kill());
  await new Promise((ok, blad) => {
    proces.stdout.once("data", ok);
    proces.once("error", blad);
    setTimeout(() => blad(new Error("serwer nie wystartował")), 5000);
  });
  const pobierz = (sciezka) => new Promise((ok, blad) => {
    http.get({ host: "127.0.0.1", port, path: sciezka }, (res) => { res.resume(); ok(res.statusCode); }).on("error", blad);
  });
  assert.equal(await pobierz("/"), 200);
  assert.equal(await pobierz("/src/app.js"), 200);
  for (const s of ["/.env", "/.git/config", "/.claude/settings.json", "/%2e%2e/%2e%2e/Windows/win.ini", "/src/../.git/HEAD"]) {
    assert.equal(await pobierz(s), 404, s);
  }
  // Krótkie nazwy Windows (8.3) tych samych plików ukrytych (weryfikacja F00, W1).
  // Na systemach bez krótkich nazw takie adresy i tak nie istnieją, więc też dają 404.
  for (const s of ["/GIT~1/HEAD", "/GIT~1/config", "/git~1/HEAD", "/CLAUDE~1/settings.json", "/GITIGN~1", "/TRAIL~1/hook.cjs"]) {
    assert.equal(await pobierz(s), 404, s);
  }
});
