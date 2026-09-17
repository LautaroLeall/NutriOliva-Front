import { useState } from "react";
import {
  Users,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  Pencil,
  X,
  Check,
  Loader2,
  AlertCircle,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Logo from "@/components/ui/Logo";

const PLANS = {
  starter: { label: "Starter", price: 75000, patients: 15 },
  pro: { label: "Pro", price: 125000, patients: 50 },
  clinic: { label: "Clinic", price: 150000, patients: 9999 },
};

const STATUS_CONFIG = {
  activo: { dot: "bg-success", text: "Activo" },
  pago_pendiente: { dot: "bg-warning", text: "Pago pendiente" },
  inactivo: { dot: "bg-danger", text: "Inactivo" },
  // compatibilidad con valores legacy
  Activo: { dot: "bg-success", text: "Activo" },
  "Pago pendiente": { dot: "bg-warning", text: "Pago pendiente" },
  Inactivo: { dot: "bg-danger", text: "Inactivo" },
};

const NAV_ITEMS = [
  { label: "Nutricionistas", icon: Users },
  { label: "Facturacion", icon: CreditCard },
  { label: "Metricas", icon: BarChart2 },
  { label: "Ajustes", icon: Settings },
];

const FORM_NUEVO_VACIO = {
  nombre: "",
  email: "",
  password: "",
  plan: "starter",
};

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatARS(amount) {
  if (!amount) return "$0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminPanel() {
  const { signOut } = useAuth();
  const { nutricionistas, loading, error, cambiarPlan, cambiarEstado, crearNutricionista } =
    useAdmin();

  const [activeNav,    setActiveNav]    = useState("Nutricionistas");
  const [editingNutri, setEditingNutri] = useState(null);
  const [editForm,     setEditForm]     = useState({ plan_suscripcion: "starter", estado: "activo" });
  const [guardando,    setGuardando]    = useState(false);

  // ── Estado modal "Nuevo nutricionista" ────────────────────────────────────
  const [modalNuevo,    setModalNuevo]    = useState(false);
  const [formNuevo,     setFormNuevo]     = useState(FORM_NUEVO_VACIO);
  const [creando,       setCreando]       = useState(false);
  const [errorNuevo,    setErrorNuevo]    = useState("");
  const [verPassword,   setVerPassword]   = useState(false);

  // ── Metricas ──────────────────────────────────────────────────────────────
  const activos = nutricionistas.filter(
    (n) => n.estado === "activo" || n.estado === "Activo",
  );
  const totalPatients = nutricionistas.reduce(
    (s, n) => s + (n.total_pacientes || 0), 0,
  );
  const totalRevenue = activos.reduce(
    (s, n) => s + (n.precio_mensual_ars || 0), 0,
  );
  const planCount = { starter: 0, pro: 0, clinic: 0 };
  activos.forEach((n) => {
    const p = (n.plan_suscripcion || "starter").toLowerCase();
    if (planCount[p] !== undefined) planCount[p]++;
  });

  const metrics = [
    { label: "Nutricionistas", value: nutricionistas.length, sub: `${activos.length} activos` },
    { label: "Pacientes totales", value: totalPatients, sub: "bajo seguimiento activo" },
    {
      label: "Ingresos est. / mes",
      value: formatARS(totalRevenue),
      sub: `${planCount.starter} Starter · ${planCount.pro} Pro · ${planCount.clinic} Clinic`,
    },
  ];

  // ── Editar plan/estado ────────────────────────────────────────────────────
  function abrirEdicion(n) {
    setEditingNutri(n);
    setEditForm({
      plan_suscripcion: (n.plan_suscripcion || "starter").toLowerCase(),
      estado: n.estado || "activo",
    });
  }

  async function guardarEdicion() {
    if (!editingNutri) return;
    setGuardando(true);
    let huboError = false;

    if (editForm.plan_suscripcion !== editingNutri.plan_suscripcion) {
      const { error: err } = await cambiarPlan(editingNutri.id, editForm.plan_suscripcion);
      if (err) { toast.error("Error al cambiar el plan: " + err); huboError = true; }
    }

    if (!huboError && editForm.estado !== editingNutri.estado) {
      const { error: err } = await cambiarEstado(editingNutri.id, editForm.estado);
      if (err) { toast.error("Error al cambiar el estado: " + err); huboError = true; }
    }

    if (!huboError) {
      toast.success("Nutricionista actualizado correctamente");
      setEditingNutri(null);
    }
    setGuardando(false);
  }

  // ── Crear nuevo nutricionista ─────────────────────────────────────────────
  function abrirModalNuevo() {
    setFormNuevo(FORM_NUEVO_VACIO);
    setErrorNuevo("");
    setVerPassword(false);
    setModalNuevo(true);
  }

  function cerrarModalNuevo() {
    if (creando) return;
    setModalNuevo(false);
    setErrorNuevo("");
  }

  function validarFormNuevo() {
    if (!formNuevo.nombre.trim()) return "El nombre es obligatorio.";
    if (!formNuevo.email.trim() || !formNuevo.email.includes("@")) return "Ingresa un email valido.";
    if (!formNuevo.password || formNuevo.password.length < 6) return "La contrasena debe tener al menos 6 caracteres.";
    return null;
  }

  async function handleCrearNutricionista(e) {
    e.preventDefault();
    const validacion = validarFormNuevo();
    if (validacion) { setErrorNuevo(validacion); return; }

    setCreando(true);
    setErrorNuevo("");

    const { data, error: err } = await crearNutricionista({
      nombre:   formNuevo.nombre.trim(),
      email:    formNuevo.email.trim().toLowerCase(),
      password: formNuevo.password,
      plan:     formNuevo.plan,
    });

    if (err) {
      setErrorNuevo(err);
      setCreando(false);
      return;
    }

    toast.success(`Nutricionista "${data?.nombre}" creado correctamente`);
    setModalNuevo(false);
    setCreando(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />
      <div className="max-w-[960px] mx-auto py-8 px-4">
        <div className="card overflow-hidden">
          <div className="flex min-h-[600px]">

            {/* Sidebar */}
            <aside className="w-44 flex-shrink-0 bg-olive-dark flex flex-col">
              <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#55613A]">
                <Logo size={26} />
                <div>
                  <div className="font-display font-semibold text-cream text-[13px] leading-tight">
                    NutriOliva
                  </div>
                  <div className="text-[8.5px] text-[#9AA37D] uppercase tracking-wider mt-0.5">
                    Super Admin
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-2 py-3 space-y-0.5">
                {NAV_ITEMS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setActiveNav(label)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left
                              font-display text-[11.5px] transition-all duration-100
                              ${activeNav === label
                                ? "bg-olive text-cream"
                                : "text-[#C9D3AC] hover:bg-[#4A5633]"
                              }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="px-3 pb-4">
                <button
                  onClick={signOut}
                  className="w-full text-[#9AA37D] font-display text-[10px] py-2 rounded-lg
                            hover:text-cream transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut size={11} />
                  Salir
                </button>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6 bg-white min-w-0">
              <div className="mb-5">
                <h2 className="font-display text-lg text-olive-dark">Panel general</h2>
                <p className="font-editorial italic text-muted text-xs mt-0.5">
                  Vision global de la plataforma NutriOliva.
                </p>
              </div>

              {/* Error de carga */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle size={14} />
                  Error al cargar datos: {error}
                </div>
              )}

              {/* Metricas */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {metrics.map((m) => (
                  <div key={m.label} className="bg-cream border border-cream-darker rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-display text-[9.5px] uppercase tracking-wide text-muted">
                        {m.label}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-olive flex-shrink-0" />
                    </div>
                    <div className="font-display text-[22px] font-semibold text-olive-dark leading-tight">
                      {loading ? <span className="text-[14px] text-muted">...</span> : m.value}
                    </div>
                    <div className="text-[10px] text-success mt-1 font-display">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tabla de nutricionistas */}
              <div className="border border-cream-darker rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 bg-cream border-b border-cream-darker">
                  <h3 className="font-display text-[12.5px] font-semibold text-olive-dark">
                    Directorio de nutricionistas
                  </h3>
                  <button
                    onClick={abrirModalNuevo}
                    className="btn-primary text-[10px] px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <UserPlus size={11} />
                    Nuevo nutricionista
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="font-display text-sm">Cargando...</span>
                  </div>
                ) : nutricionistas.length === 0 ? (
                  <div className="text-center py-10 text-muted font-display text-sm">
                    No hay nutricionistas registrados.
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {["Profesional", "Plan", "Pacientes", "Estado", ""].map((h) => (
                          <th
                            key={h}
                            className="bg-white text-muted font-display text-[9.5px] uppercase
                                    tracking-wide text-left px-4 py-2.5 border-b border-cream-dark"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {nutricionistas.map((n) => {
                        const st = STATUS_CONFIG[n.estado] || STATUS_CONFIG["Activo"];
                        const planKey = (n.plan_suscripcion || "starter").toLowerCase();
                        const planInfo = PLANS[planKey] || PLANS.starter;
                        return (
                          <tr
                            key={n.id}
                            className="border-b border-cream last:border-0 hover:bg-cream/40 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <span className="avatar text-[10px]">{initials(n.nombre)}</span>
                                <div>
                                  <div className="font-semibold text-olive-dark text-[12px]">{n.nombre}</div>
                                  <div className="text-[10px] text-muted">{n.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`badge badge-${planKey}`}>{planInfo.label}</span>
                            </td>
                            <td className="px-4 py-3 text-[12px] text-olive-dark">
                              {n.total_pacientes || 0}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-olive-dark">
                                <span className={`status-dot ${st.dot}`} />
                                {st.text}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => abrirEdicion(n)}
                                className="border border-cream-darker text-olive font-display text-[10px]
                                          px-3 py-1.5 rounded-full hover:bg-cream transition-colors
                                          flex items-center gap-1 ml-auto"
                              >
                                <Pencil size={10} />
                                Editar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* ── Modal edicion de nutricionista ── */}
      {editingNutri && (
        <div
          className="fixed inset-0 bg-olive-dark/45 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setEditingNutri(null)}
        >
          <div className="bg-white rounded-card p-6 w-80 shadow-modal animate-fade-scale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-[14.5px] text-olive-dark">Editar nutricionista</h3>
              <button onClick={() => setEditingNutri(null)} className="text-muted hover:text-olive-dark transition-colors">
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-muted font-display mb-4">
              {editingNutri.nombre} — {editingNutri.email}
            </p>

            <div className="space-y-3">
              <div>
                <label className="label">Plan</label>
                <select
                  className="input"
                  value={editForm.plan_suscripcion}
                  onChange={(e) => setEditForm((f) => ({ ...f, plan_suscripcion: e.target.value }))}
                >
                  <option value="starter">Starter — hasta 15 pac. · {formatARS(75000)}/mes</option>
                  <option value="pro">Pro — hasta 50 pac. · {formatARS(125000)}/mes</option>
                  <option value="clinic">Clinic — ilimitado · {formatARS(150000)}/mes</option>
                </select>
              </div>
              <div>
                <label className="label">Estado de pago</label>
                <select
                  className="input"
                  value={editForm.estado}
                  onChange={(e) => setEditForm((f) => ({ ...f, estado: e.target.value }))}
                >
                  <option value="activo">Activo</option>
                  <option value="pago_pendiente">Pago pendiente</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditingNutri(null)}
                className="flex-1 py-2.5 rounded-lg bg-cream-dark text-muted font-display
                          text-[11.5px] cursor-pointer hover:bg-cream-darker transition-colors
                          flex items-center justify-center gap-1.5"
              >
                <X size={12} /> Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                disabled={guardando}
                className="flex-1 py-2.5 rounded-lg bg-olive text-cream font-display
                          text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors
                          flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {guardando ? <><Loader2 size={11} className="animate-spin" /> Guardando...</> : <><Check size={12} /> Guardar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal nuevo nutricionista ── */}
      {modalNuevo && (
        <div
          className="fixed inset-0 bg-olive-dark/45 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && cerrarModalNuevo()}
        >
          <div className="bg-white rounded-card p-6 w-96 shadow-modal animate-fade-scale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-[14.5px] text-olive-dark">Nuevo nutricionista</h3>
              <button onClick={cerrarModalNuevo} className="text-muted hover:text-olive-dark transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCrearNutricionista} className="space-y-3">
              {/* Nombre */}
              <div>
                <label className="label">Nombre completo</label>
                <input
                  className="input"
                  placeholder="Ej: Maria Lopez"
                  value={formNuevo.nombre}
                  onChange={(e) => setFormNuevo((f) => ({ ...f, nombre: e.target.value }))}
                  maxLength={80}
                  autoFocus
                />
              </div>

              {/* Email */}
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="nutricionista@email.com"
                  value={formNuevo.email}
                  onChange={(e) => setFormNuevo((f) => ({ ...f, email: e.target.value }))}
                />
              </div>

              {/* Contrasena */}
              <div>
                <label className="label">Contrasena inicial</label>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type={verPassword ? "text" : "password"}
                    placeholder="Minimo 6 caracteres"
                    value={formNuevo.password}
                    onChange={(e) => setFormNuevo((f) => ({ ...f, password: e.target.value }))}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setVerPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-olive-dark"
                    tabIndex={-1}
                  >
                    {verPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[9px] text-muted mt-1">
                  El nutricionista podra cambiarla desde su perfil.
                </p>
              </div>

              {/* Plan */}
              <div>
                <label className="label">Plan inicial</label>
                <select
                  className="input"
                  value={formNuevo.plan}
                  onChange={(e) => setFormNuevo((f) => ({ ...f, plan: e.target.value }))}
                >
                  <option value="starter">Starter — hasta 15 pac. · {formatARS(75000)}/mes</option>
                  <option value="pro">Pro — hasta 50 pac. · {formatARS(125000)}/mes</option>
                  <option value="clinic">Clinic — ilimitado · {formatARS(150000)}/mes</option>
                </select>
              </div>

              {/* Error */}
              {errorNuevo && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-3 py-2 text-[11px]">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {errorNuevo}
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={cerrarModalNuevo}
                  className="flex-1 py-2.5 rounded-lg bg-cream-dark text-muted font-display
                            text-[11.5px] cursor-pointer hover:bg-cream-darker transition-colors
                            flex items-center justify-center gap-1.5"
                >
                  <X size={12} /> Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creando}
                  className="flex-1 py-2.5 rounded-lg bg-olive text-cream font-display
                            text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors
                            flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {creando
                    ? <><Loader2 size={11} className="animate-spin" /> Creando...</>
                    : <><UserPlus size={12} /> Crear nutricionista</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
