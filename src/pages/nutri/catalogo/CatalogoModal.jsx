// CatalogoModal.jsx — Modal de alta y edición de alimentos del catálogo

import { Loader2, Flame, Beef, Wheat, Droplets, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { Field, SelectField } from "./CatalogoField";
import { UNIDADES } from "./catalogoConstants";

export default function CatalogoModal({
  open, editando, form, errors, guardando,
  onClose, onChange, onSubmit,
}) {
  return (
    <Modal
      open={open}
      onClose={() => !guardando && onClose()}
      title={editando ? "Editar alimento" : "Agregar alimento"}
    >
      <form onSubmit={onSubmit} className="space-y-3.5" noValidate>

        {/* Nombre */}
        <Field
          label="Nombre del alimento *"
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          error={errors.nombre}
          icon={UtensilsCrossed}
          autoFocus
        />

        {/* Calorias + Unidad */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Calorias (kcal) *"
            name="calorias_por_unidad"
            type="number"
            min="0"
            step="0.1"
            value={form.calorias_por_unidad}
            onChange={onChange}
            error={errors.calorias_por_unidad}
            icon={Flame}
          />
          <SelectField
            label="Unidad"
            name="unidad"
            value={form.unidad}
            onChange={onChange}
            options={UNIDADES}
            icon={Beef}
          />
        </div>

        {/* Macros opcionales */}
        <div>
          <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2.5">
            Macros — opcionales
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Proteinas (g)"
              name="proteinas_g"
              type="number"
              min="0"
              step="0.1"
              value={form.proteinas_g}
              onChange={onChange}
              error={errors.proteinas_g}
              icon={Beef}
            />
            <Field
              label="Carbos (g)"
              name="carbos_g"
              type="number"
              min="0"
              step="0.1"
              value={form.carbos_g}
              onChange={onChange}
              error={errors.carbos_g}
              icon={Wheat}
            />
            <Field
              label="Grasas (g)"
              name="grasas_g"
              type="number"
              min="0"
              step="0.1"
              value={form.grasas_g}
              onChange={onChange}
              error={errors.grasas_g}
              icon={Droplets}
            />
          </div>
        </div>

        {/* Error servidor */}
        <AnimatePresence>
          {errors._server && (
            <motion.p
              key="server"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-accent bg-accent/8 border border-accent/20
                          rounded-xl px-3.5 py-2.5"
            >
              {errors._server}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Botones */}
        <div className="flex gap-2 pt-1">
          <motion.button
            type="button"
            onClick={() => !guardando && onClose()}
            disabled={guardando}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="btn-ghost flex-1 py-2.5"
          >
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            disabled={guardando}
            whileHover={!guardando ? { scale: 1.02, boxShadow: "0 6px 20px rgba(110,122,75,0.3)" } : {}}
            whileTap={!guardando ? { scale: 0.96 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="btn-primary flex-1 py-2.5 disabled:opacity-60"
          >
            {guardando ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                Guardando...
              </span>
            ) : editando ? "Guardar cambios" : "Agregar al catalogo"}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
