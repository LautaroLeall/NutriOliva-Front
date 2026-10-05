// NutriPanel.jsx — Panel principal del nutricionista

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  LogOut,
  Plus,
  Search,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import CountUp from "react-countup";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAuth } from "@/hooks/useAuth";
import { usePatients } from "@/hooks/usePatients";
import Logo from "@/components/ui/Logo";
import EmptyState from "@/components/ui/EmptyState";
import PatientRow from "@/components/patients/PatientRow";
import PatientForm from "@/components/patients/PatientForm";
import DatosClinicos from "@/components/nutri/DatosClinicos";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// ── Card 3D tilt con Framer Motion ────────────────────────────────────────
function MetricCard({ label, value, alert, delay, icon: Icon }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouse(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden card-cream px-5 py-4 cursor-default select-none
                  shadow-sm hover:shadow-card transition-shadow duration-300
                  ${alert ? "border border-accent/20" : "border border-transparent"}`}
    >
      {/* Brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-card" />

      {/* Numero con countup */}
      <div
        className={`font-display text-3xl font-bold leading-none
                      ${alert ? "text-accent" : "text-olive-dark"}`}
      >
        <CountUp end={value} duration={1.4} delay={delay} />
      </div>

      {/* Label */}
      <div
        className={`text-[11px] mt-1.5 font-display tracking-wide
                      ${alert ? "text-accent/80" : "text-muted"}`}
      >
        {label}
      </div>

      {/* Indicador de alerta */}
      {alert && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent"
        />
      )}
    </motion.div>
  );
}

// ── Skeleton de tabla ──────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="divide-y divide-cream">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-4">
          <div className="w-8 h-8 rounded-full bg-cream-darker animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-cream-darker rounded-full w-36 animate-pulse" />
            <div className="h-2 bg-cream-darker rounded-full w-24 animate-pulse" />
          </div>
          <div className="h-2.5 bg-cream-darker rounded-full w-14 animate-pulse" />
          <div className="h-2 bg-cream-darker rounded-full w-16 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function NutriPanel() {
  const navigate = useNavigate();
  const { nombre, signOut } = useAuth();
  const {
    pacientes,
    loading,
    error,
    crearPaciente,
    actualizarPaciente,
    desactivarPaciente,
    reactivarPaciente,
  } = usePatients();

  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDesact, setConfirmDesact] = useState(null);
  const [confirmReact, setConfirmReact] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [pacienteCreado, setPacienteCreado] = useState(null);
  const [modalClinicos, setModalClinicos] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // auto-animate: stagger automatico en el tbody
  const [tbodyRef] = useAutoAnimate({ duration: 180 });

  const filtrados = pacientes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.email.toLowerCase().includes(busqueda.toLowerCase()),
  );
  const activos = pacientes.filter((p) => p.estado === "activo").length;
  const sinActiv = pacientes.filter(
    (p) => p.sinActividad48h && p.estado === "activo",
  ).length;

  function abrirNuevo() {
    setEditando(null);
    setModalAbierto(true);
  }
  function abrirEdicion(paciente) {
    setEditando(paciente);
    setModalAbierto(true);
  }

  async function handleGuardar(datos) {
    if (editando) {
      const res = await actualizarPaciente(editando.id, datos);
      if (!res.error)
        toast.success(`${datos.nombre} actualizado correctamente.`);
      return res;
    }
    const res = await crearPaciente(datos);
    if (!res.error) {
      if (res.inviteError) {
        toast.warning(
          `${datos.nombre} creado, pero no se pudo enviar el mail de invitacion.`,
        );
      } else {
        toast.success(
          `Paciente ${datos.nombre} creado. Se envio el mail de invitacion.`,
        );
      }
      if (res.data?.id) {
        setPacienteCreado({ id: res.data.id, nombre: datos.nombre });
        setModalAbierto(false);
        setTimeout(() => setModalClinicos(true), 200);
      }
    }
    return res;
  }

  async function handleDesactivar() {
    if (!confirmDesact) return;
    setProcesando(true);
    const { error: e } = await desactivarPaciente(confirmDesact.id);
    setProcesando(false);
    if (e) toast.error("Error al desactivar.");
    else toast.success(`${confirmDesact.nombre} desactivado.`);
    setConfirmDesact(null);
  }

  async function handleReactivar() {
    if (!confirmReact) return;
    setProcesando(true);
    const { error: e } = await reactivarPaciente(confirmReact.id);
    setProcesando(false);
    if (e) toast.error("Error al reactivar.");
    else toast.success(`${confirmReact.nombre} reactivado.`);
    setConfirmReact(null);
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex justify-between items-center px-6 py-3.5 bg-white
                    border-b border-cream-darker shadow-sm"
      >
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={22} />
          NutriOliva
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-5 text-sm font-display text-muted">
            <span className="text-olive-dark font-semibold cursor-pointer">
              Pacientes
            </span>
            <span
              onClick={() => navigate("/panel/catalogo")}
              className="cursor-pointer hover:text-olive-dark transition-colors"
            >
              Catalogo
            </span>
            <span className="cursor-pointer hover:text-olive-dark transition-colors">
              Cuenta
            </span>
          </div>
          <motion.button
            onClick={signOut}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <LogOut size={12} />
            Salir
          </motion.button>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex justify-between items-start mb-6"
        >
          <div>
            <h2 className="font-display text-xl text-olive-dark font-bold">
              Mis pacientes
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-xs text-muted mt-0.5 flex items-center gap-1.5"
            >
              <Sparkles size={11} className="text-olive/60" />
              Hola, {nombre}
            </motion.p>
          </div>

          <motion.button
            onClick={abrirNuevo}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 24px rgba(110,122,75,0.35)",
            }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus size={14} />
            Nuevo paciente
          </motion.button>
        </motion.div>

        {/* ── Métricas con 3D tilt ────────────────────────────────────── */}
        <AnimatePresence>
          {!loading && pacientes.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <MetricCard
                label="Pacientes activos"
                value={activos}
                delay={0.15}
              />
              <MetricCard
                label="Sin actividad 48h"
                value={sinActiv}
                delay={0.25}
                alert={sinActiv > 0}
              />
              <MetricCard
                label="Total registrados"
                value={pacientes.length}
                delay={0.35}
              />
            </div>
          )}
        </AnimatePresence>

        {/* ── Tabla / Lista ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="card overflow-visible"
        >
          {/* Búsqueda animada */}
          <motion.div
            animate={{ backgroundColor: searchFocused ? "#F6F1E7" : "#F0EDE4" }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-cream-darker"
          >
            <motion.div
              animate={{
                scale: searchFocused ? 1.15 : 1,
                color: searchFocused ? "#6E7A4B" : "#69644D",
              }}
              transition={{ duration: 0.2 }}
            >
              <Search size={14} className="flex-shrink-0" />
            </motion.div>
            <input
              type="text"
              placeholder="Buscar por nombre o mail..."
              className="flex-1 bg-transparent text-sm font-body text-olive-dark placeholder-muted/60 focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <AnimatePresence>
              {busqueda && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setBusqueda("")}
                  className="text-muted hover:text-olive-dark transition-colors text-xs"
                >
                  Limpiar
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Skeleton de carga */}
          {loading && <TableSkeleton />}

          {/* Error */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-5 py-4 text-red-500 text-sm"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          {/* Empty state sin pacientes */}
          {!loading && !error && pacientes.length === 0 && (
            <EmptyState
              icon={Users}
              title="Todavia no tenes pacientes"
              description="Crea tu primer paciente y le llegara un mail de invitacion."
              action={
                <motion.button
                  onClick={abrirNuevo}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <Plus size={14} />
                  Crear primer paciente
                </motion.button>
              }
            />
          )}

          {/* Empty state sin resultados de busqueda */}
          {!loading &&
            !error &&
            pacientes.length > 0 &&
            filtrados.length === 0 && (
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description={`No encontramos pacientes con "${busqueda}".`}
              />
            )}

          {/* Tabla con stagger auto-animate */}
          {!loading && !error && filtrados.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Paciente", "Actividad", "Ultima vez", ""].map((h) => (
                    <th
                      key={h}
                      className="bg-white text-muted font-display text-[9.5px] uppercase
                                  tracking-wide text-left px-5 py-2.5 border-b border-cream-dark"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody ref={tbodyRef}>
                {filtrados.map((p) => (
                  <PatientRow
                    key={p.id}
                    paciente={p}
                    onEditar={abrirEdicion}
                    onDesactivar={(pac) =>
                      setConfirmDesact({ id: pac, nombre: p.nombre })
                    }
                    onReactivar={(pac) =>
                      setConfirmReact({ id: pac, nombre: p.nombre })
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* ── Modales ─────────────────────────────────────────────────────── */}
      <PatientForm
        open={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setEditando(null);
        }}
        paciente={editando}
        onGuardar={handleGuardar}
      />

      <ConfirmDialog
        open={!!confirmDesact}
        onClose={() => setConfirmDesact(null)}
        onConfirm={handleDesactivar}
        title="Desactivar paciente"
        message={`Desactivas a ${confirmDesact?.nombre}? No podra ingresar a la app hasta que lo reactives.`}
        confirmLabel="Desactivar"
        variant="danger"
        loading={procesando}
      />

      <ConfirmDialog
        open={!!confirmReact}
        onClose={() => setConfirmReact(null)}
        onConfirm={handleReactivar}
        title="Reactivar paciente"
        message={`Reactivas a ${confirmReact?.nombre}? Podra volver a ingresar con su cuenta.`}
        confirmLabel="Reactivar"
        variant="default"
        loading={procesando}
      />

      <DatosClinicos
        open={modalClinicos}
        onClose={() => {
          setModalClinicos(false);
          setPacienteCreado(null);
        }}
        pacienteId={pacienteCreado?.id}
        nombrePaciente={pacienteCreado?.nombre}
        datosIniciales={null}
        onGuardado={() => {
          setModalClinicos(false);
          setPacienteCreado(null);
          toast.success("Datos clinicos guardados correctamente.");
        }}
      />
    </div>
  );
}
