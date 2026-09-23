// LandingForWho.jsx — 2 columnas: nutricionista vs paciente
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const NUTRI_BENEFITS = [
  "Panel centralizado con todos tus pacientes",
  "Ve quien cumple el plan y quien no — sin llamar",
  "Historial completo de cada registro",
  "Crea o importa planes en minutos con IA",
  "Notificaciones cuando un paciente registra",
  "Sin Excel, sin planillas, sin WhatsApp de seguimiento",
];

const PACIENTE_BENEFITS = [
  "Acceso desde cualquier dispositivo, sin instalar nada",
  "Registra tus comidas en menos de 60 segundos",
  "La IA estima las calorias si no sabes el dato exacto",
  "Ve tu balance calorico del dia en tiempo real",
  "Tu plan siempre disponible, actualizado por tu nutri",
  "Sube fotos de tus comidas para mas contexto",
];

function BenefitList({ items, color }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ backgroundColor: color + "22" }}
          >
            <Check size={11} style={{ color }} strokeWidth={3} />
          </span>
          <span className="text-[13px] text-muted leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LandingForWho() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5
                        rounded-full uppercase tracking-widest mb-4"
          >
            Para quien es
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Disenado para los dos lados de la consulta
          </h2>
        </motion.div>

        {/* 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nutricionista */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="bg-olive-dark rounded-2xl p-8 text-cream transition-shadow duration-200
                        hover:shadow-[0_24px_60px_rgba(63,74,43,0.24)]"
          >
            <div className="w-10 h-10 rounded-xl bg-olive flex items-center justify-center mb-5">
              <span className="font-display font-bold text-cream text-[14px]">
                N
              </span>
            </div>
            <h3 className="font-display font-bold text-[20px] mb-1">
              Para el nutricionista
            </h3>
            <p className="text-cream/60 text-[12.5px] mb-6 leading-relaxed">
              Todo tu trabajo de seguimiento en un solo lugar. Mas tiempo para
              lo que importa.
            </p>
            <ul className="space-y-3">
              {NUTRI_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-[#C5D48A]/20">
                    <Check
                      size={11}
                      className="text-[#C5D48A]"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-[13px] text-cream/80 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Paciente */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="bg-cream border border-cream-darker rounded-2xl p-8
                        transition-shadow duration-200
                        hover:shadow-[0_24px_60px_rgba(63,74,43,0.12)]"
          >
            <div className="w-10 h-10 rounded-xl bg-olive-dark flex items-center justify-center mb-5">
              <span className="font-display font-bold text-cream text-[14px]">
                P
              </span>
            </div>
            <h3 className="font-display font-bold text-olive-dark text-[20px] mb-1">
              Para el paciente
            </h3>
            <p className="text-muted text-[12.5px] mb-6 leading-relaxed">
              Registrar lo que comes nunca fue tan rapido. Sin barreras, sin
              excusas.
            </p>
            <BenefitList items={PACIENTE_BENEFITS} color="#6E7A4B" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
