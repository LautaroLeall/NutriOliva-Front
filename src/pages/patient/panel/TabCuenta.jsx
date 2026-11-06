// TabCuenta.jsx — Pestaña "Mi cuenta" del paciente (/mi-plan)

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Stethoscope,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ChevronDown,
  Loader2,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";
import { buildEmailUrl } from "@/utils/contactLinks";
import TabCuentaClinica from "./TabCuentaClinica";

function obtenerIniciales(nombreStr) {
  if (!nombreStr) return "P";
  const partes = nombreStr.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function formatFecha(fechaStr) {
  if (!fechaStr) return "No especificada";
  const clean = fechaStr.includes("T") ? fechaStr.split("T")[0] : fechaStr;
  const parts = clean.split("-");
  if (parts.length !== 3) return fechaStr;
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const m = parseInt(parts[1], 10) - 1;
  return `${parseInt(parts[2], 10)} de ${meses[m] || parts[1]} de ${parts[0]}`;
}

export default function TabCuenta({
  nombre,
  session,
  pacienteInfo,
  nutricionistaInfo,
  datosClinicos,
  planActivo,
  handleCambiarPassword,
  signOut,
}) {
  const [passAbierto, setPassAbierto] = useState(false);
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [errorPass, setErrorPass] = useState("");
  const [guardandoPass, setGuardandoPass] = useState(false);

  const nombrePaciente = pacienteInfo?.nombre || nombre || "Paciente";
  const emailPaciente =
    pacienteInfo?.email || session?.user?.email || "Sin correo";
  const telefonoPaciente = pacienteInfo?.telefono || null;
  const fechaNac = pacienteInfo?.fecha_nacimiento || null;
  const fechaAlta = pacienteInfo?.created_at || null;

  const nombreNutri = nutricionistaInfo?.nombre || "Profesional asignado";
  const emailNutri = nutricionistaInfo?.email || null;

  async function onSubmitPassword(e) {
    e.preventDefault();
    setErrorPass("");
    if (nuevaPass.length < 6) {
      setErrorPass("La contrasena debe tener al menos 6 caracteres.");
      return;
    }
    if (nuevaPass !== confirmarPass) {
      setErrorPass("Las contrasenas no coinciden.");
      return;
    }
    setGuardandoPass(true);
    const { error } = await handleCambiarPassword(nuevaPass);
    setGuardandoPass(false);
    if (!error) {
      setNuevaPass("");
      setConfirmarPass("");
      setPassAbierto(false);
    } else {
      setErrorPass(error);
    }
  }

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Ficha Personal del Paciente (diseño limpio y natural sin mini-cards) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="bg-white rounded-2xl border border-cream-darker overflow-hidden shadow-card"
      >
        <div className="bg-olive-dark px-5 py-4 text-cream flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-cream text-olive-dark flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
            {obtenerIniciales(nombrePaciente)}
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-[16px] text-cream truncate">
              {nombrePaciente}
            </h2>
            <p className="text-[12px] text-cream/75 truncate">
              {emailPaciente}
            </p>
          </div>
        </div>

        {/* Lista natural de datos personales separada por lineas sutiles */}
        <dl className="px-5 py-2 divide-y divide-cream text-[12.5px]">
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="font-display text-muted">Correo electronico</dt>
            <dd className="font-body font-medium text-olive-dark truncate">
              {emailPaciente}
            </dd>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="font-display text-muted">Telefono</dt>
            <dd className="font-body font-medium text-olive-dark truncate">
              {telefonoPaciente || "No registrado"}
            </dd>
          </div>

          {fechaNac && (
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-display text-muted">Fecha de nacimiento</dt>
              <dd className="font-body font-medium text-olive-dark truncate">
                {formatFecha(fechaNac)}
              </dd>
            </div>
          )}

          {fechaAlta && (
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-display text-muted">En seguimiento desde</dt>
              <dd className="font-body font-medium text-olive-dark truncate">
                {formatFecha(fechaAlta)}
              </dd>
            </div>
          )}
        </dl>
      </motion.div>

      {/* 2. Profesional a Cargo (Nutricionista que lo atiende) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.05 }}
        className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive flex-shrink-0">
              <Stethoscope size={17} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-[14px] text-olive-dark truncate">
                Nutricionista a cargo
              </h3>
              <p className="text-[11px] text-muted truncate">
                Profesional responsable de tu plan y seguimiento
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold bg-olive/10 text-olive px-2.5 py-1 rounded-full whitespace-nowrap">
            <ClipboardCheck size={11} />
            Seguimiento
          </span>
        </div>

        <div className="pt-2 border-t border-cream flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-olive text-cream font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
              {obtenerIniciales(nombreNutri)}
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[13.5px] text-olive-dark truncate">
                Lic. {nombreNutri}
              </p>
              <p className="text-[11.5px] text-muted truncate">
                {emailNutri || "Nutricion clinica y deportiva"}
              </p>
            </div>
          </div>

          {emailNutri && (
            <a
              href={buildEmailUrl(
                emailNutri,
                `Consulta de ${nombrePaciente} — NutriOliva`,
                `Hola Lic. ${nombreNutri}, te escribo desde mi cuenta de NutriOliva:`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-olive text-cream font-display font-semibold text-[11.5px] hover:bg-olive-dark transition-colors whitespace-nowrap flex-shrink-0 shadow-sm"
            >
              <Mail size={13} />
              <span>Contactar por correo</span>
              <ExternalLink size={11} className="opacity-80" />
            </a>
          )}
        </div>
      </motion.div>

      {/* 3. Seccion de Datos Clinicos y Antropometria cargados por el nutricionista */}
      <TabCuentaClinica datosClinicos={datosClinicos} planActivo={planActivo} />

      {/* 4. Seguridad de la cuenta y Cerrar sesion */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.15 }}
        className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card space-y-3"
      >
        <button
          type="button"
          onClick={() => {
            setPassAbierto((o) => !o);
            setErrorPass("");
          }}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive flex-shrink-0">
              <ShieldCheck size={17} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-[14px] text-olive-dark truncate">
                Seguridad y acceso
              </h3>
              <p className="text-[11px] text-muted truncate">
                Actualiza tu contrasena o cierra tu sesion actual
              </p>
            </div>
          </div>
          <motion.span
            animate={{ rotate: passAbierto ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted flex-shrink-0"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {passAbierto && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onSubmit={onSubmitPassword}
              className="overflow-hidden pt-2 space-y-3 border-t border-cream-darker"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="relative">
                  <KeyRound
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                  <input
                    type={verPass ? "text" : "password"}
                    value={nuevaPass}
                    onChange={(e) => setNuevaPass(e.target.value)}
                    placeholder="Nueva contrasena (min. 6)"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-cream-darker bg-cream/40 text-[12.5px] text-olive-dark placeholder:text-muted/70 focus:outline-none focus:border-olive transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setVerPass((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-olive-dark p-1"
                  >
                    {verPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <div className="relative">
                  <KeyRound
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                  <input
                    type={verPass ? "text" : "password"}
                    value={confirmarPass}
                    onChange={(e) => setConfirmarPass(e.target.value)}
                    placeholder="Confirmar contrasena"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-darker bg-cream/40 text-[12.5px] text-olive-dark placeholder:text-muted/70 focus:outline-none focus:border-olive transition-colors"
                  />
                </div>
              </div>

              {errorPass && (
                <p className="text-[11.5px] font-display text-red-600">
                  {errorPass}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={guardandoPass}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-olive text-cream font-display font-semibold text-[12px] hover:bg-olive-dark transition-colors disabled:opacity-60"
                >
                  {guardandoPass && (
                    <Loader2 size={13} className="animate-spin" />
                  )}
                  Guardar nueva contrasena
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="pt-2 border-t border-cream-darker flex items-center justify-between gap-3">
          <span className="text-[11.5px] text-muted truncate">
            Sesion iniciada como{" "}
            <strong className="text-olive-dark font-medium">
              {emailPaciente}
            </strong>
          </span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-darker text-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50/40 font-display font-medium text-[11.5px] transition-colors flex-shrink-0"
          >
            <LogOut size={13} />
            Cerrar sesion
          </button>
        </div>
      </motion.div>
    </div>
  );
}
