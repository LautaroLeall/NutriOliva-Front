// CatalogoField.jsx — Inputs reutilizables del formulario de Catálogo
// Field: input con label flotante animada + ícono + error AnimatePresence
// SelectField: select con label fija + ícono + chevron animado

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Field — input texto / número ─────────────────────────────────────────
export function Field({ label, name, type = "text", value, onChange, error, icon: Icon, autoFocus, min, step }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value?.toString().length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="flex flex-col">
      {/* Wrapper interno de altura fija — el error vive FUERA para no mover el icono */}
      <div className="relative">
        <motion.div
          animate={{ color: focused ? "#6E7A4B" : "#9B9484", scale: focused ? 1.1 : 1 }}
          transition={{ duration: 0.16 }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          <Icon size={14} strokeWidth={1.75} />
        </motion.div>

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=""
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          min={min}
          step={step}
          className={`w-full pl-9 pr-3 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                      font-body text-olive-dark
                      focus:outline-none focus:ring-2 transition-all duration-150
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none
                      ${error
              ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
              : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
            }`}
        />

        {/* Label flotante — right-2 + overflow para no desbordar en grids angostos */}
        <motion.label
          animate={{
            top: lifted ? "6px" : "50%",
            y: lifted ? "0%" : "-50%",
            fontSize: lifted ? "9.5px" : "12.5px",
            color: focused ? "#6E7A4B" : error ? "#D85A30" : "#9B9484",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute left-9 right-2 font-display pointer-events-none
                      leading-none whitespace-nowrap overflow-hidden"
          style={{ textOverflow: "ellipsis" }}
        >
          {label}
        </motion.label>
      </div>

      {/* Error animado fuera del wrapper */}
      <AnimatePresence>
        {error && (
          <motion.p
            key={name + "-err"}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.17 }}
            className="text-[10.5px] text-accent ml-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SelectField — select con label siempre arriba ────────────────────────
export function SelectField({ label, name, value, onChange, options, icon: Icon }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <motion.div
        animate={{ color: focused ? "#6E7A4B" : "#9B9484", scale: focused ? 1.1 : 1 }}
        transition={{ duration: 0.16 }}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
      >
        <Icon size={14} strokeWidth={1.75} />
      </motion.div>

      {/* Label siempre arriba — select siempre tiene valor */}
      <motion.label
        animate={{ color: focused ? "#6E7A4B" : "#9B9484" }}
        className="absolute left-9 right-7 top-[6px] text-[9.5px] font-display
                    pointer-events-none leading-none whitespace-nowrap overflow-hidden"
        style={{ textOverflow: "ellipsis" }}
      >
        {label}
      </motion.label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-9 pr-8 pt-[22px] pb-[7px] rounded-xl border border-cream-darker
                    text-[13px] font-body text-olive-dark bg-[#F5F2EA]
                    focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive/60
                    transition-all duration-150 appearance-none cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      <motion.div
        animate={{ rotate: focused ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
      >
        <ChevronDown size={12} />
      </motion.div>
    </div>
  );
}
