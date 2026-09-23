// LandingPricing.jsx — 3 planes con precios reales, hover elevacion y badge "Mas popular"
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Starter",
    price: "75.000",
    period: "/mes",
    desc: "Para nutricionistas que estan empezando o con pocos pacientes activos.",
    patients: "Hasta 15 pacientes",
    popular: false,
    features: [
      "Panel completo del nutricionista",
      "Hasta 15 pacientes activos",
      "Plan alimenticio por tipo de comida",
      "Registro diario del paciente",
      "Balance calorico en tiempo real",
      "Historial de registros",
      "Invitacion por email al paciente",
    ],
    notIncluded: ["Importar plan con IA", "Estimacion de calorias con IA"],
    cta: "Empezar con Starter",
    variant: "ghost",
  },
  {
    name: "Pro",
    price: "125.000",
    period: "/mes",
    desc: "El plan mas elegido por nutricionistas independientes con practica activa.",
    patients: "Hasta 50 pacientes",
    popular: true,
    features: [
      "Todo lo de Starter",
      "Hasta 50 pacientes activos",
      "Importar plan con IA (Claude)",
      "Estimacion de calorias con IA",
      "Fotos en registros diarios",
      "Soporte prioritario",
    ],
    notIncluded: [],
    cta: "Empezar con Pro",
    variant: "primary",
  },
  {
    name: "Clinic",
    price: "150.000",
    period: "/mes",
    desc: "Para clinicas o nutricionistas con alto volumen de pacientes.",
    patients: "Pacientes ilimitados",
    popular: false,
    features: [
      "Todo lo de Pro",
      "Pacientes ilimitados",
      "Panel de gestion de equipo",
      "Acceso a estadisticas avanzadas",
      "Soporte dedicado",
      "Onboarding personalizado",
    ],
    notIncluded: [],
    cta: "Empezar con Clinic",
    variant: "ghost",
  },
];

function formatARS(price) {
  return `$${price} ARS`;
}

export default function LandingPricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="precios" ref={ref} className="py-24 px-6 bg-[#EFEAE0]">
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
            Precios
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Simple. Sin sorpresas.
          </h2>
          <p className="text-muted text-[14px] mt-3 max-w-md mx-auto">
            Paga mes a mes. Sin contratos anuales obligatorios. Cambia de plan
            cuando quieras.
          </p>
        </motion.div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.1 + i * 0.14,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
                boxShadow: plan.popular
                  ? "0 28px 60px rgba(63,74,43,0.28)"
                  : "0 20px 50px rgba(63,74,43,0.14)",
              }}
              className={`relative rounded-2xl p-7 transition-shadow duration-200
                          ${
                            plan.popular
                              ? "bg-olive-dark text-cream ring-2 ring-olive/40"
                              : "bg-white border border-cream-darker text-olive-dark"
                          }`}
            >
              {/* Badge "Mas popular" */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="bg-[#C5D48A] text-olive-dark font-display font-bold text-[10px]
                                  px-4 py-1 rounded-full flex items-center gap-1"
                  >
                    <Zap size={10} className="fill-olive-dark" />
                    Mas popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3
                  className={`font-display font-bold text-[18px] mb-1
                                ${plan.popular ? "text-cream" : "text-olive-dark"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-[11.5px] leading-relaxed
                              ${plan.popular ? "text-cream/60" : "text-muted"}`}
                >
                  {plan.desc}
                </p>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <div className="flex items-end gap-1 mb-1">
                  <span
                    className={`font-display font-bold leading-none
                                  ${plan.popular ? "text-cream" : "text-olive-dark"}`}
                    style={{ fontSize: "2rem" }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`font-display text-[12px] mb-0.5
                                  ${plan.popular ? "text-cream/50" : "text-muted"}`}
                  >
                    ARS{plan.period}
                  </span>
                </div>
                <span
                  className={`font-display text-[11px] font-medium
                                ${plan.popular ? "text-[#C5D48A]" : "text-olive"}`}
                >
                  {plan.patients}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span
                      className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5
                                    ${plan.popular ? "bg-[#C5D48A]/20" : "bg-olive/10"}`}
                    >
                      <Check
                        size={9}
                        className={
                          plan.popular ? "text-[#C5D48A]" : "text-olive"
                        }
                        strokeWidth={3}
                      />
                    </span>
                    <span
                      className={`text-[12px] leading-snug
                                    ${plan.popular ? "text-cream/80" : "text-muted"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 opacity-40">
                    <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-muted/10">
                      <span className="w-2 h-px bg-muted block" />
                    </span>
                    <span className="text-[12px] leading-snug text-muted line-through">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/login" className="block">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-pill font-display font-semibold text-[13px]
                              transition-all duration-150
                              ${
                                plan.popular
                                  ? "bg-cream text-olive-dark hover:bg-cream-dark"
                                  : "bg-olive text-cream hover:bg-olive-deep"
                              }`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Nota al pie */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-[12px] text-muted mt-8"
        >
          Todos los precios son en pesos argentinos. Pago mensual. Sin
          permanencia. Actualmente en piloto — contactanos para acceso gratuito.
        </motion.p>
      </div>
    </section>
  );
}
