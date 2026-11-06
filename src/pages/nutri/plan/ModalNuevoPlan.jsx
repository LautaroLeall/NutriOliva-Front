// ModalNuevoPlan.jsx — Modal para crear nuevo plan con label flotante y presets

import { useState } from "react";
import { Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";

const PRESETS = [1500, 1800, 2000, 2200, 2500];

export default function ModalNuevoPlan({
  open,
  onClose,
  caloriaInput,
  setCaloriaInput,
  calError,
  setCalError,
  onCrear,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = caloriaInput?.toString().length > 0;
  const lifted = focused || hasValue;

  return (
    <Modal open={open} onClose={onClose} title="Nuevo plan alimenticio" size="sm">
      <div className="space-y-4">
        <div className="flex flex-col">
          {/* Input con label flotante e icono */}
          <div className="relative">
            <motion.div
              animate={{ color: focused ? "#6E7A4B" : "#9B9484", scale: focused ? 1.1 : 1 }}
              transition={{ duration: 0.16 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <Flame size={14} strokeWidth={1.75} />
            </motion.div>

            <input
              type="number"
              value={caloriaInput}
              onChange={(e) => {
                setCaloriaInput(e.target.value);
                setCalError("");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder=""
              min="500"
              max="6000"
              autoFocus
              className={`w-full pl-9 pr-12 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                          font-body text-olive-dark
                          focus:outline-none focus:ring-2 transition-all duration-150
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                          ${calError
                  ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                  : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"}`}
            />

            <motion.label
              animate={{
                top: lifted ? "6px" : "50%",
                y: lifted ? "0%" : "-50%",
                fontSize: lifted ? "9.5px" : "12.5px",
                color: focused ? "#6E7A4B" : calError ? "#D85A30" : "#9B9484",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-9 right-12 font-display pointer-events-none leading-none"
            >
              Objetivo calorico diario *
            </motion.label>

            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10.5px] font-display text-muted pointer-events-none">
              kcal
            </span>
          </div>

          <AnimatePresence>
            {calError && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.16 }}
                className="text-[10.5px] text-accent ml-1 overflow-hidden"
              >
                {calError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Presets rapidos */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {PRESETS.map((kcal) => {
              const active = Number(caloriaInput) === kcal;
              return (
                <motion.button
                  key={kcal}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setCaloriaInput(String(kcal));
                    setCalError("");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-display transition-colors
                              ${active
                      ? "bg-olive text-cream font-semibold"
                      : "bg-cream text-muted hover:text-olive-dark"}`}
                >
                  {kcal} kcal
                </motion.button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted mt-1.5">
            Entre 500 y 6000 kcal. Podes modificarlo despues.
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="btn-ghost flex-1 py-2.5"
          >
            Cancelar
          </motion.button>
          <motion.button
            type="button"
            onClick={onCrear}
            whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(110,122,75,0.3)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="btn-primary flex-1 py-2.5"
          >
            Crear plan
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
