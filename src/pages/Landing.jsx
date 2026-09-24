// Landing.jsx — Orquestador de las 10 secciones
// Cada sección tiene su id para que el navbar pueda hacer scrollIntoView

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

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar fija con blur al scroll */}
      <LandingNav />

      {/* Hero — full height con mockup flotante | id: hero */}
      <section id="hero">
        <LandingHero />
      </section>

      {/* 3 stats con contador animado */}
      <LandingStats />

      {/* Como funciona — 3 pasos con linea conectora | id: como-funciona */}
      <section id="como-funciona">
        <LandingHowItWorks />
      </section>

      {/* 6 feature cards con hover 3D | id: funcionalidades */}
      <section id="funcionalidades">
        <LandingFeatures />
      </section>

      {/* Para el nutricionista vs para el paciente */}
      <LandingForWho />

      {/* Quote editorial en fondo oscuro */}
      <LandingQuote />

      {/* Pricing — 3 planes con precios reales | id: precios */}
      <section id="precios">
        <LandingPricing />
      </section>

      {/* FAQ — accordion animado | id: faq */}
      <section id="faq">
        <LandingFAQ />
      </section>

      {/* CTA final + Footer */}
      <LandingCTA />
    </div>
  );
}
