// src/lib/seo.js
// Hook usePageMeta y re-export de utilidades SEO por ruta.

import { useEffect } from "react";
import {
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESC,
  DEFAULT_KEYWORDS,
  INDEX_ROBOTS,
  NOINDEX_ROBOTS,
  SEO_ROUTES,
  resolveSeoForPath,
  applySeoTags,
} from "./seoConfig";

export {
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESC,
  DEFAULT_KEYWORDS,
  INDEX_ROBOTS,
  NOINDEX_ROBOTS,
  SEO_ROUTES,
  resolveSeoForPath,
  applySeoTags,
};

/**
 * Permite sobreescribir dinamicamente titulo y descripcion en vistas con datos cargados
 * (por ejemplo, el nombre del paciente en su ficha o plan alimenticio).
 */
export function usePageMeta({ title, description, noindex = true, canonical } = {}) {
  useEffect(() => {
    const robots =
      typeof noindex === "boolean"
        ? noindex
          ? NOINDEX_ROBOTS
          : INDEX_ROBOTS
        : INDEX_ROBOTS;
    applySeoTags({
      title: title || DEFAULT_TITLE,
      description: description || DEFAULT_DESC,
      canonical,
      robots,
    });
  }, [title, description, noindex, canonical]);
}
