// FoodForm.jsx — Formulario de registro o edicion de una comida.
// Toda la logica vive en useFoodForm. Este archivo solo renderiza.
//
// Props:
//   open          {boolean}   — controla visibilidad del modal
//   onClose       {function}  — callback al cerrar
//   onGuardar     {function}  — callback al guardar; recibe { descripcion, calorias_estimadas, fuente_estimacion, foto_path }
//   comidasPlan   {Array}     — comidas del plan activo del paciente
//   pacienteId    {string}    — id del paciente actual
//   modoEdicion   {boolean}   — si true muestra "Editar comida" en el titulo
//   datosIniciales {object}   — { descripcion, calorias_estimadas } pre-cargados al editar

import { Loader2 } from "lucide-react";
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modoEdicion ? "Editar comida" : "Registrar comida"}
    >
      <form onSubmit={form.handleSubmit} className="space-y-4" noValidate>
        {/* ── Selector de modo — oculto en modo edicion ─────────────────── */}
        {!modoEdicion && (
          <div className="flex gap-1 bg-cream rounded-xl p-1 border border-cream-darker">
            {MODOS.filter(
              (m) => m.key !== "plan" || comidasPlan.length > 0,
            ).map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => form.cambiarModo(m.key)}
                className={`flex-1 py-1.5 rounded-lg font-display text-[11.5px] font-medium transition-all
                            ${
                              form.modo === m.key
                                ? "bg-white text-olive-dark shadow-sm"
                                : "text-muted hover:text-olive-dark"
                            }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Panel del modo activo ──────────────────────────────────────── */}
        {form.modo === "plan" && (
          <ModoPlan
            tipoActual={form.tipoActual}
            comidasDelMomento={form.comidasDelMomento}
            otrasComidasPlan={form.otrasComidasPlan}
            planSeleccionada={form.planSeleccionada}
            setPlanSel={form.setPlanSel}
            errors={form.errors}
          />
        )}

        {form.modo === "catalogo" && (
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
        )}

        {form.modo === "otra" && (
          <ModoOtra
            formOtra={form.formOtra}
            setFormOtra={form.setFormOtra}
            setErrors={form.setErrors}
            errors={form.errors}
            estimandoCal={form.estimandoCal}
            estimarCalorias={form.estimarCalorias}
          />
        )}

        {/* ── Foto opcional ─────────────────────────────────────────────── */}
        <FotoInput
          foto={form.foto}
          onFoto={form.setFoto}
          onQuitarFoto={() => form.setFoto(null)}
        />

        {/* ── Error de servidor ──────────────────────────────────────────── */}
        {form.errors._server && (
          <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-2">
            {form.errors._server}
          </p>
        )}

        {/* ── Acciones ──────────────────────────────────────────────────── */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1 py-2.5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 py-2.5"
            disabled={form.loading}
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
          </button>
        </div>
      </form>
    </Modal>
  );
}
