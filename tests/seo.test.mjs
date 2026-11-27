// Verificacion automatizada de SEO, GEO (llms.txt), PWA manifest, security.txt y cabeceras HTTP (vercel.json) en NutriOliva.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSeoForPath, SITE_URL } from "../src/lib/seoConfig.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC = path.join(ROOT, "public");

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  [OK] ${name}`);
  } catch (err) {
    failed++;
    console.log(`  [FALLA] ${name}: ${err.message}`);
  }
}

console.log("\n[SEO / GEO / HTTP Security Test Suite]");

check("SITE_URL apunta al dominio HTTPS de produccion", () => {
  assert.equal(SITE_URL, "https://nutri-oliva.vercel.app");
});

check(
  "vercel.json es JSON valido con rewrites SPA protegidos, HSTS y X-Robots-Tag",
  () => {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")
    );
    assert.equal(cfg.trailingSlash, false);
    assert.ok(Array.isArray(cfg.rewrites) && cfg.rewrites.length >= 1);

    const spaRewrite = cfg.rewrites[0];
    assert.equal(spaRewrite.destination, "/index.html");
    assert.ok(
      spaRewrite.source.includes("robots\\.txt") &&
      spaRewrite.source.includes("sitemap\\.xml") &&
      spaRewrite.source.includes("llms\\.txt") &&
      spaRewrite.source.includes("manifest\\.json"),
      "El rewrite SPA debe excluir robots.txt, sitemap.xml, llms.txt y manifest.json"
    );

    const globalRule = cfg.headers.find((h) => h.source === "/(.*)");
    assert.ok(globalRule, "Falta regla global de headers /(.*)");
    const byKey = Object.fromEntries(
      globalRule.headers.map((h) => [h.key, h.value])
    );

    assert.ok(byKey["Strict-Transport-Security"]?.includes("max-age=63072000"));
    assert.equal(byKey["X-Content-Type-Options"], "nosniff");
    assert.equal(byKey["Referrer-Policy"], "strict-origin-when-cross-origin");
    assert.ok(byKey["Permissions-Policy"]?.includes("camera=()"));
    assert.equal(
      byKey["Cross-Origin-Opener-Policy"],
      "same-origin-allow-popups"
    );

    const privateRule = cfg.headers.find((h) => h.source.includes("panel"));
    assert.ok(
      privateRule?.headers.some(
        (h) => h.key === "X-Robots-Tag" && h.value.includes("noindex")
      ),
      "Falta X-Robots-Tag: noindex en rutas privadas de vercel.json"
    );
  }
);

check(
  "index.html contiene Geo-SEO (Tucuman, Argentina), JSON-LD (@graph), canonical y manifest.json",
  () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.ok(html.includes('lang="es-AR"'));
    assert.ok(html.includes(`href="${SITE_URL}/"`));
    assert.ok(html.includes('href="/manifest.json"'));
    assert.ok(html.includes('name="geo.region" content="AR-T"'));
    assert.ok(html.includes("Tucuman"));
    assert.ok(html.includes("nutriolivaa@gmail.com"));
    assert.ok(html.includes("https://www.instagram.com/nutri_olivaa/"));

    const ldMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );
    assert.ok(ldMatch, "Falta bloque JSON-LD en index.html");
    const parsed = JSON.parse(ldMatch[1]);
    const types = (parsed["@graph"] || []).map((n) => n["@type"]);
    for (const t of [
      "SoftwareApplication",
      "Organization",
      "WebSite",
      "FAQPage",
    ]) {
      assert.ok(types.includes(t), `Falta tipo Schema.org ${t} en JSON-LD`);
    }
  }
);

check(
  "robots.txt, sitemap.xml, manifest.json, llms.txt y security.txt existen y son validos",
  () => {
    const robots = fs.readFileSync(path.join(PUBLIC, "robots.txt"), "utf8");
    assert.ok(robots.includes("Allow: /"));
    assert.ok(robots.includes("Allow: /llms.txt"));
    assert.ok(robots.includes("Disallow: /panel"));
    assert.ok(robots.includes("Disallow: /mi-plan"));
    assert.ok(robots.includes("Disallow: /admin"));
    assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));

    const sitemap = fs.readFileSync(path.join(PUBLIC, "sitemap.xml"), "utf8");
    assert.ok(sitemap.includes(`<loc>${SITE_URL}/</loc>`));
    assert.ok(sitemap.includes(`<loc>${SITE_URL}/login</loc>`));
    assert.ok(!sitemap.includes("/panel"), "sitemap no debe incluir /panel");
    assert.ok(!sitemap.includes("/admin"), "sitemap no debe incluir /admin");

    const manifest = JSON.parse(
      fs.readFileSync(path.join(PUBLIC, "manifest.json"), "utf8")
    );
    assert.equal(manifest.short_name, "NutriOliva");
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2);

    const llms = fs.readFileSync(path.join(PUBLIC, "llms.txt"), "utf8");
    assert.ok(llms.includes(SITE_URL));
    assert.ok(llms.includes("nutriolivaa@gmail.com"));
    assert.ok(llms.includes("@nutri_olivaa"));
    assert.ok(llms.includes("Tucuman"));

    const sec = fs.readFileSync(
      path.join(PUBLIC, ".well-known", "security.txt"),
      "utf8"
    );
    assert.ok(sec.includes(`Canonical: ${SITE_URL}/.well-known/security.txt`));
    assert.ok(sec.includes("Contact: mailto:nutriolivaa@gmail.com"));
  }
);

check(
  "resolveSeoForPath indexa rutas publicas y aplica noindex, nofollow a paneles internos",
  () => {
    for (const pub of ["/", "/login"]) {
      const meta = resolveSeoForPath(pub);
      assert.ok(
        meta.robots.startsWith("index, follow"),
        `${pub} debe ser indexable`
      );
      assert.ok(meta.canonical.startsWith(SITE_URL));
    }

    for (const priv of [
      "/set-password",
      "/panel",
      "/panel/catalogo",
      "/panel/cuenta",
      "/panel/pacientes/abc-123",
      "/panel/pacientes/abc-123/plan",
      "/mi-plan",
      "/admin",
      "/ruta-inexistente-404",
    ]) {
      const meta = resolveSeoForPath(priv);
      assert.equal(
        meta.robots,
        "noindex, nofollow",
        `${priv} debe ser noindex, nofollow`
      );
    }
  }
);

if (failed > 0) {
  console.log(
    `\n[FALLA] ${failed} fallos / ${passed} OK en pruebas SEO, GEO y seguridad HTTP`
  );
  process.exit(1);
}
console.log(
  `\n[OK] SEO, GEO (llms.txt), PWA y seguridad HTTP verificados (${passed}/${passed})\n`
);
