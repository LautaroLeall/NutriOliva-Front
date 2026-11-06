// adminUtils.jsx — Constantes, helpers de exportación y componentes base (3D Tilt, ActionBtn, AdminField)

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Users, CreditCard, BarChart2, Settings } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import * as XLSX from "xlsx";

export const DEFAULT_PLANS = {
  starter: {
    key: "starter",
    label: "Starter",
    price: 75000,
    patients: 15,
    desc: "Hasta 15 pacientes activos",
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: 125000,
    patients: 50,
    desc: "Hasta 50 pacientes activos",
  },
  clinic: {
    key: "clinic",
    label: "Clinic",
    price: 150000,
    patients: 9999,
    desc: "Pacientes ilimitados",
  },
};

export const PLANS = DEFAULT_PLANS;

export function normalizarEstado(estadoRaw) {
  if (!estadoRaw) return "activo";
  const s = estadoRaw.toString().toLowerCase().trim();
  if (s === "activo") return "activo";
  if (s === "pago_pendiente" || s === "pago pendiente") return "pago_pendiente";
  if (s === "inactivo") return "inactivo";
  return "activo";
}

// Valor que se persiste en DB según lo que ya tenga la fila (soporta tanto 'Activo' como 'activo')
export function valorEstadoDB(estadoKey, filaActualEstado) {
  const usaMayus =
    filaActualEstado === "Activo" ||
    filaActualEstado === "Pago pendiente" ||
    filaActualEstado === "Inactivo";

  if (usaMayus) {
    if (estadoKey === "activo") return "Activo";
    if (estadoKey === "pago_pendiente") return "Pago pendiente";
    if (estadoKey === "inactivo") return "Inactivo";
  }
  return estadoKey;
}

export const STATUS_CONFIG = {
  activo: {
    key: "activo",
    dot: "bg-success",
    text: "Activo",
    pill: "bg-green-50 text-green-700 border-green-200",
  },
  pago_pendiente: {
    key: "pago_pendiente",
    dot: "bg-warning",
    text: "Pago pendiente",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  inactivo: {
    key: "inactivo",
    dot: "bg-danger",
    text: "Inactivo",
    pill: "bg-accent/10 text-accent border-accent/25",
  },
};

export const NAV_ITEMS = [
  { id: "Nutricionistas", label: "Nutricionistas", icon: Users },
  { id: "Facturacion", label: "Facturacion", icon: CreditCard },
  { id: "Metricas", label: "Metricas", icon: BarChart2 },
  { id: "Ajustes", label: "Ajustes", icon: Settings },
];

export const FORM_NUEVO_VACIO = {
  nombre: "",
  email: "",
  password: "",
  plan: "starter",
};

export function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function formatARS(amount) {
  if (!amount) return "$0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFechaCorta(fechaStr) {
  if (!fechaStr) return "—";
  try {
    const d = new Date(
      fechaStr.includes("T") ? fechaStr : `${fechaStr}T12:00:00`
    );
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fechaStr;
  }
}

// ── Exportar a Excel (.xlsx) ─────────────────────────────────────────────────
export function exportarExcelNutricionistas(
  nutricionistas,
  nombreArchivo = "nutrioliva_nutricionistas.xlsx",
  planesConfig = DEFAULT_PLANS
) {
  const filas = nutricionistas.map((n) => {
    const planKey = (n.plan_suscripcion || "starter").toLowerCase();
    const plan = planesConfig[planKey] || DEFAULT_PLANS.starter;
    const estKey = normalizarEstado(n.estado);
    const est = STATUS_CONFIG[estKey] || STATUS_CONFIG.activo;
    const cupoMax = n.cupo_maximo || plan.patients + (n.cupo_extra || 0);
    return {
      Profesional: n.nombre || "",
      Email: n.email || "",
      Plan: plan.label,
      "Pacientes Activos": n.total_pacientes || 0,
      "Cupo Maximo": cupoMax >= 9999 ? "Ilimitado" : cupoMax,
      "Cupo Extra": n.cupo_extra || 0,
      Estado: est.text,
      "Cuota Mensual (ARS)": n.precio_mensual_ars ?? plan.price,
      "Fecha de Alta": n.fecha_alta || "",
    };
  });

  const ws = XLSX.utils.json_to_sheet(filas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Nutricionistas");
  XLSX.writeFile(wb, nombreArchivo);
}

// ── Tarjeta KPI con 3D Tilt ──────────────────────────────────────────────────
export function AdminMetricCard({
  label,
  icon: Icon,
  sub,
  subColor = "text-success",
  delay = 0,
  children,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 300, damping: 28 });
  const rotateY = useSpring(x, { stiffness: 300, damping: 28 });

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(((e.clientX - cx) / rect.width) * 11);
    y.set(-((e.clientY - cy) / rect.height) * 11);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="bg-cream border border-cream-darker rounded-xl p-4 cursor-default shadow-sm"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-display text-[9.5px] uppercase tracking-wide text-muted">
          {label}
        </span>
        {Icon && (
          <span className="w-6 h-6 rounded-lg bg-olive/12 flex items-center justify-center flex-shrink-0">
            <Icon size={12} className="text-olive" />
          </span>
        )}
      </div>
      <div className="font-display text-[22px] font-semibold text-olive-dark leading-tight">
        {children}
      </div>
      {sub && (
        <div className={`text-[10px] mt-1 font-display ${subColor}`}>{sub}</div>
      )}
    </motion.div>
  );
}

// ── ActionBtn con tooltip animado en Portal (nunca se recorta por overflow de tabla) ──
export function ActionBtn({
  onClick,
  tooltip,
  variant = "default",
  disabled,
  children,
}) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const hoverBg =
    variant === "danger"
      ? "rgba(216, 90, 48, 0.12)"
      : variant === "success"
        ? "rgba(110, 155, 92, 0.14)"
        : variant === "warning"
          ? "rgba(217, 119, 6, 0.12)"
          : "rgba(110, 122, 75, 0.14)";

  const hoverColor =
    variant === "danger"
      ? "#D85A30"
      : variant === "success"
        ? "#6E9B5C"
        : variant === "warning"
          ? "#D97706"
          : "#6E7A4B";

  function handleMouseEnter() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const rawLeft = rect.left + rect.width / 2;
      const clampedLeft =
        typeof window !== "undefined"
          ? Math.min(window.innerWidth - 72, Math.max(72, rawLeft))
          : rawLeft;
      setCoords({
        top: rect.top - 7,
        left: clampedLeft,
      });
    }
    setHovered(true);
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        ref={btnRef}
        type="button"
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          backgroundColor: hovered ? hoverBg : "rgba(0,0,0,0)",
          color: hovered ? hoverColor : "#9B9484",
        }}
        transition={{ duration: 0.15 }}
        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-40"
      >
        {children}
      </motion.button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {hovered && tooltip && (
              <div
                style={{ top: coords.top, left: coords.left }}
                className="fixed -translate-x-1/2 -translate-y-full pointer-events-none z-[9999]"
              >
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.92 }}
                  transition={{ duration: 0.13 }}
                  className="block px-2.5 py-1 rounded-md bg-olive-dark text-cream text-[9.5px] font-display whitespace-nowrap shadow-lg"
                >
                  {tooltip}
                </motion.span>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

// ── Indicador de estado solo por color con tooltip en Portal ─────────────────
export function StatusColorDot({ estKey }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const dotRef = useRef(null);

  const st = STATUS_CONFIG[estKey] || STATUS_CONFIG.activo;

  const ringClass =
    estKey === "inactivo"
      ? "bg-danger ring-4 ring-danger/20"
      : estKey === "pago_pendiente"
        ? "bg-warning ring-4 ring-warning/25"
        : "bg-success ring-4 ring-success/20";

  function handleMouseEnter() {
    if (dotRef.current) {
      const rect = dotRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
    setHovered(true);
  }

  return (
    <div className="inline-flex items-center justify-center">
      <span
        ref={dotRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        aria-label={st.text}
        className={`w-3 h-3 rounded-full inline-block transition-transform duration-150 hover:scale-125 ${ringClass}`}
      />

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {hovered && (
              <div
                style={{ top: coords.top, left: coords.left }}
                className="fixed -translate-x-1/2 -translate-y-full pointer-events-none z-[9999]"
              >
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.92 }}
                  transition={{ duration: 0.13 }}
                  className="block px-2.5 py-1 rounded-md bg-olive-dark text-cream text-[9.5px] font-display whitespace-nowrap shadow-lg"
                >
                  {st.text}
                </motion.span>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

// ── Input con label flotante + ícono + error animado ─────────────────────────
export function AdminField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon: Icon,
  autoFocus,
  maxLength,
  rightSlot,
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
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={`w-full pl-9 ${rightSlot ? "pr-10" : "pr-3"} pt-[22px] pb-[7px] rounded-xl border text-[13px]
                      font-body text-olive-dark
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                      focus:outline-none focus:ring-2 transition-all duration-150
                      ${error
              ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
              : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
            }`}
        />

        <motion.label
          animate={{
            top: lifted ? "6px" : "50%",
            y: lifted ? "0%" : "-50%",
            fontSize: lifted ? "9.5px" : "12.5px",
            color: focused ? "#6E7A4B" : error ? "#D85A30" : "#9B9484",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`absolute left-9 ${rightSlot ? "right-10" : "right-3"} font-display pointer-events-none leading-none whitespace-nowrap overflow-hidden`}
          style={{ textOverflow: "ellipsis" }}
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
            key={name + "-err"}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.16 }}
            className="text-[10.5px] text-accent ml-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Skeleton de tabla para carga ─────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-cream">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-8 h-8 rounded-full bg-cream-darker animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-cream-darker rounded-full w-36 animate-pulse" />
            <div className="h-2 bg-cream-darker rounded-full w-24 animate-pulse" />
          </div>
          <div className="h-2.5 bg-cream-darker rounded-full w-14 animate-pulse" />
          <div className="h-2 bg-cream-darker rounded-full w-16 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
