import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      // O prefixo permite verificar os mesmos caminhos usados em um project site.
      const relativePath = pathname
        .replace(/^\/portfolio-preview(?=\/|$)/, "")
        .replace(/^\/+/, "");
      let filename = resolve(root, relativePath || "index.html");
      if (filename !== root && !filename.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(filename)).isDirectory())
        filename = resolve(filename, "index.html");
      response.writeHead(200, {
        "Content-Type": types[extname(filename)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(await readFile(filename));
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Arquivo não encontrado.");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Prévia local: http://127.0.0.1:${port}`),
  );
