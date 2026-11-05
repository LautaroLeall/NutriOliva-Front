// TimelineEntry.jsx — Entrada individual del timeline con animaciones y tooltips

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, Pencil, Trash2, Flame, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FoodForm from "@/components/patient/FoodForm";
import { generarUrlFirmada } from "@/lib/storage";

function ActionBtn({ onClick, tooltip, variant = "default", disabled, children }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const hoverBg =
    variant === "danger"
      ? "rgba(216, 90, 48, 0.12)"
      : "rgba(110, 122, 75, 0.14)";
  const hoverColor = variant === "danger" ? "#D85A30" : "#6E7A4B";

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
        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
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

export default function TimelineEntry({
  registro,
  tipo,
  index = 0,
  onEliminar,
  onEditar,
  pacienteId,
  comidasPlan = [],
}) {
  const [confirmando, setConfirmando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(null);

  const esComida = tipo === "comida";

  useEffect(() => {
    let active = true;
    if (esComida && registro.foto_url) {
      generarUrlFirmada(registro.foto_url, "fotos-comidas").then((url) => {
        if (active) setFotoUrl(url);
      });
    } else {
      setFotoUrl(null);
    }
    return () => {
      active = false;
    };
  }, [esComida, registro.foto_url]);

  function formatHora(hora) {
    if (!hora) return "";
    return hora.slice(0, 5);
  }

  async function handleEliminar() {
    setEliminando(true);
    await onEliminar(registro.id);
    setEliminando(false);
    setConfirmando(false);
  }

  async function handleGuardarEdicion(datos) {
    if (!onEditar) return { error: null };
    const result = await onEditar(registro.id, {
      descripcion: datos.descripcion,
      calorias_estimadas: datos.calorias_estimadas ?? null,
      fuente_estimacion: datos.fuente_estimacion ?? registro.fuente_estimacion,
      foto_path: datos.foto_path ?? registro.foto_url ?? registro.foto_path,
    });
    return result || { error: null };
  }

  const Icon = esComida ? Flame : Dumbbell;
  const calorias = esComida ? registro.calorias_estimadas : registro.calorias_gastadas;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.22, delay: Math.min(index, 6) * 0.04 }}
        className="flex gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-cream/60 group"
      >
        {/* Icono tipo */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: esComida ? -6 : 6 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${esComida ? "bg-olive/10" : "bg-blue-50"}`}
        >
          <Icon size={14} className={esComida ? "text-olive" : "text-blue-400"} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] text-olive-dark font-medium leading-snug group-hover:text-olive transition-colors">
            {esComida ? registro.descripcion : registro.tipo}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10.5px] text-muted">{formatHora(registro.hora)}</span>
            {!esComida && registro.duracion_min && (
              <span className="text-[10.5px] text-muted">
                · {registro.duracion_min} min · {registro.intensidad}
              </span>
            )}
            {calorias > 0 && (
              <span
                className={`text-[10.5px] font-display font-semibold px-1.5 py-0.5 rounded-md
                            ${esComida ? "bg-olive/10 text-olive-dark" : "bg-blue-50 text-blue-600"}`}
              >
                {esComida ? "+" : "-"}{calorias} kcal
              </span>
            )}
            {esComida &&
              registro.fuente_estimacion &&
              registro.fuente_estimacion !== "manual" && (
                <span className="text-[9px] text-muted/70 italic capitalize">
                  {registro.fuente_estimacion === "plan"
                    ? "del plan"
                    : registro.fuente_estimacion}
                </span>
              )}
          </div>
        </div>

        {/* Miniatura de foto de comida */}
        {esComida && fotoUrl && (
          <a
            href={fotoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver foto de comida"
            className="flex-shrink-0"
          >
            <img
              src={fotoUrl}
              alt={registro.descripcion || "Foto de comida"}
              className="w-11 h-11 rounded-xl object-cover border border-cream-darker flex-shrink-0 hover:opacity-90 transition-opacity"
            />
          </a>
        )}

        {/* Acciones visibles en mobile y al hover en desktop */}
        {(onEliminar || onEditar) && (
          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
            {esComida && onEditar && (
              <ActionBtn onClick={() => setEditando(true)} tooltip="Editar">
                <Pencil size={12} />
              </ActionBtn>
            )}
            {onEliminar && (
              <ActionBtn
                onClick={() => setConfirmando(true)}
                tooltip="Eliminar"
                variant="danger"
                disabled={eliminando}
              >
                {eliminando ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
              </ActionBtn>
            )}
          </div>
        )}
      </motion.div>

      {esComida && (
        <FoodForm
          open={editando}
          onClose={() => setEditando(false)}
          onGuardar={handleGuardarEdicion}
          comidasPlan={comidasPlan}
          pacienteId={pacienteId}
          modoEdicion
          datosIniciales={{
            descripcion: registro.descripcion,
            calorias_estimadas: registro.calorias_estimadas,
            fuente_estimacion: registro.fuente_estimacion,
          }}
        />
      )}

      <ConfirmDialog
        open={confirmando}
        onClose={() => setConfirmando(false)}
        onConfirm={handleEliminar}
        title={`Eliminar ${esComida ? "comida" : "actividad"}`}
        message={`¿Eliminas "${esComida ? registro.descripcion : registro.tipo}"? Esta accion no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={eliminando}
      />
    </>
  );
}
