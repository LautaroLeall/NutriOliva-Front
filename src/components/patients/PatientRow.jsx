import { useNavigate } from 'react-router-dom'
import { AlertCircle, Clock, ChevronRight, Pencil, UserX, UserCheck } from 'lucide-react'

/**
 * Fila individual de la tabla de pacientes.
 */
export default function PatientRow({ paciente, onEditar, onDesactivar, onReactivar }) {
  const navigate = useNavigate()

  function initials(nombre) {
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
  }

  function formatFecha(fecha) {
    if (!fecha) return 'Sin actividad'
    const diff = (new Date() - new Date(fecha)) / (1000 * 60 * 60)
    if (diff < 1)   return 'Hace menos de 1h'
    if (diff < 24)  return `Hace ${Math.floor(diff)}h`
    if (diff < 48)  return 'Ayer'
    return `Hace ${Math.floor(diff / 24)} días`
  }

  const activo = paciente.estado === 'activo'

  return (
    <tr
      className={`border-b border-cream last:border-0 transition-colors
                  ${activo ? 'hover:bg-cream/50 cursor-pointer' : 'opacity-60'}`}
      onClick={() => activo && navigate(`/panel/pacientes/${paciente.id}`)}
    >
      {/* Paciente */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="avatar">{initials(paciente.nombre)}</span>
          <div>
            <div className="font-semibold text-olive-dark text-[12.5px] leading-tight">
              {paciente.nombre}
            </div>
            <div className="text-[10.5px] text-muted mt-0.5">{paciente.email}</div>
          </div>
        </div>
      </td>

      {/* Estado de actividad */}
      <td className="px-5 py-3.5">
        {!activo ? (
          <span className="badge bg-cream-darker text-muted">Inactivo</span>
        ) : paciente.sinActividad48h ? (
          <div className="flex items-center gap-1.5 text-danger">
            <AlertCircle size={12} />
            <span className="text-[11px] font-medium">Sin actividad</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-success">
            <Clock size={12} />
            <span className="text-[11px] font-medium">Al día</span>
          </div>
        )}
      </td>

      {/* Última actividad */}
      <td className="px-5 py-3.5 text-[11px] text-muted">
        {formatFecha(paciente.ultimaActividad)}
      </td>

      {/* Acciones */}
      <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => onEditar(paciente)}
            className="p-1.5 rounded-lg text-muted hover:text-olive hover:bg-cream transition-colors"
            title="Editar"
          >
            <Pencil size={13} />
          </button>

          {activo ? (
            <button
              onClick={() => onDesactivar(paciente.id)}
              className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-accent-bg transition-colors"
              title="Desactivar"
            >
              <UserX size={13} />
            </button>
          ) : (
            <button
              onClick={() => onReactivar(paciente.id)}
              className="p-1.5 rounded-lg text-muted hover:text-success hover:bg-cream transition-colors"
              title="Reactivar"
            >
              <UserCheck size={13} />
            </button>
          )}

          {activo && (
            <button
              onClick={() => navigate(`/panel/pacientes/${paciente.id}`)}
              className="p-1.5 rounded-lg text-muted hover:text-olive hover:bg-cream transition-colors"
              title="Ver ficha"
            >
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
