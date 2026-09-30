import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const input = process.argv[2] || process.env.SITE_URL;
if (!input) {
  console.error(
    "Informe a URL pública: npm run configure -- https://usuario.github.io/repositorio/",
  );
  process.exit(1);
}
const url = new URL(input);
if (
  url.protocol !== "https:" ||
  url.username ||
  url.password ||
  url.search ||
  url.hash ||
  /[<>"']/.test(input)
) {
  throw new Error(
    "Informe uma URL HTTPS pública, sem credenciais, consulta ou fragmento.",
  );
}
const baseUrl = url.href.replace(/\/*$/, "/");
let html = await readFile("index.html", "utf8");
html = html
  .replace(/\s*<link rel="canonical"[^>]*>/g, "")
  .replace(/\s*<meta property="og:url"[^>]*>/g, "");
html = html.replace(
  "</head>",
  `  <link rel="canonical" href="${baseUrl}">\n  <meta property="og:url" content="${baseUrl}">\n</head>`,
);
html = html.replace(
  /(<meta\s+(?:property="og:image"|name="twitter:image")\s+content=")[^"]+/g,
  `$1${baseUrl}assets/images/social.png`,
);
const match = html.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
);
const person = JSON.parse(match[1]);
person.url = baseUrl;
const json = JSON.stringify(person);
html = html.replace(match[1], json);
const hash = createHash("sha256").update(json).digest("base64");
html = html.replace(/'sha256-[^']*'/, `'sha256-${hash}'`);
await writeFile("index.html", html);
await writeFile(
  "robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}sitemap.xml\n`,
);
await writeFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${baseUrl}</loc></url>\n</urlset>\n`,
);
let notFound = await readFile("404.html", "utf8");
notFound = notFound.replace(
  /(<a class="home-link" href=")[^"]+/,
  `$1${baseUrl}`,
);
await writeFile("404.html", notFound);
console.log(`SEO e página 404 configurados para ${baseUrl}`);
