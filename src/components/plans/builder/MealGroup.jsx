// MealGroup.jsx — Sección colapsable de comidas por tipo con animaciones

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MealRow from "./MealRow";
import AddMealForm from "./AddMealForm";

export default function MealGroup({
  tipo,
  index = 0,
  comidas,
  onAgregar,
  onEditar,
  onEliminar,
  readonly,
  nutricionistaId,
}) {
  const [expandido, setExpandido] = useState(true);
  const [agregando, setAgregando] = useState(false);
  const totalCal = comidas.reduce((s, c) => s + (c.calorias_aprox || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 6) * 0.045 }}
      className="border border-cream-darker bg-white rounded-xl overflow-hidden shadow-xs"
    >
      {/* Header del grupo */}
      <button
        type="button"
        onClick={() => setExpandido((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream hover:bg-cream-dark/70 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-display font-semibold text-[12.5px] text-olive-dark">
            {tipo.label}
          </span>
          <span className="text-[10px] text-muted font-display">
            {comidas.length} {comidas.length === 1 ? "item" : "items"}
          </span>
          {totalCal > 0 && (
            <span className="text-[10px] font-display font-semibold text-olive bg-olive/10 px-2 py-0.5 rounded-full">
              {totalCal} kcal
            </span>
          )}
        </div>

        <motion.span
          animate={{ rotate: expandido ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      {/* Contenido colapsable */}
      <AnimatePresence initial={false}>
        {expandido && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-1">
              {comidas.length === 0 && !agregando && (
                <p className="text-[11px] text-muted italic py-1 px-3">
                  Sin items aun.
                </p>
              )}

              <AnimatePresence initial={false}>
                {comidas.map((c, idx) => (
                  <MealRow
                    key={c.id}
                    index={idx}
                    comida={c}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                    readonly={readonly}
                  />
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {!readonly && agregando && (
                  <AddMealForm
                    key="add-form"
                    tipo={tipo}
                    onAgregar={(comida) =>
                      onAgregar({ ...comida, tipo_comida: tipo.value })
                    }
                    onCancel={() => setAgregando(false)}
                    nutricionistaId={nutricionistaId}
                  />
                )}
              </AnimatePresence>

              {!readonly && !agregando && (
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAgregando(true)}
                  className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted
                            hover:text-olive hover:bg-cream/80 transition-colors font-display text-[11px]"
                >
                  <Plus size={12} /> Agregar {tipo.label.toLowerCase()}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
