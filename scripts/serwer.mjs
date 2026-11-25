// Lokalny serwer plików do uruchamiania aplikacji: npm start → http://localhost:8000
// Bez zależności (node:http). Słucha tylko na tym komputerze i nie wydaje plików ukrytych
// (np. .env, .git), bo serwuje cały folder projektu.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KATALOG_PRAWDZIWY = await fs.realpath(KATALOG);
const PORT = Number(process.env.PORT) || 8000;
const TYPY = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon"
};

function odpowiedz(res, kod, tekst) {
  res.writeHead(kod, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(tekst);
}

/** true, gdy ścieżka (względem folderu projektu) wychodzi poza projekt albo prowadzi do pliku/katalogu ukrytego. */
function zabroniona(wzgledna) {
  const czesci = wzgledna.split(path.sep);
  return czesci[0] === ".." || path.isAbsolute(wzgledna) || czesci.some((c) => c.startsWith("."));
}

const serwer = http.createServer(async (req, res) => {
  let sciezka;
  try {
    sciezka = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return odpowiedz(res, 400, "Niepoprawny adres");
  }
  if (sciezka.endsWith("/")) sciezka += "index.html";
  const plik = path.resolve(KATALOG, "." + sciezka);
  // Poza folderem projektu albo plik/katalog ukryty (.env, .git, .claude, .trail) → brak dostępu.
  if (zabroniona(path.relative(KATALOG, plik))) return odpowiedz(res, 404, "Nie znaleziono");
  try {
    // To samo sprawdzenie na prawdziwej ścieżce: na Windows pliki z kropką mają też krótkie nazwy
    // (.git → GIT~1), które omijają sprawdzanie kropki. realpath zamienia je na pełne nazwy
    // i rozwija dowiązania (weryfikacja F00, W1).
    const prawdziwy = await fs.realpath(plik);
    if (zabroniona(path.relative(KATALOG_PRAWDZIWY, prawdziwy))) return odpowiedz(res, 404, "Nie znaleziono");
    const tresc = await fs.readFile(prawdziwy);
    res.writeHead(200, {
      "Content-Type": TYPY[path.extname(plik).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(tresc);
  } catch {
    odpowiedz(res, 404, "Nie znaleziono");
  }
});

serwer.listen(PORT, "127.0.0.1", () => {
  console.log(`szlak. działa: http://localhost:${PORT}`);
  console.log(`Tryb deweloperski: http://localhost:${PORT}/?dev`);
  console.log("Zatrzymanie: Ctrl+C");
});
