// LandingHero.jsx — Hero principal con mockup flotante de la app
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

// Variantes reutilizables
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: "easeOut" },
  },
});

// ── Mini mockup de la app (representacion en CSS/HTML) ──────────────────────
function AppMockup() {
  return (
    <div
      className="relative w-full max-w-[480px] mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Sombra flotante */}
      <motion.div
        animate={{ scaleX: [1, 0.82, 1], opacity: [0.18, 0.1, 0.18] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4
                  bg-olive-dark rounded-full blur-xl"
      />

      {/* Browser frame flotante */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ rotateY: -4, rotateX: 3, scale: 1.02 }}
        style={{ transformStyle: "preserve-3d" }}
        className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(63,74,43,0.28)] overflow-hidden border border-cream-darker"
      >
        {/* Barra del browser */}
        <div className="bg-[#F0EDE6] px-4 py-3 flex items-center gap-2 border-b border-cream-darker">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-[10px] text-muted font-display">
            nutri-oliva.vercel.app
          </div>
        </div>

        {/* App content — Panel nutricionista */}
        <div className="flex" style={{ minHeight: 280 }}>
          {/* Sidebar */}
          <div className="w-28 bg-[#3F4A2B] flex flex-col py-3 px-2 gap-1 flex-shrink-0">
            <div className="px-2 py-1.5 mb-2 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-olive flex-shrink-0" />
              <span className="text-[9px] text-cream font-display font-semibold leading-tight">
                NutriOliva
              </span>
            </div>
            {["Pacientes", "Registros", "Catalogo", "Estadisticas"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`px-2 py-1.5 rounded-lg text-[9px] font-display transition-colors
                            ${i === 0 ? "bg-olive text-cream" : "text-[#C9D3AC] hover:bg-[#4A5633]"}`}
                >
                  {item}
                </div>
              ),
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 bg-[#F6F1E7] p-3 overflow-hidden">
            <p className="font-display text-[9px] text-muted mb-2">
              Mis pacientes
            </p>

            {/* Patient cards */}
            {[
              {
                name: "Maria Lopez",
                cal: 1640,
                meta: 1800,
                pct: 91,
                color: "#6E9B5C",
              },
              {
                name: "Carlos Ruiz",
                cal: 2100,
                meta: 1900,
                pct: 110,
                color: "#D8A93A",
              },
              {
                name: "Ana Gimenez",
                cal: 820,
                meta: 1600,
                pct: 51,
                color: "#C4573F",
              },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-lg p-2 mb-1.5 border border-cream-darker"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-olive text-cream text-[7px] font-display font-bold flex items-center justify-center">
                      {p.name[0]}
                    </div>
                    <span className="font-display text-[9px] text-olive-dark font-semibold">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[8px] text-muted">
                    {p.cal} / {p.meta} kcal
                  </span>
                </div>
                <div className="h-1.5 bg-cream-darker rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(p.pct, 100)}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Balance card */}
            <div className="bg-white rounded-lg p-2 border border-cream-darker mt-1.5">
              <p className="font-display text-[8px] text-muted mb-1">
                Balance semanal
              </p>
              <div className="flex gap-1">
                {[65, 88, 72, 95, 60, 80, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end"
                    style={{ height: 32 }}
                  >
                    <div
                      className="rounded-sm bg-olive"
                      style={{ height: `${h}%`, opacity: i === 4 ? 1 : 0.4 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badge flotante — notificacion */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -top-3 -right-3 bg-white border border-cream-darker rounded-xl px-3 py-2 shadow-card"
      >
        <p className="font-display text-[9px] text-olive-dark font-semibold">
          Maria registro su almuerzo
        </p>
        <p className="font-display text-[8px] text-success">
          1640 kcal — 91% del objetivo
        </p>
      </motion.div>

      {/* Badge flotante — IA */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute -bottom-2 -left-4 bg-olive-dark text-cream rounded-xl px-3 py-2 shadow-modal"
      >
        <p className="font-display text-[9px] font-semibold">
          IA estimo las calorias
        </p>
        <p className="font-display text-[8px] text-cream/70">
          en menos de 2 segundos
        </p>
      </motion.div>
    </div>
  );
}

// ── Hero principal ─────────────────────────────────────────────────────────
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
                      grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Texto */}
        <div>
          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <span
              className="inline-block bg-olive-deep/60 border border-cream/20 text-cream/90
                          font-display text-[11px] px-4 py-1.5 rounded-full mb-6 tracking-wide"
            >
              Herramienta para nutricionistas
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-display font-bold text-cream leading-[1.12] mb-6"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            El acompanamiento que tus pacientes necesitan —{" "}
            <span className="text-[#C5D48A]">cada dia</span>
          </motion.h1>

          {/* Subtitulo */}
          <motion.p
            {...fadeUp(0.32)}
            className="text-cream/75 text-[17px] leading-relaxed mb-10 max-w-lg"
          >
            Plan alimenticio, registro diario y seguimiento en tiempo real. Para
            nutricionistas que quieren resultados reales — sin planillas, sin
            WhatsApp.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.44)} className="flex flex-wrap gap-4 mb-12">
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 12px 36px rgba(246,241,231,0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                className="bg-cream text-olive-dark font-display font-bold px-8 py-3.5 rounded-pill
                            text-[14px] flex items-center gap-2 transition-all"
              >
                Empezar gratis
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <a href="#como-funciona">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="border border-cream/30 text-cream font-display font-medium px-7 py-3.5
                            rounded-pill text-[14px] flex items-center gap-2
                          hover:bg-cream/10 transition-all backdrop-blur-sm"
              >
                <Play size={13} className="fill-cream" />
                Ver como funciona
              </motion.button>
            </a>
          </motion.div>

          {/* Pills de features */}
          <motion.div {...fadeUp(0.56)} className="flex flex-wrap gap-2">
            {[
              "Sin tarjeta de credito",
              "Acceso inmediato",
              "Soporte por WhatsApp",
            ].map((p) => (
              <span
                key={p}
                className="text-[11px] font-display text-cream/60 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5D48A]" />
                {p}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Mockup de la app */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <AppMockup />
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
