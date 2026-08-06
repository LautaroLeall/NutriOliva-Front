import { useState } from 'react'
import { Loader2, X, Pencil, Check, Trash2, Flame, Dumbbell } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

/**
 * Entrada individual del timeline (comida o actividad).
 */
export default function TimelineEntry({ registro, tipo, onEliminar, onEditar }) {
  const [confirmando, setConfirmando] = useState(false)
  const [editando,    setEditando]    = useState(false)
  const [editDesc,    setEditDesc]    = useState('')
  const [editCal,     setEditCal]     = useState('')
  const [editErr,     setEditErr]     = useState('')
  const [eliminando,  setEliminando]  = useState(false)
  const [guardando,   setGuardando]   = useState(false)

  const esComida = tipo === 'comida'

  function formatHora(hora) {
    if (!hora) return ''
    return hora.slice(0, 5)
  }

  function abrirEdicion() {
    setEditDesc(registro.descripcion || registro.tipo || '')
    setEditCal(esComida ? (registro.calorias_estimadas || '') : (registro.calorias_gastadas || ''))
    setEditErr('')
    setEditando(true)
  }

  async function handleGuardar() {
    if (!editDesc.trim()) { setEditErr('Campo obligatorio.'); return }
    if (editCal !== '' && (isNaN(Number(editCal)) || Number(editCal) < 0)) {
      setEditErr('Las calorías deben ser un número positivo.')
      return
    }
    setGuardando(true)
    const { error } = await onEditar(registro.id, {
      descripcion:        editDesc,
      calorias_estimadas: editCal ? Number(editCal) : null,
    })
    setGuardando(false)
    if (error) { setEditErr(error); return }
    setEditando(false)
  }

  async function handleEliminar() {
    setEliminando(true)
    await onEliminar(registro.id)
    setEliminando(false)
    setConfirmando(false)
  }

  const Icon = esComida ? Flame : Dumbbell
  const calorias = esComida
    ? registro.calorias_estimadas
    : registro.calorias_gastadas

  return (
    <>
      <div className={`flex gap-3 px-4 py-3 rounded-xl transition-colors
                       ${editando ? 'bg-cream' : 'hover:bg-cream/60 group'}`}>
        {/* Ícono tipo */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                         ${esComida ? 'bg-olive/10' : 'bg-blue-50'}`}>
          <Icon size={14} className={esComida ? 'text-olive' : 'text-blue-400'} />
        </div>

        <div className="flex-1 min-w-0">
          {editando ? (
            <div className="space-y-2">
              <input
                className={`input py-1.5 text-sm ${editErr ? 'border-red-400' : ''}`}
                value={editDesc}
                onChange={e => { setEditDesc(e.target.value); setEditErr('') }}
                placeholder="Descripción"
                autoFocus
              />
              <input
                type="number"
                className="input py-1.5 text-sm"
                value={editCal}
                onChange={e => { setEditCal(e.target.value); setEditErr('') }}
                placeholder="Calorías (opcional)"
                min={0}
              />
              {editErr && <p className="text-[10.5px] text-red-500">{editErr}</p>}
              <div className="flex gap-2">
                <button onClick={() => setEditando(false)}
                  className="flex-1 py-1.5 rounded-lg border border-cream-darker bg-white
                             text-muted font-display text-[11px] hover:bg-cream transition-colors">
                  <X size={10} className="inline mr-1" />Cancelar
                </button>
                <button onClick={handleGuardar} disabled={guardando}
                  className="flex-1 py-1.5 rounded-lg bg-olive text-cream font-display
                             text-[11px] hover:bg-olive-deep transition-colors disabled:opacity-60">
                  {guardando
                    ? <Loader2 size={11} className="inline animate-spin" />
                    : <><Check size={10} className="inline mr-1" />Guardar</>}
                </button>
              </div>
            </div>
          ) : (
            <>
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
              </div>
            </>
          )}
        </div>

        {/* Acciones — visible on hover */}
        {!editando && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
            {esComida && (
              <button onClick={abrirEdicion}
                className="p-1.5 rounded-lg text-muted hover:text-olive hover:bg-cream transition-colors">
                <Pencil size={12} />
              </button>
            )}
            <button onClick={() => setConfirmando(true)}
              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
              {eliminando ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </button>
          </div>
        )}
      </div>

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
