import {
  Mail,
  Phone,
  Calendar,
  ClipboardList,
  HeartPulse,
  Pencil,
  UserX,
  UserCheck,
} from "lucide-react";
import { formatFecha, calcularEdad, initials } from "./patientDetailUtils";

export default function PatientHeader({
  paciente,
  activo,
  datosClinicos,
  id,
  navigate,
  setEditando,
  setEditandoClinicos,
  desactivarPaciente,
  reactivarPaciente,
  fetchPaciente,
}) {
  return (
    <div className="card p-6 mb-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full bg-olive flex items-center justify-center
                          font-display font-bold text-lg text-cream flex-shrink-0"
          >
            {initials(paciente.nombre)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-semibold text-lg text-olive-dark">
                {paciente.nombre}
              </h1>
              {!activo && (
                <span className="badge bg-cream-darker text-muted text-[9px]">
                  Inactivo
                </span>
              )}
              {!datosClinicos && (
                <span
                  className="flex items-center gap-1 text-[9px] bg-amber-100 text-amber-700
                                  px-2 py-0.5 rounded-full font-display"
                >
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
                        ${
                          !datosClinicos
                            ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                            : "btn-ghost"
                        }`}
          >
            <HeartPulse size={12} />
            {datosClinicos ? "Actualizar clínica" : "Cargar datos clínicos"}
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
                await desactivarPaciente(id);
                fetchPaciente();
              }}
              className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <UserX size={12} />
              Desactivar
            </button>
          ) : (
            <button
              onClick={async () => {
                await reactivarPaciente(id);
                fetchPaciente();
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
  );
}
