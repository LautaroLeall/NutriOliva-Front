// FoodForm.jsx — Formulario de registro o edición de comida con animaciones y tabs deslizables

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { MODOS } from "@/lib/foodFormUtils";
import { useFoodForm } from "@/hooks/useFoodForm";
import FotoInput from "./foodForm/FotoInput";
import ModoPlan from "./foodForm/ModoPlan";
import ModoCatalogo from "./foodForm/ModoCatalogo";
import ModoOtra from "./foodForm/ModoOtra";

export default function FoodForm({
  open,
  onClose,
  onGuardar,
  comidasPlan = [],
  pacienteId,
  modoEdicion = false,
  datosIniciales = null,
}) {
  const form = useFoodForm({
    open,
    comidasPlan,
    pacienteId,
    modoEdicion,
    datosIniciales,
    onGuardar,
    onClose,
  });

  const modosDisponibles = MODOS.filter(
    (m) => m.key !== "plan" || comidasPlan.length > 0
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modoEdicion ? "Editar comida" : "Registrar comida"}
    >
      <form onSubmit={form.handleSubmit} className="space-y-3.5" noValidate>
        {/* ── Selector de modo con layoutId — oculto en modo edición ─────── */}
        {!modoEdicion && (
          <div className="flex gap-1 bg-cream rounded-xl p-1 border border-cream-darker">
            {modosDisponibles.map((m) => {
              const active = form.modo === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => form.cambiarModo(m.key)}
                  className={`relative flex-1 py-1.5 rounded-lg font-display text-[11.5px] font-medium transition-colors
                              ${active ? "text-olive-dark font-semibold" : "text-muted hover:text-olive-dark"}`}
                >
                  {active && (
                    <motion.div
                      layoutId="food-form-mode-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{m.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Panel del modo activo con AnimatePresence ──────────────────── */}
        <AnimatePresence mode="wait">
          {form.modo === "plan" && (
            <motion.div
              key="modo-plan"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <ModoPlan
                tipoActual={form.tipoActual}
                comidasDelMomento={form.comidasDelMomento}
                otrasComidasPlan={form.otrasComidasPlan}
                planSeleccionada={form.planSeleccionada}
                setPlanSel={form.setPlanSel}
                errors={form.errors}
              />
            </motion.div>
          )}

          {form.modo === "catalogo" && (
            <motion.div
              key="modo-catalogo"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <ModoCatalogo
                query={form.query}
                setQuery={form.setQuery}
                setErrors={form.setErrors}
                inputRef={form.inputRef}
                buscando={form.buscando}
                sugs={form.sugs}
                itemSeleccionado={form.itemSeleccionado}
                seleccionarItem={form.seleccionarItem}
                limpiarSeleccion={form.limpiarSeleccion}
                cambiarModo={form.cambiarModo}
                errors={form.errors}
              />
            </motion.div>
          )}

          {form.modo === "otra" && (
            <motion.div
              key="modo-otra"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <ModoOtra
                formOtra={form.formOtra}
                setFormOtra={form.setFormOtra}
                setErrors={form.setErrors}
                errors={form.errors}
                estimandoCal={form.estimandoCal}
                estimarCalorias={form.estimarCalorias}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Foto opcional ─────────────────────────────────────────────── */}
        <FotoInput
          foto={form.foto}
          onFoto={form.setFoto}
          onQuitarFoto={() => form.setFoto(null)}
        />

        {/* ── Error de servidor ──────────────────────────────────────────── */}
        <AnimatePresence>
          {form.errors._server && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-accent bg-accent/8 border border-accent/20 rounded-xl px-3.5 py-2.5"
            >
              {form.errors._server}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Acciones ──────────────────────────────────────────────────── */}
        <div className="flex gap-2 pt-1">
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
            type="submit"
            disabled={form.loading}
            whileHover={!form.loading ? { scale: 1.02, boxShadow: "0 6px 20px rgba(110,122,75,0.3)" } : {}}
            whileTap={!form.loading ? { scale: 0.96 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="btn-primary flex-1 py-2.5 disabled:opacity-60"
          >
            {form.loading ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Guardando...
              </span>
            ) : modoEdicion ? (
              "Guardar"
            ) : (
              "Registrar"
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
