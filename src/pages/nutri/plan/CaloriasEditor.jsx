// CaloriasEditor.jsx — Editor inline de objetivo calórico con CountUp y animaciones

import { Check, X, FilePen, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

export default function CaloriasEditor({
  planVisible,
  readonly,
  editandoCal,
  setEditandoCal,
  nuevasCal,
  setNuevasCal,
  calEditError,
  setCalEditError,
  handleGuardarCalorias,
}) {
  const total = (planVisible.comidas_plan || []).reduce(
    (s, c) => s + (c.calorias_aprox || 0),
    0
  );
  const diff = total - planVisible.calorias_objetivo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="card px-5 py-4 mb-4 flex items-center justify-between gap-4"
    >
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
          <Flame size={10} className="text-olive" />
          Objetivo calorico diario
        </p>

        <AnimatePresence mode="wait">
          {editandoCal ? (
            <motion.div
              key="edit-cal"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="space-y-1 mt-1"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className={`w-32 px-3 py-1.5 rounded-xl border text-sm font-display text-olive-dark
                              bg-[#F5F2EA] focus:outline-none focus:ring-2 transition-all
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                              [&::-webkit-inner-spin-button]:appearance-none
                              ${calEditError
                      ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                      : "border-cream-darker focus:ring-olive/30 focus:border-olive/60"}`}
                  value={nuevasCal}
                  onChange={(e) => {
                    setNuevasCal(e.target.value);
                    setCalEditError("");
                  }}
                  autoFocus
                  min={500}
                  max={6000}
                />
                <span className="text-xs font-display text-muted">kcal</span>
                <motion.button
                  type="button"
                  onClick={handleGuardarCalorias}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg bg-olive text-cream flex items-center justify-center shadow-sm"
                  title="Guardar"
                >
                  <Check size={13} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setEditandoCal(false);
                    setCalEditError("");
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg bg-cream text-muted hover:text-olive-dark flex items-center justify-center"
                  title="Cancelar"
                >
                  <X size={13} />
                </motion.button>
              </div>
              <AnimatePresence>
                {calEditError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[10px] text-accent ml-1"
                  >
                    {calEditError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="view-cal"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2"
            >
              <span className="font-display font-semibold text-xl text-olive-dark">
                <CountUp
                  end={planVisible.calorias_objetivo || 0}
                  duration={0.65}
                  separator="."
                />
              </span>
              <span className="text-xs text-muted font-display">kcal / dia</span>
              {!readonly && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setNuevasCal(String(planVisible.calorias_objetivo));
                    setEditandoCal(true);
                    setCalEditError("");
                  }}
                  whileHover={{ scale: 1.15, color: "#6E7A4B" }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted transition-colors ml-1 p-1 rounded-lg hover:bg-cream"
                  title="Editar objetivo calorico"
                >
                  <FilePen size={13} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resumen calorías del plan */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-right flex-shrink-0"
        >
          <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-0.5">
            Total en el plan
          </p>
          <p
            className={`font-display font-semibold text-xl ${Math.abs(diff) < 100
              ? "text-green-600"
              : diff > 0
                ? "text-accent"
                : "text-olive-dark"
              }`}
          >
            <CountUp end={total} duration={0.65} separator="." /> kcal
          </p>
          <p className="text-[10px] text-muted font-display">
            {diff > 0 ? `+${diff}` : diff} vs objetivo
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
