// LandingCTA.jsx — Seccion CTA final con circulos animados, canales oficiales + Footer

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, ExternalLink } from "lucide-react";
import Logo from "@/components/ui/Logo";
import {
  ADMIN_EMAIL,
  ADMIN_INSTAGRAM_HANDLE,
  ADMIN_INSTAGRAM_URL,
  ADMIN_TELEFONO_DISPLAY,
  ADMIN_WHATSAPP,
  buildWhatsAppUrl,
  getEmailLinkProps,
} from "@/utils/contactLinks";

// Mismo helper que en LandingNav
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
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

const FOOTER_LINKS = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Funcionalidades", id: "funcionalidades" },
  { label: "Contacto", id: "contacto" },
  { label: "FAQ", id: "faq" },
];

export default function LandingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const ctaEmailProps = getEmailLinkProps(
    ADMIN_EMAIL,
    "Consulta sobre NutriOliva",
    "Hola equipo de NutriOliva, quiero consultar sobre la plataforma para mi consultorio."
  );

  const footerEmailProps = getEmailLinkProps(
    ADMIN_EMAIL,
    "Consulta sobre NutriOliva"
  );

  return (
    <>
      {/* ── CTA Final ───────────────────────────────────────────────────────── */}
      <section
        ref={ref}
        className="relative py-28 px-5 sm:px-6 overflow-hidden
                    bg-gradient-to-br from-olive-dark via-olive-deep to-olive"
      >
        {/* Patron de puntos con pulso suave */}
        <motion.div
          animate={{ opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 40% 40%, #F6F1E7 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Halos luminosos flotantes de fondo */}
        <motion.div
          animate={{
            x: [-30, 35, -30],
            y: [-20, 25, -20],
            scale: [1, 1.18, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#C5D48A]/12 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [30, -35, 30],
            y: [20, -25, 20],
            scale: [1.1, 0.92, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cream/10 blur-3xl pointer-events-none"
        />

        {/* Anillos concentricos animados con rotacion y respiracion */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 26, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] rounded-full border border-cream/12 absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C5D48A]/60 shadow-[0_0_14px_#C5D48A]" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cream/40" />
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
              scale: [1.03, 0.96, 1.03],
            }}
            transition={{
              rotate: { duration: 36, repeat: Infinity, ease: "linear" },
              scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-[540px] h-[540px] sm:w-[640px] sm:h-[640px] rounded-full border border-dashed border-[#C5D48A]/15 absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C5D48A]/50 shadow-[0_0_12px_#C5D48A]" />
          </motion.div>

          <motion.div
            animate={{
              rotate: 360,
              scale: [0.97, 1.06, 0.97],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              rotate: { duration: 48, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-[700px] h-[700px] sm:w-[820px] sm:h-[820px] rounded-full border border-cream/8 absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-cream/35" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-cream leading-tight mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Empieza hoy.{" "}
            <span className="text-[#C5D48A]">
              Transforma el seguimiento de tu consultorio.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-cream/75 text-[16px] leading-relaxed mb-10 max-w-lg mx-auto"
          >
            Comunicate con nosotros para activar tu cuenta de nutricionista y
            comenzar a acompanar a tus pacientes en tiempo real.
          </motion.p>

          {/* Disposicion piramidal:
              Fila 1 (Arriba al centro): Ingresar a la plataforma
              Fila 2 (Abajo): WhatsApp, Email oficial e Instagram */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-col items-center gap-4 max-w-2xl mx-auto"
          >
            {/* Vertice superior: Ingresar a la plataforma */}
            <Link to="/login" className="inline-block">
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 18px 44px rgba(246,241,231,0.28)",
                }}
                whileTap={{ scale: 0.97 }}
                className="relative bg-cream text-olive-dark font-display font-bold px-10 py-4
                            rounded-pill text-[15px] flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer shadow-lg group"
              >
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent
                              -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
                <span className="relative">Ingresar a la plataforma</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex items-center"
                >
                  <ArrowRight size={16} />
                </motion.span>
              </motion.button>
            </Link>

            {/* Base: WhatsApp + Email + Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
              <motion.a
                href={buildWhatsAppUrl(
                  ADMIN_WHATSAPP,
                  "Hola! Quiero consultar por NutriOliva para mi consultorio."
                )}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.03,
                  y: -2,
                  backgroundColor: "rgba(246, 241, 231, 0.14)",
                }}
                whileTap={{ scale: 0.97 }}
                className="border border-cream/30 text-cream font-display font-medium px-4 py-3.5
                            rounded-pill text-[12.5px] flex items-center justify-center gap-2
                            transition-all backdrop-blur-sm shadow-sm whitespace-nowrap"
              >
                <Phone size={14} className="text-[#C5D48A] flex-shrink-0" />
                <span>{ADMIN_TELEFONO_DISPLAY}</span>
                <ExternalLink size={11} className="opacity-65 flex-shrink-0" />
              </motion.a>

              <motion.a
                {...ctaEmailProps}
                whileHover={{
                  scale: 1.03,
                  y: -2,
                  backgroundColor: "rgba(246, 241, 231, 0.14)",
                }}
                whileTap={{ scale: 0.97 }}
                className="border border-cream/30 text-cream font-display font-medium px-4 py-3.5
                            rounded-pill text-[12.5px] flex items-center justify-center gap-2
                            transition-all backdrop-blur-sm shadow-sm whitespace-nowrap"
              >
                <Mail size={14} className="text-[#C5D48A] flex-shrink-0" />
                <span>{ADMIN_EMAIL}</span>
                <ExternalLink size={11} className="opacity-65 flex-shrink-0" />
              </motion.a>

              <motion.a
                href={ADMIN_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.03,
                  y: -2,
                  backgroundColor: "rgba(246, 241, 231, 0.14)",
                }}
                whileTap={{ scale: 0.97 }}
                className="border border-cream/30 text-cream font-display font-medium px-4 py-3.5
                            rounded-pill text-[12.5px] flex items-center justify-center gap-2
                            transition-all backdrop-blur-sm shadow-sm whitespace-nowrap"
              >
                <InstagramIcon
                  size={14}
                  className="text-[#C5D48A] flex-shrink-0"
                />
                <span>{ADMIN_INSTAGRAM_HANDLE}</span>
                <ExternalLink size={11} className="opacity-65 flex-shrink-0" />
              </motion.a>
            </div>
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

          {/* Links con smooth scroll */}
          <div className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map(({ label, id }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="font-display text-[11px] text-cream/40 hover:text-cream/70 transition-colors focus:outline-none cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contacto & Copyright */}
          <div className="text-center md:text-right">
            <div className="font-display text-[11px] text-cream/55 flex flex-wrap items-center justify-center md:justify-end gap-2">
              <a
                {...footerEmailProps}
                className="hover:text-cream transition-colors"
              >
                {ADMIN_EMAIL}
              </a>
              <span>·</span>
              <a
                href={buildWhatsAppUrl(
                  ADMIN_WHATSAPP,
                  "Hola! Quiero consultar por NutriOliva"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
              >
                {ADMIN_TELEFONO_DISPLAY}
              </a>
              <span>·</span>
              <a
                href={ADMIN_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors inline-flex items-center gap-1"
              >
                <InstagramIcon size={11} />
                <span>{ADMIN_INSTAGRAM_HANDLE}</span>
              </a>
            </div>
            <p className="font-display text-[10px] text-cream/30 mt-1">
              2026 NutriOliva — Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
