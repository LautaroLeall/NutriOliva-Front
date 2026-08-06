import { useState } from 'react'
import { Plus, X, Check, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'

const TIPOS = [
  { value: 'desayuno',  label: 'Desayuno' },
  { value: 'almuerzo',  label: 'Almuerzo' },
  { value: 'merienda',  label: 'Merienda' },
  { value: 'cena',      label: 'Cena' },
  { value: 'snack',     label: 'Snack' },
]

const FORM_VACIO = {
  tipo_comida:    'desayuno',
  descripcion:    '',
  calorias_aprox: '',
  proteinas_g:    '',
  carbos_g:       '',
  grasas_g:       '',
}

/**
 * Fila de una comida individual — con edición inline.
 */
function MealRow({ comida, onEditar, onEliminar, readonly }) {
  const [editando,   setEditando]   = useState(false)
  const [form,       setForm]       = useState({ ...comida })
  const [guardando,  setGuardando]  = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
            <select name="tipo_comida" className="input py-1.5 text-xs" value={form.tipo_comida} onChange={handleChange}>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Calorías aprox.</label>
            <input name="calorias_aprox" type="number" className="input py-1.5 text-xs"
              placeholder="kcal" value={form.calorias_aprox} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="label">Descripción</label>
          <input name="descripcion" className="input py-1.5 text-xs"
            placeholder="Ej: 2 tostadas con palta y huevo" value={form.descripcion} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['proteinas_g','Proteínas (g)'],['carbos_g','Carbos (g)'],['grasas_g','Grasas (g)']].map(([n,l]) => (
            <div key={n}>
              <label className="label">{l}</label>
              <input name={n} type="number" className="input py-1.5 text-xs"
                placeholder="0" value={form[n]} onChange={handleChange} />
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
        <p className="text-[12px] text-olive-dark font-medium leading-snug truncate">
          {comida.descripcion}
        </p>
        {comida.calorias_aprox && (
          <p className="text-[10.5px] text-muted mt-0.5">
            {comida.calorias_aprox} kcal
            {comida.proteinas_g && ` · P: ${comida.proteinas_g}g`}
            {comida.carbos_g    && ` · C: ${comida.carbos_g}g`}
            {comida.grasas_g    && ` · G: ${comida.grasas_g}g`}
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

/**
 * Grupo de comidas por tipo con formulario de agregar inline.
 */
function MealGroup({ tipo, comidas, onAgregar, onEditar, onEliminar, readonly }) {
  const [expandido, setExpandido] = useState(true)
  const [agregando, setAgregando] = useState(false)
  const [form,      setForm]      = useState({ ...FORM_VACIO, tipo_comida: tipo.value })
  const [loading,   setLoading]   = useState(false)

  const totalCal = comidas.reduce((s, c) => s + (c.calorias_aprox || 0), 0)

  async function handleAgregar() {
    if (!form.descripcion.trim()) return
    setLoading(true)
    await onAgregar({ ...form, tipo_comida: tipo.value })
    setLoading(false)
    setForm({ ...FORM_VACIO, tipo_comida: tipo.value })
    setAgregando(false)
  }

  return (
    <div className="border border-cream-darker rounded-xl overflow-hidden">
      {/* Header del grupo */}
      <button
        onClick={() => setExpandido(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream hover:bg-cream-dark transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-[12.5px] text-olive-dark">
            {tipo.label}
          </span>
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
            <p className="text-[11px] text-muted italic py-1 px-3">Sin items aún.</p>
          )}

          {comidas.map(c => (
            <MealRow
              key={c.id}
              comida={c}
              onEditar={onEditar}
              onEliminar={onEliminar}
              readonly={readonly}
            />
          ))}

          {/* Formulario inline de agregar */}
          {!readonly && agregando && (
            <div className="bg-cream rounded-xl p-3 mt-1 space-y-2">
              <div>
                <label className="label">Descripción *</label>
                <input
                  className="input py-1.5 text-xs"
                  placeholder="Ej: Avena con banana y miel"
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Calorías aprox.</label>
                  <input type="number" className="input py-1.5 text-xs" placeholder="kcal"
                    value={form.calorias_aprox}
                    onChange={e => setForm(f => ({ ...f, calorias_aprox: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Proteínas (g)</label>
                  <input type="number" className="input py-1.5 text-xs" placeholder="0"
                    value={form.proteinas_g}
                    onChange={e => setForm(f => ({ ...f, proteinas_g: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Carbohidratos (g)</label>
                  <input type="number" className="input py-1.5 text-xs" placeholder="0"
                    value={form.carbos_g}
                    onChange={e => setForm(f => ({ ...f, carbos_g: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Grasas (g)</label>
                  <input type="number" className="input py-1.5 text-xs" placeholder="0"
                    value={form.grasas_g}
                    onChange={e => setForm(f => ({ ...f, grasas_g: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setAgregando(false); setForm({ ...FORM_VACIO, tipo_comida: tipo.value }) }}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-cream-darker text-muted
                             font-display text-[11px] flex items-center justify-center gap-1 hover:bg-cream transition-colors">
                  <X size={11} /> Cancelar
                </button>
                <button onClick={handleAgregar} disabled={loading || !form.descripcion.trim()}
                  className="flex-1 py-1.5 rounded-lg bg-olive text-cream font-display text-[11px]
                             flex items-center justify-center gap-1 hover:bg-olive-deep
                             disabled:opacity-50 transition-colors">
                  <Check size={11} /> Agregar
                </button>
              </div>
            </div>
          )}

          {/* Botón agregar */}
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

/**
 * Constructor visual de plan alimenticio.
 * Agrupa comidas por tipo y permite agregar/editar/eliminar inline.
 */
export default function PlanBuilder({ plan, onAgregar, onEditar, onEliminar, readonly = false }) {
  const comidas = plan?.comidas_plan || []

  return (
    <div className="space-y-3">
      {TIPOS.map(tipo => (
        <MealGroup
          key={tipo.value}
          tipo={tipo}
          comidas={comidas.filter(c => c.tipo_comida === tipo.value)}
          onAgregar={onAgregar}
          onEditar={onEditar}
          onEliminar={onEliminar}
          readonly={readonly}
        />
      ))}
    </div>
  )
}
