// SetPasswordLeft.jsx — Panel izquierdo del SetPassword
// Contenido diferente segun el flujo (invite o recovery)

import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, KeyRound } from "lucide-react";
import Logo from "@/components/ui/Logo";

const BULLETS = [
  "Acceso privado y seguro",
  "Solo tu nutricionista ve tus datos",
  "Funciona desde cualquier dispositivo",
];

const CONTENT = {
  invite: {
    title: "Bienvenido a tu plan nutricional",
    quote:
      "Tu nutricionista ya armo todo. Solo necesitas crear tu contrasena para empezar.",
  },
  recovery: {
    title: "Crea una nueva contrasena",
    quote:
      "Elige una contrasena segura. La podras cambiar cuando quieras desde tu cuenta.",
  },
};

export default function SetPasswordLeft({ tipoFlujo, mounted }) {
  const content = CONTENT[tipoFlujo] ?? CONTENT.invite;

  return (
    <div className="lg:w-[42%] relative flex flex-col bg-olive-dark overflow-hidden">
      {/* Patron de puntos */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, #F6F1E7 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Circulos decorativos blur */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-olive/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cream/5 blur-3xl pointer-events-none" />

      {/* Header: logo + volver al sitio */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 flex items-center justify-between p-6 pb-0"
      >
        <div className="flex items-center gap-2.5">
          <Logo size={22} />
          <span className="font-display font-bold text-[14px] text-cream">
            NutriOliva
          </span>
        </div>
        <Link to="/">
          <button
            className="flex items-center gap-1.5 bg-cream/10 hover:bg-cream/20
                        text-cream/80 hover:text-cream text-[11px] font-display
                          px-3 py-1.5 rounded-full transition-all duration-200
                          border border-cream/10 hover:border-cream/20"
          >
            Volver al sitio
            <ArrowRight size={11} />
          </button>
        </Link>
      </motion.div>

      {/* Contenido central */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.28 }}
        className="relative z-10 flex-1 mx-5 mt-5 mb-6 flex flex-col items-center justify-center
                    text-center px-6"
      >
        {/* Icono grande */}
        <div className="w-20 h-20 rounded-3xl bg-olive flex items-center justify-center mb-6 shadow-card">
          <KeyRound size={32} className="text-cream" />
        </div>

        {/* Texto animado segun flujo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tipoFlujo}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="font-display font-bold text-cream text-[22px] leading-tight mb-3">
              {content.title}
            </h2>
            <p className="font-editorial italic text-cream/60 text-[14px] leading-relaxed">
              "{content.quote}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Bullets de seguridad */}
        <div className="mt-8 w-full space-y-2.5">
          {BULLETS.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-left">
              <span className="w-4 h-4 rounded-full bg-[#C5D48A]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#C5D48A] text-[8px] font-bold">✓</span>
              </span>
              <span className="text-[12px] text-cream/60 font-display">
                {item}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
