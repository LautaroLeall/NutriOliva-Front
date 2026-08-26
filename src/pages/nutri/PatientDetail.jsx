import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, UserX, UserCheck,
  Phone, Mail, Calendar, Loader2, AlertCircle,
  ClipboardList, BookOpen, Flame, Dumbbell, HeartPulse,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast, Toaster } from 'sonner'
import Logo from '@/components/ui/Logo'
import PatientForm from '@/components/patients/PatientForm'
import DatosClinicos from '@/components/nutri/DatosClinicos'
import DayCalendar from '@/components/patient/DayCalendar'
import Timeline from '@/components/patient/Timeline'
import WeeklyCaloriesChart from '@/components/ui/WeeklyCaloriesChart'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { useRegistrosNutri } from '@/hooks/useRegistrosNutri'
import { useWeeklyBalance } from '@/hooks/useWeeklyBalance'

// ── Helpers de fecha ──────────────────────────────────────────────────────────

function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseLocalDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  const date = fecha.length === 10 ? parseLocalDate(fecha) : new Date(fecha)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const hoy = new Date()
  const nac = parseLocalDate(fechaNacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

function initials(nombre) {
  return nombre?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?'
}

function formatFechaLegible(iso) {
  const hoy = toLocalISO(new Date())
  const ayer = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return toLocalISO(d) })()
  if (iso === hoy) return 'Hoy'
  if (iso === ayer) return 'Ayer'
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

// ── Sub-componente: balance del día en la pestaña Diario ──────────────────────

function BalanceDia({ consumidas, gastadas, caloriasObjetivo, loading }) {
  if (loading) return null
  const netas = consumidas - gastadas
  const exceso = caloriasObjetivo > 0 && netas > caloriasObjetivo
  const pct = caloriasObjetivo > 0 ? Math.min((netas / caloriasObjetivo) * 100, 100) : 0

  return (
    <div className="bg-cream border border-cream-darker rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9.5px] font-display text-muted uppercase tracking-wide">
          Balance del día
        </span>
        {caloriasObjetivo > 0 && (
          <span className={`text-[10.5px] font-display font-semibold
                            ${exceso ? 'text-red-500' : 'text-olive'}`}>
            {exceso
              ? `+${netas - caloriasObjetivo} kcal sobre el objetivo`
              : `${caloriasObjetivo - netas} kcal restantes`}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span className={`font-display font-bold text-2xl
                          ${exceso ? 'text-red-500' : 'text-olive-dark'}`}>
          {netas}
        </span>
        {caloriasObjetivo > 0 && (
          <span className="text-muted text-sm">/ {caloriasObjetivo} kcal</span>
        )}
      </div>

      {caloriasObjetivo > 0 && (
        <div className="w-full bg-white rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className={`h-1.5 rounded-full transition-all duration-500
                        ${exceso ? 'bg-red-400' : 'bg-olive'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="flex gap-4">
        <span className="flex items-center gap-1 text-[10.5px] font-display text-olive">
          <Flame size={11} /> +{consumidas} consumidas
        </span>
        <span className="flex items-center gap-1 text-[10.5px] font-display text-blue-400">
          <Dumbbell size={11} /> -{gastadas} gastadas
        </span>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { actualizarPaciente, desactivarPaciente, reactivarPaciente } = usePatients()

  const [paciente, setPaciente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editando, setEditando] = useState(false)
  const [editandoClinicos, setEditandoClinicos] = useState(false)

  // Tab activo: 'ficha' | 'diario' | 'clinica'
  const [tab, setTab] = useState('ficha')

  // Fecha seleccionada en el calendario del nutricionista
  const [fechaDiario, setFechaDiario] = useState(toLocalISO(new Date()))

  // Hook de registros — solo activo cuando el tab es "diario"
  const {
    comidas: comidasNutri,
    actividades: actividadesNutri,
    totalConsumidas,
    totalGastadas,
    loading: loadingDiario,
  } = useRegistrosNutri(tab === 'diario' ? id : null, fechaDiario)

  const { puntos: puntosSemanales, loading: loadingTendencia } = useWeeklyBalance(
    id,
    paciente?.planes?.find(p => p.estado === 'activo')?.calorias_objetivo || 0
  )

  useEffect(() => { fetchPaciente() }, [id])

  async function fetchPaciente() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('pacientes')
      .select(`
        *,
        datos_clinicos (
          id, peso, altura, edad, sexo, objetivo, observaciones, fecha_registro, created_at
        ),
        planes (
          id, calorias_objetivo, version, estado, created_at
        ),
        registros_comida (
          id, fecha, hora, descripcion, calorias_estimadas, created_at
        )
      `)
      .eq('id', id)
      .single()

    if (err) setError(err.message)
    else {
      if (data.datos_clinicos) {
        data.datos_clinicos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      if (data.registros_comida) {
        data.registros_comida.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      setPaciente(data)
    }
    setLoading(false)
  }

  async function handleGuardar(datos) {
    const result = await actualizarPaciente(id, datos)
    if (!result.error) fetchPaciente()
    return result
  }

  async function handleGuardarClinicos() {
    await fetchPaciente()
    toast.success('Datos clínicos actualizados.')
  }

  const datosClinicos = paciente?.datos_clinicos?.[0]
  const planActivo = paciente?.planes?.find(p => p.estado === 'activo')
  const caloriasObjetivo = planActivo?.calorias_objetivo || 0

  const registrosHoy = paciente?.registros_comida?.filter(
    r => r.fecha === toLocalISO(new Date())
  ) || []
  const caloriasHoy = registrosHoy.reduce((s, r) => s + (r.calorias_estimadas || 0), 0)

  // ── Loading / Error states ──────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted">
          <Loader2 size={16} className="animate-spin" />
          <span className="font-display text-sm">Cargando ficha...</span>
        </div>
      </div>
    )
  }

  if (error || !paciente) {
    return (
      <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
        <div className="flex items-center gap-2 text-danger">
          <AlertCircle size={16} />
          <span className="font-display text-sm">{error || 'Paciente no encontrado.'}</span>
        </div>
      </div>
    )
  }

  const activo = paciente.estado === 'activo'

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="top-center" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/panel')}
            className="text-muted hover:text-olive-dark transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
            <Logo size={20} />
            NutriOliva
          </div>
        </div>
        <button onClick={signOut} className="btn-ghost text-xs px-3 py-1.5">
          Salir
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header del paciente */}
        <div className="card p-6 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-olive flex items-center justify-center
                              font-display font-bold text-lg text-cream flex-shrink-0">
                {initials(paciente.nombre)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-semibold text-lg text-olive-dark">
                    {paciente.nombre}
                  </h1>
                  {!activo && (
                    <span className="badge bg-cream-darker text-muted text-[9px]">Inactivo</span>
                  )}
                  {/* Alerta si no tiene datos clínicos */}
                  {!datosClinicos && (
                    <span className="flex items-center gap-1 text-[9px] bg-amber-100 text-amber-700
                                      px-2 py-0.5 rounded-full font-display">
                      Sin datos clínicos
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Mail size={11} /> {paciente.email}
                  </span>
                  {paciente.telefono && (
                    <span className="flex items-center gap-1.5 text-[11px] text-muted">
                      <Phone size={11} /> {paciente.telefono}
                    </span>
                  )}
                  {paciente.fecha_nacimiento && (
                    <span className="flex items-center gap-1.5 text-[11px] text-muted">
                      <Calendar size={11} />
                      {formatFecha(paciente.fecha_nacimiento)}
                      {calcularEdad(paciente.fecha_nacimiento) !== null &&
                        ` · ${calcularEdad(paciente.fecha_nacimiento)} años`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => navigate(`/panel/pacientes/${id}/plan`)}
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <ClipboardList size={12} />
                Ver plan
              </button>
              <button
                onClick={() => setEditandoClinicos(true)}
                className={`text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg border transition-colors font-display
                            ${!datosClinicos
                    ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                    : 'btn-ghost'}`}
              >
                <HeartPulse size={12} />
                {datosClinicos ? 'Actualizar clínica' : 'Cargar datos clínicos'}
              </button>
              <button
                onClick={() => setEditando(true)}
                className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <Pencil size={12} />
                Editar
              </button>
              {activo ? (
                <button
                  onClick={async () => { await desactivarPaciente(id); fetchPaciente() }}
                  className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <UserX size={12} />
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={async () => { await reactivarPaciente(id); fetchPaciente() }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <UserCheck size={12} />
                  Reactivar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card p-4">
            <div className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
              Calorías hoy
            </div>
            <div className="font-display text-2xl font-semibold text-olive-dark">
              {caloriasHoy > 0 ? caloriasHoy : '—'}
            </div>
            {planActivo && (
              <div className="text-[10px] text-muted mt-1">
                de {planActivo.calorias_objetivo} kcal objetivo
              </div>
            )}
          </div>

          <div className="card p-4">
            <div className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
              Plan activo
            </div>
            {planActivo ? (
              <>
                <div className="font-display text-sm font-semibold text-olive-dark">
                  v{planActivo.version}
                </div>
                <div className="text-[10px] text-muted mt-1">
                  {planActivo.calorias_objetivo} kcal/día
                </div>
              </>
            ) : (
              <div className="text-[11px] text-muted italic">Sin plan asignado</div>
            )}
          </div>

          <div className="card p-4">
            <div className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
              Datos clínicos
            </div>
            {datosClinicos ? (
              <div className="space-y-0.5">
                {datosClinicos.peso && (
                  <div className="text-[11px] text-olive-dark">
                    <span className="text-muted">Peso:</span> {datosClinicos.peso} kg
                  </div>
                )}
                {datosClinicos.altura && (
                  <div className="text-[11px] text-olive-dark">
                    <span className="text-muted">Altura:</span> {datosClinicos.altura} cm
                  </div>
                )}
                {datosClinicos.objetivo && (
                  <div className="text-[11px] text-olive-dark capitalize">
                    <span className="text-muted">Objetivo:</span> {datosClinicos.objetivo}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-muted italic">Sin datos clínicos</div>
            )}
          </div>
        </div>

        {/* Tabs: Ficha / Diario / Clinica */}
        <div className="card overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-cream-darker bg-white">
            {[
              { id: 'ficha', label: 'Registros recientes', icon: BookOpen },
              { id: 'diario', label: 'Diario del paciente', icon: Calendar },
              { id: 'clinica', label: 'Datos clínicos', icon: HeartPulse },
            ].map(t => {
              const Icon = t.icon
              const actv = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-display
                              transition-colors border-b-2
                              ${actv
                      ? 'border-olive text-olive-dark font-semibold'
                      : 'border-transparent text-muted hover:text-olive-dark'}`}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* ── TAB: Ficha (registros recientes) ─────────────────────────── */}
          {tab === 'ficha' && (
            paciente.registros_comida?.length > 0 ? (
              <div className="divide-y divide-cream">
                {paciente.registros_comida.slice(0, 10).map(r => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <div className="text-[12px] text-olive-dark font-medium">{r.descripcion}</div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {formatFecha(r.fecha)} · {r.hora?.slice(0, 5)}
                      </div>
                    </div>
                    {r.calorias_estimadas && (
                      <span className="font-display text-sm font-semibold text-olive-dark">
                        {r.calorias_estimadas} kcal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-[11px] text-muted italic">
                El paciente todavía no registró ninguna comida.
              </div>
            )
          )}

          {/* ── TAB: Diario del paciente ──────────────────────────────────── */}
          {tab === 'diario' && (
            <div className="p-4">
              {/* Selector de fecha */}
              <DayCalendar
                fechaActiva={fechaDiario}
                onChange={setFechaDiario}
              />

              {/* Fecha legible */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-semibold text-olive-dark capitalize">
                  {formatFechaLegible(fechaDiario)}
                </h3>
                {loadingDiario && (
                  <Loader2 size={14} className="animate-spin text-muted" />
                )}
              </div>

              {/* Balance del día */}
              {!loadingDiario && (comidasNutri.length > 0 || actividadesNutri.length > 0) && (
                <BalanceDia
                  consumidas={totalConsumidas}
                  gastadas={totalGastadas}
                  caloriasObjetivo={caloriasObjetivo}
                  loading={loadingDiario}
                />
              )}

              {/* Timeline — sin funciones de edición/eliminación */}
              {!loadingDiario && (
                <Timeline
                  comidas={comidasNutri}
                  actividades={actividadesNutri}
                  onEliminarComida={null}
                  onEliminarActividad={null}
                  onEditarComida={null}
                />
              )}

              {/* Separador */}
              <div className="border-t border-cream-darker my-4" />

              {/* Gráfico de tendencia semanal */}
              <WeeklyCaloriesChart
                puntos={puntosSemanales}
                loading={loadingTendencia}
                titulo={`Adherencia de ${paciente.nombre} — últimos 7 días`}
                caloriasObjetivo={caloriasObjetivo}
              />
            </div>
          )}

          {/* ── TAB: Datos clínicos ─────────────────────────────────────────── */}
          {tab === 'clinica' && (
            <div className="p-5 space-y-4">

              {/* Si no hay datos — aviso prominente */}
              {!datosClinicos && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <HeartPulse size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-display text-sm font-semibold text-amber-800">
                      Sin datos clínicos cargados
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Este paciente no tiene datos clínicos registrados.
                      Los datos clínicos son necesarios para activar un plan.
                    </p>
                    <button
                      onClick={() => setEditandoClinicos(true)}
                      className="mt-3 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg
                                hover:bg-amber-700 transition-colors font-display"
                    >
                      Cargar datos clínicos ahora
                    </button>
                  </div>
                </div>
              )}

              {/* Última medición */}
              {datosClinicos && (() => {
                const imc = datosClinicos.peso && datosClinicos.altura
                  ? (datosClinicos.peso / ((datosClinicos.altura / 100) ** 2)).toFixed(1)
                  : null
                const imcColor = !imc ? 'text-muted'
                  : imc < 18.5 ? 'text-blue-500'
                    : imc < 25 ? 'text-green-600'
                      : imc < 30 ? 'text-amber-500'
                        : 'text-red-500'
                const OBJETIVO_LABELS = {
                  bajar: 'Bajar de peso', bajar_fuerza: 'Bajar + fuerza',
                  mantener: 'Mantener', subir: 'Aumentar de peso',
                  subir_fuerza: 'Aumentar + fuerza',
                  rendimiento_deportivo: 'Rendimiento deportivo',
                  recomposicion: 'Recomposicion corporal',
                }
                const ACTIVIDAD_LABELS = {
                  sedentario: 'Sedentario', leve: 'Leve',
                  moderado: 'Moderado', activo: 'Activo', muy_activo: 'Muy activo',
                }
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-[9.5px] text-muted uppercase tracking-wide">
                          Ultimo registro
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {datosClinicos.fecha_registro
                            ? new Date(datosClinicos.fecha_registro + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
                            : '—'
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => setEditandoClinicos(true)}
                        className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
                      >
                        <HeartPulse size={12} />
                        Actualizar medicion
                      </button>
                    </div>

                    {/* Medidas principales */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Peso', value: datosClinicos.peso, unit: 'kg' },
                        { label: 'Altura', value: datosClinicos.altura, unit: 'cm' },
                        { label: 'IMC', value: imc, unit: '', color: imcColor },
                        { label: 'Edad', value: datosClinicos.edad, unit: 'años' },
                      ].map(({ label, value, unit, color }) => (
                        <div key={label} className="bg-cream rounded-xl p-3 text-center">
                          <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">{label}</p>
                          <p className={`font-display font-bold text-xl ${color || 'text-olive-dark'}`}>
                            {value ?? '—'}
                          </p>
                          {unit && <p className="text-[9px] text-muted">{unit}</p>}
                        </div>
                      ))}
                    </div>

                    {/* Composicion corporal */}
                    {(datosClinicos.porcentaje_grasa || datosClinicos.masa_muscular_kg || datosClinicos.cintura_cm) && (
                      <div>
                        <p className="font-display text-[9.5px] text-muted uppercase tracking-wide mb-2">
                          Composicion corporal
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: '% Grasa', value: datosClinicos.porcentaje_grasa, unit: '%' },
                            { label: 'Masa muscular', value: datosClinicos.masa_muscular_kg, unit: 'kg' },
                            { label: 'Cintura', value: datosClinicos.cintura_cm, unit: 'cm' },
                          ].map(({ label, value, unit }) => value && (
                            <div key={label} className="bg-cream rounded-xl p-3 text-center">
                              <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">{label}</p>
                              <p className="font-display font-bold text-lg text-olive-dark">{value}</p>
                              <p className="text-[9px] text-muted">{unit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Objetivo y actividad */}
                    <div className="grid grid-cols-2 gap-3">
                      {datosClinicos.objetivo && (
                        <div className="bg-cream rounded-xl p-3">
                          <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Objetivo</p>
                          <p className="text-[12px] text-olive-dark font-medium">
                            {OBJETIVO_LABELS[datosClinicos.objetivo] || datosClinicos.objetivo}
                          </p>
                        </div>
                      )}
                      {datosClinicos.nivel_actividad && (
                        <div className="bg-cream rounded-xl p-3">
                          <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Nivel de actividad</p>
                          <p className="text-[12px] text-olive-dark font-medium">
                            {ACTIVIDAD_LABELS[datosClinicos.nivel_actividad] || datosClinicos.nivel_actividad}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Sexo */}
                    {datosClinicos.sexo && (
                      <div className="bg-cream rounded-xl p-3">
                        <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Sexo</p>
                        <p className="text-[12px] text-olive-dark font-medium capitalize">
                          {datosClinicos.sexo === 'M' ? 'Masculino' : datosClinicos.sexo === 'F' ? 'Femenino' : 'Otro'}
                        </p>
                      </div>
                    )}

                    {/* Informacion clinica */}
                    {(datosClinicos.patologias || datosClinicos.alergias || datosClinicos.medicacion) && (
                      <div className="space-y-2">
                        <p className="font-display text-[9.5px] text-muted uppercase tracking-wide">
                          Informacion clinica
                        </p>
                        {datosClinicos.patologias && (
                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Patologias</p>
                            <p className="text-[12px] text-olive-dark">{datosClinicos.patologias}</p>
                          </div>
                        )}
                        {datosClinicos.alergias && (
                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Alergias e intolerancias</p>
                            <p className="text-[12px] text-olive-dark">{datosClinicos.alergias}</p>
                          </div>
                        )}
                        {datosClinicos.medicacion && (
                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Medicacion actual</p>
                            <p className="text-[12px] text-olive-dark">{datosClinicos.medicacion}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Observaciones */}
                    {datosClinicos.observaciones && (
                      <div className="bg-cream rounded-xl p-3">
                        <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">Observaciones clinicas</p>
                        <p className="text-[12px] text-olive-dark">{datosClinicos.observaciones}</p>
                      </div>
                    )}

                    {/* Historial de registros anteriores */}
                    {paciente.datos_clinicos?.length > 1 && (
                      <details className="mt-2">
                        <summary className="text-[11px] font-display text-muted cursor-pointer hover:text-olive-dark">
                          Ver historial completo ({paciente.datos_clinicos.length} registros)
                        </summary>
                        <div className="mt-3 space-y-2">
                          {paciente.datos_clinicos.slice(1).map((dc, i) => (
                            <div key={dc.id || i} className="border border-cream-darker rounded-xl px-4 py-3">
                              <p className="text-[9.5px] font-display text-muted mb-1">
                                {dc.fecha_registro
                                  ? new Date(dc.fecha_registro + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
                                  : '—'
                                }
                              </p>
                              <div className="flex gap-4 flex-wrap text-[11px] text-olive-dark">
                                {dc.peso && <span><span className="text-muted">Peso:</span> {dc.peso} kg</span>}
                                {dc.altura && <span><span className="text-muted">Altura:</span> {dc.altura} cm</span>}
                                {dc.objetivo && <span className="capitalize"><span className="text-muted">Obj:</span> {dc.objetivo}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición de datos del paciente */}
      <PatientForm
        open={editando}
        onClose={() => setEditando(false)}
        paciente={paciente}
        onGuardar={handleGuardar}
      />

      {/* Modal de datos clínicos */}
      <DatosClinicos
        open={editandoClinicos}
        onClose={() => setEditandoClinicos(false)}
        pacienteId={id}
        nombrePaciente={paciente?.nombre}
        datosIniciales={datosClinicos || null}
        onGuardado={handleGuardarClinicos}
      />
    </div>
  )
}
