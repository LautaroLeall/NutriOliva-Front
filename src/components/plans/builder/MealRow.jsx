// MealRow.jsx — Fila de comida con animaciones, tooltips y edición inline

import { useState } from "react";
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TIPOS } from "./planBuilderUtils";

function ActionBtn({ onClick, tooltip, variant = "default", children }) {
  const [hovered, setHovered] = useState(false);

  const hoverBg =
    variant === "danger"
      ? "rgba(216, 90, 48, 0.12)"
      : "rgba(110, 122, 75, 0.14)";
  const hoverColor = variant === "danger" ? "#D85A30" : "#6E7A4B";

  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
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

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.92 }}
            transition={{ duration: 0.13 }}
            className="absolute bottom-full mb-1.5 px-2 py-0.5 rounded-md
                      bg-olive-dark text-cream text-[9.5px] font-display
                        whitespace-nowrap pointer-events-none shadow-md z-30"
          >
            {tooltip}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MealRow({ comida, index = 0, onEditar, onEliminar, readonly }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ ...comida });
  const [guardando, setGuardando] = useState(false);

  async function handleGuardar() {
    if (!form.descripcion.trim()) return;
    setGuardando(true);
    await onEditar(comida.id, form);
    setGuardando(false);
    setEditando(false);
  }

  if (editando) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="bg-cream rounded-xl p-3.5 space-y-2.5 border border-cream-darker"
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Tipo</label>
            <select
              name="tipo_comida"
              className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                          font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60"
              value={form.tipo_comida}
              onChange={(e) => setForm((f) => ({ ...f, tipo_comida: e.target.value }))}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Calorias aprox.</label>
            <input
              name="calorias_aprox"
              type="number"
              className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                          font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="kcal"
              value={form.calorias_aprox ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, calorias_aprox: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="label">Descripcion</label>
          <input
            name="descripcion"
            className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                        font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60"
            placeholder="Ej: 2 tostadas con palta y huevo"
            value={form.descripcion}
            onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["proteinas_g", "Proteinas (g)"],
            ["carbos_g", "Carbos (g)"],
            ["grasas_g", "Grasas (g)"],
          ].map(([n, l]) => (
            <div key={n}>
              <label className="label">{l}</label>
              <input
                name={n}
                type="number"
                className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                            font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
                value={form[n] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [n]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-0.5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setEditando(false)}
            className="flex-1 py-1.5 rounded-xl bg-white border border-cream-darker text-muted
                        font-display text-[11px] flex items-center justify-center gap-1 hover:bg-cream transition-colors"
          >
            <X size={11} /> Cancelar
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleGuardar}
            disabled={guardando}
            className="flex-1 py-1.5 rounded-xl bg-olive text-cream font-display text-[11px]
                        flex items-center justify-center gap-1 hover:bg-olive-deep transition-colors"
          >
            {guardando ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            Guardar
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.18, delay: Math.min(index, 5) * 0.03 }}
      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-cream/60 group transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-olive-dark font-medium leading-snug truncate group-hover:text-olive transition-colors">
          {comida.descripcion}
        </p>
        {(comida.calorias_aprox > 0 ||
          comida.proteinas_g ||
          comida.carbos_g ||
          comida.grasas_g) && (
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {comida.calorias_aprox > 0 && (
                <span className="text-[10px] font-display font-semibold text-olive-dark bg-cream px-2 py-0.5 rounded-md">
                  {comida.calorias_aprox} kcal
                </span>
              )}
              {comida.proteinas_g > 0 && (
                <span className="text-[10px] text-muted">P: {comida.proteinas_g}g</span>
              )}
              {comida.carbos_g > 0 && (
                <span className="text-[10px] text-muted">C: {comida.carbos_g}g</span>
              )}
              {comida.grasas_g > 0 && (
                <span className="text-[10px] text-muted">G: {comida.grasas_g}g</span>
              )}
            </div>
          )}
      </div>

      {!readonly && (
        <div className="flex gap-0.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionBtn onClick={() => setEditando(true)} tooltip="Editar">
            <Pencil size={12} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onEliminar(comida.id)}
            tooltip="Eliminar"
            variant="danger"
          >
            <Trash2 size={12} />
          </ActionBtn>
        </div>
      )}
    </motion.div>
  );
}
