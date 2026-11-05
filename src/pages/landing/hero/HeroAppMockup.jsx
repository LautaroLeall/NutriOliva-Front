// HeroAppMockup.jsx — Marco de navegador 3D interactivo para el Hero

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { TOUR_STEPS } from "./heroTourData";
import {
  StepPacientes,
  StepFichaClinica,
  StepPlanAlimenticio,
  StepDiarioVivo,
} from "./HeroMockupSteps";

export default function HeroAppMockup() {
  const [stepIdx, setStepIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % TOUR_STEPS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [paused]);

  const currentStep = TOUR_STEPS[stepIdx];

  return (
    <div
      className="relative w-full max-w-[520px] mx-auto"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sombra flotante */}
      <motion.div
        animate={{ scaleX: [1, 0.86, 1], opacity: [0.2, 0.12, 0.2] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4
                  bg-olive-dark rounded-full blur-xl"
      />

      {/* Browser frame flotante */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ rotateY: -3, rotateX: 2, scale: 1.015 }}
        style={{ transformStyle: "preserve-3d" }}
        className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(63,74,43,0.32)] overflow-hidden border border-cream-darker"
      >
        {/* Barra del browser */}
        <div className="bg-[#F0EDE6] px-3.5 py-2.5 flex items-center gap-2 border-b border-cream-darker">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-2 bg-white rounded-md px-3 py-1 text-[9.5px] text-muted font-display flex items-center justify-between">
            <span className="truncate">{currentStep.url}</span>
            <span className="text-[8px] text-olive font-semibold uppercase tracking-wider">
              En vivo
            </span>
          </div>
        </div>

        {/* Navbar real del Panel del Nutricionista */}
        <div className="bg-olive-dark px-4 py-2.5 flex items-center justify-between border-b border-[#55613A]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-display font-semibold text-cream text-[11px]">
              NutriOliva
            </span>
            <div className="flex items-center gap-1 ml-2">
              <span className="px-2 py-0.5 rounded-full bg-olive text-cream font-display text-[8.5px]">
                Mis pacientes
              </span>
              <span className="px-2 py-0.5 rounded-full text-[#C9D3AC] font-display text-[8.5px]">
                Catalogo
              </span>
            </div>
          </div>
          <span className="text-[8.5px] font-display text-[#C9D3AC]">
            Lic. Olivia
          </span>
        </div>

        {/* Contenido dinamico paso a paso */}
        <div className="bg-[#EFEAE0] p-3.5 min-h-[255px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {stepIdx === 0 && <StepPacientes />}
              {stepIdx === 1 && <StepFichaClinica />}
              {stepIdx === 2 && <StepPlanAlimenticio />}
              {stepIdx === 3 && <StepDiarioVivo />}
            </motion.div>
          </AnimatePresence>

          {/* Barra inferior de pasos interactivos */}
          <div className="mt-3 pt-2 border-t border-cream-darker flex items-center justify-between gap-1">
            {TOUR_STEPS.map((st, idx) => {
              const active = stepIdx === idx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStepIdx(idx)}
                  className={`relative flex-1 py-1.5 px-2 rounded-lg font-display text-[8.5px] transition-colors cursor-pointer text-center ${active
                    ? "text-cream font-semibold"
                    : "text-muted hover:text-olive-dark bg-white/60"
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="hero-mockup-step-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-lg bg-olive-dark"
                    />
                  )}
                  <span className="relative z-10">{st.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Badge flotante superior derecho */}
      <AnimatePresence mode="wait">
        <motion.div
          key={"top-" + stepIdx}
          initial={{ opacity: 0, x: 14, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 10, y: -4 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-3 -right-3 bg-white border border-cream-darker rounded-xl px-3 py-2 shadow-card z-20"
        >
          <p className="font-display text-[9px] text-olive-dark font-semibold">
            {currentStep.topBadgeTitle}
          </p>
          <p className="font-display text-[8px] text-success">
            {currentStep.topBadgeSub}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Badge flotante inferior izquierdo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={"bot-" + stepIdx}
          initial={{ opacity: 0, x: -14, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -10, y: 4 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-3 -left-4 bg-olive-dark text-cream rounded-xl px-3 py-2 shadow-modal z-20"
        >
          <p className="font-display text-[9px] font-semibold">
            {currentStep.bottomBadgeTitle}
          </p>
          <p className="font-display text-[8px] text-cream/70">
            {currentStep.bottomBadgeSub}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
