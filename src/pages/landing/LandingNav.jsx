// LandingNav.jsx — Navbar sticky con fondo blur al scroll
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "@/components/ui/Logo";

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
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <span
            className={`font-display font-bold text-[15px] transition-colors duration-300
                            ${scrolled ? "text-olive-dark" : "text-cream"}`}
          >
            NutriOliva
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Como funciona", "Funcionalidades", "Precios"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={`font-display text-[12.5px] transition-colors duration-200
                          ${scrolled ? "text-muted hover:text-olive-dark" : "text-cream/80 hover:text-cream"}`}
            >
              {item}
            </a>
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
