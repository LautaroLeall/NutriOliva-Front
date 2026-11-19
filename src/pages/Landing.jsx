// Landing.jsx — Orquestador de las secciones de la pagina principal
// Limpia parametros de tracking externos (Instagram utm_*, fbclid, igshid) de la barra
// de direcciones sin recargar la pagina y soporta enlaces directos con #hash.

import { useEffect } from "react";
import LandingNav from "./landing/LandingNav";
import LandingHero from "./landing/LandingHero";
import LandingStats from "./landing/LandingStats";
import LandingHowItWorks from "./landing/LandingHowItWorks";
import LandingFeatures from "./landing/LandingFeatures";
import LandingForWho from "./landing/LandingForWho";
import LandingQuote from "./landing/LandingQuote";
import LandingPricing from "./landing/LandingPricing";
import LandingFAQ from "./landing/LandingFAQ";
import LandingCTA from "./landing/LandingCTA";

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "igshid",
  "gclid",
];

export default function Landing() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Limpiar parametros de seguimiento (ej: link in bio de Instagram) de la URL visible
    try {
      const url = new URL(window.location.href);
      let modified = false;
      TRACKING_PARAMS.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          modified = true;
        }
      });

      if (modified) {
        const cleanSearch = url.searchParams.toString();
        const cleanUrl = `${url.pathname}${cleanSearch ? `?${cleanSearch}` : ""}${url.hash}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch {
      // Ignorar si el navegador restringe history.replaceState
    }

    // 2. Si viene con un #hash (ej: #como-funciona o #contacto), hacer scroll suave a la seccion
    if (window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar fija con blur al scroll */}
      <LandingNav />

      {/* Hero — full height con mockup interactivo paso a paso | id: hero */}
      <section id="hero">
        <LandingHero />
      </section>

      {/* 3 stats con contador animado */}
      <LandingStats />

      {/* Como funciona — 3 pasos + Demo interactiva del paciente | id: como-funciona */}
      <LandingHowItWorks />

      {/* 6 feature cards con hover 3D | id: funcionalidades */}
      <LandingFeatures />

      {/* Para el nutricionista vs para el paciente */}
      <LandingForWho />

      {/* Quote editorial en fondo oscuro */}
      <LandingQuote />

      {/* Contacto directo — WhatsApp, Email e Instagram | id: contacto */}
      <LandingPricing />

      {/* FAQ — accordion animado | id: faq */}
      <section id="faq">
        <LandingFAQ />
      </section>

      {/* CTA final + Footer */}
      <LandingCTA />
    </div>
  );
}
