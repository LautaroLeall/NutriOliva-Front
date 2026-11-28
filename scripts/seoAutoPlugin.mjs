import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_URL = "https://nutri-oliva.vercel.app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

/**
 * Escribe un archivo en disco unicamente si su contenido cambio,
 * evitando recargas innecesarias del watcher de Vite en modo dev.
 */
function writeIfChanged(filePath, content) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (fs.existsSync(filePath)) {
      const current = fs.readFileSync(filePath, "utf8");
      if (current === content) return;
    }
    fs.writeFileSync(filePath, content, "utf8");
  } catch {
    // Ignorar errores de permisos en entornos de solo lectura
  }
}

function generateRobotsTxt() {
  return [
    "# NutriOliva — robots.txt generado automaticamente",
    "User-agent: *",
    "Allow: /",
    "Allow: /login",
    "Allow: /privacidad",
    "Allow: /llms.txt",
    "Allow: /.well-known/security.txt",
    "Allow: /manifest.json",
    "Allow: /icon.png",
    "Allow: /icon-fondo_blanco.png",
    "Allow: /favicon.svg",
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
}

function generateSitemapXml(today) {
  return `<?xml version="1.0" encoding="UTF-8"?>
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
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/login" />
  </url>
  <url>
    <loc>${SITE_URL}/privacidad</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="es-AR" href="${SITE_URL}/privacidad" />
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/privacidad" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/privacidad" />
  </url>
</urlset>
`;
}

function generateManifestJson() {
  return (
    JSON.stringify(
      {
        id: "/",
        name: "NutriOliva — Mi Plan y Seguimiento Nutricional",
        short_name: "NutriOliva",
        description:
          "Tu plan alimenticio, registro diario de comidas y evolucion nutricional en tiempo real junto a tu nutricionista.",
        start_url: "/mi-plan",
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
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
        shortcuts: [
          {
            name: "Registrar mi dia",
            short_name: "Mi dia",
            description: "Registrar comidas o actividad fisica del dia",
            url: "/mi-plan?tab=hoy",
            icons: [
              {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Ver mi plan alimenticio",
            short_name: "Mi plan",
            description: "Consultar mi plan alimenticio activo",
            url: "/mi-plan?tab=plan",
            icons: [
              {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Ver mi tendencia",
            short_name: "Tendencia",
            description: "Revisar el balance calorico de los ultimos 7 dias",
            url: "/mi-plan?tab=tendencia",
            icons: [
              {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
      },
      null,
      2
    ) + "\n"
  );
}

/**
 * GEO (Generative Engine Optimization) — public/llms.txt
 * Permite que motores de IA generativa (ChatGPT, Perplexity, Claude, Gemini, Copilot)
 * indexen con precision la propuesta de valor, funciones, planes y canales de NutriOliva.
 */
function generateLlmsTxt(today) {
  return `# NutriOliva — El acompanamiento que tus pacientes necesitan cada dia (${SITE_URL})
> Ultima actualizacion: ${today}
> Plataforma SaaS para nutricionistas y pacientes en Tucuman y toda Argentina. Integra planes alimenticios versionados con IA y Excel, historia clinica antropometrica evolutiva, catalogo nutricional SARA (+205 alimentos) y seguimiento diario de comidas y actividad fisica en tiempo real en Web y Web App instalable (PWA).

## Que es NutriOliva
NutriOliva reemplaza las planillas de Excel, los PDFs estaticos y el seguimiento disperso por WhatsApp en el consultorio nutricional. Conecta al profesional con sus pacientes tanto desde el navegador web como mediante su Web App instalable en Android e iPhone en 2 toques.

## Funcionalidades para el Nutricionista
- **Gestion integral de pacientes y alertas de adherencia:** nomina de pacientes activos e inactivos, buscador global instantaneo (Ctrl+K) tolerante a errores de tipeo, invitacion automatica por correo electronico y alerta visual cuando un paciente lleva mas de 48 horas sin registrar.
- **Ficha clinica y antropometria evolutiva:** registro acumulativo de peso, altura, calculo automatico de IMC, porcentaje de grasa corporal, masa muscular (kg), perimetro de cintura con semaforo de riesgo cardiometabolico, patologias, alergias, medicacion, 5 niveles de actividad fisica y 7 objetivos clinicos (bajar de peso, bajar peso manteniendo fuerza, mantener, subir masa muscular, subir fuerza, rendimiento deportivo y recomposicion corporal).
- **Constructor de planes alimenticios con IA y Excel:** versionado completo (borrador, activo, archivado), organizacion en 7 tiempos de comida (desayuno, colacion, almuerzo, merienda, cena, colacion nocturna y snack), calculo en vivo de calorias y macronutrientes (proteinas, carbohidratos y grasas), importacion asistida con Inteligencia Artificial desde texto/Word/PDF e importador directo de planillas Excel/CSV.
- **Catalogo nutricional SARA (+205 alimentos) + catalogo propio:** base precargada con alimentos simples y preparaciones clinicas completas de la gastronomia argentina y latinoamericana, mas creacion ilimitada de alimentos personalizados del consultorio.

## Funcionalidades para el Paciente
- **Acceso flexible en Web y Web App instalable:** el paciente activa su contraseña desde el enlace recibido por email e ingresa al instante desde su navegador o instala el icono de NutriOliva en su pantalla de inicio a pantalla completa (/mi-plan).
- **Registro diario en 3 modos en menos de 60 segundos:**
  1. *Mi plan:* sugiere automaticamente las comidas del plan activo segun la franja horaria actual.
  2. *Catalogo:* buscador difuso instantaneo tolerante a acentos y errores de tipeo.
  3. *Otra comida con IA:* el paciente describe lo que comio con sus propias palabras, la IA estima las calorias de la porcion y permite adjuntar una foto privada comprimida automaticamente.
- **Actividad fisica y balance calorico en tiempo real:** registro de ejercicio por duracion e intensidad, calculo de gasto calorico, barra de progreso diaria y grafica de tendencia de los ultimos 7 dias.
- **Pestaña Mi Cuenta:** consulta de su evolucion antropometrica, notas del profesional, politica de privacidad y contacto directo con su nutricionista asignado.

## Planes Comerciales para Profesionales
Todos los planes incluyen el 100% de las funcionalidades de la plataforma; solo varia el cupo de pacientes activos:
- **Plan Starter:** hasta 15 pacientes activos (ideal para consultorios individuales en etapa inicial).
- **Plan Pro:** hasta 50 pacientes activos (para profesionales con cartera activa en crecimiento).
- **Plan Clinic:** pacientes ilimitados (para consultorios de alto volumen, centros y equipos de nutricion).

## Privacidad y Seguridad Multi-Tenant
- Aislamiento estricto por nutricionista y por paciente a nivel motor PostgreSQL mediante Row Level Security (RLS) en Supabase.
- Fotografias de comidas almacenadas en buckets privados con acceso exclusivo mediante URLs firmadas temporales y cero cache local de datos sensibles.

## Ubicacion y Cobertura
Desarrollado en San Miguel de Tucuman, Tucuman, Argentina, para nutricionistas, licenciados en nutricion, centros medicos y pacientes de Tucuman, Argentina y toda Hispanoamerica.

## Secciones Publicas
- [Inicio y Demo Interactiva en Vivo](${SITE_URL}/): tour del panel profesional, simulador movil del paciente sincronizado en tiempo real con el espejo del nutricionista, funcionalidades, preguntas frecuentes y formulario de contacto.
- [Acceso a la Plataforma](${SITE_URL}/login): inicio de sesion unificado por rol para nutricionistas, pacientes y administracion.
- [Politica de Privacidad y Eliminacion de Datos](${SITE_URL}/privacidad): proteccion de datos personales (Ley 25.326 Argentina) y derechos del usuario.

## Contacto Comercial Oficial
- Web: ${SITE_URL}/
- WhatsApp Directo: https://wa.me/5493813399463 (+549 381 339 9463)
- Correo Oficial: nutriolivaa@gmail.com
- Instagram Oficial: https://www.instagram.com/nutri_olivaa/ (@nutri_olivaa)
`;
}

function generateSecurityTxt() {
  return [
    "Contact: mailto:nutriolivaa@gmail.com",
    "Contact: https://wa.me/5493813399463",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    "Preferred-Languages: es, en",
    "Expires: 2027-12-31T23:59:59.000Z",
    "",
  ].join("\n");
}

function validateHomeSeoBounds(baseHtml) {
  const titleMatch = baseHtml.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = baseHtml.match(
    /<meta\s+name="description"[\s\S]*?content="([^"]*)"\s*\/>/
  );
  const title = (titleMatch?.[1] || "").trim();
  const desc = (descMatch?.[1] || "").trim();

  if (title.length < 15 || title.length > 120) {
    throw new Error(
      `[nutriolivaAutoSeoPlugin] <title> en index.html fuera de rango (${title.length} chars)`
    );
  }
  if (desc.length < 100 || desc.length > 260) {
    throw new Error(
      `[nutriolivaAutoSeoPlugin] <meta name="description"> en index.html fuera de rango (${desc.length} chars)`
    );
  }
}

export function nutriolivaAutoSeoPlugin() {
  let resolvedOutDir = path.join(PROJECT_ROOT, "dist");

  function syncPublicSeoFiles() {
    const publicDir = path.join(PROJECT_ROOT, "public");
    if (!fs.existsSync(publicDir)) return;

    const today = new Date().toISOString().slice(0, 10);

    writeIfChanged(path.join(publicDir, "robots.txt"), generateRobotsTxt());
    writeIfChanged(
      path.join(publicDir, "sitemap.xml"),
      generateSitemapXml(today)
    );
    writeIfChanged(
      path.join(publicDir, "manifest.json"),
      generateManifestJson()
    );
    writeIfChanged(path.join(publicDir, "llms.txt"), generateLlmsTxt(today));
    writeIfChanged(
      path.join(publicDir, ".well-known", "security.txt"),
      generateSecurityTxt()
    );
  }

  return {
    name: "nutrioliva-auto-seo",
    configResolved(config) {
      resolvedOutDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(PROJECT_ROOT, config.build.outDir);
    },
    buildStart() {
      syncPublicSeoFiles();
    },
    configureServer() {
      syncPublicSeoFiles();
    },
    closeBundle() {
      const distIndexPath = path.join(resolvedOutDir, "index.html");
      if (!fs.existsSync(distIndexPath)) return;
      const baseHtml = fs.readFileSync(distIndexPath, "utf8");
      validateHomeSeoBounds(baseHtml);
    },
  };
}
