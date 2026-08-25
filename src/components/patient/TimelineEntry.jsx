import { useState } from 'react'
import { Loader2, X, Pencil, Trash2, Flame, Dumbbell, CheckCircle } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import FoodForm from '@/components/patient/FoodForm'

// ── Entrada individual del timeline (comida o actividad) ─────────────────────
export default function TimelineEntry({ registro, tipo, onEliminar, onEditar, pacienteId, comidasPlan = [] }) {
  const [confirmando, setConfirmando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const esComida = tipo === 'comida'

  function formatHora(hora) {
    if (!hora) return ''
    return hora.slice(0, 5)
  }

  async function handleEliminar() {
    setEliminando(true)
    await onEliminar(registro.id)
    setEliminando(false)
    setConfirmando(false)
  }

  // El FoodForm en modo edición llama a onGuardar con los nuevos datos
  // onEditar(id, datos) → debe retornar { error }
  async function handleGuardarEdicion(datos) {
    if (!onEditar) return { error: null }
    const result = await onEditar(registro.id, {
      descripcion: datos.descripcion,
      calorias_estimadas: datos.calorias_estimadas ?? null,
      fuente_estimacion: datos.fuente_estimacion ?? registro.fuente_estimacion,
      foto_path: datos.foto_path ?? registro.foto_path,
    })
    return result || { error: null }
  }

  const Icon = esComida ? Flame : Dumbbell
  const calorias = esComida ? registro.calorias_estimadas : registro.calorias_gastadas

  return (
    <>
      <div className={`flex gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-cream/60 group`}>
        {/* Ícono tipo */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        ${esComida ? 'bg-olive/10' : 'bg-blue-50'}`}>
          <Icon size={14} className={esComida ? 'text-olive' : 'text-blue-400'} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] text-olive-dark font-medium leading-snug">
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
              <span className={`text-[10.5px] font-medium
                                ${esComida ? 'text-olive' : 'text-blue-500'}`}>
                {esComida ? '+' : '-'}{calorias} kcal
              </span>
            )}
            {/* Badge de fuente */}
            {esComida && registro.fuente_estimacion && registro.fuente_estimacion !== 'manual' && (
              <span className="text-[9px] text-muted/60 italic capitalize">
                {registro.fuente_estimacion === 'plan' ? 'del plan' : registro.fuente_estimacion}
              </span>
            )}
          </div>
        </div>

        {/* Acciones — visibles al hover. Ocultas si los handlers son null (modo solo lectura) */}
        {(onEliminar || onEditar) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
            {esComida && onEditar && (
              <button onClick={() => setEditando(true)}
                className="p-1.5 rounded-lg text-muted hover:text-olive hover:bg-cream transition-colors"
                title="Editar">
                <Pencil size={12} />
              </button>
            )}
            {onEliminar && (
              <button onClick={() => setConfirmando(true)}
                className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Eliminar">
                {eliminando ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de edición — mismo FoodForm con datos pre-cargados */}
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

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={confirmando}
        onClose={() => setConfirmando(false)}
        onConfirm={handleEliminar}
        title={`Eliminar ${esComida ? 'comida' : 'actividad'}`}
        message={`¿Eliminás "${esComida ? registro.descripcion : registro.tipo}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={eliminando}
      />
    </>
  )
}
