import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const html = await readFile("index.html", "utf8");
const js = await readFile("assets/js/main.js", "utf8");
const css = await readFile("assets/css/style.css", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "IDs duplicados");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "Deve existir um H1");
assert.match(html, /<html lang="pt-BR">/);
for (const [, href] of html.matchAll(/href="#([^"]+)"/g))
  assert.ok(ids.includes(href), `Âncora ausente: ${href}`);
for (const [, path] of html.matchAll(/(?:href|src)="(assets\/[^"?#]+)"/g))
  await access(resolve(path));
for (const [link] of html.matchAll(/<a\b[^>]+target="_blank"[^>]*>/g))
  assert.match(link, /rel="[^"]*noopener/);
for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
  assert.match(image, /alt="[^"]+"/);
  assert.match(image, /width="\d+"/);
  assert.match(image, /height="\d+"/);
}
assert.ok(!js.includes("innerHTML"), "Inserção insegura de HTML");
assert.match(css, /prefers-reduced-motion/);
assert.ok(
  !/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}/.test(
    html + js,
  ),
  "Possível segredo",
);
const json = html.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
)[1];
assert.equal(JSON.parse(json)["@type"], "Person");
assert.ok(
  html.includes(`sha256-${createHash("sha256").update(json).digest("base64")}`),
  "Hash CSP inválido",
);
console.log(
  "OK: arquivos, links internos, semântica básica, imagens, JSON-LD, CSP e verificações de segurança.",
);
