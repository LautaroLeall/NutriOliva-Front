// AdminNutricionistas.jsx — Directorio de nutricionistas con KPIs 3D, gestion de pacientes/cupos y precios dinamicos

import { useState, useMemo } from "react";
import {
  Users,
  HeartHandshake,
  DollarSign,
  Search,
  X,
  UserPlus,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { toast } from "sonner";
import {
  DEFAULT_PLANS,
  STATUS_CONFIG,
  normalizarEstado,
  valorEstadoDB,
  exportarExcelNutricionistas,
  AdminMetricCard,
} from "./adminUtils";
import AdminNutriTable from "./AdminNutriTable";

export default function AdminNutricionistas({
  nutricionistas,
  planesConfig = DEFAULT_PLANS,
  loading,
  onAbrirNuevo,
  onAbrirEdicion,
  onAbrirPacientes,
  onAbrirPreciosPlanes,
  cambiarEstado,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [actualizandoId, setActualizandoId] = useState(null);

  // ── KPIs calculados sobre datos reales ────────────────────────────────────
  const activos = useMemo(
    () =>
      nutricionistas.filter((n) => normalizarEstado(n.estado) === "activo"),
    [nutricionistas]
  );

  const totalPatients = useMemo(
    () =>
      nutricionistas.reduce((acc, n) => acc + (n.total_pacientes || 0), 0),
    [nutricionistas]
  );

  const totalRevenue = useMemo(
    () =>
      activos.reduce((acc, n) => {
        const pKey = (n.plan_suscripcion || "starter").toLowerCase();
        const fallbackPrice = planesConfig[pKey]?.price ?? 75000;
        return acc + (n.precio_mensual_ars ?? fallbackPrice);
      }, 0),
    [activos, planesConfig]
  );

  const planCount = useMemo(() => {
    const counts = { starter: 0, pro: 0, clinic: 0 };
    activos.forEach((n) => {
      const p = (n.plan_suscripcion || "starter").toLowerCase();
      if (counts[p] !== undefined) counts[p]++;
    });
    return counts;
  }, [activos]);

  // ── Filtrado combinando busqueda + plan + estado ──────────────────────────
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return nutricionistas.filter((n) => {
      const matchTexto =
        !q ||
        (n.nombre || "").toLowerCase().includes(q) ||
        (n.email || "").toLowerCase().includes(q);
      const pKey = (n.plan_suscripcion || "starter").toLowerCase();
      const estKey = normalizarEstado(n.estado);
      const matchPlan = filtroPlan === "todos" || pKey === filtroPlan;
      const matchEstado = filtroEstado === "todos" || estKey === filtroEstado;
      return matchTexto && matchPlan && matchEstado;
    });
  }, [nutricionistas, busqueda, filtroPlan, filtroEstado]);

  async function handleCambioRapidoEstado(n, nuevoEstadoKey) {
    setActualizandoId(n.id);
    const valorDB = valorEstadoDB(nuevoEstadoKey, n.estado);
    const { error } = await cambiarEstado(n.id, valorDB);
    setActualizandoId(null);
    if (error) {
      toast.error("No se pudo actualizar el estado: " + error);
    } else {
      toast.success(
        `Estado de ${n.nombre} cambiado a ${STATUS_CONFIG[nuevoEstadoKey]?.text || nuevoEstadoKey}`
      );
    }
  }

  return (
    <div className="space-y-5">
      {/* Tarjetas KPI con 3D Tilt y CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AdminMetricCard
          label="Nutricionistas"
          icon={Users}
          sub={`${activos.length} activos en plataforma`}
          delay={0}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp end={nutricionistas.length} duration={0.8} />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Pacientes totales"
          icon={HeartHandshake}
          sub="Bajo seguimiento activo"
          delay={0.07}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp end={totalPatients} duration={0.9} />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Ingresos est. / mes"
          icon={DollarSign}
          sub={`${planCount.starter} Starter · ${planCount.pro} Pro · ${planCount.clinic} Clinic`}
          delay={0.14}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp
              end={totalRevenue}
              duration={1.1}
              separator="."
              prefix="$"
            />
          )}
        </AdminMetricCard>
      </div>

      {/* Directorio y barra de herramientas */}
      <div className="border border-cream-darker rounded-xl overflow-hidden bg-white">
        {/* Cabecera de la tabla */}
        <div className="flex flex-wrap justify-between items-center gap-3 px-4 py-3.5 bg-cream border-b border-cream-darker">
          <div>
            <h3 className="font-display text-[13px] font-semibold text-olive-dark">
              Directorio de nutricionistas
            </h3>
            <p className="text-[10.5px] text-muted font-body">
              {filtrados.length} de {nutricionistas.length} profesionales
              mostrados · Haz clic en Pacientes / Cupo para gestionar su cartera
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAbrirPreciosPlanes}
              className="px-3 py-1.5 rounded-lg border border-cream-darker bg-white
                        text-olive-dark font-display text-[10.5px] flex items-center gap-1.5
                        hover:bg-cream transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={12} className="text-olive" />
              Precios y cupos de planes
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!filtrados.length) {
                  toast.info("No hay datos para exportar");
                  return;
                }
                exportarExcelNutricionistas(
                  filtrados,
                  "nutrioliva_nutricionistas.xlsx",
                  planesConfig
                );
                toast.success("Archivo Excel descargado");
              }}
              className="px-3 py-1.5 rounded-lg border border-cream-darker bg-white
                        text-olive-dark font-display text-[10.5px] flex items-center gap-1.5
                        hover:bg-cream transition-colors cursor-pointer"
            >
              <Download size={12} className="text-olive" />
              Exportar (.xlsx)
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAbrirNuevo}
              className="btn-primary text-[10.5px] px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={12} />
              Nuevo nutricionista
            </motion.button>
          </div>
        </div>

        {/* Buscador y filtros */}
        <div className="px-4 py-3 bg-[#FAF8F3] border-b border-cream-darker flex flex-wrap items-center justify-between gap-2.5">
          {/* Input de busqueda */}
          <div className="relative flex-1 min-w-[210px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-cream-darker bg-white
                          text-[12px] text-olive-dark placeholder:text-muted/70
                          focus:outline-none focus:ring-2 focus:ring-olive/25 focus:border-olive/50 transition-all"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-olive-dark cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Chips de Plan */}
          <div className="flex items-center gap-1 bg-cream rounded-lg p-0.5 border border-cream-darker">
            {[
              { id: "todos", label: "Todos" },
              { id: "starter", label: "Starter" },
              { id: "pro", label: "Pro" },
              { id: "clinic", label: "Clinic" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFiltroPlan(p.id)}
                className={`px-2.5 py-1 rounded-md font-display text-[10px] transition-all cursor-pointer ${
                  filtroPlan === p.id
                    ? "bg-olive text-cream shadow-sm"
                    : "text-muted hover:text-olive-dark"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chips de Estado con referencia de color */}
          <div className="flex items-center gap-1 bg-cream rounded-lg p-0.5 border border-cream-darker">
            {[
              { id: "todos", label: "Cualquier estado", dot: null },
              { id: "activo", label: "Activos", dot: "bg-success" },
              { id: "pago_pendiente", label: "Pendientes", dot: "bg-warning" },
              { id: "inactivo", label: "Inactivos", dot: "bg-danger" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFiltroEstado(st.id)}
                className={`px-2.5 py-1 rounded-md font-display text-[10px] flex items-center gap-1.5 transition-all cursor-pointer ${
                  filtroEstado === st.id
                    ? "bg-olive-dark text-cream shadow-sm"
                    : "text-muted hover:text-olive-dark"
                }`}
              >
                {st.dot && (
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`}
                  />
                )}
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de la tabla */}
        <AdminNutriTable
          loading={loading}
          filtrados={filtrados}
          planesConfig={planesConfig}
          actualizandoId={actualizandoId}
          onAbrirEdicion={onAbrirEdicion}
          onAbrirPacientes={onAbrirPacientes}
          onCambioRapidoEstado={handleCambioRapidoEstado}
        />
      </div>
    </div>
  );
}
