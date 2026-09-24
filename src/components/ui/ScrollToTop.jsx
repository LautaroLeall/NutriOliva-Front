// ScrollToTop.jsx — Sube al tope de la pagina en cada cambio de ruta

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantaneo al tope en cada navegacion entre rutas
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
