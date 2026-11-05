// PatientHeader.jsx — Header de la ficha del paciente con animaciones
// Avatar spring, badges AnimatePresence, botones spring hover/tap

import { motion, AnimatePresence } from "framer-motion";
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
import { buildEmailUrl, buildWhatsAppUrl } from "@/utils/contactLinks";
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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="card p-6 mb-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* ── Avatar + Info ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.14,
              type: "spring",
              stiffness: 280,
              damping: 22,
            }}
            className="w-14 h-14 rounded-full bg-olive flex items-center justify-center
                        font-display font-bold text-lg text-cream flex-shrink-0 shadow-md"
          >
            {initials(paciente.nombre)}
          </motion.div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-semibold text-lg text-olive-dark">
                {paciente.nombre}
              </h1>

              <AnimatePresence>
                {!activo && (
                  <motion.span
                    key="inactivo"
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.2 }}
                    className="badge bg-cream-darker text-muted text-[9px]"
                  >
                    Inactivo
                  </motion.span>
                )}
                {!datosClinicos && (
                  <motion.span
                    key="sin-datos"
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1 text-[9px] bg-amber-100 text-amber-700
                                px-2 py-0.5 rounded-full font-display"
                  >
                    Sin datos clinicos
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              {paciente.email && (
                <a
                  href={buildEmailUrl(
                    paciente.email,
                    `Seguimiento nutricional — NutriOliva`,
                    `Hola ${paciente.nombre}, te escribo desde NutriOliva:`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Enviar correo al paciente en nueva pestaña"
                  className="flex items-center gap-1.5 text-[11px] text-muted hover:text-olive transition-colors"
                >
                  <Mail size={11} /> {paciente.email}
                </a>
              )}
              {paciente.telefono && (
                <a
                  href={buildWhatsAppUrl(
                    paciente.telefono,
                    `Hola ${paciente.nombre}! Te escribo desde el consultorio en NutriOliva.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir WhatsApp del paciente en nueva pestaña"
                  className="flex items-center gap-1.5 text-[11px] text-muted hover:text-olive transition-colors"
                >
                  <Phone size={11} /> {paciente.telefono}
                </a>
              )}
              {paciente.fecha_nacimiento && (
                <span className="flex items-center gap-1.5 text-[11px] text-muted">
                  <Calendar size={11} />
                  {formatFecha(paciente.fecha_nacimiento)}
                  {calcularEdad(paciente.fecha_nacimiento) !== null &&
                    ` · ${calcularEdad(paciente.fecha_nacimiento)} anos`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Botones de accion ──────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap sm:justify-end shrink-0">
          <motion.button
            onClick={() => navigate(`/panel/pacientes/${id}/plan`)}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 6px 20px rgba(110,122,75,0.3)",
            }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <ClipboardList size={12} />
            Ver plan
          </motion.button>

          <motion.button
            onClick={() => setEditandoClinicos(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            className={`text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg border transition-colors font-display
                        ${!datosClinicos
                ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                : "btn-ghost"
              }`}
          >
            <HeartPulse size={12} />
            {datosClinicos ? "Actualizar clinica" : "Cargar datos clinicos"}
          </motion.button>

          <motion.button
            onClick={() => setEditando(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <Pencil size={12} />
            Editar
          </motion.button>

          {activo ? (
            <motion.button
              onClick={async () => {
                await desactivarPaciente(id);
                fetchPaciente();
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <UserX size={12} />
              Desactivar
            </motion.button>
          ) : (
            <motion.button
              onClick={async () => {
                await reactivarPaciente(id);
                fetchPaciente();
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <UserCheck size={12} />
              Reactivar
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
