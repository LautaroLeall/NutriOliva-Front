// LandingCTA.jsx — Seccion CTA final + Footer
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function LandingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      {/* ── CTA Final ───────────────────────────────────────────────────────── */}
      <section
        ref={ref}
        className="relative py-28 px-6 overflow-hidden
                    bg-gradient-to-br from-olive-dark via-olive-deep to-olive"
      >
        {/* Patron */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 40% 40%, #F6F1E7 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Anillos decorativos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full border border-cream/5 absolute -translate-x-1/2 -translate-y-1/2" />
          <div className="w-[700px] h-[700px] rounded-full border border-cream/3 absolute -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <span
              className="inline-block bg-[#C5D48A]/20 border border-[#C5D48A]/30 text-[#C5D48A]
                          font-display text-[11px] px-4 py-1.5 rounded-full mb-6 tracking-wide"
            >
              Piloto gratuito por tiempo limitado
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-cream leading-tight mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Empieza hoy.{" "}
            <span className="text-[#C5D48A]">Sin tarjeta de credito.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-cream/65 text-[16px] leading-relaxed mb-10 max-w-lg mx-auto"
          >
            Actualmente en piloto. Los primeros nutricionistas en registrarse
            obtienen acceso al plan Pro gratuitamente por 30 dias.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 16px 40px rgba(246,241,231,0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                className="relative bg-cream text-olive-dark font-display font-bold px-9 py-4
                            rounded-pill text-[15px] flex items-center gap-2.5 overflow-hidden"
              >
                {/* Efecto shimmer en hover */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                              -translate-x-full hover:translate-x-full transition-transform duration-700"
                />
                <span className="relative">Crear cuenta gratis</span>
                <ArrowRight size={16} className="relative" />
              </motion.button>
            </Link>

            <motion.a
              href="mailto:hola@nutrioliva.com"
              whileHover={{ scale: 1.03 }}
              className="border border-cream/25 text-cream font-display font-medium px-7 py-4
                          rounded-pill text-[14px] flex items-center gap-2
                        hover:bg-cream/10 transition-all backdrop-blur-sm"
            >
              <Mail size={14} />
              Contactar al equipo
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#2A3120] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo y nombre */}
          <div className="flex items-center gap-2.5">
            <Logo size={22} />
            <span className="font-display font-bold text-[13px] text-cream/80">
              NutriOliva
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            {["Funcionalidades", "Precios", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="font-display text-[11px] text-cream/40 hover:text-cream/70 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-display text-[11px] text-cream/30">
            2026 NutriOliva — Todos los derechos reservados
          </p>
        </div>
      </footer>
    </>
  );
}
