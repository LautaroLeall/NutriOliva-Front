// LandingHowItWorks.jsx — 3 pasos con iconos, numeros y linea conectora animada
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardList, Utensils, BarChart2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Creas el plan",
    desc: "Arma el plan alimenticio en minutos desde el panel del nutricionista. Organizalo por tipo de comida — desayuno, almuerzo, merienda, cena. O importalo con IA: pega el texto de un plan existente y Claude lo estructura automaticamente.",
    color: "#6E7A4B",
    bg: "#DCE3C8",
  },
  {
    number: "02",
    icon: Utensils,
    title: "Tu paciente lo sigue",
    desc: "El paciente recibe acceso por email y empieza a registrar cada comida desde su celular. Escribe lo que comio, sube una foto si quiere, y el sistema calcula los macros — sin apps extra, sin instalaciones.",
    color: "#5C6740",
    bg: "#E8EDDA",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "Ves el progreso",
    desc: 'El panel del nutricionista muestra el balance calorico en tiempo real, el historial completo de registros y cuanto se esta cumpliendo el plan. Sin llamadas, sin preguntar "como vas". Los datos hablan solos.',
    color: "#3F4A2B",
    bg: "#D5DEAD",
  },
];

export default function LandingHowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="como-funciona" ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5
                        rounded-full uppercase tracking-widest mb-4"
          >
            Como funciona
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Tres pasos. Sin complejidad.
          </h2>
          <p className="text-muted text-[14px] mt-3 max-w-md mx-auto">
            Desde que te registras hasta que tu primer paciente tiene su plan
            funcionando.
          </p>
        </motion.div>

        {/* Pasos */}
        <div className="relative">
          {/* Linea conectora de fondo (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px bg-cream-darker z-0" />

          {/* Linea de progreso animada */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
            style={{ originX: 0 }}
            className="hidden md:block absolute top-[52px] left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px bg-olive z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.18,
                    ease: "easeOut",
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icono con numero */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center
                                  shadow-card border-2 border-white"
                      style={{ backgroundColor: step.bg }}
                    >
                      <Icon size={26} style={{ color: step.color }} />
                    </motion.div>
                    <span
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-olive-dark
                                text-cream font-display font-bold text-[10px] flex items-center justify-center"
                    >
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-olive-dark text-[16px] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted text-[12.5px] leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
