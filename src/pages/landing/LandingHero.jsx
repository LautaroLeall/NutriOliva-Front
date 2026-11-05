// LandingHero.jsx — Hero principal de NutriOliva (orquestador modular)

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { fadeUp, HERO_FEATURE_PILLS } from "./hero/heroTourData";
import HeroAppMockup from "./hero/HeroAppMockup";

export default function LandingHero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden
                        bg-gradient-to-br from-olive-dark via-olive to-olive-deep animate-gradient"
    >
      {/* Patron de fondo */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #F6F1E7 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #F6F1E7 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16
                      grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
      >
        {/* Texto e indicadores */}
        <div>
          <motion.h1
            {...fadeUp(0.2)}
            className="font-display font-bold text-cream leading-[1.12] mb-6"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            El acompanamiento que tus pacientes necesitan —{" "}
            <span className="text-[#C5D48A]">cada dia</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.32)}
            className="text-cream/75 text-[17px] leading-relaxed mb-10 max-w-lg"
          >
            Plan alimenticio, datos clinicos, registro diario y seguimiento en
            tiempo real. Para nutricionistas que buscan resultados reales — sin
            planillas, sin WhatsApp.
          </motion.p>

          <motion.div {...fadeUp(0.44)} className="flex flex-wrap gap-4 mb-12">
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 12px 36px rgba(246,241,231,0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                className="bg-cream text-olive-dark font-display font-bold px-8 py-3.5 rounded-pill
                            text-[14px] flex items-center gap-2 transition-all cursor-pointer"
              >
                Ingresar al panel
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <a href="#como-funciona">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="border border-cream/30 text-cream font-display font-medium px-7 py-3.5
                            rounded-pill text-[14px] flex items-center gap-2
                          hover:bg-cream/10 transition-all backdrop-blur-sm cursor-pointer"
              >
                <Play size={13} className="fill-cream" />
                Probar demo interactiva
              </motion.button>
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.56)} className="flex flex-wrap gap-3">
            {HERO_FEATURE_PILLS.map((p) => (
              <span
                key={p}
                className="text-[11px] font-display text-cream/70 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5D48A]" />
                {p}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Mockup interactivo paso a paso */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <HeroAppMockup />
        </motion.div>
      </div>

      {/* Ola divisora inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z"
            fill="#EFEAE0"
          />
        </svg>
      </div>
    </section>
  );
}
