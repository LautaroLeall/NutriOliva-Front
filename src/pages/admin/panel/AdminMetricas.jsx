// AdminMetricas.jsx — Analitica operativa, consumo de IA y crecimiento real

import { useMemo } from "react";
import {
  Users,
  ShieldCheck,
  Activity,
  Database,
  Award,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  DEFAULT_PLANS,
  normalizarEstado,
  initials,
  formatARS,
  formatFechaCorta,
  AdminMetricCard,
} from "./adminUtils";
import AdminConsumoIA from "./AdminConsumoIA";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-olive-dark text-cream px-3 py-2 rounded-xl shadow-lg text-[11px] font-display">
      <div className="font-semibold mb-0.5">{d.nombreCompleto}</div>
      <div className="text-[#C9D3AC]">
        Pacientes activos: <strong className="text-cream">{d.pacientes}</strong>
      </div>
      <div className="text-[#C9D3AC]">
        Plan: <strong className="text-cream">{d.planLabel}</strong> (
        {formatARS(d.cuota)}/mes)
      </div>
    </div>
  );
}

export default function AdminMetricas({
  nutricionistas,
  planesConfig = DEFAULT_PLANS,
  pacientesAll = [],
  registrosComida = [],
  perfiles,
  catalogoCount,
  loading,
}) {
  // ── Calculos sobre datos reales ───────────────────────────────────────────
  const stats = useMemo(() => {
    const totalNutris = nutricionistas.length;
    const activos = nutricionistas.filter(
      (n) => normalizarEstado(n.estado) === "activo"
    ).length;

    const retencionPct =
      totalNutris > 0 ? Math.round((activos / totalNutris) * 100) : 100;

    const totalPacientesSeg = nutricionistas.reduce(
      (s, n) => s + (n.total_pacientes || 0),
      0
    );
    const promPacientes =
      totalNutris > 0
        ? Number((totalPacientesSeg / totalNutris).toFixed(1))
        : 0;

    // Roles desde tabla perfiles
    const roles = { nutricionista: 0, paciente: 0, superadmin: 0 };
    perfiles.forEach((p) => {
      const r = (p.rol || "").toLowerCase();
      if (roles[r] !== undefined) roles[r]++;
    });

    // Datos para grafico Recharts (Top 7 por pacientes)
    const ranking = [...nutricionistas]
      .sort((a, b) => (b.total_pacientes || 0) - (a.total_pacientes || 0))
      .slice(0, 7)
      .map((n) => {
        const pKey = (n.plan_suscripcion || "starter").toLowerCase();
        const plan = planesConfig[pKey] || DEFAULT_PLANS.starter;
        const primerNombre = (n.nombre || "Profesional").split(" ")[0];
        return {
          id: n.id,
          nombreCorto:
            primerNombre.length > 10
              ? primerNombre.slice(0, 10) + "."
              : primerNombre,
          nombreCompleto: n.nombre,
          email: n.email,
          pacientes: n.total_pacientes || 0,
          cupo: n.cupo_maximo || plan.patients,
          planKey: pKey,
          planLabel: plan.label,
          cuota: n.precio_mensual_ars ?? plan.price,
        };
      });

    // Ocupacion por plan
    const usoPlanes = ["starter", "pro", "clinic"].map((key) => {
      const plan = planesConfig[key] || DEFAULT_PLANS[key];
      const delPlan = nutricionistas.filter(
        (n) => (n.plan_suscripcion || "starter").toLowerCase() === key
      );
      const pacDelPlan = delPlan.reduce(
        (s, n) => s + (n.total_pacientes || 0),
        0
      );
      const pctSobreTotal =
        totalNutris > 0 ? Math.round((delPlan.length / totalNutris) * 100) : 0;

      return {
        ...plan,
        cantidadNutris: delPlan.length,
        pacientesTotales: pacDelPlan,
        pctSobreTotal,
      };
    });

    return {
      totalUsuarios: perfiles.length || totalNutris + totalPacientesSeg,
      roles,
      retencionPct,
      activos,
      totalNutris,
      promPacientes,
      totalPacientesSeg,
      ranking,
      usoPlanes,
    };
  }, [nutricionistas, perfiles, planesConfig]);

  return (
    <div className="space-y-5">
      {/* 4 KPIs de Plataforma con 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <AdminMetricCard
          label="Usuarios en plataforma"
          icon={Users}
          sub={`${stats.roles.nutricionista} nutris · ${stats.roles.paciente} pac. · ${stats.roles.superadmin} admin`}
          delay={0}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp end={stats.totalUsuarios} duration={0.9} />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Tasa de retencion"
          icon={ShieldCheck}
          sub={`${stats.activos} de ${stats.totalNutris} cuentas activas`}
          delay={0.06}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp end={stats.retencionPct} duration={0.9} suffix="%" />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Promedio pac. / nutri"
          icon={Activity}
          sub={`${stats.totalPacientesSeg} pacientes vinculados`}
          delay={0.12}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp end={stats.promPacientes} decimals={1} duration={0.9} />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Alimentos en catalogo"
          icon={Database}
          sub="Base nutricional SARA activa"
          delay={0.18}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp end={catalogoCount} duration={1} separator="." />
          )}
        </AdminMetricCard>
      </div>

      {/* Consumo y Gasto Estimado de IA (Total, por Nutricionista y por Paciente) */}
      <AdminConsumoIA
        nutricionistas={nutricionistas}
        pacientesAll={pacientesAll}
        registrosComida={registrosComida}
      />

      {/* Grafico de barras Recharts + Distribucion de Planes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Grafico Recharts: Top profesionales por cartera de pacientes */}
        <div className="lg:col-span-3 border border-cream-darker rounded-xl p-4 bg-white flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-[12.5px] font-semibold text-olive-dark flex items-center gap-1.5">
                <Award size={14} className="text-olive" />
                Pacientes activos por nutricionista
              </h3>
              <p className="text-[10.5px] text-muted">
                Comparativa en tiempo real segun vinculos activos
              </p>
            </div>
          </div>

          {stats.ranking.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12 text-muted font-display text-xs">
              Sin datos suficientes para graficar.
            </div>
          ) : (
            <div className="h-[220px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.ranking}
                  margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E8E1D3"
                  />
                  <XAxis
                    dataKey="nombreCorto"
                    tick={{ fill: "#6E7A4B", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#9B9484", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(110, 122, 75, 0.08)" }}
                  />
                  <Bar
                    dataKey="pacientes"
                    fill="#6E7A4B"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Adopcion por Plan */}
        <div className="lg:col-span-2 border border-cream-darker rounded-xl p-4 bg-[#FAF8F3] flex flex-col justify-between">
          <div>
            <h3 className="font-display text-[12.5px] font-semibold text-olive-dark flex items-center gap-1.5 mb-1">
              <Layers size={14} className="text-olive" />
              Adopcion por nivel de plan
            </h3>
            <p className="text-[10.5px] text-muted mb-3.5">
              Profesionales y pacientes agrupados por suscripcion
            </p>

            <div className="space-y-3">
              {stats.usoPlanes.map((p) => (
                <div
                  key={p.key}
                  className="bg-white border border-cream-darker rounded-xl p-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`badge badge-${p.key}`}>{p.label}</span>
                    <span className="font-display text-[11px] font-semibold text-olive-dark">
                      {p.cantidadNutris} nutris ({p.pctSobreTotal}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted font-display mb-1.5">
                    <span>{p.pacientesTotales} pacientes atendidos</span>
                    <span>
                      Cupo:{" "}
                      {p.patients === 9999
                        ? "Ilimitado"
                        : `${p.patients}/nutri`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-cream-darker overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pctSobreTotal}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-olive"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ultimos registros reales en la plataforma */}
      <div className="border border-cream-darker rounded-xl overflow-hidden bg-white">
        <div className="px-4 py-3 bg-cream border-b border-cream-darker flex justify-between items-center">
          <div>
            <h3 className="font-display text-[12.5px] font-semibold text-olive-dark">
              Ultimos usuarios dados de alta en Supabase
            </h3>
            <p className="text-[10.5px] text-muted">
              Actividad reciente de cuentas creadas (nutricionistas y pacientes)
            </p>
          </div>
          <span className="font-display text-[10px] text-olive bg-olive/10 px-2.5 py-1 rounded-full">
            Ultimos {Math.min(6, perfiles.length)} registros
          </span>
        </div>

        <div className="divide-y divide-cream">
          {perfiles.slice(0, 6).map((u) => {
            const rol = (u.rol || "usuario").toLowerCase();
            return (
              <div
                key={u.id}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-cream/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="avatar text-[10px] flex-shrink-0">
                    {initials(u.nombre)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-olive-dark text-[12px] truncate">
                      {u.nombre || "Sin nombre"}
                    </div>
                    <div className="text-[10px] text-muted truncate">
                      {u.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-display uppercase tracking-wide border ${rol === "superadmin"
                        ? "bg-olive-dark text-cream border-olive-dark"
                        : rol === "nutricionista"
                          ? "bg-olive/12 text-olive-dark border-olive/25"
                          : "bg-cream text-muted border-cream-darker"
                      }`}
                  >
                    {rol}
                  </span>
                  <span className="text-[10.5px] text-muted font-display whitespace-nowrap">
                    {formatFechaCorta(u.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
