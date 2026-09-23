// LandingFeatures.jsx — 6 feature cards con hover 3D y stagger al entrar en viewport
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ClipboardList,
  Brain,
  Utensils,
  Flame,
  TrendingUp,
  History,
} from "lucide-react";

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Plan alimenticio personalizado",
    desc: "Crea el plan organizando por tipo de comida — desayuno, almuerzo, merienda, cena. Con calorias, proteinas, carbos y grasas por cada item.",
    badge: "Plan",
    color: "#6E7A4B",
    bg: "#DCE3C8",
  },
  {
    icon: Brain,
    title: "Importar plan con IA",
    desc: "Tenes un plan en Word o en papel? Pegalo como texto y Claude lo estructura automaticamente en el sistema — listo para que el paciente lo siga.",
    badge: "IA",
    color: "#5C6740",
    bg: "#E8EDDA",
    highlight: true,
  },
  {
    icon: Utensils,
    title: "Registro diario simple",
    desc: "Tu paciente describe lo que comio con sus propias palabras. El sistema calcula los macros automaticamente. Sin codigos de barra, sin buscar en bases de datos.",
    badge: "Registro",
    color: "#3F4A2B",
    bg: "#D5DEAD",
  },
  {
    icon: Flame,
    title: "Estimacion con IA",
    desc: 'El paciente escribe "pollo grillado con ensalada y arroz" y la IA estima calorias, proteinas, carbos y grasas. Sin weighing scale, sin calcular a mano.',
    badge: "IA",
    color: "#D85A30",
    bg: "#FAECE7",
    highlight: true,
  },
  {
    icon: TrendingUp,
    title: "Balance en tiempo real",
    desc: "Calorias consumidas vs objetivo del dia. El balance se actualiza con cada registro. El paciente sabe en todo momento si tiene margen o si ya paso el limite.",
    badge: "Balance",
    color: "#6E9B5C",
    bg: "#E8F3E5",
  },
  {
    icon: History,
    title: "Historial completo",
    desc: "El nutricionista accede al historial de cada paciente: cada comida registrada, con fecha, descripcion, macros y fotos. Todo en un solo lugar, sin preguntar.",
    badge: "Historial",
    color: "#D8A93A",
    bg: "#FBF3E0",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function LandingFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="funcionalidades" ref={ref} className="py-24 px-6 bg-[#EFEAE0]">
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
            Funcionalidades
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-muted text-[14px] mt-3 max-w-md mx-auto">
            Sin apps extra, sin integraciones. NutriOliva cubre todo el ciclo de
            seguimiento.
          </p>
        </motion.div>

        {/* Grid de features */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{
                  rotateY: 4,
                  rotateX: -3,
                  scale: 1.025,
                  boxShadow: "0 20px 50px rgba(63,74,43,0.16)",
                }}
                style={{
                  transformPerspective: 900,
                  transformStyle: "preserve-3d",
                }}
                className={`relative bg-white border rounded-2xl p-6 cursor-default
                            transition-shadow duration-200
                            ${f.highlight ? "border-olive/30 ring-1 ring-olive/20" : "border-cream-darker"}`}
              >
                {/* Badge IA */}
                {f.badge === "IA" && (
                  <span
                    className="absolute top-4 right-4 bg-olive text-cream font-display font-semibold
                                text-[9px] px-2 py-0.5 rounded-full tracking-wide"
                  >
                    IA
                  </span>
                )}

                {/* Icono */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.bg }}
                >
                  <Icon size={20} style={{ color: f.color }} />
                </div>

                <h3 className="font-display font-bold text-olive-dark text-[14px] mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-muted text-[12px] leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
