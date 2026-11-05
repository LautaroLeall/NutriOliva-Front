// AddMealForm.jsx — Formulario inline para agregar comida con búsqueda en catálogo y animaciones

import { useState, useEffect, useRef } from "react";
import { Plus, X, Check, Search, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import FloatingDropdown from "@/components/ui/FloatingDropdown";
import { FORM_VACIO, buscarEnCatalogoMultiword } from "./planBuilderUtils";

function ItemSeleccionadoCard({ item, onLimpiar }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border-2 border-olive/40 bg-olive/5"
    >
      <CheckCircle size={13} className="text-olive flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-display text-[12px] font-semibold text-olive-dark leading-snug truncate">
          {item.nombre}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {item.calorias_por_unidad && (
            <span className="bg-olive/15 text-olive-dark font-display font-bold text-[10px] px-1.5 py-0.5 rounded-md">
              {Math.round(item.calorias_por_unidad)} kcal
            </span>
          )}
          {item.proteinas_g && (
            <span className="text-[9.5px] text-muted">P: {item.proteinas_g}g</span>
          )}
          {item.carbos_g && (
            <span className="text-[9.5px] text-muted">C: {item.carbos_g}g</span>
          )}
          {item.grasas_g && (
            <span className="text-[9.5px] text-muted">G: {item.grasas_g}g</span>
          )}
        </div>
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLimpiar}
        title="Cambiar"
        className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-cream-darker flex items-center
                    justify-center text-muted hover:text-olive-dark hover:border-olive/50 transition-colors"
      >
        <X size={11} />
      </motion.button>
    </motion.div>
  );
}

export default function AddMealForm({ tipo, onAgregar, onCancel, nutricionistaId }) {
  const [mode, setMode] = useState("buscar");
  const [query, setQuery] = useState("");
  const [itemSel, setItemSel] = useState(null);
  const [formNueva, setFormNueva] = useState({ ...FORM_VACIO, tipo_comida: tipo.value });
  const [loading, setLoading] = useState(false);
  const [sugs, setSugs] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [guardandoCat, setGuardandoCat] = useState(false);
  const [mostrarTodo, setMostrarTodo] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (mode !== "buscar" || itemSel) {
      setSugs([]);
      return;
    }
    if (query.trim().length < 2) {
      setSugs([]);
      return;
    }

    const t = setTimeout(async () => {
      setBuscando(true);
      const results = await buscarEnCatalogoMultiword(query, tipo.value, mostrarTodo);
      setSugs(results);
      setBuscando(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, mode, itemSel, mostrarTodo, tipo.value]);

  function seleccionarItem(item) {
    setItemSel(item);
    setSugs([]);
    setQuery("");
  }

  function limpiarSeleccion() {
    setItemSel(null);
    setQuery("");
    setSugs([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function handleAgregar() {
    if (mode === "buscar") {
      if (!itemSel) return;
      setLoading(true);
      await onAgregar({
        tipo_comida: tipo.value,
        descripcion: itemSel.nombre,
        calorias_aprox: itemSel.calorias_por_unidad
          ? Math.round(itemSel.calorias_por_unidad)
          : "",
        proteinas_g: itemSel.proteinas_g || "",
        carbos_g: itemSel.carbos_g || "",
        grasas_g: itemSel.grasas_g || "",
      });
      setLoading(false);
      onCancel();
      return;
    }

    if (!formNueva.descripcion.trim()) return;
    setLoading(true);
    await onAgregar({ ...formNueva, tipo_comida: tipo.value });
    setLoading(false);
    onCancel();
  }

  async function handleGuardarEnCatalogoYAgregar() {
    if (!formNueva.descripcion.trim()) return;
    setGuardandoCat(true);
    const { error } = await supabase.from("catalogo_alimentos").insert({
      nombre: formNueva.descripcion.trim(),
      calorias_por_unidad: formNueva.calorias_aprox
        ? Number(formNueva.calorias_aprox)
        : null,
      proteinas_g: formNueva.proteinas_g ? Number(formNueva.proteinas_g) : null,
      carbos_g: formNueva.carbos_g ? Number(formNueva.carbos_g) : null,
      grasas_g: formNueva.grasas_g ? Number(formNueva.grasas_g) : null,
      tipo_comida: tipo.value,
      es_comida_completa: true,
      nutricionista_id: nutricionistaId,
    });
    if (!error) toast.success("Comida guardada en el catalogo.");
    else toast.error("No se pudo guardar en el catalogo.");
    setGuardandoCat(false);
    await handleAgregar();
  }

  const puedeAgregar =
    mode === "buscar" ? !!itemSel : !!formNueva.descripcion.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="bg-cream rounded-xl p-3.5 mt-1.5 space-y-2.5 border border-cream-darker"
    >
      {/* Selector de modo con pill animado */}
      <div className="flex gap-1 bg-white rounded-xl p-0.5 border border-cream-darker">
        {[
          { key: "buscar", label: "Buscar en catalogo" },
          { key: "nueva", label: "Cargar nueva" },
        ].map((m) => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setMode(m.key);
                setItemSel(null);
                setQuery("");
                setSugs([]);
              }}
              className={`relative flex-1 py-1.5 rounded-lg font-display text-[11px] transition-colors
                          ${active ? "text-cream font-medium" : "text-muted hover:text-olive-dark"}`}
            >
              {active && (
                <motion.div
                  layoutId={`add-meal-tab-${tipo.value}`}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 bg-olive rounded-lg"
                />
              )}
              <span className="relative z-10">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modo: buscar en catálogo */}
      <AnimatePresence mode="wait">
        {mode === "buscar" ? (
          <motion.div
            key="buscar"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {itemSel ? (
              <ItemSeleccionadoCard item={itemSel} onLimpiar={limpiarSeleccion} />
            ) : (
              <div>
                <label className="label">Buscar comida</label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    className="w-full px-3 py-1.5 pr-7 rounded-xl border border-cream-darker text-xs
                                font-body text-olive-dark bg-white focus:outline-none focus:ring-2
                              focus:ring-olive/25 focus:border-olive/60 transition-all"
                    placeholder="Ej: pollo, pollo arroz, salmon brocoli..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {buscando ? (
                      <Loader2 size={12} className="text-muted animate-spin" />
                    ) : (
                      <Search size={12} className="text-muted" />
                    )}
                  </div>
                </div>

                {query.trim().split(/\s+/).filter((w) => w.length >= 2).length > 1 && (
                  <p className="text-[9px] text-olive mt-0.5 font-display">
                    Buscando todos los terminos juntos
                  </p>
                )}

                <div className="flex items-center justify-between mt-1.5">
                  <span
                    className={`text-[9px] font-display px-2 py-0.5 rounded-full
                                ${mostrarTodo
                        ? "bg-muted/10 text-muted"
                        : "bg-olive/10 text-olive-dark"}`}
                  >
                    {mostrarTodo
                      ? "Todo el catalogo"
                      : `Solo para ${tipo.label.toLowerCase()}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMostrarTodo((v) => !v)}
                    className="text-[9px] text-muted hover:text-olive font-display underline underline-offset-2"
                  >
                    {mostrarTodo ? "Filtrar por seccion" : "Ver todo el catalogo"}
                  </button>
                </div>

                <FloatingDropdown anchorRef={inputRef} visible={sugs.length > 0} maxH={240}>
                  {sugs.map((item) => (
                    <button
                      key={item.nombre}
                      type="button"
                      onClick={() => seleccionarItem(item)}
                      className="w-full text-left px-4 py-3 hover:bg-cream transition-colors
                                  border-b border-cream-darker/40 last:border-0 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-display text-[12px] text-olive-dark font-medium truncate
                                      group-hover:text-olive transition-colors"
                          >
                            {item.nombre}
                          </p>
                          {(item.proteinas_g || item.carbos_g || item.grasas_g) && (
                            <p className="text-[9.5px] text-muted mt-0.5">
                              {item.proteinas_g ? `P: ${item.proteinas_g}g` : ""}
                              {item.carbos_g ? ` · C: ${item.carbos_g}g` : ""}
                              {item.grasas_g ? ` · G: ${item.grasas_g}g` : ""}
                            </p>
                          )}
                        </div>
                        {item.calorias_por_unidad && (
                          <span
                            className="flex-shrink-0 bg-olive/10 text-olive-dark font-display
                                        font-semibold text-[11px] px-2 py-0.5 rounded-lg"
                          >
                            {Math.round(item.calorias_por_unidad)} kcal
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("nueva");
                      setSugs([]);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[10.5px] text-muted italic
                              hover:bg-cream transition-colors border-t border-cream-darker/40 font-display"
                  >
                    No esta en el catalogo — Cargar nueva
                  </button>
                </FloatingDropdown>
              </div>
            )}
          </motion.div>
        ) : (
          /* Modo: nueva comida */
          <motion.div
            key="nueva"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-2"
          >
            <div>
              <label className="label">Descripcion *</label>
              <input
                className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                            font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60"
                placeholder="Ej: Tarta de verdura casera"
                value={formNueva.descripcion}
                onChange={(e) =>
                  setFormNueva((f) => ({ ...f, descripcion: e.target.value }))
                }
                autoFocus
                maxLength={200}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Calorias aprox.</label>
                <input
                  type="number"
                  className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                              font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                              [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="kcal"
                  value={formNueva.calorias_aprox}
                  onChange={(e) =>
                    setFormNueva((f) => ({ ...f, calorias_aprox: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="label">Proteinas (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                              font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                              [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={formNueva.proteinas_g}
                  onChange={(e) =>
                    setFormNueva((f) => ({ ...f, proteinas_g: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Carbohidratos (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                              font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                              [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={formNueva.carbos_g}
                  onChange={(e) =>
                    setFormNueva((f) => ({ ...f, carbos_g: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="label">Grasas (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-1.5 rounded-xl border border-cream-darker text-xs
                              font-body text-olive-dark bg-white focus:outline-none focus:border-olive/60
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                              [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={formNueva.grasas_g}
                  onChange={(e) =>
                    setFormNueva((f) => ({ ...f, grasas_g: e.target.value }))
                  }
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acciones */}
      <div className="flex gap-2 flex-wrap pt-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onCancel}
          className="flex-1 min-w-[80px] py-1.5 rounded-xl bg-white border border-cream-darker text-muted
                      font-display text-[11px] flex items-center justify-center gap-1 hover:bg-cream transition-colors"
        >
          <X size={11} /> Cancelar
        </motion.button>
        <motion.button
          type="button"
          whileHover={puedeAgregar && !loading ? { scale: 1.02 } : {}}
          whileTap={puedeAgregar && !loading ? { scale: 0.96 } : {}}
          onClick={handleAgregar}
          disabled={loading || !puedeAgregar}
          className="flex-1 min-w-[80px] py-1.5 rounded-xl bg-olive text-cream font-display text-[11px]
                      flex items-center justify-center gap-1 hover:bg-olive-deep disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          Agregar
        </motion.button>
        {mode === "nueva" && formNueva.descripcion.trim() && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGuardarEnCatalogoYAgregar}
            disabled={guardandoCat || loading}
            className="w-full py-1.5 rounded-xl bg-white border border-olive/40 text-olive-dark
                        font-display text-[10.5px] flex items-center justify-center gap-1
                      hover:bg-cream disabled:opacity-50 transition-colors"
          >
            {guardandoCat ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Plus size={11} />
            )}
            Guardar en catalogo y agregar al plan
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
