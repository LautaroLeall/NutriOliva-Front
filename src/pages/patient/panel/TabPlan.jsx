// TabPlan.jsx — Vista del plan alimenticio del paciente con acordeones animados y CountUp

import { useState } from "react";
import { ClipboardList, ChevronDown, Flame, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

const SECCIONES_PLAN = [
  { key: "desayuno", label: "Desayuno" },
  { key: "colacion", label: "Colacion" },
  { key: "almuerzo", label: "Almuerzo" },
  { key: "merienda", label: "Merienda" },
  { key: "cena", label: "Cena" },
  { key: "colacion_nocturna", label: "Colacion nocturna" },
  { key: "snack", label: "Snack" },
];

function PlanSection({ label, items, index = 0 }) {
  const [open, setOpen] = useState(true);
  const totalCal = items.reduce((s, c) => s + (c.calorias_aprox || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 6) * 0.05 }}
      className="bg-white rounded-2xl border border-cream-darker overflow-hidden shadow-card"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream/60 hover:bg-cream transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-[12.5px] text-olive-dark">
            {label}
          </span>
          <span className="text-[10px] text-muted font-display">
            ({items.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {totalCal > 0 && (
            <span className="text-[10px] font-display font-semibold text-olive bg-olive/10 px-2 py-0.5 rounded-full">
              {totalCal} kcal
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted"
          >
            <ChevronDown size={14} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden divide-y divide-cream"
          >
            {items.map((c) => (
              <div
                key={c.id}
                className="px-4 py-3 hover:bg-cream/35 transition-colors"
              >
                <p className="text-[12px] text-olive-dark font-medium leading-snug">
                  {c.descripcion}
                </p>
                {(c.calorias_aprox > 0 ||
                  c.proteinas_g ||
                  c.carbos_g ||
                  c.grasas_g) && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {c.calorias_aprox > 0 && (
                        <span className="text-[10px] font-display font-semibold text-olive-dark bg-cream px-2 py-0.5 rounded-md">
                          {c.calorias_aprox} kcal
                        </span>
                      )}
                      {c.proteinas_g > 0 && (
                        <span className="text-[10px] text-muted">
                          P: {c.proteinas_g}g
                        </span>
                      )}
                      {c.carbos_g > 0 && (
                        <span className="text-[10px] text-muted">
                          C: {c.carbos_g}g
                        </span>
                      )}
                      {c.grasas_g > 0 && (
                        <span className="text-[10px] text-muted">
                          G: {c.grasas_g}g
                        </span>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TabPlan({ loadingInf, planActivo, comidasPlan }) {
  if (loadingInf) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-cream-darker p-5 space-y-2">
          <div className="h-3 w-28 bg-cream-darker rounded-full animate-pulse" />
          <div className="h-7 w-36 bg-cream-darker rounded-xl animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-cream-darker p-4 space-y-2"
          >
            <div className="h-3.5 w-24 bg-cream-darker rounded-full animate-pulse" />
            <div className="h-10 w-full bg-cream rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!planActivo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-cream-darker p-8 text-center shadow-card"
      >
        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-3">
          <ClipboardList size={22} className="text-muted" />
        </div>
        <p className="font-display text-[13px] font-semibold text-olive-dark mb-1">
          Sin plan activo
        </p>
        <p className="text-[11px] text-muted">
          Tu nutricionista todavia no asigno un plan alimenticio.
        </p>
      </motion.div>
    );
  }

  const seccionesConItems = SECCIONES_PLAN.map((sec) => ({
    ...sec,
    items: comidasPlan.filter((c) => c.tipo_comida === sec.key),
  })).filter((sec) => sec.items.length > 0);

  return (
    <div className="space-y-3">
      {/* Resumen del plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card flex items-center justify-between"
      >
        <div>
          <p className="flex items-center gap-1.5 text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
            <Flame size={11} className="text-olive" />
            Plan activo — v{planActivo.version}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-2xl text-olive-dark">
              <CountUp
                end={planActivo.calorias_objetivo || 0}
                duration={0.7}
                separator="."
              />
            </span>
            <span className="text-muted text-sm font-display">kcal / dia</span>
          </div>
        </div>

        <span className="text-[10.5px] font-display font-medium text-olive bg-olive/10 px-3 py-1 rounded-full">
          {comidasPlan.length} {comidasPlan.length === 1 ? "comida" : "comidas"}
        </span>
      </motion.div>

      {/* Notas y recomendaciones generales del nutricionista */}
      {planActivo.notas?.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.04 }}
          className="bg-white rounded-2xl border border-olive/25 p-4 shadow-card flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-olive/10 flex items-center justify-center text-olive flex-shrink-0 mt-0.5">
            <FileText size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10.5px] font-display font-semibold text-olive-dark uppercase tracking-wide">
              Indicaciones de tu nutricionista
            </p>
            <p className="text-[12px] text-olive-dark/90 mt-1 leading-relaxed whitespace-pre-line break-words">
              {planActivo.notas.trim()}
            </p>
          </div>
        </motion.div>
      )}

      {/* Secciones del plan */}
      {seccionesConItems.map((sec, idx) => (
        <PlanSection
          key={sec.key}
          index={idx}
          label={sec.label}
          items={sec.items}
        />
      ))}
    </div>
  );
}
