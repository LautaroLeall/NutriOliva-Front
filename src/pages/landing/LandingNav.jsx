// LandingNav.jsx — Navbar sticky con fondo blur al scroll + smooth scroll por seccion
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

// Mapa: texto del link -> id de la seccion en el DOM
const NAV_LINKS = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Funcionalidades", id: "funcionalidades" },
  { label: "Precios", id: "precios" },
];

// Scroll suave a una seccion por su ID
function scrollToSection(id) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${
                    scrolled
                      ? "bg-white/80 backdrop-blur-md border-b border-cream-darker shadow-sm"
                      : "bg-transparent"
                  }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo — click vuelve al tope con smooth */}
        <button
          onClick={() => scrollToSection(null)}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <Logo size={26} />
          <span
            className={`font-display font-bold text-[15px] transition-colors duration-300
                        ${scrolled ? "text-olive-dark" : "text-cream"}`}
          >
            NutriOliva
          </span>
        </button>

        {/* Links con smooth scroll */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`font-display text-[12.5px] transition-colors duration-200 focus:outline-none
                          ${
                            scrolled
                              ? "text-muted hover:text-olive-dark"
                              : "text-cream/80 hover:text-cream"
                          }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`font-display font-semibold text-[12.5px] px-5 py-2.5 rounded-pill
                        transition-all duration-200
                        ${
                          scrolled
                            ? "bg-olive text-cream hover:bg-olive-deep"
                            : "bg-cream text-olive-dark hover:bg-cream-dark"
                        }`}
          >
            Iniciar sesion
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  );
}
