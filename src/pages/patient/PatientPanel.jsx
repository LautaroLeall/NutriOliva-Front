import { useState, useEffect } from "react";
import {
  LogOut,
  Plus,
  Flame,
  Dumbbell,
  ClipboardList,
  X,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useRegistros } from "@/hooks/useRegistros";
import { useBalance } from "@/hooks/useBalance";
import { useWeeklyBalance } from "@/hooks/useWeeklyBalance";
import Logo from "@/components/ui/Logo";
import DayCalendar from "@/components/patient/DayCalendar";
import Timeline from "@/components/patient/Timeline";
import FoodForm from "@/components/patient/FoodForm";
import ActivityForm from "@/components/patient/ActivityForm";
import WeeklyCaloriesChart from "@/components/ui/WeeklyCaloriesChart";

// ── Helper fecha local ────────────────────────────────────────────────────────
function toLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatFechaLegible(iso) {
  const hoy = toLocalISO(new Date());
  const ayer = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toLocalISO(d);
  })();
  if (iso === hoy) return "Hoy";
  if (iso === ayer) return "Ayer";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ── Balance card ──────────────────────────────────────────────────────────────
function BalanceCard({ balance, caloriasObjetivo, loading }) {
  const { consumidas, gastadas, netas, restante, pct, barColor, estaEnExceso } =
    balance;

  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-5 mb-4">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={18} className="animate-spin text-muted" />
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
                Balance del día
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-display font-bold text-3xl
                                  ${estaEnExceso ? "text-red-500" : "text-olive-dark"}`}
                >
                  {netas}
                </span>
                <span className="text-muted text-sm">
                  / {caloriasObjetivo} kcal
                </span>
              </div>
            </div>

            {/* Pills de desglose */}
            <div className="flex flex-col gap-1 items-end">
              <span className="flex items-center gap-1 text-[10.5px] font-display text-olive">
                <Flame size={11} /> +{consumidas} consumidas
              </span>
              <span className="flex items-center gap-1 text-[10.5px] font-display text-blue-400">
                <Dumbbell size={11} /> -{gastadas} gastadas
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>

          <div className="flex justify-between mt-1.5">
            <span className="text-[9.5px] text-muted">{pct}% del objetivo</span>
            <span
              className={`text-[9.5px] font-display font-medium
                              ${estaEnExceso ? "text-red-500" : "text-muted"}`}
            >
              {estaEnExceso
                ? `+${Math.abs(restante)} kcal sobre el objetivo`
                : `${restante} kcal restantes`}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Selector de qué registrar (FAB expandido) ─────────────────────────────────
function AddMenu({ onComida, onActividad, onClose }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-end pb-24 px-5"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-2 items-end"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onActividad();
            onClose();
          }}
          className="flex items-center gap-3 bg-white border border-cream-darker rounded-2xl
                    px-5 py-3 shadow-modal font-display text-[13px] text-olive-dark
                  hover:bg-cream transition-colors animate-fade-scale"
        >
          Actividad física
          <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Dumbbell size={14} className="text-blue-400" />
          </span>
        </button>
        <button
          onClick={() => {
            onComida();
            onClose();
          }}
          className="flex items-center gap-3 bg-white border border-cream-darker rounded-2xl
                    px-5 py-3 shadow-modal font-display text-[13px] text-olive-dark
                  hover:bg-cream transition-colors animate-fade-scale"
        >
          Lo que comí
          <span className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center">
            <Flame size={14} className="text-olive" />
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Panel principal ───────────────────────────────────────────────────────────
export default function PatientPanel() {
  const { session, nombre, signOut } = useAuth();
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(toLocalISO(new Date()));
  const [pacienteId, setPacienteId] = useState(null);
  const [planActivo, setPlanActivo] = useState(null);
  const [loadingInf, setLoadingInf] = useState(true);
  const [fabAbierto, setFabAbierto] = useState(false);
  const [modalComida, setModalComida] = useState(false);
  const [modalActiv, setModalActiv] = useState(false);
  const [tab, setTab] = useState("hoy"); // 'hoy' | 'plan' | 'tendencia'

  // Hook de tendencia semanal — solo activo cuando el paciente ya está cargado
  const { puntos: puntosSemanales, loading: loadingTendencia } =
    useWeeklyBalance(pacienteId, planActivo?.calorias_objetivo || 0);

  // Cargar info del paciente y su plan activo
  useEffect(() => {
    async function cargarPaciente() {
      if (!session?.user?.id) return;
      setLoadingInf(true);

      // Buscar el perfil del paciente en la tabla pacientes (por auth user id)
      const { data: pac } = await supabase
        .from("pacientes")
        .select("id, nutricionista_id")
        .eq("auth_user_id", session.user.id)
        .eq("estado", "activo")
        .single();

      if (pac) {
        setPacienteId(pac.id);
        // Traer plan activo
        const { data: plan } = await supabase
          .from("planes")
          .select("id, calorias_objetivo, version, comidas_plan(*)")
          .eq("paciente_id", pac.id)
          .eq("estado", "activo")
          .single();
        setPlanActivo(plan || null);
      }
      setLoadingInf(false);
    }
    cargarPaciente();
  }, [session]);

  const {
    comidas,
    actividades,
    loading: loadingReg,
    agregarComida,
    editarComida,
    eliminarComida,
    agregarActividad,
    eliminarActividad,
  } = useRegistros(pacienteId, fecha);

  const balance = useBalance(
    comidas,
    actividades,
    planActivo?.calorias_objetivo || 2000,
  );

  async function handleGuardarComida(datos) {
    const { error } = await agregarComida(datos);
    if (!error) toast.success("Comida registrada.");
    else toast.error(error);
    return { error };
  }

  async function handleGuardarActividad(datos) {
    const { error } = await agregarActividad(datos);
    if (!error) toast.success("Actividad registrada.");
    else toast.error(error);
    return { error };
  }

  async function handleEliminarComida(id) {
    const { error } = await eliminarComida(id);
    if (!error) toast.success("Registro eliminado.");
    else toast.error(error);
  }

  async function handleEliminarActividad(id) {
    const { error } = await eliminarActividad(id);
    if (!error) toast.success("Actividad eliminada.");
    else toast.error(error);
  }

  async function handleEditarComida(id, datos) {
    const { error } = await editarComida(id, datos);
    if (!error) toast.success("Registro actualizado.");
    return { error };
  }

  const esPasado = fecha < toLocalISO(new Date());

  // Ordenar comidas por tipo para mostrar el plan
  const ORDEN_TIPO = {
    desayuno: 1,
    almuerzo: 2,
    merienda: 3,
    cena: 4,
    snack: 5,
  };
  const comidasPlan = [...(planActivo?.comidas_plan || [])].sort(
    (a, b) =>
      (ORDEN_TIPO[a.tipo_comida] || 9) - (ORDEN_TIPO[b.tipo_comida] || 9),
  );

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
            aria-label="Cerrar sesión"
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
            { key: "hoy", label: "Mi día" },
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

        {/* ── TAB: Mi día ────────────────────────────────────────────────────── */}
        {tab === "hoy" && (
          <>
            {/* Balance */}
            <BalanceCard
              balance={balance}
              caloriasObjetivo={planActivo?.calorias_objetivo || 2000}
              loading={loadingInf || loadingReg}
            />

            {/* Calendario semanal */}
            <DayCalendar fechaActiva={fecha} onChange={setFecha} />

            {/* Etiqueta del día */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-[13px] text-olive-dark">
                {formatFechaLegible(fecha)}
              </h3>
              <span className="text-[10.5px] text-muted font-display">
                {comidas.length + actividades.length} registros
              </span>
            </div>

            {/* Timeline */}
            {loadingReg ? (
              <div className="flex justify-center py-12">
                <Loader2
                  size={18}
                  className="animate-spin text-muted"
                  aria-label="Cargando registros"
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-cream-darker overflow-hidden p-2">
                <Timeline
                  comidas={comidas}
                  actividades={actividades}
                  onEliminarComida={handleEliminarComida}
                  onEliminarActividad={handleEliminarActividad}
                  onEditarComida={handleEditarComida}
                  pacienteId={pacienteId}
                  comidasPlan={comidasPlan}
                />
              </div>
            )}
          </>
        )}

        {/* ── TAB: Mi plan ───────────────────────────────────────────────────── */}
        {tab === "plan" && (
          <div className="space-y-3">
            {loadingInf ? (
              <div className="flex justify-center py-16">
                <Loader2
                  size={18}
                  className="animate-spin text-muted"
                  aria-label="Cargando plan"
                />
              </div>
            ) : planActivo ? (
              <>
                {/* Resumen del plan */}
                <div className="bg-white rounded-2xl border border-cream-darker p-5">
                  <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
                    Plan activo — v{planActivo.version}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-bold text-2xl text-olive-dark">
                      {planActivo.calorias_objetivo}
                    </span>
                    <span className="text-muted text-sm">kcal / día</span>
                  </div>
                </div>

                {/* Comidas del plan agrupadas por tipo */}
                {["desayuno", "almuerzo", "merienda", "cena", "snack"].map(
                  (tipo) => {
                    const items = comidasPlan.filter(
                      (c) => c.tipo_comida === tipo,
                    );
                    if (items.length === 0) return null;
                    const tipoLabel = {
                      desayuno: "Desayuno",
                      almuerzo: "Almuerzo",
                      merienda: "Merienda",
                      cena: "Cena",
                      snack: "Snack",
                    }[tipo];
                    const totalCal = items.reduce(
                      (s, c) => s + (c.calorias_aprox || 0),
                      0,
                    );

                    return (
                      <div
                        key={tipo}
                        className="bg-white rounded-2xl border border-cream-darker overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-cream">
                          <span className="font-display font-semibold text-[12.5px] text-olive-dark">
                            {tipoLabel}
                          </span>
                          {totalCal > 0 && (
                            <span className="text-[10.5px] text-muted">
                              {totalCal} kcal
                            </span>
                          )}
                        </div>
                        <div className="divide-y divide-cream">
                          {items.map((c) => (
                            <div key={c.id} className="px-4 py-2.5">
                              <p className="text-[12px] text-olive-dark">
                                {c.descripcion}
                              </p>
                              {c.calorias_aprox && (
                                <p className="text-[10px] text-muted mt-0.5">
                                  {c.calorias_aprox} kcal
                                  {c.proteinas_g && ` · P: ${c.proteinas_g}g`}
                                  {c.carbos_g && ` · C: ${c.carbos_g}g`}
                                  {c.grasas_g && ` · G: ${c.grasas_g}g`}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  },
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-cream-darker p-8 text-center">
                <ClipboardList size={28} className="text-muted mx-auto mb-3" />
                <p className="font-display text-[13px] font-semibold text-olive-dark mb-1">
                  Sin plan activo
                </p>
                <p className="text-[11px] text-muted">
                  Tu nutricionista todavía no asignó un plan alimenticio.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Tendencia ──────────────────────────────────────────────────── */}
        {tab === "tendencia" && (
          <div className="space-y-4">
            <WeeklyCaloriesChart
              puntos={puntosSemanales}
              loading={loadingTendencia}
              titulo="Mis últimos 7 días"
              caloriasObjetivo={planActivo?.calorias_objetivo || 0}
            />

            {/* Resumen textual */}
            {!loadingTendencia &&
              puntosSemanales.length > 0 &&
              (() => {
                const conDatos = puntosSemanales.filter(
                  (p) => p.registroExistente,
                );
                const diasCumple = conDatos.filter(
                  (p) => p.estado === "cumple",
                ).length;
                const diasExceso = conDatos.filter(
                  (p) => p.estado === "exceso",
                ).length;
                const promedio =
                  conDatos.length > 0
                    ? Math.round(
                        conDatos.reduce((s, p) => s + (p.netas || 0), 0) /
                          conDatos.length,
                      )
                    : 0;
                return (
                  <div className="bg-white rounded-2xl border border-cream-darker p-5">
                    <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-3">
                      Resumen de la semana
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Dias registrados",
                          value: conDatos.length,
                          unit: `/ ${puntosSemanales.length}`,
                        },
                        {
                          label: "Dias en objetivo",
                          value: diasCumple,
                          unit: "dias",
                        },
                        {
                          label: "Promedio diario",
                          value: promedio,
                          unit: "kcal",
                        },
                      ].map(({ label, value, unit }) => (
                        <div key={label} className="text-center">
                          <div className="font-display font-bold text-xl text-olive-dark">
                            {value}
                          </div>
                          <div className="text-[9px] text-muted mt-0.5 font-display">
                            {unit}
                          </div>
                          <div className="text-[9px] text-muted mt-0.5">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                    {diasExceso > 0 && (
                      <p className="text-[10.5px] text-muted mt-4 pt-3 border-t border-cream">
                        {diasExceso === 1
                          ? "Tuviste 1 dia con exceso calorico esta semana."
                          : `Tuviste ${diasExceso} dias con exceso calorico esta semana.`}
                      </p>
                    )}
                  </div>
                );
              })()}
          </div>
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

      {/* FAB — solo en tab Hoy y para fecha de hoy */}
      {tab === "hoy" && (
        <button
          onClick={() => setFabAbierto((o) => !o)}
          aria-label={fabAbierto ? "Cerrar menú" : "Agregar registro"}
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
