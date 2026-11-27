// src/lib/seoConfig.js
// Configuracion centralizada de SEO por ruta (sin dependencias de React ni alias de Vite
// para poder importarse directamente tanto en el navegador como en suites de pruebas Node.js).

const rawEnvUrl =
  typeof import.meta !== "undefined" ? import.meta.env?.VITE_APP_URL : "";

export const SITE_URL = (
  rawEnvUrl && /^https:\/\/(?!localhost\b)/i.test(rawEnvUrl)
    ? rawEnvUrl
    : "https://nutri-oliva.vercel.app"
).replace(/\/+$/, "");

export const SITE_CANONICAL_URL = SITE_URL;

export const DEFAULT_TITLE =
  "NutriOliva — Software para Nutricionistas, Planes Alimenticios y Seguimiento de Pacientes | Tucuman y Argentina";

export const DEFAULT_DESC =
  "Plataforma profesional para nutricionistas y pacientes en Tucuman y toda Argentina. Crea planes alimenticios con IA, registra datos clinicos, antropometria, descenso de peso y controla el balance calorico diario en tiempo real.";

export const DEFAULT_KEYWORDS = [
  "nutricionista",
  "nutricionistas",
  "software para nutricionistas",
  "app para nutricionistas",
  "sistema para consultorio nutricional",
  "plataforma nutricional",
  "gestion de pacientes nutricion",
  "seguimiento de pacientes en tiempo real",
  "control nutricional diario",
  "adherencia al plan alimenticio",
  "app para pacientes de nutricion",
  "diario de comidas y calorias",
  "plan alimenticio personalizado",
  "armado de planes nutricionales",
  "importar plan alimenticio con IA",
  "datos clinicos nutricion",
  "historia clinica nutricional",
  "antropometria e IMC",
  "composicion corporal porcentaje de grasa masa muscular",
  "catalogo nutricional SARA",
  "bajar de peso",
  "descenso de peso saludable",
  "aumentar masa muscular",
  "recomposicion corporal",
  "nutricion clinica y deportiva",
  "balance calorico diario",
  "nutricionista Tucuman",
  "nutricionistas en Tucuman",
  "San Miguel de Tucuman nutricion",
  "nutricionista Argentina",
  "software nutricion Argentina",
  "NutriOliva",
  "Nutri Oliva",
  "nutrioliva app",
  "nutriolia",
  "nutriholiva",
  "@nutri_olivaa",
].join(", ");

export const INDEX_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex, nofollow";

export const SEO_ROUTES = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    canonical: `${SITE_URL}/`,
    robots: INDEX_ROBOTS,
  },
  "/login": {
    title:
      "Iniciar Sesion — NutriOliva | Acceso para Nutricionistas y Pacientes",
    description:
      "Ingresa a tu cuenta de NutriOliva. Panel de gestion clinica y planes alimenticios para nutricionistas y seguimiento diario para pacientes.",
    canonical: `${SITE_URL}/login`,
    robots: INDEX_ROBOTS,
  },
  "/set-password": {
    title: "Configurar Contraseña Segura — NutriOliva",
    description:
      "Activa tu cuenta o restablece tu contraseña de acceso a la plataforma NutriOliva.",
    canonical: `${SITE_URL}/set-password`,
    robots: NOINDEX_ROBOTS,
  },
  "/panel": {
    title: "Mis Pacientes — Gestion de Consultorio Nutricional | NutriOliva",
    description:
      "Panel profesional del nutricionista: nomina de pacientes activos, alertas de adherencia de 48h, alta clinica e invitaciones automaticas.",
    canonical: `${SITE_URL}/panel`,
    robots: NOINDEX_ROBOTS,
  },
  "/panel/catalogo": {
    title:
      "Catalogo Nutricional SARA (+205 Alimentos y Preparaciones) | NutriOliva",
    description:
      "Base nutricional clinica con calorias, proteinas, carbohidratos y grasas por porcion para planes de descenso de peso, mantenimiento y masa muscular.",
    canonical: `${SITE_URL}/panel/catalogo`,
    robots: NOINDEX_ROBOTS,
  },
  "/panel/cuenta": {
    title: "Mi Cuenta Profesional y Suscripcion | NutriOliva",
    description:
      "Configuracion del consultorio nutricional, metricas de cartera de pacientes, cupo disponible y seguridad de la cuenta.",
    canonical: `${SITE_URL}/panel/cuenta`,
    robots: NOINDEX_ROBOTS,
  },
  "/mi-plan": {
    title: "Mi Plan Alimenticio, Diario de Comidas y Evolucion | NutriOliva",
    description:
      "Panel del paciente: registro diario de comidas, estimacion de calorias con IA, actividad fisica, balance calorico y evolucion antropometrica.",
    canonical: `${SITE_URL}/mi-plan`,
    robots: NOINDEX_ROBOTS,
  },
  "/admin": {
    title: "Suite Super Admin — Gestion SaaS y Metricas IA | NutriOliva",
    description:
      "Administracion central de nutricionistas, planes de suscripcion, facturacion y auditoria de consumo de inteligencia artificial.",
    canonical: `${SITE_URL}/admin`,
    robots: NOINDEX_ROBOTS,
  },
};

/**
 * Resuelve la configuracion SEO correspondiente a cualquier pathname,
 * incluyendo rutas dinamicas (/panel/pacientes/:id y /panel/pacientes/:id/plan) y 404.
 */
export function resolveSeoForPath(pathname = "/") {
  const cleanPath = String(pathname || "/").replace(/\/+$/, "") || "/";

  if (SEO_ROUTES[cleanPath]) {
    return SEO_ROUTES[cleanPath];
  }

  if (/^\/panel\/pacientes\/[^/]+\/plan$/i.test(cleanPath)) {
    return {
      title: "Constructor de Plan Alimenticio e Importacion IA | NutriOliva",
      description:
        "Diseño y versionado de plan alimenticio personalizado con calculo automatico de calorias, macronutrientes, importacion por IA y Excel.",
      canonical: `${SITE_URL}${cleanPath}`,
      robots: NOINDEX_ROBOTS,
    };
  }

  if (/^\/panel\/pacientes\/[^/]+$/i.test(cleanPath)) {
    return {
      title:
        "Ficha Clinica, Datos Antropometricos y Diario del Paciente | NutriOliva",
      description:
        "Seguimiento en tiempo real del paciente: diario de comidas con fotos, balance calorico semanal, composicion corporal e historial clinico.",
      canonical: `${SITE_URL}${cleanPath}`,
      robots: NOINDEX_ROBOTS,
    };
  }

  if (cleanPath.startsWith("/mi-plan")) return SEO_ROUTES["/mi-plan"];
  if (cleanPath.startsWith("/admin")) return SEO_ROUTES["/admin"];
  if (cleanPath.startsWith("/panel")) return SEO_ROUTES["/panel"];

  return {
    title: "Pagina no encontrada (404) — NutriOliva",
    description: "La direccion solicitada no existe en NutriOliva.",
    canonical: `${SITE_URL}/`,
    robots: NOINDEX_ROBOTS,
  };
}

function setMetaTag(attrName, attrValue, content) {
  if (typeof document === "undefined" || !content) return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  if (el.getAttribute("content") !== content) {
    el.setAttribute("content", content);
  }
}

export function applySeoTags({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  canonical,
  robots = INDEX_ROBOTS,
  keywords = DEFAULT_KEYWORDS,
} = {}) {
  if (typeof document === "undefined") return;

  if (title && document.title !== title) {
    document.title = title;
  }

  setMetaTag("name", "title", title);
  setMetaTag("name", "description", description);
  setMetaTag("name", "keywords", keywords);
  setMetaTag("name", "robots", robots);

  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", description);
  if (canonical) setMetaTag("property", "og:url", canonical);

  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", description);
  if (canonical) setMetaTag("name", "twitter:url", canonical);

  if (canonical) {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== canonical) {
      link.setAttribute("href", canonical);
    }
  }
}
