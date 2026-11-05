// LandingFAQ.jsx — Accordion de preguntas frecuentes con animacion de expand/collapse

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "¿Mis pacientes necesitan instalar algo?",
    a: "No. NutriOliva funciona 100% desde el navegador web, tanto en celular como en computadora. El paciente recibe un email con su acceso y ya puede registrar sus comidas sin descargar ninguna app.",
  },
  {
    q: "¿Como invito a un paciente al sistema?",
    a: 'Desde el panel del nutricionista, al dar de alta al paciente o desde su ficha haces clic en "Invitar por email". El sistema envia automaticamente un correo con el enlace de acceso para que configure su clave e ingrese de inmediato.',
  },
  {
    q: "¿Puedo importar un plan que ya tengo hecho?",
    a: 'Si. Si tenes un plan en PDF, Excel, Word o texto, podes importarlo en el constructor de planes y el sistema lo estructura automaticamente dividido por tipo de comida y con calorias y macronutrientes.',
  },
  {
    q: "¿Los datos de mis pacientes son privados?",
    a: "Si. Cada nutricionista solo puede ver y modificar los datos clinicos y planes de sus propios pacientes. Esto esta garantizado a nivel base de datos mediante Row Level Security (RLS) en Supabase.",
  },
  {
    q: "¿Como solicito el alta de mi cuenta profesional?",
    a: "Podes comunicarte directamente con nosotros por WhatsApp al +549 381 339 9463 o por correo a lautaroleal4@gmail.com. Coordinamos el alta de tu cuenta segun la cantidad de pacientes que manejes en tu consultorio.",
  },
  {
    q: "¿Puedo ampliar mi cupo de pacientes mas adelante?",
    a: "Si. A medida que tu cartera de pacientes crece, podemos ampliar tu cupo o actualizar tu nivel de cuenta de forma inmediata sin perder ningun dato ni historial.",
  },
  {
    q: "¿La estimacion con IA es precisa?",
    a: "Es una estimacion muy util y agil para el seguimiento diario de adherencia y tendencias caloricas. Combina la base nutricional SARA con inteligencia artificial para que el paciente nunca deje de registrar por no saber las calorias exactas.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-cream-darker rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 py-4 bg-white
                    hover:bg-cream/40 transition-colors duration-150 text-left cursor-pointer"
      >
        <span className="font-display font-semibold text-olive-dark text-[13.5px] pr-4">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 bg-cream/30 border-t border-cream-darker">
              <p className="text-muted text-[13px] leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingFAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5
                          rounded-full uppercase tracking-widest mb-4"
          >
            Preguntas frecuentes
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Todo lo que necesitas saber
          </h2>
        </motion.div>

        {/* Acordeon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
