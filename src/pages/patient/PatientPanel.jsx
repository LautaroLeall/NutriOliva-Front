// PatientPanel.jsx — Panel principal del paciente (/mi-plan) con animaciones

import { Toaster } from "sonner";
import {
  Plus,
  LogOut,
  PhoneCall,
  Mail,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  User,
  Lock,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import FoodForm from "@/components/patient/FoodForm";
import ActivityForm from "@/components/patient/ActivityForm";
import { usePatientPanel } from "./panel/usePatientPanel";
import AddMenu from "./panel/AddMenu";
import TabHoy from "./panel/TabHoy";
import TabPlan from "./panel/TabPlan";
import TabTendencia from "./panel/TabTendencia";
import TabCuenta from "./panel/TabCuenta";

const TABS = [
  { key: "hoy", label: "Mi dia", icon: CalendarDays },
  { key: "plan", label: "Mi plan", icon: ClipboardList },
  { key: "tendencia", label: "Tendencia", icon: TrendingUp },
  { key: "cuenta", label: "Mi cuenta", icon: User },
];

// ── Pantalla de cuenta desactivada ────────────────────────────────────────────
function CuentaDesactivada({ nombre, nutricionistaInfo, signOut }) {
  return (
    <div className="min-h-screen bg-[#EFEAE0] flex flex-col">
      <Toaster position="top-center" richColors />

      <motion.nav
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex justify-between items-center px-5 py-3.5 bg-white border-b border-cream-darker shadow-sm"
      >
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={20} />
          NutriOliva
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted font-display">{nombre}</span>
          <motion.button
            onClick={signOut}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cerrar sesion"
            className="text-muted hover:text-olive-dark transition-colors p-1 rounded-lg hover:bg-cream"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </motion.nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 20,
              delay: 0.1,
            }}
            className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center mx-auto mb-6"
          >
            <Lock size={32} className="text-amber-600" strokeWidth={1.75} />
          </motion.div>

          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-xl text-olive-dark mb-2">
              Cuenta pausada
            </h1>
            <p className="text-sm text-muted font-body leading-relaxed">
              Tu nutricionista
              {nutricionistaInfo?.nombre
                ? ` (${nutricionistaInfo.nombre})`
                : ""}{" "}
              ha pausado temporalmente el acceso a tu cuenta. Esto suele ocurrir
              al finalizar un tratamiento o durante una transicion de plan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-cream-darker p-5 space-y-3 shadow-card">
            <p className="text-[11px] font-display font-semibold text-olive-dark uppercase tracking-wide">
              Que podes hacer
            </p>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <PhoneCall size={14} className="text-olive" />
              </div>
              <div>
                <p className="text-[12.5px] font-display font-semibold text-olive-dark">
                  Comunicate con tu nutricionista
                </p>
                <p className="text-[11px] text-muted mt-0.5 leading-snug">
                  Escribile o llamale para consultar el motivo o coordinar tu
                  proximo seguimiento.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail size={14} className="text-olive" />
              </div>
              <div>
                <p className="text-[12.5px] font-display font-semibold text-olive-dark">
                  Solicita la reactivacion
                </p>
                <p className="text-[11px] text-muted mt-0.5 leading-snug">
                  Una vez que tu nutricionista reactive tu cuenta, podras volver
                  a registrar y ver tu progreso.
                </p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={signOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full mt-4 py-2.5 rounded-xl border border-cream-darker bg-white text-muted
                        font-display text-[12px] hover:text-olive-dark hover:border-olive/40
                        transition-colors"
          >
            Cerrar sesion
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Pantalla de carga ─────────────────────────────────────────────────────────
function Cargando() {
  return (
    <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={26} className="text-olive/70" />
        </motion.div>
        <p className="text-[12px] font-display text-muted">
          Cargando tu cuenta...
        </p>
      </motion.div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PatientPanel() {
  const {
    session,
    nombre,
    signOut,
    fecha,
    setFecha,
    pacienteId,
    pacienteInfo,
    nutricionistaInfo,
    datosClinicos,
    planActivo,
    loadingInf,
    cuentaDesactivada,
    fabAbierto,
    setFabAbierto,
    modalComida,
    setModalComida,
    modalActiv,
    setModalActiv,
    tab,
    setTab,
    puntosSemanales,
    loadingTendencia,
    comidas,
    actividades,
    loadingReg,
    balance,
    comidasPlan,
    handleGuardarComida,
    handleGuardarActividad,
    handleEliminarComida,
    handleEliminarActividad,
    handleEditarComida,
    handleCambiarPassword,
  } = usePatientPanel();

  if (loadingInf) return <Cargando />;
  if (cuentaDesactivada)
    return (
      <CuentaDesactivada
        nombre={nombre}
        nutricionistaInfo={nutricionistaInfo}
        signOut={signOut}
      />
    );

  return (
    <main className="min-h-screen bg-[#EFEAE0] pb-32">
      <Toaster position="top-center" richColors />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex justify-between items-center px-5 py-3.5 bg-white border-b border-cream-darker sticky top-0 z-30 shadow-sm"
      >
        <button
          type="button"
          onClick={() => setTab("hoy")}
          className="flex items-center gap-2 font-display font-bold text-base text-olive-dark cursor-pointer"
        >
          <Logo size={20} />
          NutriOliva
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("cuenta")}
            title="Ver mi cuenta y datos clinicos"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-display text-[11.5px] transition-colors cursor-pointer ${tab === "cuenta"
              ? "bg-olive text-cream font-semibold"
              : "text-muted hover:text-olive-dark hover:bg-cream"
              }`}
          >
            <User size={13} />
            <span className="max-w-[130px] truncate">{nombre}</span>
          </button>
          <motion.button
            onClick={signOut}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cerrar sesion"
            title="Cerrar sesion"
            className="text-muted hover:text-olive-dark transition-colors p-1.5 rounded-lg hover:bg-cream"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </motion.nav>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Tabs con layoutId deslizable */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-1 bg-cream rounded-xl p-1 mb-5 border border-cream-darker"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={active}
                className={`relative flex-1 py-2 px-1 rounded-lg font-display text-[11.5px] sm:text-[12px] font-medium
                            flex items-center justify-center gap-1 transition-colors min-w-0
                            ${active ? "text-olive-dark font-semibold" : "text-muted hover:text-olive-dark"}`}
              >
                {active && (
                  <motion.div
                    layoutId="patient-tab-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  />
                )}
                <motion.span
                  animate={{
                    scale: active ? 1.12 : 1,
                    color: active ? "#6E7A4B" : "#9B9484",
                  }}
                  transition={{ duration: 0.18 }}
                  className="relative z-10 flex-shrink-0"
                >
                  <Icon size={13} />
                </motion.span>
                <span className="relative z-10 truncate">{t.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Contenido de cada pestaña con AnimatePresence */}
        <AnimatePresence mode="wait">
          {tab === "hoy" && (
            <motion.div
              key="hoy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabHoy
                balance={balance}
                caloriasObjetivo={planActivo?.calorias_objetivo || 2000}
                loadingInf={loadingInf}
                loadingReg={loadingReg}
                fecha={fecha}
                setFecha={setFecha}
                comidas={comidas}
                actividades={actividades}
                comidasPlan={comidasPlan}
                pacienteId={pacienteId}
                handleEliminarComida={handleEliminarComida}
                handleEliminarActividad={handleEliminarActividad}
                handleEditarComida={handleEditarComida}
              />
            </motion.div>
          )}

          {tab === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabPlan
                loadingInf={loadingInf}
                planActivo={planActivo}
                comidasPlan={comidasPlan}
              />
            </motion.div>
          )}

          {tab === "tendencia" && (
            <motion.div
              key="tendencia"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabTendencia
                puntosSemanales={puntosSemanales}
                loadingTendencia={loadingTendencia}
                caloriasObjetivo={planActivo?.calorias_objetivo || 0}
              />
            </motion.div>
          )}

          {tab === "cuenta" && (
            <motion.div
              key="cuenta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabCuenta
                nombre={nombre}
                session={session}
                pacienteInfo={pacienteInfo}
                nutricionistaInfo={nutricionistaInfo}
                datosClinicos={datosClinicos}
                planActivo={planActivo}
                handleCambiarPassword={handleCambiarPassword}
                signOut={signOut}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu del FAB animado */}
      <AnimatePresence>
        {fabAbierto && (
          <AddMenu
            key="add-menu"
            onComida={() => setModalComida(true)}
            onActividad={() => setModalActiv(true)}
            onClose={() => setFabAbierto(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB — solo en tab Hoy */}
      <AnimatePresence>
        {tab === "hoy" && (
          <motion.button
            key="fab-btn"
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              backgroundColor: fabAbierto ? "#E8E2D5" : "#6E7A4B",
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 28px rgba(63,74,43,0.32)",
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={() => setFabAbierto((o) => !o)}
            aria-label={fabAbierto ? "Cerrar menu" : "Agregar registro"}
            aria-expanded={fabAbierto}
            className="fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full shadow-modal
                        flex items-center justify-center cursor-pointer"
          >
            <motion.span
              animate={{
                rotate: fabAbierto ? 135 : 0,
                color: fabAbierto ? "#6E7A4B" : "#F6F1E7",
              }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
            >
              <Plus size={22} aria-hidden="true" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modales */}
      <FoodForm
        open={modalComida}
        onClose={() => setModalComida(false)}
        onGuardar={handleGuardarComida}
        comidasPlan={planActivo?.comidas_plan || []}
        pacienteId={pacienteId}
      />
      <ActivityForm
        open={modalActiv}
        onClose={() => setModalActiv(false)}
        onGuardar={handleGuardarActividad}
        pacienteId={pacienteId}
      />
    </main>
  );
}
