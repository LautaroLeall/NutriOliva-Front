// LoginLeftPanel.jsx — Panel izquierdo con preview animado en vivo del Panel Admin / Plataforma NutriOliva

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  CheckCircle2,
  Activity,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

const SLIDES = [
  {
    nav: "Nutricionistas",
    tag: "Gestion Profesional",
    title: "Directorio y carteras de pacientes en vivo",
    desc: "Gestiona profesionales, planes y carteras de pacientes en tiempo real.",
    quote: "El acompanamiento que tus pacientes necesitan, cada dia.",
    sub: "Gestiona profesionales, planes y carteras de pacientes en tiempo real.",
  },
  {
    nav: "Facturacion",
    tag: "Control de Suscripciones",
    title: "Control total de suscripciones, cupos y rendimiento",
    desc: "Seguimiento transparente de planes Starter, Pro y Clinic.",
    quote: "Control total de suscripciones, cupos y rendimiento.",
    sub: "Seguimiento transparente de planes Starter, Pro y Clinic.",
  },
  {
    nav: "Metricas",
    tag: "Analitica en Tiempo Real",
    title: "Sin planillas. Sin WhatsApp. Solo datos que hablan solos",
    desc: "Metricas operativas, catalogo nutricional SARA e IA integrada.",
    quote: "Sin planillas. Sin WhatsApp. Solo datos que hablan solos.",
    sub: "Metricas operativas, catalogo nutricional SARA e IA integrada.",
  },
  {
    nav: "Ajustes",
    tag: "Configuracion Global",
    title: "Esquema tarifario y cupos editables en vivo",
    desc: "Actualiza precios por plan, cupos de pacientes y parametros de la plataforma en tiempo real.",
    quote: "Esquema tarifario y cupos editables en vivo.",
    sub: "Actualiza precios por plan, cupos de pacientes y parametros de la plataforma en tiempo real.",
  },
];

const MINI_NAV = [
  { id: "Nutricionistas", label: "Nutris", icon: Users },
  { id: "Facturacion", label: "Planes", icon: CreditCard },
  { id: "Metricas", label: "Metricas", icon: BarChart2 },
  { id: "Ajustes", label: "Sistema", icon: Settings },
];

function DotPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `radial-gradient(circle, #F6F1E7 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    />
  );
}

function SlideNutricionistas() {
  const rows = [
    {
      initials: "ML",
      name: "Lic. Maria Lopez",
      plan: "Pro",
      pac: 38,
      max: 50,
      pct: 76,
    },
    {
      initials: "CR",
      name: "Lic. Carlos Ruiz",
      plan: "Clinic",
      pac: 94,
      max: "Ilim.",
      pct: 92,
    },
    {
      initials: "AG",
      name: "Lic. Ana Gimenez",
      plan: "Starter",
      pac: 13,
      max: 15,
      pct: 86,
    },
  ];

  return (
    <div className="space-y-2">
      {/* 3 Mini KPIs */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { l: "Nutricionistas", v: "14", s: "Activos" },
          { l: "Pacientes", v: "312", s: "En seguimiento" },
          { l: "Retencion", v: "98%", s: "Al dia" },
        ].map((k, idx) => (
          <motion.div
            key={k.l}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="bg-cream/[0.07] border border-cream/10 rounded-lg p-1.5"
          >
            <div className="text-[7px] uppercase tracking-wider text-cream/45 font-display">
              {k.l}
            </div>
            <div className="font-display text-[12px] font-bold text-cream leading-tight mt-0.5">
              {k.v}
            </div>
            <div className="text-[7px] text-[#C5D48A] font-display">{k.s}</div>
          </motion.div>
        ))}
      </div>

      {/* Directorio de nutricionistas */}
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}
            className="bg-cream/[0.06] border border-cream/10 rounded-lg px-2.5 py-1.5"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-4 h-4 rounded-full bg-olive text-cream font-display text-[7px] font-bold flex items-center justify-center flex-shrink-0">
                  {r.initials}
                </span>
                <span className="font-display text-[8.5px] text-cream/90 truncate">
                  {r.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="px-1.5 py-0.5 rounded-full bg-olive/40 text-[#C5D48A] font-display text-[7px]">
                  {r.plan}
                </span>
                <span className="text-[7.5px] text-cream/60 font-display">
                  {r.pac}/{r.max} pac.
                </span>
              </div>
            </div>
            <div className="h-1 bg-cream/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.pct}%` }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="h-full rounded-full bg-[#6E9B5C]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideFacturacion() {
  const planes = [
    { name: "Plan Starter", cupo: "Hasta 15 pac.", pct: 32, active: "4 nutris" },
    { name: "Plan Pro", cupo: "Hasta 50 pac.", pct: 78, active: "7 nutris" },
    { name: "Plan Clinic", cupo: "Cupo ilimitado", pct: 54, active: "3 nutris" },
  ];

  return (
    <div className="space-y-2">
      <div className="bg-cream/[0.07] border border-cream/10 rounded-lg p-2 flex items-center justify-between">
        <div>
          <div className="text-[7.5px] uppercase tracking-wider text-cream/50 font-display">
            Estado de suscripciones
          </div>
          <div className="font-display text-[12px] font-bold text-cream mt-0.5">
            100% Cuentas activas y sincronizadas
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6E9B5C]/25 text-[#C5D48A] text-[7.5px] font-display">
          <CheckCircle2 size={9} /> Al dia
        </span>
      </div>

      <div className="space-y-1.5">
        {planes.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-cream/[0.06] border border-cream/10 rounded-lg p-2"
          >
            <div className="flex justify-between items-center text-[8.5px] font-display mb-1">
              <span className="text-cream font-semibold">{p.name}</span>
              <span className="text-[#C5D48A]">
                {p.cupo} · {p.active}
              </span>
            </div>
            <div className="h-1.5 bg-cream/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-[#C5D48A]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideMetricas() {
  const bars = [
    { name: "Maria", h: 78 },
    { name: "Carlos", h: 95 },
    { name: "Ana", h: 52 },
    { name: "Sofia", h: 84 },
    { name: "Lucas", h: 66 },
    { name: "Elena", h: 90 },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-cream/[0.07] border border-cream/10 rounded-lg p-2">
          <div className="text-[7px] uppercase text-cream/45 font-display">
            Catalogo SARA + IA
          </div>
          <div className="font-display text-[12px] font-bold text-cream mt-0.5">
            +350 alimentos
          </div>
        </div>
        <div className="bg-cream/[0.07] border border-cream/10 rounded-lg p-2">
          <div className="text-[7px] uppercase text-cream/45 font-display flex items-center gap-1">
            <Activity size={8} className="text-[#C5D48A]" /> Supabase Realtime
          </div>
          <div className="font-display text-[12px] font-bold text-[#C5D48A] mt-0.5">
            Online · 38 ms
          </div>
        </div>
      </div>

      {/* Mini Bar Chart animado */}
      <div className="bg-cream/[0.06] border border-cream/10 rounded-lg p-2.5">
        <div className="flex justify-between items-center mb-2">
          <span className="font-display text-[8px] text-cream/70">
            Pacientes activos por profesional
          </span>
          <span className="font-display text-[7.5px] text-[#C5D48A]">
            Tiempo real
          </span>
        </div>
        <div className="flex items-end gap-2 h-20 pt-2">
          {bars.map((b, idx) => (
            <div
              key={b.name}
              className="flex-1 flex flex-col items-center justify-end h-full gap-1"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${b.h}%` }}
                transition={{ duration: 0.55, delay: idx * 0.06 }}
                className="w-full rounded-t-md bg-gradient-to-t from-olive to-[#C5D48A]"
              />
              <span className="font-display text-[7px] text-cream/50">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideAjustes() {
  const tarifas = [
    { plan: "Plan Starter", cupo: "15 pac.", precio: "$18.000/mes", estado: "Editable" },
    { plan: "Plan Pro", cupo: "50 pac.", precio: "$32.000/mes", estado: "Editable" },
    { plan: "Plan Clinic", cupo: "Ilimitado", precio: "$54.000/mes", estado: "Editable" },
  ];

  return (
    <div className="space-y-2">
      <div className="bg-cream/[0.07] border border-cream/10 rounded-lg p-2 flex items-center justify-between">
        <div>
          <div className="text-[7px] uppercase tracking-wider text-[#C5D48A] font-display">
            Configuracion Global
          </div>
          <div className="font-display text-[11px] font-bold text-cream mt-0.5">
            Esquema tarifario y cupos editables en vivo
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6E9B5C]/25 text-[#C5D48A] text-[7px] font-display flex-shrink-0">
          <Settings size={8} /> En vivo
        </span>
      </div>

      <div className="space-y-1.5">
        {tarifas.map((t, i) => (
          <motion.div
            key={t.plan}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-cream/[0.06] border border-cream/10 rounded-lg px-2.5 py-1.5 flex items-center justify-between"
          >
            <div>
              <div className="font-display text-[8.5px] font-semibold text-cream">
                {t.plan}
              </div>
              <div className="font-display text-[7px] text-cream/55">
                Cupo max.: {t.cupo}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-cream/10 border border-cream/15 font-display text-[8px] font-bold text-[#C5D48A]">
                {t.precio}
              </span>
              <span className="text-[7px] text-cream/50 font-display">
                {t.estado}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AdminAppPreview({ slideIdx, onSelectSlide }) {
  return (
    <div className="p-3.5 pb-14">
      {/* Barra superior estilo ventana Admin */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-cream/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#28C840] animate-pulse" />
          <span className="font-display text-[8.5px] text-cream/65 uppercase tracking-widest">
            Panel Admin · NutriOliva
          </span>
        </div>
        <div className="flex gap-1">
          {["bg-[#FF5F57]", "bg-[#FEBC2E]", "bg-[#28C840]"].map((c, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
          ))}
        </div>
      </div>

      {/* Layout Mini Admin: Sidebar + Main Content */}
      <div className="flex gap-2.5">
        {/* Mini Sidebar */}
        <div className="w-20 flex-shrink-0 bg-[#1F2717] rounded-xl p-1.5 border border-cream/10 flex flex-col gap-1">
          {MINI_NAV.map((item, idx) => {
            const Icon = item.icon;
            const active = idx === slideIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSlide(idx)}
                className={`relative w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left font-display text-[8px] transition-colors cursor-pointer ${active ? "text-cream font-semibold" : "text-cream/50 hover:text-cream/80"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="login-admin-nav-pill"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    className="absolute inset-0 rounded-lg bg-olive"
                  />
                )}
                <Icon size={9} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vista dinamica animada */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {slideIdx === 0 && <SlideNutricionistas />}
              {slideIdx === 1 && <SlideFacturacion />}
              {slideIdx === 2 && <SlideMetricas />}
              {slideIdx === 3 && <SlideAjustes />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal del panel izquierdo ───────────────────────────────
export default function LoginLeftPanel({ mounted }) {
  const [slideIdx, setSlideIdx] = useState(0);

  // Auto-avance cada 4 segundos
  useEffect(() => {
    const t = setInterval(
      () => setSlideIdx((i) => (i + 1) % SLIDES.length),
      4000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="lg:w-[44%] relative flex flex-col bg-olive-dark overflow-hidden">
      <DotPattern />

      {/* Circulos decorativos */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-olive/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cream/5 blur-3xl pointer-events-none" />

      {/* Header: logo + volver */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 flex items-center justify-between p-6 pb-0"
      >
        <div className="flex items-center gap-2.5">
          <Logo size={22} />
          <span className="font-display font-bold text-[14px] text-cream">
            NutriOliva
          </span>
        </div>

        <Link to="/">
          <button
            className="flex items-center gap-1.5 bg-cream/10 hover:bg-cream/20
                        text-cream/80 hover:text-cream text-[11px] font-display
                          px-3 py-1.5 rounded-full transition-all duration-200
                          border border-cream/10 hover:border-cream/20 cursor-pointer"
          >
            Volver al sitio
            <ArrowRight size={11} />
          </button>
        </Link>
      </motion.div>

      {/* Visual central con AdminPanel animado + quote superpuesta */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="relative z-10 flex-1 mx-5 mt-5 mb-4 rounded-2xl overflow-hidden
                  bg-[#2A3420] border border-cream/10 flex flex-col justify-between"
        style={{ minHeight: 270 }}
      >
        {/* Gradiente inferior para legibilidad del texto */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-olive-dark via-olive-dark/80 to-transparent z-10 pointer-events-none" />

        {/* Mini mockup del Panel Admin en movimiento */}
        <AdminAppPreview
          slideIdx={slideIdx}
          onSelectSlide={(idx) => setSlideIdx(idx)}
        />

        {/* Quote animada */}
        <div className="absolute bottom-4 left-0 right-0 text-center px-5 z-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={slideIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="font-editorial italic text-cream text-[13.5px] leading-snug"
            >
              "{SLIDES[slideIdx].quote}"
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Dots de navegacion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex justify-center gap-1.5 mb-5"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${slideIdx === i
              ? "w-6 bg-cream"
              : "w-2.5 bg-cream/20 hover:bg-cream/40"
              }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
