// PatientRow.jsx — Fila de paciente
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle, Clock, ChevronRight,
  Pencil, UserX, UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function initials(nombre) {
  return nombre.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function formatFecha(fecha) {
  if (!fecha) return "Sin actividad";
  const diff = (new Date() - new Date(fecha)) / (1000 * 60 * 60);
  if (diff < 1) return "Hace menos de 1h";
  if (diff < 24) return `Hace ${Math.floor(diff)}h`;
  if (diff < 48) return "Ayer";
  return `Hace ${Math.floor(diff / 24)} dias`;
}

// ── Botón de acción con tooltip en Portal ─────────────────────────────────
function ActionBtn({ onClick, title, color, icon: Icon }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const colorMap = {
    olive: { base: "#69644D", hover: "#3F4A2B", bg: "#F0EDE4" },
    danger: { base: "#69644D", hover: "#D85A30", bg: "#FEF2F2" },
    success: { base: "#69644D", hover: "#6E9B5C", bg: "#F0FDF4" },
  };
  const c = colorMap[color] ?? colorMap.olive;

  function handleMouseEnter() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const rawLeft = rect.left + rect.width / 2;
      const clampedLeft =
        typeof window !== "undefined"
          ? Math.min(window.innerWidth - 64, Math.max(64, rawLeft))
          : rawLeft;
      setCoords({
        top: rect.top - 7,
        left: clampedLeft,
      });
    }
    setHovered(true);
  }

  return (
    <div className="relative">
      <motion.button
        ref={btnRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        animate={{
          color: hovered ? c.hover : c.base,
          backgroundColor: hovered ? c.bg : "transparent",
        }}
        whileTap={{ scale: 0.82 }}
        transition={{ duration: 0.15 }}
        className="p-2 rounded-xl focus:outline-none cursor-pointer"
        aria-label={title}
      >
        <motion.div
          animate={{ scale: hovered ? 1.18 : 1, rotate: hovered ? (color === "danger" ? -8 : color === "success" ? 8 : 0) : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <Icon size={14} strokeWidth={1.8} />
        </motion.div>
      </motion.button>

      {/* Tooltip en Portal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {hovered && title && (
              <div
                style={{ top: coords.top, left: coords.left }}
                className="fixed -translate-x-1/2 -translate-y-full pointer-events-none z-[9999]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.92 }}
                  transition={{ duration: 0.14 }}
                  className="px-2.5 py-1 bg-olive-dark text-cream text-[9.5px] font-display rounded-md whitespace-nowrap shadow-lg"
                >
                  {title}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

// ── Fila principal ────────────────────────────────────────────────────────
export default function PatientRow({ paciente, onEditar, onDesactivar, onReactivar }) {
  const navigate = useNavigate();
  const activo = paciente.estado === "activo";

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 14 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`border-b border-cream last:border-0 group relative
                  ${activo ? "cursor-pointer" : "opacity-60"}`}
      onClick={() => activo && navigate(`/panel/pacientes/${paciente.id}`)}
    >
      {/* Paciente — avatar + nombre + mail */}
      <td className="px-5 py-3.5 group-hover:bg-cream/60 transition-colors duration-150 rounded-l-sm">
        <div className="flex items-center gap-3">
          <motion.span
            whileHover={{ scale: 1.14, rotate: -4 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="avatar flex-shrink-0 select-none"
          >
            {initials(paciente.nombre)}
          </motion.span>
          <div>
            <div className="font-semibold text-olive-dark text-[12.5px] leading-tight group-hover:text-olive transition-colors duration-150">
              {paciente.nombre}
            </div>
            <div className="text-[10.5px] text-muted mt-0.5">{paciente.email}</div>
          </div>
        </div>
      </td>

      {/* Estado de actividad */}
      <td className="px-4 sm:px-5 py-3.5 group-hover:bg-cream/60 transition-colors duration-150 whitespace-nowrap">
        {!activo ? (
          <span className="badge bg-cream-darker text-muted">Inactivo</span>
        ) : paciente.sinActividad48h ? (
          <motion.div
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="inline-flex items-center gap-1.5 text-accent bg-accent/8
                        px-2.5 py-1 rounded-full"
          >
            <AlertCircle size={11} />
            <span className="text-[10.5px] font-semibold">Sin actividad</span>
          </motion.div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-success
                          bg-success/10 px-2.5 py-1 rounded-full">
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              <Clock size={11} />
            </motion.div>
            <span className="text-[10.5px] font-semibold">Al dia</span>
          </div>
        )}
      </td>

      {/* Última actividad */}
      <td className="px-4 sm:px-5 py-3.5 text-[11px] text-muted group-hover:bg-cream/60 transition-colors duration-150 whitespace-nowrap">
        {formatFecha(paciente.ultimaActividad)}
      </td>

      {/* Acciones */}
      <td
        className="px-4 py-3.5 group-hover:bg-cream/60 transition-colors duration-150 rounded-r-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-0.5 justify-end">
          <ActionBtn
            onClick={() => onEditar(paciente)}
            title="Editar"
            color="olive"
            icon={Pencil}
          />

          {activo ? (
            <ActionBtn
              onClick={() => onDesactivar(paciente.id)}
              title="Desactivar"
              color="danger"
              icon={UserX}
            />
          ) : (
            <ActionBtn
              onClick={() => onReactivar(paciente.id)}
              title="Reactivar"
              color="success"
              icon={UserCheck}
            />
          )}

          {activo && (
            <ActionBtn
              onClick={() => navigate(`/panel/pacientes/${paciente.id}`)}
              title="Ver ficha"
              color="olive"
              icon={ChevronRight}
            />
          )}
        </div>
      </td>
    </motion.tr>
  );
}
