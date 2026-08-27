import { useState, useEffect, useRef } from 'react'
import {
  Plus, X, Check, ChevronDown, ChevronUp,
  Pencil, Trash2, Search, FileSpreadsheet, Loader2, CheckCircle,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import FloatingDropdown from '@/components/ui/FloatingDropdown'

const TIPOS = [
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'colacion', label: 'Colacion' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'merienda', label: 'Merienda' },
  { value: 'cena', label: 'Cena' },
  { value: 'colacion_nocturna', label: 'Colacion Nocturna' },
  { value: 'snack', label: 'Snack' },
]

const FORM_VACIO = {
  tipo_comida: 'desayuno',
  descripcion: '',
  calorias_aprox: '',
  proteinas_g: '',
  carbos_g: '',
  grasas_g: '',
}

// ── Fila de comida individual ─────────────────────────────────────────────────
function MealRow({ comida, onEditar, onEliminar, readonly }) {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ ...comida })
  const [guardando, setGuardando] = useState(false)

  async function handleGuardar() {
    if (!form.descripcion.trim()) return
    setGuardando(true)
    await onEditar(comida.id, form)
    setGuardando(false)
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="bg-cream rounded-xl p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Tipo</label>
            <select name="tipo_comida" className="input py-1.5 text-base md:text-xs"
              value={form.tipo_comida}
              onChange={e => setForm(f => ({ ...f, tipo_comida: e.target.value }))}>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Calorias aprox.</label>
            <input name="calorias_aprox" type="number" className="input py-1.5 text-base md:text-xs"
              placeholder="kcal" value={form.calorias_aprox}
              onChange={e => setForm(f => ({ ...f, calorias_aprox: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Descripcion</label>
          <input name="descripcion" className="input py-1.5 text-base md:text-xs"
            placeholder="Ej: 2 tostadas con palta y huevo" value={form.descripcion}
            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['proteinas_g', 'Proteinas (g)'], ['carbos_g', 'Carbos (g)'], ['grasas_g', 'Grasas (g)']].map(([n, l]) => (
            <div key={n}>
              <label className="label">{l}</label>
              <input name={n} type="number" className="input py-1.5 text-base md:text-xs"
                placeholder="0" value={form[n]}
                onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditando(false)}
            className="flex-1 py-1.5 rounded-lg bg-white border border-cream-darker text-muted
                        font-display text-[11px] flex items-center justify-center gap-1 hover:bg-cream transition-colors">
            <X size={11} /> Cancelar
          </button>
          <button onClick={handleGuardar} disabled={guardando}
            className="flex-1 py-1.5 rounded-lg bg-olive text-cream font-display text-[11px]
                        flex items-center justify-center gap-1 hover:bg-olive-deep transition-colors">
            <Check size={11} /> Guardar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between py-2.5 px-3 rounded-xl hover:bg-cream/60 group transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-olive-dark font-medium leading-snug truncate">{comida.descripcion}</p>
        {comida.calorias_aprox > 0 && (
          <p className="text-[10.5px] text-muted mt-0.5">
            {comida.calorias_aprox} kcal
            {comida.proteinas_g ? ` · P: ${comida.proteinas_g}g` : ''}
            {comida.carbos_g ? ` · C: ${comida.carbos_g}g` : ''}
            {comida.grasas_g ? ` · G: ${comida.grasas_g}g` : ''}
          </p>
        )}
      </div>
      {!readonly && (
        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditando(true)}
            className="p-1 rounded text-muted hover:text-olive transition-colors">
            <Pencil size={11} />
          </button>
          <button onClick={() => onEliminar(comida.id)}
            className="p-1 rounded text-muted hover:text-danger transition-colors">
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  )
}


// ── Búsqueda multi-palabra para el catálogo (AND de ORs) ─────────────────────
async function buscarEnCatalogoMultiword(query, tipoComida = null, mostrarTodo = false) {
  const words = query.trim().split(/\s+/).filter(w => w.length >= 2)
  if (!words.length) return []

  let q = supabase
    .from('catalogo_alimentos')
    .select('nombre, calorias_por_unidad, proteinas_g, carbos_g, grasas_g, tipo_comida')
    .order('es_comida_completa', { ascending: false })
    .limit(10)

  // Filtro por tipos compatibles con la sección (a menos que el usuario elija "mostrar todo")
  if (!mostrarTodo && tipoComida && TIPOS_COMPATIBLES[tipoComida]) {
    q = q.in('tipo_comida', TIPOS_COMPATIBLES[tipoComida])
  }

  // Cada palabra debe aparecer en nombre O descripcion_completa (AND de ORs)
  for (const word of words) {
    q = q.or(`nombre.ilike.%${word}%,descripcion_completa.ilike.%${word}%`)
  }

  const { data } = await q
  return data || []
}

// ── Tarjeta de ítem seleccionado (bloqueado) en PlanBuilder ──────────────────
function ItemSeleccionadoCard({ item, onLimpiar }) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border-2 border-olive/40 bg-olive/5">
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
          {item.proteinas_g && <span className="text-[9.5px] text-muted">P: {item.proteinas_g}g</span>}
          {item.carbos_g && <span className="text-[9.5px] text-muted">C: {item.carbos_g}g</span>}
          {item.grasas_g && <span className="text-[9.5px] text-muted">G: {item.grasas_g}g</span>}
        </div>
      </div>
      <button type="button" onClick={onLimpiar} title="Cambiar"
        className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-cream-darker flex items-center
                    justify-center text-muted hover:text-olive-dark hover:border-olive/50 transition-colors">
        <X size={11} />
      </button>
    </div>
  )
}

// ── Formulario inline de agregar con autocomplete inteligente ─────────────────
function AddMealForm({ tipo, onAgregar, onCancel, nutricionistaId }) {
  const [mode, setMode] = useState('buscar') // 'buscar' | 'nueva'
  const [query, setQuery] = useState('')
  const [itemSel, setItemSel] = useState(null)
  const [formNueva, setFormNueva] = useState({ ...FORM_VACIO, tipo_comida: tipo.value })
  const [loading, setLoading] = useState(false)
  const [sugs, setSugs] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [guardandoCat, setGuardandoCat] = useState(false)
  const [mostrarTodo, setMostrarTodo] = useState(false) // override filtro de tipo

  const inputRef = useRef(null)

  // Búsqueda en tiempo real con debounce 300ms
  // Pasa el tipo de la sección para filtrar por tipos compatibles
  useEffect(() => {
    if (mode !== 'buscar' || itemSel) { setSugs([]); return }
    if (query.trim().length < 2) { setSugs([]); return }

    const t = setTimeout(async () => {
      setBuscando(true)
      const results = await buscarEnCatalogoMultiword(query, tipo.value, mostrarTodo)
      setSugs(results)
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query, mode, itemSel, mostrarTodo])

  function seleccionarItem(item) {
    setItemSel(item)
    setSugs([])
    setQuery('')
  }

  function limpiarSeleccion() {
    setItemSel(null)
    setQuery('')
    setSugs([])
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function handleAgregar() {
    // Modo buscar: debe tener ítem seleccionado
    if (mode === 'buscar') {
      if (!itemSel) return
      setLoading(true)
      await onAgregar({
        tipo_comida: tipo.value,
        descripcion: itemSel.nombre,
        calorias_aprox: itemSel.calorias_por_unidad ? Math.round(itemSel.calorias_por_unidad) : '',
        proteinas_g: itemSel.proteinas_g || '',
        carbos_g: itemSel.carbos_g || '',
        grasas_g: itemSel.grasas_g || '',
      })
      setLoading(false)
      onCancel()
      return
    }

    // Modo nueva
    if (!formNueva.descripcion.trim()) return
    setLoading(true)
    await onAgregar({ ...formNueva, tipo_comida: tipo.value })
    setLoading(false)
    onCancel()
  }

  async function handleGuardarEnCatalogoYAgregar() {
    if (!formNueva.descripcion.trim()) return
    setGuardandoCat(true)
    const { error } = await supabase.from('catalogo_alimentos').insert({
      nombre: formNueva.descripcion.trim(),
      calorias_por_unidad: formNueva.calorias_aprox ? Number(formNueva.calorias_aprox) : null,
      proteinas_g: formNueva.proteinas_g ? Number(formNueva.proteinas_g) : null,
      carbos_g: formNueva.carbos_g ? Number(formNueva.carbos_g) : null,
      grasas_g: formNueva.grasas_g ? Number(formNueva.grasas_g) : null,
      tipo_comida: tipo.value,
      es_comida_completa: true,
      nutricionista_id: nutricionistaId,
    })
    if (!error) toast.success('Comida guardada en el catálogo.')
    else toast.error('No se pudo guardar en el catálogo.')
    setGuardandoCat(false)
    await handleAgregar()
  }

  const puedeAgregar = mode === 'buscar' ? !!itemSel : !!formNueva.descripcion.trim()

  return (
    <div className="bg-cream rounded-xl p-3 mt-1 space-y-2">

      {/* Selector de modo */}
      <div className="flex gap-1 bg-white rounded-lg p-0.5 border border-cream-darker">
        {[{ key: 'buscar', label: 'Buscar en catálogo' }, { key: 'nueva', label: 'Cargar nueva' }].map(m => (
          <button key={m.key} type="button"
            onClick={() => { setMode(m.key); setItemSel(null); setQuery(''); setSugs([]) }}
            className={`flex-1 py-1 rounded-md font-display text-[11px] transition-all
                        ${mode === m.key ? 'bg-olive text-cream' : 'text-muted hover:text-olive-dark'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Modo: buscar en catálogo */}
      {mode === 'buscar' && (
        <div>
          {itemSel ? (
            <ItemSeleccionadoCard item={itemSel} onLimpiar={limpiarSeleccion} />
          ) : (
            <div>
              <label className="label">Buscar comida</label>
              <div className="relative">
                <input
                  ref={inputRef}
                  className="input py-1.5 text-xs pr-7"
                  placeholder="Ej: pollo, pollo arroz, salmón brocoli..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {buscando
                    ? <Loader2 size={11} className="text-muted animate-spin" />
                    : <Search size={11} className="text-muted" />
                  }
                </div>
              </div>

              {/* Hint multi-palabra */}
              {query.trim().split(/\s+/).filter(w => w.length >= 2).length > 1 && (
                <p className="text-[9px] text-olive mt-0.5 font-display">
                  Buscando todos los terminos juntos
                </p>
              )}

              {/* Badge de filtro activo + toggle "mostrar todo" */}
              <div className="flex items-center justify-between mt-1">
                <span className={`text-[9px] font-display px-2 py-0.5 rounded-full
                                  ${mostrarTodo
                    ? 'bg-muted/10 text-muted'
                    : 'bg-olive/10 text-olive-dark'}`}>
                  {mostrarTodo ? 'Todo el catalogo' : `Solo para ${tipo.label.toLowerCase()}`}
                </span>
                <button type="button" onClick={() => setMostrarTodo(v => !v)}
                  className="text-[9px] text-muted hover:text-olive font-display underline underline-offset-2">
                  {mostrarTodo ? 'Filtrar por seccion' : 'Ver todo el catalogo'}
                </button>
              </div>

              <FloatingDropdown anchorRef={inputRef} visible={sugs.length > 0} maxH={240}>
                {sugs.map(item => (
                  <button key={item.nombre} type="button"
                    onClick={() => seleccionarItem(item)}
                    className="w-full text-left px-4 py-3 hover:bg-cream transition-colors
                                border-b border-cream-darker/40 last:border-0 group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[12px] text-olive-dark font-medium truncate
                                      group-hover:text-olive transition-colors">
                          {item.nombre}
                        </p>
                        {(item.proteinas_g || item.carbos_g || item.grasas_g) && (
                          <p className="text-[9.5px] text-muted mt-0.5">
                            {item.proteinas_g ? `P: ${item.proteinas_g}g` : ''}
                            {item.carbos_g ? ` · C: ${item.carbos_g}g` : ''}
                            {item.grasas_g ? ` · G: ${item.grasas_g}g` : ''}
                          </p>
                        )}
                      </div>
                      {item.calorias_por_unidad && (
                        <span className="flex-shrink-0 bg-olive/10 text-olive-dark font-display
                                          font-semibold text-[11px] px-2 py-0.5 rounded-lg">
                          {Math.round(item.calorias_por_unidad)} kcal
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {/* Sin resultados */}
                {query.trim().length >= 2 && sugs.length === 0 && !buscando && (
                  <div className="px-4 py-3 text-center">
                    <p className="text-[10.5px] text-muted">Sin resultados para "{query}"</p>
                    <button type="button" onClick={() => { setMode('nueva'); setQuery('') }}
                      className="text-[10px] text-olive font-display hover:underline mt-0.5">
                      Cargar como nueva
                    </button>
                  </div>
                )}
                <button type="button" onClick={() => { setMode('nueva'); setSugs([]) }}
                  className="w-full text-left px-4 py-2.5 text-[10.5px] text-muted italic
                              hover:bg-cream transition-colors border-t border-cream-darker/40 font-display">
                  No está en el catálogo → Cargar nueva
                </button>
              </FloatingDropdown>
            </div>
          )}
        </div>
      )}

      {/* Modo: nueva comida */}
      {mode === 'nueva' && (
        <div className="space-y-2">
          <div>
            <label className="label">Descripcion *</label>
            <input className="input py-1.5 text-base md:text-xs"
              placeholder="Ej: Tarta de verdura casera"
              value={formNueva.descripcion}
              onChange={e => setFormNueva(f => ({ ...f, descripcion: e.target.value }))}
              autoFocus maxLength={200} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Calorias aprox.</label>
              <input type="number" className="input py-1.5 text-base md:text-xs" placeholder="kcal"
                value={formNueva.calorias_aprox}
                onChange={e => setFormNueva(f => ({ ...f, calorias_aprox: e.target.value }))} />
            </div>
            <div>
              <label className="label">Proteinas (g)</label>
              <input type="number" className="input py-1.5 text-base md:text-xs" placeholder="0"
                value={formNueva.proteinas_g}
                onChange={e => setFormNueva(f => ({ ...f, proteinas_g: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Carbohidratos (g)</label>
              <input type="number" className="input py-1.5 text-base md:text-xs" placeholder="0"
                value={formNueva.carbos_g}
                onChange={e => setFormNueva(f => ({ ...f, carbos_g: e.target.value }))} />
            </div>
            <div>
              <label className="label">Grasas (g)</label>
              <input type="number" className="input py-1.5 text-base md:text-xs" placeholder="0"
                value={formNueva.grasas_g}
                onChange={e => setFormNueva(f => ({ ...f, grasas_g: e.target.value }))} />
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 flex-wrap pt-1">
        <button onClick={onCancel}
          className="flex-1 min-w-[80px] py-1.5 rounded-lg bg-white border border-cream-darker text-muted
                      font-display text-[11px] flex items-center justify-center gap-1 hover:bg-cream transition-colors">
          <X size={11} /> Cancelar
        </button>
        <button onClick={handleAgregar} disabled={loading || !puedeAgregar}
          className="flex-1 min-w-[80px] py-1.5 rounded-lg bg-olive text-cream font-display text-[11px]
                      flex items-center justify-center gap-1 hover:bg-olive-deep disabled:opacity-50 transition-colors">
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          Agregar
        </button>
        {mode === 'nueva' && formNueva.descripcion.trim() && (
          <button onClick={handleGuardarEnCatalogoYAgregar}
            disabled={guardandoCat || loading}
            className="w-full py-1.5 rounded-lg bg-cream border border-olive/40 text-olive-dark
                        font-display text-[10.5px] flex items-center justify-center gap-1
                      hover:bg-cream-dark disabled:opacity-50 transition-colors">
            {guardandoCat ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
            Guardar en catálogo y agregar al plan
          </button>
        )}
      </div>
    </div>
  )
}


// ── Importador de Excel ───────────────────────────────────────────────────────
/**
 * Parsea un archivo Excel/CSV y retorna un array de comidas en formato plan.
 *
 * Columnas esperadas (case-insensitive, mínimas):
 *   descripcion | tipo_comida | calorias_aprox | proteinas_g | carbos_g | grasas_g
 *
 * Columna tipo_comida acepta: desayuno, colacion, almuerzo, merienda, cena, snack, colacion_nocturna
 * Si no está presente, se usa 'snack' por defecto.
 */
function parsearExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' })
        const hoja = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(hoja, { defval: '' })

        const TIPO_VALIDOS = new Set(TIPOS.map(t => t.value))
        const TIPO_MAP = {
          desayuno: 'desayuno', breakfast: 'desayuno',
          colacion: 'colacion', snack: 'snack',
          almuerzo: 'almuerzo', lunch: 'almuerzo',
          merienda: 'merienda',
          cena: 'cena', dinner: 'cena', cena_noche: 'cena',
          colacion_nocturna: 'colacion_nocturna',
        }

        function norm(key) { return key?.toString().toLowerCase().trim().replace(/\s+/g, '_') }
        function col(row, ...keys) {
          for (const k of keys) {
            const found = Object.keys(row).find(r => norm(r) === k)
            if (found && row[found] !== '') return row[found]
          }
          return ''
        }

        const comidas = rows
          .filter(r => col(r, 'descripcion', 'nombre', 'comida', 'alimento'))
          .map(r => {
            const tipo_raw = norm(col(r, 'tipo_comida', 'tipo', 'momento', 'toma'))
            const tipo = TIPO_MAP[tipo_raw] || (TIPO_VALIDOS.has(tipo_raw) ? tipo_raw : 'snack')
            const calorias = Number(col(r, 'calorias_aprox', 'calorias', 'kcal', 'cal')) || null
            return {
              tipo_comida: tipo,
              descripcion: String(col(r, 'descripcion', 'nombre', 'comida', 'alimento')).trim(),
              calorias_aprox: calorias,
              proteinas_g: Number(col(r, 'proteinas_g', 'proteinas', 'proteína')) || null,
              carbos_g: Number(col(r, 'carbos_g', 'carbos', 'carbohidratos', 'hidratos')) || null,
              grasas_g: Number(col(r, 'grasas_g', 'grasas')) || null,
            }
          })
          .filter(c => c.descripcion.length > 1)

        resolve(comidas)
      } catch (err) {
        reject(new Error('No se pudo leer el archivo. Verificá que sea un Excel o CSV válido.'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo.'))
    reader.readAsBinaryString(file)
  })
}

// ── Panel de importación Excel ────────────────────────────────────────────────
function ExcelImporter({ onImportar, onCancel }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null) // array de comidas
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [importando, setImportando] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const comidas = await parsearExcel(file)
      if (comidas.length === 0) { setError('No se encontraron comidas en el archivo. Revisá las columnas.'); setLoading(false); return }
      setPreview(comidas)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleConfirmar() {
    if (!preview?.length) return
    setImportando(true)
    await onImportar(preview)
    setImportando(false)
    onCancel()
  }

  return (
    <div className="border border-dashed border-olive/40 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <FileSpreadsheet size={15} className="text-olive" />
        <p className="font-display text-[12.5px] font-semibold text-olive-dark">
          Importar plan desde Excel / CSV
        </p>
      </div>

      <p className="text-[10.5px] text-muted">
        El archivo debe tener columnas: <strong>descripcion</strong>, <strong>tipo_comida</strong>, <strong>calorias_aprox</strong>.
        Opcionalmente: proteinas_g, carbos_g, grasas_g.
      </p>

      {!preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl bg-cream border border-cream-darker font-display
                      text-[11.5px] text-olive-dark hover:bg-cream-dark transition-colors"
        >
          {loading ? <Loader2 size={13} className="inline animate-spin mr-1" /> : null}
          Elegir archivo .xlsx / .csv
        </button>
      )}

      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />

      {error && (
        <p className="text-[10.5px] text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {preview && (
        <div className="space-y-2">
          <p className="text-[10.5px] font-display text-muted">
            {preview.length} comidas detectadas. Revisa antes de importar:
          </p>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {preview.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-cream-darker">
                <div className="min-w-0">
                  <p className="text-[11.5px] text-olive-dark font-medium truncate">{c.descripcion}</p>
                  <p className="text-[10px] text-muted">{c.tipo_comida} {c.calorias_aprox ? `· ${c.calorias_aprox} kcal` : ''}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setPreview(null); setError(null) }}
              className="flex-1 py-2 rounded-lg bg-white border border-cream-darker text-muted
                          font-display text-[11px] hover:bg-cream transition-colors">
              Volver a elegir
            </button>
            <button onClick={handleConfirmar} disabled={importando}
              className="flex-1 py-2 rounded-lg bg-olive text-cream font-display text-[11px]
                          hover:bg-olive-deep disabled:opacity-50 transition-colors">
              {importando ? <Loader2 size={12} className="inline animate-spin mr-1" /> : null}
              Confirmar e importar
            </button>
          </div>
        </div>
      )}

      <button onClick={onCancel}
        className="w-full py-1.5 text-[10.5px] text-muted font-display hover:text-olive-dark transition-colors">
        Cancelar importacion
      </button>
    </div>
  )
}

// ── MealGroup ─────────────────────────────────────────────────────────────────
function MealGroup({ tipo, comidas, onAgregar, onEditar, onEliminar, readonly, nutricionistaId }) {
  const [expandido, setExpandido] = useState(true)
  const [agregando, setAgregando] = useState(false)
  const totalCal = comidas.reduce((s, c) => s + (c.calorias_aprox || 0), 0)

  return (
    <div className="border border-cream-darker rounded-xl overflow-hidden">
      <button
        onClick={() => setExpandido(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream hover:bg-cream-dark transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-[12.5px] text-olive-dark">{tipo.label}</span>
          <span className="text-[10px] text-muted font-display">
            {comidas.length} {comidas.length === 1 ? 'item' : 'items'}
            {totalCal > 0 && ` · ${totalCal} kcal`}
          </span>
        </div>
        {expandido ? <ChevronUp size={13} className="text-muted" /> : <ChevronDown size={13} className="text-muted" />}
      </button>

      {expandido && (
        <div className="p-3 space-y-1">
          {comidas.length === 0 && !agregando && (
            <p className="text-[11px] text-muted italic py-1 px-3">Sin items aun.</p>
          )}

          {comidas.map(c => (
            <MealRow key={c.id} comida={c} onEditar={onEditar} onEliminar={onEliminar} readonly={readonly} />
          ))}

          {!readonly && agregando && (
            <AddMealForm
              tipo={tipo}
              onAgregar={comida => onAgregar({ ...comida, tipo_comida: tipo.value })}
              onCancel={() => setAgregando(false)}
              nutricionistaId={nutricionistaId}
            />
          )}

          {!readonly && !agregando && (
            <button
              onClick={() => setAgregando(true)}
              className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted
                          hover:text-olive hover:bg-cream/80 transition-colors font-display text-[11px]"
            >
              <Plus size={12} /> Agregar {tipo.label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── PlanBuilder (componente raíz) ─────────────────────────────────────────────
/**
 * Constructor visual de plan alimenticio con catálogo, autocomplete y carga Excel.
 */
export default function PlanBuilder({ plan, onAgregar, onEditar, onEliminar, readonly = false }) {
  const { session } = useAuth()
  // El nutricionista_id es el auth.uid() del usuario logueado (rol nutricionista)
  const authUserId = session?.user?.id || null
  const [mostrarExcel, setMostrarExcel] = useState(false)
  const comidas = plan?.comidas_plan || []

  async function handleImportarExcel(comidasImportadas) {
    for (const c of comidasImportadas) {
      await onAgregar(c)
    }
    toast.success(`${comidasImportadas.length} comidas importadas correctamente.`)
  }

  return (
    <div className="space-y-3">
      {/* Botón de importación Excel */}
      {!readonly && (
        <div className="flex justify-end">
          <button
            onClick={() => setMostrarExcel(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cream-darker
                        bg-white text-muted font-display text-[11.5px] hover:text-olive-dark
                        hover:bg-cream transition-colors"
          >
            <FileSpreadsheet size={13} />
            {mostrarExcel ? 'Cerrar importacion' : 'Importar desde Excel'}
          </button>
        </div>
      )}

      {/* Panel de importación Excel */}
      {!readonly && mostrarExcel && (
        <ExcelImporter
          onImportar={handleImportarExcel}
          onCancel={() => setMostrarExcel(false)}
        />
      )}

      {/* Grupos por tipo */}
      {TIPOS.map(tipo => (
        <MealGroup
          key={tipo.value}
          tipo={tipo}
          comidas={comidas.filter(c => c.tipo_comida === tipo.value)}
          onAgregar={onAgregar}
          onEditar={onEditar}
          onEliminar={onEliminar}
          readonly={readonly}
          nutricionistaId={authUserId}
        />
      ))}
    </div>
  )
}
