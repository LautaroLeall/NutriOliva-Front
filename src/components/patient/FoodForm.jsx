import { useState, useEffect, useRef } from 'react'
import { Loader2, Camera, X, Search, CheckCircle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import FloatingDropdown from '@/components/ui/FloatingDropdown'
import { supabase } from '@/lib/supabaseClient'
import { subirFoto } from '@/lib/storage'

// ── Configuración ──────────────────────────────────────────────────────────────
const MODOS = [
  { key: 'plan', label: 'Mi plan' },
  { key: 'catalogo', label: 'Catálogo' },
  { key: 'otra', label: 'Otra' },
]

function tipoComidaActual() {
  const h = new Date().getHours()
  if (h < 10) return 'desayuno'
  if (h < 12) return 'colacion'
  if (h < 15) return 'almuerzo'
  if (h < 17) return 'colacion'
  if (h < 20) return 'merienda'
  return 'cena'
}

function tipoLabel(t) {
  return (
    {
      desayuno: 'Desayuno', colacion: 'Colacion', almuerzo: 'Almuerzo',
      merienda: 'Merienda', cena: 'Cena', colacion_nocturna: 'Colacion nocturna', snack: 'Snack'
    }[t] || t
  )
}

// ── Búsqueda multi-palabra ─────────────────────────────────────────────────────
// "pollo arroz" → busca filas donde CADA palabra aparece en nombre O descripcion_completa
async function buscarEnCatalogo(query) {
  const words = query.trim().split(/\s+/).filter(w => w.length >= 2)
  if (!words.length) return []

  let q = supabase
    .from('catalogo_alimentos')
    .select(
      'nombre, calorias_por_unidad, proteinas_g, carbos_g, grasas_g, ' +
      'tipo_comida, descripcion_completa, objetivo_ideal'
    )
    .order('es_comida_completa', { ascending: false })
    .limit(10)

  // AND de ORs: cada palabra debe aparecer en nombre O en descripcion_completa
  for (const word of words) {
    q = q.or(`nombre.ilike.%${word}%,descripcion_completa.ilike.%${word}%`)
  }

  const { data } = await q
  return data || []
}

// ── Validaciones ───────────────────────────────────────────────────────────────
function validarOtra(form) {
  const errs = {}
  const desc = form.descripcion.trim()
  if (!desc) errs.descripcion = 'La descripción es obligatoria.'
  else if (desc.length < 3) errs.descripcion = 'Describí un poco más lo que comiste.'
  else if (desc.length > 200) errs.descripcion = 'Máximo 200 caracteres.'

  if (form.calorias_estimadas !== '') {
    const n = Number(form.calorias_estimadas)
    if (isNaN(n)) errs.calorias = 'Debe ser un número.'
    else if (n < 1) errs.calorias = 'Las calorías deben ser mayor a 0.'
    else if (n > 3000) errs.calorias = 'El máximo es 3000 kcal por comida.'
    else if (!Number.isInteger(n)) errs.calorias = 'Debe ser un número entero (sin decimales).'
  }
  return errs
}

// ── Componente: Foto opcional ─────────────────────────────────────────────────
function FotoInput({ foto, onFoto, onQuitarFoto }) {
  const inputRef = useRef(null)

  return (
    <div>
      <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
        Foto opcional
      </p>
      {foto ? (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-cream-darker">
          <img src={URL.createObjectURL(foto)} alt="Vista previa" className="w-full h-full object-cover" />
          <button type="button" onClick={onQuitarFoto}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center
                        justify-center text-white hover:bg-black/70 transition-colors">
            <X size={12} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dashed
                    border-cream-darker text-muted hover:border-olive/50 hover:text-olive
                      transition-colors font-display text-[11.5px]">
          <Camera size={14} /> Agregar foto
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment" className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          if (file.size > 5 * 1024 * 1024) { alert('La foto no debe superar los 5 MB.'); return }
          onFoto(file)
        }} />
    </div>
  )
}

// ── Componente: Tarjeta de comida seleccionada (estado bloqueado) ──────────────
function ComidaSeleccionadaCard({ item, onLimpiar }) {
  return (
    <div className="rounded-xl border-2 border-olive/40 bg-olive/5 px-4 py-3">
      <div className="flex items-start gap-3">
        <CheckCircle size={16} className="text-olive flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-display text-[12.5px] font-semibold text-olive-dark leading-snug">
            {item.nombre}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.calorias_por_unidad && (
              <span className="bg-olive/15 text-olive-dark font-display font-bold
                                text-[11px] px-2 py-0.5 rounded-lg">
                {Math.round(item.calorias_por_unidad)} kcal
              </span>
            )}
            {item.proteinas_g && <span className="text-[10px] text-muted">P: {item.proteinas_g}g</span>}
            {item.carbos_g && <span className="text-[10px] text-muted">C: {item.carbos_g}g</span>}
            {item.grasas_g && <span className="text-[10px] text-muted">G: {item.grasas_g}g</span>}
          </div>
          {item.objetivo_ideal && (
            <p className="text-[9.5px] text-muted mt-1 italic">{item.objetivo_ideal}</p>
          )}
        </div>
        <button type="button" onClick={onLimpiar}
          title="Cambiar comida"
          className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-cream-darker
                      flex items-center justify-center text-muted hover:text-olive-dark
                    hover:border-olive/50 transition-colors">
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

// ── Componente: Resultado individual del dropdown ─────────────────────────────
function ResultItem({ item, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(item)}
      className="w-full text-left px-4 py-3 hover:bg-cream transition-colors
                  border-b border-cream-darker/40 last:border-0 group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[12px] text-olive-dark font-medium leading-snug
                        group-hover:text-olive transition-colors">
            {item.nombre}
          </p>
          {item.descripcion_completa && (
            <p className="text-[9.5px] text-muted mt-0.5 leading-snug line-clamp-1">
              {item.descripcion_completa}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.proteinas_g && <span className="text-[9px] text-muted">P: {item.proteinas_g}g</span>}
            {item.carbos_g && <span className="text-[9px] text-muted">C: {item.carbos_g}g</span>}
            {item.grasas_g && <span className="text-[9px] text-muted">G: {item.grasas_g}g</span>}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          {item.calorias_por_unidad && (
            <span className="inline-block bg-olive/10 text-olive-dark font-display font-bold
                              text-[11px] px-2 py-0.5 rounded-lg">
              {Math.round(item.calorias_por_unidad)} kcal
            </span>
          )}
          {item.tipo_comida && (
            <p className="text-[9px] text-muted mt-0.5">{tipoLabel(item.tipo_comida)}</p>
          )}
        </div>
      </div>
    </button>
  )
}

// ── Componente: Pill de comida del plan ───────────────────────────────────────
function PlanMealPill({ comida, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(comida)}
      className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all
                  ${selected ? 'bg-olive text-cream border-olive' : 'bg-white border-cream-darker hover:border-olive/50 hover:bg-cream'}`}>
      <p className={`font-display text-[12px] font-medium leading-snug ${selected ? 'text-cream' : 'text-olive-dark'}`}>
        {comida.descripcion}
      </p>
      {comida.calorias_aprox > 0 && (
        <p className={`text-[10px] mt-0.5 ${selected ? 'text-cream/70' : 'text-muted'}`}>
          {comida.calorias_aprox} kcal
          {comida.proteinas_g ? ` · P: ${comida.proteinas_g}g` : ''}
          {comida.carbos_g ? ` · C: ${comida.carbos_g}g` : ''}
          {comida.grasas_g ? ` · G: ${comida.grasas_g}g` : ''}
        </p>
      )}
    </button>
  )
}

// COMPONENTE PRINCIPAL

/**
 * Formulario enriquecido para registrar o editar una comida.
 *
 * @param {boolean}  open
 * @param {function} onClose
 * @param {function} onGuardar
 * @param {Array}    comidasPlan    - comidas del plan activo del paciente
 * @param {string}   pacienteId
 * @param {boolean}  modoEdicion    - si true, muestra título "Editar comida"
 * @param {object}   datosIniciales - { descripcion, calorias_estimadas, fuente_estimacion }
 */
export default function FoodForm({
  open, onClose, onGuardar, comidasPlan = [], pacienteId,
  modoEdicion = false, datosIniciales = null,
}) {
  const [modo, setModo] = useState('plan')

  // Modo catálogo — búsqueda y selección bloqueada
  const [query, setQuery] = useState('')
  const [itemSeleccionado, setItemSel] = useState(null)
  const [sugs, setSugs] = useState([])
  const [buscando, setBuscando] = useState(false)

  // Modo otra comida
  const [formOtra, setFormOtra] = useState({ descripcion: '', calorias_estimadas: '' })

  // Modo plan
  const [planSeleccionada, setPlanSel] = useState(null)

  // Foto
  const [foto, setFoto] = useState(null)

  // Errores y loading
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)

  const tipoActual = tipoComidaActual()
  const comidasDelMomento = comidasPlan.filter(c => c.tipo_comida === tipoActual)
  const otrasComidasPlan = comidasPlan.filter(c => c.tipo_comida !== tipoActual)

  // ── Reset al abrir ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return

    if (modoEdicion && datosIniciales) {
      // Modo edición: siempre "otra" con datos pre-cargados
      setModo('otra')
      setFormOtra({
        descripcion: datosIniciales.descripcion || '',
        calorias_estimadas: datosIniciales.calorias_estimadas != null
          ? String(datosIniciales.calorias_estimadas)
          : '',
      })
    } else {
      setModo(comidasPlan.length > 0 ? 'plan' : 'catalogo')
      setFormOtra({ descripcion: '', calorias_estimadas: '' })
    }

    setQuery(''); setItemSel(null); setSugs([])
    setPlanSel(null); setFoto(null); setErrors({})
  }, [open])

  // ── Búsqueda en tiempo real (multi-palabra, debounce 300ms) ───────────────
  useEffect(() => {
    if (modo !== 'catalogo' || itemSeleccionado) { setSugs([]); return }
    if (query.trim().length < 2) { setSugs([]); return }

    const t = setTimeout(async () => {
      setBuscando(true)
      const results = await buscarEnCatalogo(query)
      setSugs(results)
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query, modo, itemSeleccionado])

  // ── Seleccionar ítem del catálogo → BLOQUEA el campo ─────────────────────
  function seleccionarItem(item) {
    setItemSel(item)
    setSugs([])
    setQuery('')
    setErrors(e => ({ ...e, catalogo: undefined, _server: undefined }))
  }

  // ── Limpiar selección → vuelve al buscador ────────────────────────────────
  function limpiarSeleccion() {
    setItemSel(null)
    setQuery('')
    setSugs([])
    setErrors(e => ({ ...e, catalogo: undefined }))
    // Foco automático al input
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function cambiarModo(m) {
    setModo(m)
    setQuery(''); setItemSel(null); setSugs([])
    setFormOtra({ descripcion: '', calorias_estimadas: '' })
    setPlanSel(null); setErrors({})
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()

    let descripcion, calorias_estimadas, fuente_estimacion

    if (modo === 'plan') {
      if (!planSeleccionada) {
        setErrors({ _plan: 'Elegí una comida del plan.' })
        return
      }
      descripcion = planSeleccionada.descripcion
      calorias_estimadas = planSeleccionada.calorias_aprox || null
      fuente_estimacion = 'plan'
    }

    else if (modo === 'catalogo') {
      if (!itemSeleccionado) {
        setErrors({ catalogo: 'Buscá y seleccioná una comida del catálogo.' })
        return
      }
      descripcion = itemSeleccionado.nombre
      calorias_estimadas = itemSeleccionado.calorias_por_unidad
        ? Math.round(itemSeleccionado.calorias_por_unidad)
        : null
      fuente_estimacion = 'catalogo'
    }

    else {
      // Modo "otra"
      const errs = validarOtra(formOtra)
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      descripcion = formOtra.descripcion.trim()
      calorias_estimadas = formOtra.calorias_estimadas !== '' ? Number(formOtra.calorias_estimadas) : null
      fuente_estimacion = 'manual'
    }

    setErrors({})
    setLoading(true)

    // Subir foto si existe
    let foto_path = null
    if (foto && pacienteId) {
      const { path, error: fotoErr } = await subirFoto(foto, 'fotos-comidas', pacienteId)
      if (fotoErr) {
        setErrors({ _server: 'Error al subir la foto: ' + fotoErr })
        setLoading(false)
        return
      }
      foto_path = path
    }

    const { error } = await onGuardar({ descripcion, calorias_estimadas, fuente_estimacion, foto_path })
    setLoading(false)
    if (error) { setErrors({ _server: error }); return }
    onClose()
  }

  // RENDER
  return (
    <Modal open={open} onClose={onClose} title={modoEdicion ? 'Editar comida' : 'Registrar comida'}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* ── Selector de modo — oculto en modo edición ────────────────── */}
        {!modoEdicion && (
          <div className="flex gap-1 bg-cream rounded-xl p-1 border border-cream-darker">
            {MODOS.filter(m => m.key !== 'plan' || comidasPlan.length > 0).map(m => (
              <button key={m.key} type="button" onClick={() => cambiarModo(m.key)}
                className={`flex-1 py-1.5 rounded-lg font-display text-[11.5px] font-medium transition-all
                            ${modo === m.key ? 'bg-white text-olive-dark shadow-sm' : 'text-muted hover:text-olive-dark'}`}>
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* ── MODO: MI PLAN ────────────────────────────────────────────── */}
        {modo === 'plan' && (
          <div className="space-y-2">
            <p className="text-[10px] font-display text-muted uppercase tracking-wide">
              {tipoLabel(tipoActual)} de tu plan
            </p>

            {comidasDelMomento.length > 0 ? (
              <div className="space-y-1.5">
                {comidasDelMomento.map(c => (
                  <PlanMealPill key={c.id} comida={c}
                    selected={planSeleccionada?.id === c.id}
                    onSelect={c => setPlanSel(prev => prev?.id === c.id ? null : c)} />
                ))}
              </div>
            ) : (
              <p className="text-[11.5px] text-muted italic">
                No hay {tipoLabel(tipoActual).toLowerCase()} en tu plan.
              </p>
            )}

            {otrasComidasPlan.length > 0 && (
              <details className="mt-1">
                <summary className="text-[10.5px] text-muted cursor-pointer hover:text-olive-dark font-display">
                  Ver otras comidas del plan
                </summary>
                <div className="space-y-1.5 mt-2">
                  {otrasComidasPlan.map(c => (
                    <PlanMealPill key={c.id} comida={c}
                      selected={planSeleccionada?.id === c.id}
                      onSelect={c => setPlanSel(prev => prev?.id === c.id ? null : c)} />
                  ))}
                </div>
              </details>
            )}

            {errors._plan && (
              <p className="text-[10.5px] text-red-500 flex items-center gap-1">
                <X size={10} /> {errors._plan}
              </p>
            )}
          </div>
        )}

        {/* ── MODO: CATÁLOGO ───────────────────────────────────────────── */}
        {modo === 'catalogo' && (
          <div className="space-y-3">

            {/* Estado A: ítem seleccionado (bloqueado) */}
            {itemSeleccionado ? (
              <ComidaSeleccionadaCard item={itemSeleccionado} onLimpiar={limpiarSeleccion} />
            ) : (
              /* Estado B: buscando */
              <div>
                <label className="label">Buscar en el catálogo</label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    className={`input pr-9 ${errors.catalogo ? 'border-red-400' : ''}`}
                    placeholder="Ej: pollo, avena, pollo arroz, salmón..."
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value)
                      setErrors(er => ({ ...er, catalogo: undefined }))
                    }}
                    autoFocus
                    autoComplete="off"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {buscando
                      ? <Loader2 size={14} className="text-muted animate-spin" />
                      : <Search size={14} className="text-muted" />
                    }
                  </div>
                </div>

                {/* Hint de búsqueda multi-palabra */}
                {!buscando && query.trim().split(/\s+/).filter(w => w.length >= 2).length > 1 && (
                  <p className="text-[9.5px] text-olive mt-1 font-display">
                    Buscando todos los terminos juntos...
                  </p>
                )}

                {/* Resultados de búsqueda */}
                <FloatingDropdown anchorRef={inputRef} visible={sugs.length > 0} maxH={280}>
                  {sugs.map(item => (
                    <ResultItem key={item.nombre} item={item} onSelect={seleccionarItem} />
                  ))}

                  {/* Sin resultados — opción de ir a "Otra" */}
                  {query.trim().length >= 2 && sugs.length === 0 && !buscando && (
                    <div className="px-4 py-3 text-center">
                      <p className="text-[11px] text-muted">No encontramos resultados para "{query}"</p>
                      <button type="button" onClick={() => cambiarModo('otra')}
                        className="mt-1 text-[10.5px] text-olive font-display hover:underline">
                        Cargar como "Otra comida"
                      </button>
                    </div>
                  )}

                  <button type="button" onClick={() => cambiarModo('otra')}
                    className="w-full text-left px-4 py-2.5 text-[11px] text-muted italic
                                hover:bg-cream transition-colors border-t border-cream-darker/40 font-display">
                    No encuentro lo que busco → Otra comida
                  </button>
                </FloatingDropdown>

                {/* Mensaje sin resultados cuando el dropdown no se muestra */}
                {!buscando && query.trim().length >= 2 && sugs.length === 0 && !query && (
                  <p className="text-[10.5px] text-muted mt-1">
                    Sin resultados. Probá con otras palabras.
                  </p>
                )}
              </div>
            )}

            {errors.catalogo && (
              <p className="text-[10.5px] text-red-500 flex items-center gap-1">
                <X size={10} /> {errors.catalogo}
              </p>
            )}
          </div>
        )}

        {/* ── MODO: OTRA COMIDA ────────────────────────────────────────── */}
        {modo === 'otra' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <p className="text-[10.5px] text-amber-700 font-display leading-snug">
                Esta comida no se guardara en el catálogo. Pedile a tu nutricionista agregarla si la consumís con frecuencia.
              </p>
            </div>

            <div>
              <label className="label">¿Qué comiste? *</label>
              <input
                className={`input ${errors.descripcion ? 'border-red-400' : ''}`}
                placeholder="Ej: Medialunas con café con leche..."
                value={formOtra.descripcion}
                onChange={e => {
                  setFormOtra(f => ({ ...f, descripcion: e.target.value }))
                  setErrors(er => ({ ...er, descripcion: undefined }))
                }}
                autoFocus
                autoComplete="off"
                maxLength={200}
              />
              <div className="flex justify-between mt-0.5">
                {errors.descripcion
                  ? <p className="text-[10px] text-red-500">{errors.descripcion}</p>
                  : <span />
                }
                <p className={`text-[9.5px] ${formOtra.descripcion.length > 180 ? 'text-amber-500' : 'text-muted'}`}>
                  {formOtra.descripcion.length}/200
                </p>
              </div>
            </div>

            <div>
              <label className="label">
                Calorías estimadas <span className="text-muted font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className={`input pr-12 ${errors.calorias ? 'border-red-400' : ''}`}
                  placeholder="Ej: 250"
                  value={formOtra.calorias_estimadas}
                  onChange={e => {
                    setFormOtra(f => ({ ...f, calorias_estimadas: e.target.value }))
                    setErrors(er => ({ ...er, calorias: undefined }))
                  }}
                  min={1} max={3000}
                  step={1}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[11px]">kcal</span>
              </div>
              {errors.calorias
                ? <p className="text-[10px] text-red-500 mt-1">{errors.calorias}</p>
                : <p className="text-[9.5px] text-muted mt-1">Si no sabés las calorías exactas, podés dejarlo vacío.</p>
              }
            </div>
          </div>
        )}

        {/* ── FOTO OPCIONAL ────────────────────────────────────────────── */}
        <FotoInput foto={foto} onFoto={setFoto} onQuitarFoto={() => setFoto(null)} />

        {/* ── ERROR DE SERVIDOR ────────────────────────────────────────── */}
        {errors._server && (
          <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-2">{errors._server}</p>
        )}

        {/* ── ACCIONES ─────────────────────────────────────────────────── */}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5">
            Cancelar
          </button>
          <button type="submit" className="btn-primary flex-1 py-2.5" disabled={loading}>
            {loading
              ? <span className="flex items-center justify-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Guardando...
              </span>
              : modoEdicion ? 'Guardar cambios' : 'Registrar comida'
            }
          </button>
        </div>

      </form>
    </Modal>
  )
}
