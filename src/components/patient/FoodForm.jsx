import { useState, useEffect } from 'react'
import { Loader2, Search } from 'lucide-react'
import Modal    from '@/components/ui/Modal'
import { supabase } from '@/lib/supabaseClient'

const FORM_VACIO = { descripcion: '', calorias_estimadas: '' }

// ── Validación ────────────────────────────────────────────────────────────────
function validar(form) {
  const errs = {}
  if (!form.descripcion.trim())
    errs.descripcion = 'La descripción es obligatoria.'
  if (form.descripcion.trim().length < 3)
    errs.descripcion = 'Describí un poco más lo que comiste.'
  if (form.calorias_estimadas !== '' && form.calorias_estimadas !== null) {
    const n = Number(form.calorias_estimadas)
    if (isNaN(n) || n < 0)    errs.calorias = 'Ingresá un número positivo.'
    if (n > 3000)              errs.calorias = 'El máximo es 3000 kcal por comida.'
    if (!Number.isInteger(n)) errs.calorias = 'Debe ser un número entero.'
  }
  return errs
}

/**
 * Formulario para registrar una comida.
 * Incluye búsqueda en el catálogo de alimentos para autocompletar calorías.
 */
export default function FoodForm({ open, onClose, onGuardar }) {
  const [form,     setForm]     = useState(FORM_VACIO)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [catalogo, setCatalogo] = useState([])
  const [sugs,     setSugs]     = useState([]) // sugerencias del catálogo
  const [buscando, setBuscando] = useState(false)

  // Reset al abrir
  useEffect(() => {
    if (open) { setForm(FORM_VACIO); setErrors({}); setSugs([]) }
  }, [open])

  // Buscar en catálogo mientras escribe (debounced)
  useEffect(() => {
    if (!open || form.descripcion.length < 2) { setSugs([]); return }
    const timer = setTimeout(() => buscarEnCatalogo(form.descripcion), 350)
    return () => clearTimeout(timer)
  }, [form.descripcion, open])

  async function buscarEnCatalogo(q) {
    setBuscando(true)
    const { data } = await supabase
      .from('catalogo_alimentos')
      .select('nombre, calorias_por_100g, unidad_medida')
      .ilike('nombre', `%${q}%`)
      .limit(5)
    setSugs(data || [])
    setBuscando(false)
  }

  function seleccionarSugerencia(item) {
    setForm(f => ({
      ...f,
      descripcion:        item.nombre,
      calorias_estimadas: item.calorias_por_100g
        ? String(Math.round(item.calorias_por_100g))
        : '',
    }))
    setSugs([])
    if (errors.descripcion) setErrors(e => ({ ...e, descripcion: undefined }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name] || errors.calorias)
      setErrors(e => ({ ...e, [name]: undefined, calorias: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validar(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    const { error } = await onGuardar({
      descripcion:        form.descripcion.trim(),
      calorias_estimadas: form.calorias_estimadas !== '' ? form.calorias_estimadas : null,
      fuente_estimacion:  'manual',
    })
    setLoading(false)
    if (error) { setErrors({ _server: error }); return }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar comida">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* Descripción con búsqueda en catálogo */}
        <div className="relative">
          <label className="label">¿Qué comiste? *</label>
          <div className="relative">
            <input
              name="descripcion"
              className={`input pr-8 ${errors.descripcion ? 'border-red-400' : ''}`}
              placeholder="Ej: Avena con banana, 2 tostadas con queso..."
              value={form.descripcion}
              onChange={handleChange}
              autoFocus
              autoComplete="off"
            />
            {buscando && (
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted animate-pulse" />
            )}
          </div>
          {errors.descripcion && (
            <p className="text-[10.5px] text-red-500 mt-1">{errors.descripcion}</p>
          )}

          {/* Sugerencias del catálogo */}
          {sugs.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-cream-darker
                            rounded-xl shadow-modal overflow-hidden">
              {sugs.map(item => (
                <button
                  key={item.nombre}
                  type="button"
                  onClick={() => seleccionarSugerencia(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-cream transition-colors
                             flex items-center justify-between"
                >
                  <span className="font-display text-[12px] text-olive-dark">{item.nombre}</span>
                  {item.calorias_por_100g && (
                    <span className="text-[10.5px] text-muted">
                      {item.calorias_por_100g} kcal/100g
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Calorías */}
        <div>
          <label className="label">
            Calorías estimadas <span className="text-muted font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <input
              name="calorias_estimadas"
              type="number"
              className={`input pr-12 ${errors.calorias ? 'border-red-400' : ''}`}
              placeholder="Ej: 350"
              value={form.calorias_estimadas}
              onChange={handleChange}
              min={0}
              max={3000}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[11px]">
              kcal
            </span>
          </div>
          {errors.calorias && (
            <p className="text-[10.5px] text-red-500 mt-1">{errors.calorias}</p>
          )}
          <p className="text-[10px] text-muted mt-1">
            Si no sabés las calorías exactas, podés dejarlo vacío.
          </p>
        </div>

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
              : 'Registrar comida'
            }
          </button>
        </div>
      </form>
    </Modal>
  )
}
