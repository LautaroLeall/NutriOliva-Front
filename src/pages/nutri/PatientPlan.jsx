import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ClipboardList, Send, FilePen,
  Loader2, AlertCircle, CheckCircle2, Trash2,
  Pencil, X, Check, ChevronDown
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { usePlans }     from '@/hooks/usePlans'
import PlanBuilder      from '@/components/plans/PlanBuilder'
import Logo             from '@/components/ui/Logo'
import Modal            from '@/components/ui/Modal'
import EmptyState       from '@/components/ui/EmptyState'
import ConfirmDialog    from '@/components/ui/ConfirmDialog'
import { useAuth }      from '@/hooks/useAuth'

// ── Validaciones de calorías ──────────────────────────────────────────────────
function validarCalorias(val) {
  const n = Number(val)
  if (!val || isNaN(n))    return 'Ingresá un número válido.'
  if (n < 500)             return 'El mínimo es 500 kcal.'
  if (n > 6000)            return 'El máximo es 6000 kcal.'
  if (!Number.isInteger(n))return 'Debe ser un número entero.'
  return null
}

// ── Cabecera del plan ─────────────────────────────────────────────────────────
function PlanHeader({ plan, onPublicar, onNuevaVersion, onEliminar, publicando }) {
  const estado = {
    borrador:  { label: 'Borrador',  dot: 'bg-amber-400' },
    activo:    { label: 'Activo',    dot: 'bg-green-500' },
    archivado: { label: 'Archivado', dot: 'bg-gray-400'  },
  }[plan.estado] || { label: plan.estado, dot: 'bg-gray-400' }

  const puedeEliminar = plan.estado !== 'activo'

  return (
    <div className="card p-5 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display font-semibold text-base text-olive-dark">
              Plan v{plan.version}
            </span>
            <span className="flex items-center gap-1 text-[10.5px] font-display">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${estado.dot}`} />
              {estado.label}
            </span>
          </div>
          {plan.notas && (
            <p className="text-[11px] text-olive italic mb-1">"{plan.notas}"</p>
          )}
          <p className="text-[11px] text-muted">
            {plan.calorias_objetivo} kcal/día · {plan.comidas_plan?.length || 0} items
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {plan.estado === 'borrador' && (
            <button
              onClick={onPublicar}
              disabled={publicando || !plan.comidas_plan?.length}
              title={!plan.comidas_plan?.length ? 'Agregá al menos 1 comida para publicar' : ''}
              className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5 disabled:opacity-50"
            >
              {publicando
                ? <><Loader2 size={12} className="animate-spin" /> Publicando...</>
                : <><Send size={12} /> Publicar</>}
            </button>
          )}
          {plan.estado === 'activo' && (
            <button onClick={onNuevaVersion}
              className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
              <FilePen size={12} /> Nueva versión
            </button>
          )}
          {puedeEliminar && (
            <button onClick={onEliminar}
              className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500 font-display
                         hover:bg-red-100 transition-colors flex items-center gap-1.5">
              <Trash2 size={12} /> Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Selector de versiones ─────────────────────────────────────────────────────
function VersionSelector({ planes, planVisibleId, onSelect }) {
  const [open, setOpen] = useState(false)
  const actual = planes.find(p => p.id === planVisibleId) || planes[0]

  const estadoLabel = { borrador: 'Borrador', activo: 'Activo', archivado: 'Archivado' }
  const estadoDot   = { borrador: 'bg-amber-400', activo: 'bg-green-500', archivado: 'bg-gray-400' }

  if (planes.length <= 1) return null

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white border border-cream-darker rounded-xl
                   px-4 py-2.5 font-display text-sm text-olive-dark hover:bg-cream transition-colors"
      >
        <span className={`w-2 h-2 rounded-full ${estadoDot[actual?.estado] || 'bg-gray-400'}`} />
        Plan v{actual?.version} — {estadoLabel[actual?.estado]}
        <ChevronDown size={13} className={`ml-1 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-cream-darker
                        rounded-xl shadow-modal z-10 min-w-[220px] overflow-hidden">
          {planes.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-display text-[12px]
                          transition-colors hover:bg-cream
                          ${p.id === planVisibleId ? 'bg-cream text-olive-dark font-semibold' : 'text-muted'}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${estadoDot[p.estado] || 'bg-gray-400'}`} />
              <span>Plan v{p.version}</span>
              <span className="text-[10px] text-muted ml-auto">{estadoLabel[p.estado]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function PatientPlan() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { signOut } = useAuth()

  const {
    planes, planActivo, loading, error,
    crearPlan, agregarComida, editarComida, eliminarComida,
    actualizarCalorias, publicarPlan, crearNuevaVersion,
    eliminarPlan, actualizarNotas,
  } = usePlans(id)

  const [planVisibleId,  setPlanVisibleId]  = useState(null)
  const [modalNuevo,     setModalNuevo]     = useState(false)
  const [caloriaInput,   setCaloriaInput]   = useState('2000')
  const [calError,       setCalError]       = useState('')
  const [publicando,     setPublicando]     = useState(false)

  // Objetivo calórico editable
  const [editandoCal,   setEditandoCal]     = useState(false)
  const [nuevasCal,     setNuevasCal]       = useState('')
  const [calEditError,  setCalEditError]    = useState('')

  // Notas del plan
  const [editandoNotas, setEditandoNotas]   = useState(false)
  const [notasInput,    setNotasInput]      = useState('')

  // Confirms
  const [confirmEliminar, setConfirmEliminar] = useState(null) // planId a eliminar
  const [confirmPublicar, setConfirmPublicar] = useState(false)
  const [confirmVersion,  setConfirmVersion]  = useState(false)
  const [procesando,      setProcesando]      = useState(false)

  // Plan visible: el seleccionado, o el activo, o el primero
  const planVisible = planes.find(p => p.id === planVisibleId)
    || planActivo
    || planes[0]
    || null

  // ── Crear plan ──────────────────────────────────────────────────────────────
  async function handleCrearPlan() {
    const err = validarCalorias(caloriaInput)
    if (err) { setCalError(err); return }
    setCalError('')
    const { data, error: e } = await crearPlan(Number(caloriaInput))
    if (e) toast.error('Error al crear el plan.')
    else {
      toast.success('Plan creado como borrador.')
      setPlanVisibleId(data.id)
      setModalNuevo(false)
    }
  }

  // ── Publicar ────────────────────────────────────────────────────────────────
  async function handlePublicar() {
    if (!planVisible) return
    setProcesando(true)
    const { error: e } = await publicarPlan(planVisible.id)
    setProcesando(false)
    setConfirmPublicar(false)
    if (e) toast.error('Error al publicar: ' + e.message)
    else   toast.success('Plan publicado y activo correctamente.')
  }

  // ── Nueva versión ───────────────────────────────────────────────────────────
  async function handleNuevaVersion() {
    if (!planActivo) return
    setProcesando(true)
    const { data, error: e } = await crearNuevaVersion(planActivo.id)
    setProcesando(false)
    setConfirmVersion(false)
    if (e) toast.error('Error al crear nueva versión.')
    else {
      toast.success('Nueva versión creada como borrador.')
      setPlanVisibleId(data.id)
    }
  }

  // ── Eliminar plan ───────────────────────────────────────────────────────────
  async function handleEliminar() {
    if (!confirmEliminar) return
    setProcesando(true)
    const { error: e } = await eliminarPlan(confirmEliminar)
    setProcesando(false)
    if (e) {
      toast.error(e)
    } else {
      toast.success('Plan eliminado.')
      setPlanVisibleId(null)
    }
    setConfirmEliminar(null)
  }

  // ── Guardar calorías ────────────────────────────────────────────────────────
  async function handleGuardarCalorias() {
    const err = validarCalorias(nuevasCal)
    if (err) { setCalEditError(err); return }
    if (Number(nuevasCal) === planVisible.calorias_objetivo) {
      setCalEditError('El valor no cambió.')
      return
    }
    setCalEditError('')
    await actualizarCalorias(planVisible.id, nuevasCal)
    setEditandoCal(false)
    toast.success('Objetivo calórico actualizado.')
  }

  // ── Guardar notas ───────────────────────────────────────────────────────────
  async function handleGuardarNotas() {
    if (notasInput.trim() === (planVisible.notas || '').trim()) {
      setEditandoNotas(false)
      return
    }
    await actualizarNotas(planVisible.id, notasInput)
    setEditandoNotas(false)
    toast.success('Notas actualizadas.')
  }

  const readonly = planVisible?.estado === 'archivado'

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/panel/pacientes/${id}`)}
            className="text-muted hover:text-olive-dark transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
            <Logo size={20} />
            NutriOliva
          </div>
        </div>
        <button onClick={signOut} className="btn-ghost text-xs px-3 py-1.5">Salir</button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-display text-xl text-olive-dark">Plan alimenticio</h2>
            {planes.length > 0 && (
              <p className="text-xs text-muted mt-0.5">
                {planes.length} {planes.length === 1 ? 'versión' : 'versiones'}
              </p>
            )}
          </div>
          <button onClick={() => { setCaloriaInput('2000'); setCalError(''); setModalNuevo(true) }}
            className="btn-secondary text-xs px-4 py-2">
            + Nuevo plan
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-muted">
            <Loader2 size={16} className="animate-spin" />
            <span className="font-display text-sm">Cargando plan...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="card p-5 flex items-center gap-2 text-red-500">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Sin planes */}
        {!loading && !error && planes.length === 0 && (
          <div className="card">
            <EmptyState
              icon={ClipboardList}
              title="Este paciente no tiene plan todavía"
              description="Creá el primer plan alimenticio, agregá las comidas y publicalo."
              action={
                <button onClick={() => setModalNuevo(true)} className="btn-primary text-sm">
                  Crear primer plan
                </button>
              }
            />
          </div>
        )}

        {/* Plan visible */}
        {!loading && planVisible && (
          <>
            {/* Selector de versiones (dropdown) */}
            <VersionSelector
              planes={planes}
              planVisibleId={planVisible.id}
              onSelect={p => setPlanVisibleId(p.id)}
            />

            {/* Header del plan seleccionado */}
            <PlanHeader
              plan={planVisible}
              onPublicar={() => setConfirmPublicar(true)}
              onNuevaVersion={() => setConfirmVersion(true)}
              onEliminar={() => setConfirmEliminar(planVisible.id)}
              publicando={publicando}
            />

            {/* Notas del plan */}
            <div className="card px-5 py-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9.5px] font-display text-muted uppercase tracking-wide">
                  Notas del plan
                </p>
                {!readonly && !editandoNotas && (
                  <button onClick={() => { setNotasInput(planVisible.notas || ''); setEditandoNotas(true) }}
                    className="text-muted hover:text-olive transition-colors">
                    <Pencil size={12} />
                  </button>
                )}
              </div>
              {editandoNotas ? (
                <div className="space-y-2">
                  <input
                    className="input text-sm"
                    placeholder="Ej: Plan de mantenimiento — Fase 1"
                    value={notasInput}
                    onChange={e => setNotasInput(e.target.value)}
                    maxLength={100}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setEditandoNotas(false)}
                      className="flex-1 py-1.5 rounded-lg border border-cream-darker bg-white text-muted
                                 font-display text-[11px] hover:bg-cream transition-colors">
                      <X size={11} className="inline mr-1" />Cancelar
                    </button>
                    <button onClick={handleGuardarNotas}
                      className="flex-1 py-1.5 rounded-lg bg-olive text-cream font-display text-[11px]
                                 hover:bg-olive-deep transition-colors">
                      <Check size={11} className="inline mr-1" />Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-olive-dark">
                  {planVisible.notas || <span className="text-muted italic">Sin notas</span>}
                </p>
              )}
            </div>

            {/* Objetivo calórico */}
            <div className="card px-5 py-4 mb-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
                  Objetivo calórico diario
                </p>
                {editandoCal ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className={`input py-1 text-sm w-32 ${calEditError ? 'border-red-400' : ''}`}
                        value={nuevasCal}
                        onChange={e => { setNuevasCal(e.target.value); setCalEditError('') }}
                        autoFocus
                        min={500}
                        max={6000}
                      />
                      <span className="text-sm text-muted">kcal</span>
                      <button onClick={handleGuardarCalorias}
                        className="text-green-500 hover:text-green-600 transition-colors">
                        <CheckCircle2 size={18} />
                      </button>
                      <button onClick={() => { setEditandoCal(false); setCalEditError('') }}
                        className="text-muted hover:text-olive-dark transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    {calEditError && <p className="text-[10.5px] text-red-500">{calEditError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-xl text-olive-dark">
                      {planVisible.calorias_objetivo}
                    </span>
                    <span className="text-sm text-muted">kcal / día</span>
                    {!readonly && (
                      <button
                        onClick={() => { setNuevasCal(String(planVisible.calorias_objetivo)); setEditandoCal(true); setCalEditError('') }}
                        className="text-muted hover:text-olive transition-colors ml-1">
                        <FilePen size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Resumen calorías del plan */}
              {planVisible.comidas_plan?.length > 0 && (() => {
                const total = planVisible.comidas_plan.reduce((s, c) => s + (c.calorias_aprox || 0), 0)
                const diff  = total - planVisible.calorias_objetivo
                if (total === 0) return null
                return (
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-0.5">
                      Total en el plan
                    </p>
                    <p className={`font-display font-semibold text-xl ${
                      Math.abs(diff) < 100 ? 'text-green-500' : diff > 0 ? 'text-red-500' : 'text-olive-dark'
                    }`}>
                      {total} kcal
                    </p>
                    <p className="text-[10px] text-muted">
                      {diff > 0 ? `+${diff}` : diff} vs objetivo
                    </p>
                  </div>
                )
              })()}
            </div>

            {/* Constructor de comidas */}
            <PlanBuilder
              plan={planVisible}
              onAgregar={comida => agregarComida(planVisible.id, comida)}
              onEditar={editarComida}
              onEliminar={eliminarComida}
              readonly={readonly}
            />

            {readonly && (
              <p className="text-center text-[11px] text-muted italic mt-5">
                Plan archivado — solo lectura.
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Modal: crear nuevo plan ─────────────────────────────────────────── */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo plan" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Objetivo calórico diario (kcal) *</label>
            <input
              type="number"
              className={`input ${calError ? 'border-red-400' : ''}`}
              value={caloriaInput}
              onChange={e => { setCaloriaInput(e.target.value); setCalError('') }}
              placeholder="Ej: 2000"
              min="500"
              max="6000"
            />
            {calError && <p className="text-[10.5px] text-red-500 mt-1">{calError}</p>}
            <p className="text-[10px] text-muted mt-1">Entre 500 y 6000 kcal. Podés modificarlo después.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setModalNuevo(false)} className="btn-ghost flex-1 py-2.5">
              Cancelar
            </button>
            <button onClick={handleCrearPlan} className="btn-primary flex-1 py-2.5">
              Crear plan
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Confirm: publicar ───────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmPublicar}
        onClose={() => setConfirmPublicar(false)}
        onConfirm={handlePublicar}
        title="Publicar plan"
        message={`El plan v${planVisible?.version} pasará a estar Activo. ${planActivo && planActivo.id !== planVisible?.id ? 'El plan activo actual quedará archivado.' : ''}`}
        confirmLabel="Publicar"
        variant="default"
        loading={procesando}
      />

      {/* ── Confirm: nueva versión ──────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmVersion}
        onClose={() => setConfirmVersion(false)}
        onConfirm={handleNuevaVersion}
        title="Crear nueva versión"
        message={`Se copiará el plan v${planActivo?.version} con todas sus comidas como borrador. El plan activo seguirá vigente hasta que publiques la nueva versión.`}
        confirmLabel="Crear nueva versión"
        variant="warning"
        loading={procesando}
      />

      {/* ── Confirm: eliminar plan ──────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!confirmEliminar}
        onClose={() => setConfirmEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar plan"
        message="Esta acción es irreversible. Se eliminará el plan y todas sus comidas. No podés eliminar el plan activo."
        confirmLabel="Eliminar plan"
        variant="danger"
        loading={procesando}
      />
    </div>
  )
}
