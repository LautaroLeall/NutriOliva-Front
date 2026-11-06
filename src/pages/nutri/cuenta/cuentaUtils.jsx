// cuentaUtils.jsx — Componentes reutilizables (3D Tilt Card, Input con label flotante) y utilidades de Cuenta

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import CountUp from "react-countup";

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NO";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatFechaLarga(isoStr) {
  if (!isoStr) return "Reciente";
  try {
    return new Date(isoStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Reciente";
  }
}

export function evaluarFortalezaPassword(pass = "") {
  if (!pass) return { score: 0, label: "Sin ingresar", color: "bg-cream-darker" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
  if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Debil", color: "bg-accent" };
  if (score === 2) return { score: 2, label: "Aceptable", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "Buena", color: "bg-olive" };
  return { score: 4, label: "Fuerte", color: "bg-success" };
}

export function TiltStatCard({
  label,
  value,
  suffix = "",
  sublabel,
  icon: Icon,
  delay = 0,
  progress = null,
  alert = false,
  onClick,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 300,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 300,
    damping: 28,
  });

  function handleMouse(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.025 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`relative overflow-hidden bg-white rounded-2xl border p-4 shadow-sm hover:shadow-card transition-shadow select-none ${onClick ? "cursor-pointer" : "cursor-default"
        } ${alert ? "border-accent/35" : "border-cream-darker"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cream/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-display text-[10px] uppercase tracking-wider text-muted">
          {label}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
            <Icon size={14} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className={`font-display text-2xl sm:text-3xl font-bold leading-none ${alert ? "text-accent" : "text-olive-dark"
            }`}
        >
          <CountUp end={Number(value) || 0} duration={1.2} delay={delay} />
        </span>
        {suffix && (
          <span className="font-display text-xs text-muted font-medium">
            {suffix}
          </span>
        )}
      </div>

      {progress !== null && (
        <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden mt-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.6, delay: delay + 0.15, ease: "easeOut" }}
            className={`h-full rounded-full ${progress >= 90 ? "bg-accent" : "bg-olive"
              }`}
          />
        </div>
      )}

      {sublabel && (
        <p className="text-[10.5px] font-display text-muted mt-2 truncate">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
}

export function CuentaField({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  onChange,
  disabled = false,
  error = "",
  rightSlot = null,
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || String(value ?? "").length > 0;

  return (
    <div className="flex flex-col">
      <div className="relative">
        {Icon && (
          <motion.div
            animate={{
              color: focused ? "#6E7A4B" : "#9B9484",
              scale: focused ? 1.08 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          >
            <Icon size={14} />
          </motion.div>
        )}

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          className={`w-full ${Icon ? "pl-9" : "pl-3.5"} ${rightSlot ? "pr-10" : "pr-3.5"
            } pt-[21px] pb-[6px] rounded-xl border text-[13px] font-body text-olive-dark focus:outline-none focus:ring-2 transition-all duration-150 ${disabled
              ? "bg-cream/70 border-cream-darker text-muted cursor-not-allowed"
              : error
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
          className={`absolute ${Icon ? "left-9" : "left-3.5"
            } right-9 font-display pointer-events-none leading-none truncate`}
        >
          {label}
        </motion.label>

        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightSlot}
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="text-[10.5px] text-accent font-display ml-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
