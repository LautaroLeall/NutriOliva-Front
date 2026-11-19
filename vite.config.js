import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const SITE_URL = "https://nutri-oliva.vercel.app";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Escribe un archivo solo si su contenido cambio, evitando recargas innecesarias en Vite dev.
 */
function writeIfChanged(filePath, content) {
  try {
    if (fs.existsSync(filePath)) {
      const current = fs.readFileSync(filePath, "utf8");
      if (current === content) return;
    }
    fs.writeFileSync(filePath, content, "utf8");
  } catch {
    // Ignorar errores de permisos en entornos de solo lectura
  }
}

/**
 * Plugin Vite automatizado que mantiene actualizados robots.txt, sitemap.xml y manifest.json
 * en cada inicio de servidor (dev) y en cada compilacion de produccion (build).
 */
function nutriOlivaAutoSeoPlugin() {
  function generateSeoFiles() {
    const publicDir = path.resolve(__dirname, "public");
    if (!fs.existsSync(publicDir)) return;

    const today = new Date().toISOString().split("T")[0];

    // 1. robots.txt automatizado: indexa rutas publicas y protege paneles internos
    const robotsTxt = [
      "# NutriOliva — robots.txt generado automaticamente",
      "User-agent: *",
      "Allow: /",
      "Allow: /login",
      "Disallow: /panel",
      "Disallow: /panel/",
      "Disallow: /mi-plan",
      "Disallow: /mi-plan/",
      "Disallow: /admin",
      "Disallow: /admin/",
      "Disallow: /set-password",
      "",
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      "",
    ].join("\n");

    // 2. sitemap.xml automatizado con fecha actual, hreflang es-AR e imagen
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es-AR" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
    <image:image>
      <image:loc>${SITE_URL}/icon-fondo_blanco.png</image:loc>
      <image:title>NutriOliva — Software para Nutricionistas y Seguimiento de Pacientes</image:title>
      <image:caption>Plataforma de planes alimenticios con IA, datos clinicos y seguimiento nutricional en tiempo real en Tucuman y Argentina.</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/login</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="es-AR" href="${SITE_URL}/login" />
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/login" />
  </url>
</urlset>
`;

    // 3. manifest.json para SEO movil y experiencia de app instalable
    const manifestJson =
      JSON.stringify(
        {
          name: "NutriOliva — Seguimiento Nutricional en Tiempo Real",
          short_name: "NutriOliva",
          description:
            "Software para nutricionistas y pacientes: planes alimenticios con IA, datos clinicos, bajar de peso y balance calorico diario.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#EFEAE0",
          theme_color: "#3F4A2B",
          lang: "es-AR",
          categories: ["health", "medical", "fitness", "productivity"],
          icons: [
            {
              src: "/icon.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icon-fondo_blanco.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable any",
            },
          ],
        },
        null,
        2
      ) + "\n";

    writeIfChanged(path.join(publicDir, "robots.txt"), robotsTxt);
    writeIfChanged(path.join(publicDir, "sitemap.xml"), sitemapXml);
    writeIfChanged(path.join(publicDir, "manifest.json"), manifestJson);
  }

  return {
    name: "nutrioliva-auto-seo",
    buildStart() {
      generateSeoFiles();
    },
    configureServer() {
      generateSeoFiles();
    },
  };
}

export default defineConfig({
  plugins: [react(), nutriOlivaAutoSeoPlugin()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
