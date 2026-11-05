// DatosClinicosUI.jsx — Componentes de interfaz reutilizables para DatosClinicos

import { useState } from "react";
import { Check, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "./datosClinicosUtils";

export function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-3">
      {STEPS.map((s, i) => {
        const done = s.id < currentStep;
        const active = s.id === currentStep;
        const Icon = s.icon;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <motion.div
                animate={{
                  scale: active ? 1.08 : 1,
                  backgroundColor: done ? "#6E7A4B" : "#FFFFFF",
                  borderColor: done || active ? "#6E7A4B" : "#E5E0D8",
                  color: done ? "#F6F1E7" : active ? "#6E7A4B" : "#9B9484",
                }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className="w-7 h-7 rounded-full flex items-center justify-center border-2"
              >
                {done ? <Check size={11} strokeWidth={3} /> : <Icon size={11} />}
              </motion.div>
              <span
                className={`text-[7.5px] font-display font-medium text-center w-[54px] leading-none transition-colors ${active ? "text-olive-dark font-semibold" : "text-muted"
                  }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-6 h-0.5 mb-3.5 mx-0.5 bg-cream-darker overflow-hidden rounded-full">
                <motion.div
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-olive"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function NumField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  unit,
  min,
  max,
  step = "0.1",
  required,
  icon: Icon = Scale,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value?.toString().length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="flex flex-col">
      <div className="relative">
        <motion.div
          animate={{
            color: focused ? "#6E7A4B" : "#9B9484",
            scale: focused ? 1.1 : 1,
          }}
          transition={{ duration: 0.16 }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          <Icon size={14} strokeWidth={1.75} />
        </motion.div>

        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholder=""
          min={min}
          max={max}
          step={step}
          className={`w-full pl-9 pr-9 pt-[21px] pb-[6px] rounded-xl border text-[13px]
                      font-body text-olive-dark
                      focus:outline-none focus:ring-2 transition-all duration-150
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none
                      ${error
              ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
              : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
            }`}
        />

        <motion.label
          animate={{
            top: lifted ? "6px" : "50%",
            y: lifted ? "0%" : "-50%",
            fontSize: lifted ? "9.5px" : "12px",
            color: focused ? "#6E7A4B" : error ? "#D85A30" : "#9B9484",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute left-9 right-8 font-display pointer-events-none
                      leading-none whitespace-nowrap overflow-hidden"
          style={{ textOverflow: "ellipsis" }}
        >
          {label}
          {required ? " *" : ""}
        </motion.label>

        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted font-display pointer-events-none">
            {unit}
          </span>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            key={name + "-err"}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 3 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.16 }}
            className="text-[10px] text-accent ml-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelCard({ selected, onClick, label, desc, extra }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      className={`text-left px-2.5 py-2 rounded-xl border-2 transition-colors duration-150 w-full ${selected
        ? "border-olive bg-olive/8"
        : "border-cream-darker bg-[#F5F2EA] hover:border-olive/35"
        }`}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p
            className={`text-[10.5px] font-display font-semibold leading-tight truncate ${selected ? "text-olive-dark" : "text-olive-dark/80"
              }`}
          >
            {label}
          </p>
          <p className="text-[8.5px] text-muted leading-tight mt-0.5 truncate">
            {desc}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {extra && (
            <span
              className={`text-[8.5px] font-display font-medium ${selected ? "text-olive" : "text-muted"
                }`}
            >
              {extra}
            </span>
          )}
          <motion.div
            animate={{
              scale: selected ? 1.08 : 1,
              backgroundColor: selected ? "#6E7A4B" : "#FFFFFF",
              borderColor: selected ? "#6E7A4B" : "#E5E0D8",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
          >
            {selected && <Check size={8} className="text-cream" strokeWidth={3} />}
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}
