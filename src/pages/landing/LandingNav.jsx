// LandingNav.jsx — Navbar sticky con fondo blur al scroll, acceso a Instagram y navegacion movil

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import {
  ADMIN_INSTAGRAM_HANDLE,
  ADMIN_INSTAGRAM_URL,
} from "@/utils/contactLinks";

// Mapa: texto del link -> id de la seccion en el DOM
const NAV_LINKS = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Funcionalidades", id: "funcionalidades" },
  { label: "Contacto", id: "contacto" },
  { label: "FAQ", id: "faq" },
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

function InstagramIcon({ size = 14, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
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
      className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-all duration-300 ${scrolled
        ? "bg-white/85 backdrop-blur-md border-b border-cream-darker shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center gap-3">
        {/* Logo — click vuelve al tope con smooth */}
        <button
          type="button"
          onClick={() => scrollToSection(null)}
          className="flex items-center gap-2.5 focus:outline-none cursor-pointer"
        >
          <Logo size={26} />
          <span
            className={`font-display font-bold text-[15px] transition-colors duration-300 ${scrolled ? "text-olive-dark" : "text-cream"
              }`}
          >
            NutriOliva
          </span>
        </button>

        {/* Links de escritorio con smooth scroll */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className={`font-display text-[12.5px] transition-colors duration-200 focus:outline-none cursor-pointer ${scrolled
                ? "text-muted hover:text-olive-dark"
                : "text-cream/80 hover:text-cream"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Acciones derechas: Instagram oficial + Iniciar sesion */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href={ADMIN_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={`Instagram oficial ${ADMIN_INSTAGRAM_HANDLE}`}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-pill font-display text-[11.5px] font-medium transition-all ${scrolled
              ? "bg-cream text-olive-dark hover:bg-cream-darker border border-cream-darker"
              : "bg-cream/12 text-cream hover:bg-cream/20 border border-cream/25 backdrop-blur-sm"
              }`}
          >
            <InstagramIcon size={13} />
            <span className="hidden sm:inline">{ADMIN_INSTAGRAM_HANDLE}</span>
          </a>

          <Link to="/login">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`font-display font-semibold text-[12px] sm:text-[12.5px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-pill transition-all duration-200 cursor-pointer whitespace-nowrap ${scrolled
                ? "bg-olive text-cream hover:bg-olive-deep"
                : "bg-cream text-olive-dark hover:bg-cream-dark"
                }`}
            >
              Iniciar sesion
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Barra rapida movil (ideal para quienes entran desde el link de la bio de Instagram) */}
      <div
        className={`md:hidden flex items-center justify-center gap-4 sm:gap-5 px-3 py-1.5 border-t overflow-x-auto no-scrollbar whitespace-nowrap transition-colors ${scrolled
          ? "bg-white/90 border-cream-darker/70 text-muted"
          : "bg-olive-dark/45 backdrop-blur-sm border-cream/10 text-cream/80"
          }`}
      >
        {NAV_LINKS.map(({ label, id }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            className={`font-display text-[11px] py-0.5 transition-colors cursor-pointer ${scrolled ? "hover:text-olive-dark" : "hover:text-cream"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
