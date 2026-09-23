// LoginLeftPanel.jsx — Panel izquierdo con branding NutriOliva
// Incluye: logo, slides con quotes rotativas, mini mockup de la app, dots

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";

// ── Datos de slides ────────────────────────────────────────────────────────
const SLIDES = [
  {
    quote: "El acompanamiento que tus pacientes necesitan, cada dia.",
    sub: "Plan alimenticio + registro diario + balance en tiempo real.",
  },
  {
    quote: "Sin planillas. Sin WhatsApp. Solo datos que hablan solos.",
    sub: "Historial completo de cada paciente desde el panel del nutricionista.",
  },
  {
    quote: "La IA estima las calorias en segundos.",
    sub: "Tu paciente describe lo que comio y el sistema hace el resto.",
  },
];

// ── Patron de puntos de fondo ──────────────────────────────────────────────
function DotPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `radial-gradient(circle, #F6F1E7 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    />
  );
}

// ── Mini mockup del panel de pacientes ────────────────────────────────────
const MOCK_PATIENTS = [
  { name: "Maria Lopez", pct: 91, color: "#6E9B5C" },
  { name: "Carlos Ruiz", pct: 110, color: "#D8A93A" },
  { name: "Ana Gimenez", pct: 51, color: "#C4573F" },
];

function AppPreview() {
  return (
    <div className="p-4 space-y-2.5">
      {/* Barra top del mini dashboard */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-[9px] text-cream/50 uppercase tracking-widest">
          Panel Nutricionista
        </span>
        <div className="flex gap-1">
          {["bg-[#FF5F57]", "bg-[#FEBC2E]", "bg-[#28C840]"].map((c, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
          ))}
        </div>
      </div>

      {MOCK_PATIENTS.map((p) => (
        <div
          key={p.name}
          className="bg-cream/5 rounded-lg p-2 border border-cream/5"
        >
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full bg-olive flex items-center justify-center
                            text-[7px] text-cream font-bold"
              >
                {p.name[0]}
              </span>
              <span className="font-display text-[9px] text-cream/80">
                {p.name}
              </span>
            </div>
            <span className="text-[8px] text-cream/40">{p.pct}%</span>
          </div>
          <div className="h-1 bg-cream/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(p.pct, 100)}%`,
                backgroundColor: p.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Componente principal del panel izquierdo ───────────────────────────────
export default function LoginLeftPanel({ mounted }) {
  const [slideIdx, setSlideIdx] = useState(0);

  // Auto-avance cada 4 segundos
  useEffect(() => {
    const t = setInterval(
      () => setSlideIdx((i) => (i + 1) % SLIDES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="lg:w-[42%] relative flex flex-col bg-olive-dark overflow-hidden">
      <DotPattern />

      {/* Círculos decorativos */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-olive/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cream/5 blur-3xl pointer-events-none" />

      {/* Header: logo + volver */}
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

      {/* Visual central con gradiente + quote superpuesta */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="relative z-10 flex-1 mx-5 mt-5 mb-4 rounded-2xl overflow-hidden
                  bg-[#2A3420] border border-cream/10"
        style={{ minHeight: 240 }}
      >
        {/* Gradiente inferior para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-olive-dark via-olive-dark/20 to-transparent z-10" />

        {/* Mini mockup */}
        <AppPreview />

        {/* Quote animada */}
        <div className="absolute bottom-5 left-0 right-0 text-center px-5 z-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={slideIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="font-editorial italic text-cream text-[14px] leading-snug"
            >
              "{SLIDES[slideIdx].quote}"
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Dots de navegacion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex justify-center gap-1.5 mb-5"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              slideIdx === i
                ? "w-5 bg-cream"
                : "w-2.5 bg-cream/20 hover:bg-cream/40"
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
