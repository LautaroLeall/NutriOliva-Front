// LandingStats.jsx — 3 numeros grandes con animacion de contador al entrar en viewport
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCounter(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

const STATS = [
  {
    value: 100,
    suffix: "%",
    label: "Digital",
    desc: "Sin planillas de Excel, sin papel, sin WhatsApp para hacer seguimiento",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Disponible",
    desc: "Tu paciente registra cuando come — no cuando tiene turno contigo",
  },
  {
    value: 3,
    suffix: " min",
    label: "Por dia",
    desc: "Es todo lo que le lleva al paciente registrar sus comidas del dia",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.13, ease: "easeOut" },
  }),
};

export default function LandingStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const c0 = useCounter(STATS[0].value, 1600, inView);
  const c1 = useCounter(STATS[1].value, 1200, inView);
  const c2 = useCounter(STATS[2].value, 900, inView);
  const counts = [c0, c1, c2];

  return (
    <section ref={ref} className="bg-[#EFEAE0] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5
                        rounded-full uppercase tracking-widest mb-4"
          >
            Por que NutriOliva
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Menos friccion. Mas adherencia.
          </h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 50px rgba(63,74,43,0.14)",
              }}
              className="bg-white border border-cream-darker rounded-2xl px-8 py-8 text-center
                          transition-shadow duration-200"
            >
              <div
                className="font-display font-bold text-olive-dark leading-none mb-2"
                style={{ fontSize: "clamp(3rem, 6vw, 4rem)" }}
              >
                {counts[i]}
                {s.suffix}
              </div>
              <div className="font-display font-semibold text-olive text-[13px] mb-3">
                {s.label}
              </div>
              <p className="text-muted text-[12px] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
