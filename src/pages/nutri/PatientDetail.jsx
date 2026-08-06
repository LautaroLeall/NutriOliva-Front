import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, UserX, UserCheck,
  Phone, Mail, Calendar, Loader2, AlertCircle, ClipboardList
} from 'lucide-react'
import { supabase }    from '@/lib/supabaseClient'
import Logo            from '@/components/ui/Logo'
import PatientForm     from '@/components/patients/PatientForm'
import { useAuth }     from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'

/**
 * Parsea una fecha 'YYYY-MM-DD' como fecha LOCAL (sin conversión UTC).
 * Evita el bug de restar un día por diferencia de zona horaria.
 */
function parseLocalDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  // Si es formato YYYY-MM-DD, parsear como fecha local
  const date = fecha.length === 10 ? parseLocalDate(fecha) : new Date(fecha)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const hoy  = new Date()
  const nac  = parseLocalDate(fechaNacimiento)
  let edad   = hoy.getFullYear() - nac.getFullYear()
  const m    = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

function initials(nombre) {
  return nombre?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?'
}

export default function PatientDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { signOut }  = useAuth()
  const { actualizarPaciente, desactivarPaciente, reactivarPaciente } = usePatients()

  const [paciente,  setPaciente]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [editando,  setEditando]  = useState(false)

  useEffect(() => {
    fetchPaciente()
  }, [id])

  async function fetchPaciente() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('pacientes')
      .select(`
        *,
        datos_clinicos (
          peso, altura, edad, sexo, objetivo, observaciones, fecha_registro, created_at
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
      // Ordenar datos clínicos y registros por fecha descendente
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

  const datosClinicos = paciente?.datos_clinicos?.[0] // El más reciente
  const planActivo    = paciente?.planes?.find(p => p.estado === 'activo')
  const registrosHoy  = paciente?.registros_comida?.filter(
    r => r.fecha === new Date().toISOString().split('T')[0]
  ) || []
  const caloriasHoy   = registrosHoy.reduce((s, r) => s + (r.calorias_estimadas || 0), 0)

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

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
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
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/panel/pacientes/${id}/plan`)}
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <ClipboardList size={12} />
                Ver plan
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
                  onClick={async () => {
                    await desactivarPaciente(id)
                    fetchPaciente()
                  }}
                  className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <UserX size={12} />
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await reactivarPaciente(id)
                    fetchPaciente()
                  }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <UserCheck size={12} />
                  Reactivar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Balance del día */}
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

          {/* Plan activo */}
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

          {/* Datos clínicos */}
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

        {/* Registros recientes */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-cream-darker bg-cream">
            <h3 className="font-display text-[12.5px] font-semibold text-olive-dark">
              Registros recientes
            </h3>
          </div>
          {paciente.registros_comida?.length > 0 ? (
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
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <PatientForm
        open={editando}
        onClose={() => setEditando(false)}
        paciente={paciente}
        onGuardar={handleGuardar}
      />
    </div>
  )
}
