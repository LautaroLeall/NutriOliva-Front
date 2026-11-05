// ModoOtra.jsx — Panel del modo "Otra comida" con inputs de label flotante y estimación IA

import { useState } from "react";
import { Loader2, Sparkles, Utensils, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModoOtra({
  formOtra,
  setFormOtra,
  setErrors,
  errors,
  estimandoCal,
  estimarCalorias,
}) {
  const [focusDesc, setFocusDesc] = useState(false);
  const [focusCal, setFocusCal] = useState(false);

  const liftDesc = focusDesc || formOtra.descripcion?.length > 0;
  const liftCal = focusCal || formOtra.calorias_estimadas?.toString().length > 0;
  const puedeEstimar = !estimandoCal && formOtra.descripcion.trim().length >= 3;

  return (
    <div className="space-y-3">
      {/* Aviso informativo */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
        <p className="text-[10px] text-amber-700 font-display leading-snug">
          Esta comida no se guardara en el catalogo. Pedile a tu nutricionista
          agregarla si la consumis con frecuencia.
        </p>
      </div>

      {/* Campo descripcion con label flotante */}
      <div className="flex flex-col">
        <div className="relative">
          <motion.div
            animate={{
              color: focusDesc ? "#6E7A4B" : "#9B9484",
              scale: focusDesc ? 1.1 : 1,
            }}
            transition={{ duration: 0.16 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          >
            <Utensils size={14} strokeWidth={1.75} />
          </motion.div>

          <input
            value={formOtra.descripcion}
            onChange={(e) => {
              setFormOtra((f) => ({ ...f, descripcion: e.target.value }));
              setErrors((er) => ({ ...er, descripcion: undefined }));
            }}
            onFocus={() => setFocusDesc(true)}
            onBlur={() => setFocusDesc(false)}
            placeholder=""
            autoFocus
            autoComplete="off"
            maxLength={200}
            className={`w-full pl-9 pr-12 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                        font-body text-olive-dark
                        focus:outline-none focus:ring-2 transition-all duration-150
                        ${errors.descripcion
                ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
              }`}
          />

          <motion.label
            animate={{
              top: liftDesc ? "6px" : "50%",
              y: liftDesc ? "0%" : "-50%",
              fontSize: liftDesc ? "9.5px" : "12.5px",
              color: focusDesc
                ? "#6E7A4B"
                : errors.descripcion
                  ? "#D85A30"
                  : "#9B9484",
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-9 right-12 font-display pointer-events-none leading-none"
          >
            ¿Que comiste? *
          </motion.label>

          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-display pointer-events-none ${formOtra.descripcion.length > 180 ? "text-amber-500" : "text-muted"
              }`}
          >
            {formOtra.descripcion.length}/200
          </span>
        </div>

        <AnimatePresence>
          {errors.descripcion && (
            <motion.p
              key="desc-err"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.16 }}
              className="text-[10.5px] text-accent ml-1 overflow-hidden"
            >
              {errors.descripcion}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Campo calorías con label flotante + botón IA */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <motion.div
              animate={{
                color: focusCal ? "#6E7A4B" : "#9B9484",
                scale: focusCal ? 1.1 : 1,
              }}
              transition={{ duration: 0.16 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <Flame size={14} strokeWidth={1.75} />
            </motion.div>

            <input
              type="number"
              value={formOtra.calorias_estimadas}
              onChange={(e) => {
                setFormOtra((f) => ({
                  ...f,
                  calorias_estimadas: e.target.value,
                }));
                setErrors((er) => ({ ...er, calorias: undefined }));
              }}
              onFocus={() => setFocusCal(true)}
              onBlur={() => setFocusCal(false)}
              placeholder=""
              min={1}
              max={3000}
              step={1}
              className={`w-full pl-9 pr-11 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                          font-body text-olive-dark
                          focus:outline-none focus:ring-2 transition-all duration-150
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                          ${errors.calorias
                  ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                  : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                }`}
            />

            <motion.label
              animate={{
                top: liftCal ? "6px" : "50%",
                y: liftCal ? "0%" : "-50%",
                fontSize: liftCal ? "9.5px" : "12.5px",
                color: focusCal
                  ? "#6E7A4B"
                  : errors.calorias
                    ? "#D85A30"
                    : "#9B9484",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-9 right-11 font-display pointer-events-none leading-none whitespace-nowrap overflow-hidden"
              style={{ textOverflow: "ellipsis" }}
            >
              Calorias estimadas (opcional)
            </motion.label>

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[10.5px] font-display pointer-events-none">
              kcal
            </span>
          </div>

          {/* Boton Estimar con IA */}
          <motion.button
            type="button"
            onClick={estimarCalorias}
            disabled={!puedeEstimar}
            whileHover={puedeEstimar ? { scale: 1.03 } : {}}
            whileTap={puedeEstimar ? { scale: 0.95 } : {}}
            className="flex items-center gap-1.5 px-3 py-3.5 rounded-xl border border-olive/35
                        bg-olive/8 text-olive-dark hover:bg-olive/15 font-display text-[10.5px] font-medium
                        transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {estimandoCal ? (
              <Loader2 size={12} className="animate-spin text-olive" />
            ) : (
              <Sparkles size={12} className="text-olive" />
            )}
            {estimandoCal ? "Estimando..." : "Estimar con IA"}
          </motion.button>
        </div>

        <AnimatePresence>
          {errors.calorias && (
            <motion.p
              key="cal-err"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.16 }}
              className="text-[10.5px] text-accent ml-1 overflow-hidden"
            >
              {errors.calorias}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
