import { Toaster } from "sonner";
import { Plus, X, LogOut, PhoneCall, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import FoodForm from "@/components/patient/FoodForm";
import ActivityForm from "@/components/patient/ActivityForm";
import { usePatientPanel } from "./panel/usePatientPanel";
import AddMenu from "./panel/AddMenu";
import TabHoy from "./panel/TabHoy";
import TabPlan from "./panel/TabPlan";
import TabTendencia from "./panel/TabTendencia";

// ── Pantalla de cuenta desactivada ────────────────────────────────────────────
function CuentaDesactivada({ nombre, signOut }) {
  return (
    <div className="min-h-screen bg-[#EFEAE0] flex flex-col">
      <Toaster position="top-center" richColors />

      {/* Navbar minimo */}
      <nav className="flex justify-between items-center px-5 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={20} />
          NutriOliva
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted font-display">{nombre}</span>
          <button
            onClick={signOut}
            aria-label="Cerrar sesion"
            className="text-muted hover:text-olive-dark transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Contenido central */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Icono decorativo */}
          <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center mx-auto mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-9 h-9 text-amber-500"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          {/* Mensaje principal */}
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-xl text-olive-dark mb-2">
              Cuenta pausada
            </h1>
            <p className="text-sm text-muted font-body leading-relaxed">
              Tu nutricionista ha pausado temporalmente el acceso a tu cuenta.
              Esto suele ocurrir al finalizar un tratamiento o durante una
              transicion de plan.
            </p>
          </div>

          {/* Card de contacto */}
          <div className="bg-white rounded-2xl border border-cream-darker p-5 space-y-3 shadow-sm">
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

          {/* Boton cerrar sesion */}
          <button
            onClick={signOut}
            className="w-full mt-4 py-2.5 rounded-xl border-2 border-cream-darker text-muted
                       font-display text-[12px] hover:text-olive-dark hover:border-olive/40
                       transition-all"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pantalla de carga ─────────────────────────────────────────────────────────
function Cargando() {
  return (
    <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-olive/30 border-t-olive animate-spin" />
        <p className="text-[12px] font-display text-muted">
          Cargando tu cuenta...
        </p>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PatientPanel() {
  const {
    nombre,
    signOut,
    fecha,
    setFecha,
    pacienteId,
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
  } = usePatientPanel();

  // Estados tempranos — antes de renderizar el panel completo
  if (loadingInf) return <Cargando />;
  if (cuentaDesactivada)
    return <CuentaDesactivada nombre={nombre} signOut={signOut} />;

  return (
    <main className="min-h-screen bg-[#EFEAE0] pb-32">
      <Toaster position="top-center" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-5 py-3.5 bg-white border-b border-cream-darker sticky top-0 z-30">
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={20} />
          NutriOliva
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted font-display">{nombre}</span>
          <button
            onClick={signOut}
            aria-label="Cerrar sesion"
            className="text-muted hover:text-olive-dark transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-cream rounded-xl p-1 mb-5 border border-cream-darker">
          {[
            { key: "hoy", label: "Mi dia" },
            { key: "plan", label: "Mi plan" },
            { key: "tendencia", label: "Tendencia" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={`flex-1 py-2 rounded-lg font-display text-[12.5px] font-medium transition-all
                          ${
                            tab === t.key
                              ? "bg-white text-olive-dark shadow-sm"
                              : "text-muted hover:text-olive-dark"
                          }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: Mi dia */}
        {tab === "hoy" && (
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
        )}

        {/* TAB: Mi plan */}
        {tab === "plan" && (
          <TabPlan
            loadingInf={loadingInf}
            planActivo={planActivo}
            comidasPlan={comidasPlan}
          />
        )}

        {/* TAB: Tendencia */}
        {tab === "tendencia" && (
          <TabTendencia
            puntosSemanales={puntosSemanales}
            loadingTendencia={loadingTendencia}
            caloriasObjetivo={planActivo?.calorias_objetivo || 0}
          />
        )}
      </div>

      {/* FAB y overlay */}
      {fabAbierto && (
        <AddMenu
          onComida={() => setModalComida(true)}
          onActividad={() => setModalActiv(true)}
          onClose={() => setFabAbierto(false)}
        />
      )}

      {/* FAB — solo en tab Hoy */}
      {tab === "hoy" && (
        <button
          onClick={() => setFabAbierto((o) => !o)}
          aria-label={fabAbierto ? "Cerrar menu" : "Agregar registro"}
          aria-expanded={fabAbierto}
          className={`fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full shadow-modal
                      flex items-center justify-center transition-all duration-200
                      ${fabAbierto ? "bg-cream-dark" : "bg-olive hover:bg-olive-deep"}`}
        >
          {fabAbierto ? (
            <X size={20} className="text-muted" aria-hidden="true" />
          ) : (
            <Plus size={22} className="text-cream" aria-hidden="true" />
          )}
        </button>
      )}

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
