import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { estimarCaloriasActividad } from '@/hooks/useBalance'

const INTENSIDADES = [
  { value: 'baja',  label: 'Baja',  desc: 'Caminata, yoga, stretching' },
  { value: 'media', label: 'Media', desc: 'Bici, natación, trote liviano' },
  { value: 'alta',  label: 'Alta',  desc: 'HIIT, pesas, fútbol, running' },
]

const FORM_VACIO = {
  tipo:        '',
  duracion_min: '',
  intensidad:  'media',
}

// ── Validación ────────────────────────────────────────────────────────────────
function validar(form) {
  const errs = {}
  if (!form.tipo.trim())
    errs.tipo = 'El tipo de actividad es obligatorio.'
  if (form.tipo.trim().length < 2)
    errs.tipo = 'Describí un poco más la actividad.'
  if (!form.duracion_min)
    errs.duracion = 'La duración es obligatoria.'
  else {
    const n = Number(form.duracion_min)
    if (isNaN(n) || !Number.isInteger(n)) errs.duracion = 'Debe ser un número entero.'
    if (n < 1)   errs.duracion = 'La duración mínima es 1 minuto.'
    if (n > 480) errs.duracion = 'El máximo es 480 minutos (8 horas).'
  }
  return errs
}

/**
 * Formulario para registrar actividad física.
 * Calcula automáticamente las calorías estimadas según MET.
 */
export default function ActivityForm({ open, onClose, onGuardar }) {
  const [form,    setForm]    = useState(FORM_VACIO)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  // Calorías estimadas en tiempo real
  const calEst = form.duracion_min && Number(form.duracion_min) > 0
    ? estimarCaloriasActividad(Number(form.duracion_min), form.intensidad)
    : null

  // Reset al abrir
  useEffect(() => {
    if (open) { setForm(FORM_VACIO); setErrors({}) }
  }, [open])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name] || errors.duracion)
      setErrors(e => ({ ...e, [name]: undefined, duracion: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validar(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    const { error } = await onGuardar({
      tipo:             form.tipo.trim(),
      duracion_min:     Number(form.duracion_min),
      intensidad:       form.intensidad,
      calorias_gastadas: calEst,
    })
    setLoading(false)
    if (error) { setErrors({ _server: error }); return }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar actividad">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* Tipo de actividad */}
        <div>
          <label className="label">Actividad *</label>
          <input
            name="tipo"
            className={`input ${errors.tipo ? 'border-red-400' : ''}`}
            placeholder="Ej: Salida a correr, clase de natación..."
            value={form.tipo}
            onChange={handleChange}
            autoFocus
          />
          {errors.tipo && <p className="text-[10.5px] text-red-500 mt-1">{errors.tipo}</p>}
        </div>

        {/* Duración */}
        <div>
          <label className="label">Duración *</label>
          <div className="relative">
            <input
              name="duracion_min"
              type="number"
              className={`input pr-14 ${errors.duracion ? 'border-red-400' : ''}`}
              placeholder="Ej: 45"
              value={form.duracion_min}
              onChange={handleChange}
              min={1}
              max={480}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[11px]">min</span>
          </div>
          {errors.duracion && <p className="text-[10.5px] text-red-500 mt-1">{errors.duracion}</p>}
        </div>

        {/* Intensidad */}
        <div>
          <label className="label">Intensidad *</label>
          <div className="grid grid-cols-3 gap-2">
            {INTENSIDADES.map(i => (
              <button
                key={i.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, intensidad: i.value }))}
                className={`rounded-xl px-3 py-2.5 text-left transition-all border
                            ${form.intensidad === i.value
                              ? 'bg-olive text-cream border-olive'
                              : 'bg-white border-cream-darker text-muted hover:border-olive/50'}`}
              >
                <p className={`font-display text-[12px] font-semibold
                               ${form.intensidad === i.value ? 'text-cream' : 'text-olive-dark'}`}>
                  {i.label}
                </p>
                <p className={`text-[9.5px] mt-0.5 leading-tight
                               ${form.intensidad === i.value ? 'text-cream/70' : 'text-muted'}`}>
                  {i.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Calorías estimadas (calculadas) */}
        {calEst !== null && (
          <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-display text-[11px] text-blue-700 font-medium">Calorías estimadas</p>
              <p className="text-[10px] text-blue-500 mt-0.5">Calculado según intensidad y duración</p>
            </div>
            <span className="font-display font-bold text-xl text-blue-600">
              {calEst} kcal
            </span>
          </div>
        )}

        {errors._server && (
          <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-2">{errors._server}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5">
            Cancelar
          </button>
          <button type="submit" className="btn-primary flex-1 py-2.5" disabled={loading}>
            {loading
              ? <span className="flex items-center justify-center gap-1.5">
                  <Loader2 size={13} className="animate-spin" /> Guardando...
                </span>
              : 'Registrar actividad'
            }
          </button>
        </div>
      </form>
    </Modal>
  )
}
