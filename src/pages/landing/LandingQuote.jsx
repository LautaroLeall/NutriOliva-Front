// LandingQuote.jsx — Frase editorial en fondo olive-dark con animacion de fade
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function LandingQuote() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 px-6 overflow-hidden
                  bg-gradient-to-br from-olive-dark to-olive-deep"
    >
      {/* Patron de fondo */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, #F6F1E7 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Circulo decorativo grande */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-olive/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cream/5 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Comillas decorativas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="font-editorial text-[80px] text-cream/10 leading-none select-none mb-[-24px]"
          aria-hidden
        >
          &ldquo;
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
          className="font-editorial italic text-cream leading-relaxed"
          style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.75rem)" }}
        >
          El problema no es que el paciente no quiera seguir el plan — es que
          entre una consulta y la siguiente,{" "}
          <span className="text-[#C5D48A] not-italic font-semibold">
            nadie lo acompana.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ originX: 0.5 }}
          className="w-12 h-px bg-cream/30 mx-auto mt-8 mb-5"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="font-display text-[12px] text-cream/50 tracking-widest uppercase"
        >
          El problema que NutriOliva resuelve
        </motion.p>
      </div>
    </section>
  );
}
