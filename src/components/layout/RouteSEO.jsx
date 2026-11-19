// src/components/layout/RouteSEO.jsx
// Componente automatizado que sincroniza <title>, <meta>, Open Graph, canonical y robots
// en cada cambio de ruta tanto en la Landing como dentro del sistema.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resolveSeoForPath, applySeoTags } from "@/lib/seoConfig";

export default function RouteSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seoData = resolveSeoForPath(pathname);
    applySeoTags(seoData);
  }, [pathname]);

  return null;
}
