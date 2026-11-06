// NotasEditor.jsx — Editor inline de notas del plan con AnimatePresence

import { Pencil, X, Check, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotasEditor({
  planVisible,
  readonly,
  editandoNotas,
  setEditandoNotas,
  notasInput,
  setNotasInput,
  handleGuardarNotas,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="card px-5 py-4 mb-4"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="flex items-center gap-1.5 text-[9.5px] font-display text-muted uppercase tracking-wide">
          <StickyNote size={10} className="text-olive" />
          Notas del plan
        </p>
        {!readonly && !editandoNotas && (
          <motion.button
            type="button"
            onClick={() => {
              setNotasInput(planVisible.notas || "");
              setEditandoNotas(true);
            }}
            whileHover={{ scale: 1.15, color: "#6E7A4B" }}
            whileTap={{ scale: 0.9 }}
            className="text-muted transition-colors p-1 rounded-lg hover:bg-cream"
            title="Editar notas"
          >
            <Pencil size={12} />
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editandoNotas ? (
          <motion.div
            key="edit-notas"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="space-y-2 mt-1.5"
          >
            <input
              className="w-full px-3.5 py-2 rounded-xl border border-cream-darker text-[12.5px]
                          font-body text-olive-dark bg-[#F5F2EA]
                          focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive/60
                          transition-all"
              placeholder="Ej: Plan de mantenimiento — Fase 1"
              value={notasInput}
              onChange={(e) => setNotasInput(e.target.value)}
              maxLength={100}
              autoFocus
            />
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={() => setEditandoNotas(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-1.5 rounded-xl border border-cream-darker bg-white text-muted
                            font-display text-[11px] hover:bg-cream transition-colors flex items-center justify-center gap-1"
              >
                <X size={11} />
                Cancelar
              </motion.button>
              <motion.button
                type="button"
                onClick={handleGuardarNotas}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-1.5 rounded-xl bg-olive text-cream font-display text-[11px]
                          hover:bg-olive-deep transition-colors flex items-center justify-center gap-1"
              >
                <Check size={11} />
                Guardar
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="view-notas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[12px] text-olive-dark"
          >
            {planVisible.notas || (
              <span className="text-muted italic">Sin notas</span>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
