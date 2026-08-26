import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, LogOut, Plus, Search, Loader2, AlertCircle } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import Logo from '@/components/ui/Logo'
import EmptyState from '@/components/ui/EmptyState'
import PatientRow from '@/components/patients/PatientRow'
import PatientForm from '@/components/patients/PatientForm'
import DatosClinicos from '@/components/nutri/DatosClinicos'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function NutriPanel() {
  const navigate = useNavigate()
  const { nombre, signOut } = useAuth()
  const {
    pacientes, loading, error,
    crearPaciente, actualizarPaciente,
    desactivarPaciente, reactivarPaciente,
  } = usePatients()

  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDesact, setConfirmDesact] = useState(null)
  const [confirmReact, setConfirmReact] = useState(null)
  const [procesando, setProcesando] = useState(false)
  // Datos clínicos — se muestra al crear un paciente nuevo
  const [pacienteCreado, setPacienteCreado] = useState(null) // { id, nombre }
  const [modalClinicos, setModalClinicos] = useState(false)

  const filtrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const activos = pacientes.filter(p => p.estado === 'activo').length
  const sinActiv = pacientes.filter(p => p.sinActividad48h && p.estado === 'activo').length

  function abrirNuevo() {
    setEditando(null)
    setModalAbierto(true)
  }

  function abrirEdicion(paciente) {
    setEditando(paciente)
    setModalAbierto(true)
  }

  async function handleGuardar(datos) {
    if (editando) {
      const res = await actualizarPaciente(editando.id, datos)
      if (!res.error) toast.success(`${datos.nombre} actualizado correctamente.`)
      return res
    }
    // Crear paciente nuevo
    const res = await crearPaciente(datos)
    if (!res.error) {
      toast.success(`Paciente ${datos.nombre} creado.`)
      // Abrir modal de datos clínicos (opcional al crearlos)
      if (res.data?.id) {
        setPacienteCreado({ id: res.data.id, nombre: datos.nombre })
        setModalAbierto(false)
        // Pequeño delay para que el PatientForm se cierre primero
        setTimeout(() => setModalClinicos(true), 200)
      }
    }
    return res
  }

  async function handleDesactivar() {
    if (!confirmDesact) return
    setProcesando(true)
    const { error: e } = await desactivarPaciente(confirmDesact.id)
    setProcesando(false)
    if (e) toast.error('Error al desactivar.')
    else toast.success(`${confirmDesact.nombre} desactivado.`)
    setConfirmDesact(null)
  }

  async function handleReactivar() {
    if (!confirmReact) return
    setProcesando(true)
    const { error: e } = await reactivarPaciente(confirmReact.id)
    setProcesando(false)
    if (e) toast.error('Error al reactivar.')
    else toast.success(`${confirmReact.nombre} reactivado.`)
    setConfirmReact(null)
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={22} />
          NutriOliva
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-5 text-sm font-display text-muted">
            <span className="text-olive-dark font-semibold cursor-pointer">Pacientes</span>
            <span className="cursor-pointer hover:text-olive-dark transition-colors">Catálogo</span>
            <span className="cursor-pointer hover:text-olive-dark transition-colors">Cuenta</span>
          </div>
          <button onClick={signOut} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
            <LogOut size={12} />
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-xl text-olive-dark">Mis pacientes</h2>
            <p className="text-xs text-muted mt-0.5">Hola, {nombre}</p>
          </div>
          <button onClick={abrirNuevo} className="btn-primary text-sm flex items-center gap-2">
            <Plus size={14} />
            Nuevo paciente
          </button>
        </div>

        {/* Métricas */}
        {!loading && pacientes.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Pacientes activos', value: activos },
              { label: 'Sin actividad 48h', value: sinActiv, alert: sinActiv > 0 },
              { label: 'Total registrados', value: pacientes.length },
            ].map(m => (
              <div key={m.label} className="card-cream px-4 py-3.5">
                <div className="font-display text-2xl font-semibold text-olive-dark">{m.value}</div>
                <div className={`text-[10.5px] mt-0.5 font-display ${m.alert ? 'text-red-500' : 'text-muted'}`}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabla */}
        <div className="card overflow-hidden">
          {/* Búsqueda */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-cream-darker bg-cream">
            <Search size={14} className="text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre o mail..."
              className="flex-1 bg-transparent text-sm font-body text-olive-dark placeholder-muted/60 focus:outline-none"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-14 text-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="font-display text-sm">Cargando pacientes...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 px-5 py-4 text-red-500 text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {!loading && !error && pacientes.length === 0 && (
            <EmptyState
              icon={Users}
              title="Todavía no tenés pacientes"
              description="Creá tu primer paciente y le llegará un mail de invitación."
              action={
                <button onClick={abrirNuevo} className="btn-primary text-sm flex items-center gap-2">
                  <Plus size={14} />Crear primer paciente
                </button>
              }
            />
          )}

          {!loading && !error && pacientes.length > 0 && filtrados.length === 0 && (
            <EmptyState
              icon={Search}
              title="Sin resultados"
              description={`No encontramos pacientes con "${busqueda}".`}
            />
          )}

          {!loading && !error && filtrados.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Paciente', 'Actividad', 'Última vez', ''].map(h => (
                    <th key={h}
                      className="bg-white text-muted font-display text-[9.5px] uppercase
                                tracking-wide text-left px-5 py-2.5 border-b border-cream-dark">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <PatientRow
                    key={p.id}
                    paciente={p}
                    onEditar={abrirEdicion}
                    onDesactivar={pac => setConfirmDesact({ id: pac, nombre: p.nombre })}
                    onReactivar={pac => setConfirmReact({ id: pac, nombre: p.nombre })}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal alta/edición — el useEffect dentro de PatientForm maneja el pre-llenado */}
      <PatientForm
        open={modalAbierto}
        onClose={() => { setModalAbierto(false); setEditando(null) }}
        paciente={editando}
        onGuardar={handleGuardar}
      />

      {/* Confirm desactivar */}
      <ConfirmDialog
        open={!!confirmDesact}
        onClose={() => setConfirmDesact(null)}
        onConfirm={handleDesactivar}
        title="Desactivar paciente"
        message={`¿Desactivás a ${confirmDesact?.nombre}? No podrá ingresar a la app hasta que lo reactives.`}
        confirmLabel="Desactivar"
        variant="danger"
        loading={procesando}
      />

      {/* Confirm reactivar */}
      <ConfirmDialog
        open={!!confirmReact}
        onClose={() => setConfirmReact(null)}
        onConfirm={handleReactivar}
        title="Reactivar paciente"
        message={`¿Reactivás a ${confirmReact?.nombre}? Podrá volver a ingresar con su cuenta.`}
        confirmLabel="Reactivar"
        variant="default"
        loading={procesando}
      />

      {/* Modal de datos clínicos — aparece opcionalmente al crear un paciente */}
      <DatosClinicos
        open={modalClinicos}
        onClose={() => { setModalClinicos(false); setPacienteCreado(null) }}
        pacienteId={pacienteCreado?.id}
        nombrePaciente={pacienteCreado?.nombre}
        datosIniciales={null}
        onGuardado={() => {
          setModalClinicos(false)
          setPacienteCreado(null)
          toast.success('Datos clínicos guardados correctamente.')
        }}
      />
    </div>
  )
}
