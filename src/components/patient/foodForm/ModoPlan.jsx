// ModoPlan.jsx — Panel del modo "Mi Plan" en el formulario de comida con animaciones

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tipoLabel } from "@/lib/foodFormUtils";
import PlanMealPill from "./PlanMealPill";

export default function ModoPlan({
  tipoActual,
  comidasDelMomento,
  otrasComidasPlan,
  planSeleccionada,
  setPlanSel,
  errors,
}) {
  const [verOtras, setVerOtras] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-display text-muted uppercase tracking-wide">
        {tipoLabel(tipoActual)} de tu plan
      </p>

      {/* Comidas del momento actual */}
      {comidasDelMomento.length > 0 ? (
        <div className="space-y-1.5">
          {comidasDelMomento.map((c, idx) => (
            <PlanMealPill
              key={c.id}
              index={idx}
              comida={c}
              selected={planSeleccionada?.id === c.id}
              onSelect={(item) =>
                setPlanSel((prev) => (prev?.id === item.id ? null : item))
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-[11.5px] text-muted italic">
          No hay {tipoLabel(tipoActual).toLowerCase()} en tu plan.
        </p>
      )}

      {/* Otras comidas del plan (colapsadas con animación) */}
      {otrasComidasPlan.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setVerOtras((v) => !v)}
            className="flex items-center gap-1 text-[10.5px] text-muted hover:text-olive-dark font-display transition-colors"
          >
            <motion.span
              animate={{ rotate: verOtras ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={12} />
            </motion.span>
            Ver otras comidas del plan ({otrasComidasPlan.length})
          </button>

          <AnimatePresence initial={false}>
            {verOtras && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 mt-2">
                  {otrasComidasPlan.map((c, idx) => (
                    <PlanMealPill
                      key={c.id}
                      index={idx}
                      comida={c}
                      selected={planSeleccionada?.id === c.id}
                      onSelect={(item) =>
                        setPlanSel((prev) =>
                          prev?.id === item.id ? null : item
                        )
                      }
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {errors._plan && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10.5px] text-accent ml-1 overflow-hidden"
          >
            {errors._plan}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
