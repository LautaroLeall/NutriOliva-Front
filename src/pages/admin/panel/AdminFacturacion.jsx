// AdminFacturacion.jsx — Gestion financiera real (MRR, ARR, precios editables de planes y estados de pago en Supabase)

import { useState, useMemo } from "react";
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  Ban,
  Download,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import {
  DEFAULT_PLANS,
  STATUS_CONFIG,
  normalizarEstado,
  valorEstadoDB,
  initials,
  formatARS,
  exportarExcelNutricionistas,
  AdminMetricCard,
  TableSkeleton,
} from "./adminUtils";

export default function AdminFacturacion({
  nutricionistas,
  planesConfig = DEFAULT_PLANS,
  loading,
  cambiarEstado,
  onAbrirEdicion,
  onAbrirPreciosPlanes,
}) {
  const [filtroCobro, setFiltroCobro] = useState("todos");
  const [procesandoId, setProcesandoId] = useState(null);
  const [tbodyRef] = useAutoAnimate({ duration: 200 });

  // ── Calculos financieros reales ───────────────────────────────────────────
  const resumen = useMemo(() => {
    let mrrCobrado = 0;
    let pendienteCobro = 0;
    let cantActivos = 0;
    let cantPendientes = 0;
    let cantInactivos = 0;

    const porPlan = {
      starter: { count: 0, pendientesCount: 0, revenue: 0 },
      pro: { count: 0, pendientesCount: 0, revenue: 0 },
      clinic: { count: 0, pendientesCount: 0, revenue: 0 },
    };

    nutricionistas.forEach((n) => {
      const pKey = (n.plan_suscripcion || "starter").toLowerCase();
      const plan = planesConfig[pKey] || DEFAULT_PLANS.starter;
      const cuota = n.precio_mensual_ars ?? plan.price;
      const estKey = normalizarEstado(n.estado);

      if (estKey === "activo") {
        mrrCobrado += cuota;
        cantActivos++;
        if (porPlan[pKey]) {
          porPlan[pKey].count++;
          porPlan[pKey].revenue += cuota;
        }
      } else if (estKey === "pago_pendiente") {
        pendienteCobro += cuota;
        cantPendientes++;
        if (porPlan[pKey]) {
          porPlan[pKey].pendientesCount++;
        }
      } else {
        cantInactivos++;
      }
    });

    const arrProyectado = mrrCobrado * 12;
    const arpu = cantActivos > 0 ? Math.round(mrrCobrado / cantActivos) : 0;

    return {
      mrrCobrado,
      pendienteCobro,
      arrProyectado,
      arpu,
      cantActivos,
      cantPendientes,
      cantInactivos,
      porPlan,
    };
  }, [nutricionistas, planesConfig]);

  const listaFiltrada = useMemo(() => {
    if (filtroCobro === "todos") return nutricionistas;
    return nutricionistas.filter(
      (n) => normalizarEstado(n.estado) === filtroCobro
    );
  }, [nutricionistas, filtroCobro]);

  async function actualizarCobro(n, nuevoEstadoKey) {
    setProcesandoId(n.id);
    const valorDB = valorEstadoDB(nuevoEstadoKey, n.estado);
    const { error } = await cambiarEstado(n.id, valorDB);
    setProcesandoId(null);

    if (error) {
      toast.error("Error al actualizar cobro: " + error);
    } else {
      toast.success(
        `Suscripcion de ${n.nombre} actualizada a ${STATUS_CONFIG[nuevoEstadoKey]?.text}`
      );
    }
  }

  return (
    <div className="space-y-5">
      {/* 4 KPIs Financieros con 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <AdminMetricCard
          label="MRR Cobrado (Activos)"
          icon={DollarSign}
          sub={`${resumen.cantActivos} suscripciones al dia`}
          delay={0}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp
              end={resumen.mrrCobrado}
              duration={1}
              separator="."
              prefix="$"
            />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Pendiente de cobro"
          icon={AlertTriangle}
          sub={
            resumen.cantPendientes > 0
              ? `${resumen.cantPendientes} cuentas por regularizar`
              : "Sin pagos atrasados"
          }
          subColor={
            resumen.cantPendientes > 0 ? "text-amber-600" : "text-success"
          }
          delay={0.06}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp
              end={resumen.pendienteCobro}
              duration={1}
              separator="."
              prefix="$"
            />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="ARR Proyectado (Anual)"
          icon={TrendingUp}
          sub="Proyeccion 12 meses"
          delay={0.12}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp
              end={resumen.arrProyectado}
              duration={1.1}
              separator="."
              prefix="$"
            />
          )}
        </AdminMetricCard>

        <AdminMetricCard
          label="Ticket Promedio (ARPU)"
          icon={CreditCard}
          sub="Ingreso medio por nutri"
          delay={0.18}
        >
          {loading ? (
            <span className="text-[14px] text-muted">...</span>
          ) : (
            <CountUp
              end={resumen.arpu}
              duration={0.9}
              separator="."
              prefix="$"
            />
          )}
        </AdminMetricCard>
      </div>

      {/* Desglose de ingresos y tarifas por plan (Editable en tiempo real) */}
      <div className="border border-cream-darker rounded-xl p-4 bg-[#FAF8F3]">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <div>
            <h3 className="font-display text-[12.5px] font-semibold text-olive-dark">
              Tarifas vigentes y distribucion de ingresos por plan
            </h3>
            <p className="text-[10.5px] text-muted">
              Participacion sobre el MRR activo ({formatARS(resumen.mrrCobrado)}
              ) · Los cambios de precio impactan en toda la plataforma
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAbrirPreciosPlanes}
            className="px-3 py-1.5 rounded-lg bg-olive text-cream font-display text-[10.5px]
                        flex items-center gap-1.5 hover:bg-olive-deep transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={12} />
            Editar precios de planes
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(planesConfig).map((plan) => {
            const info = resumen.porPlan[plan.key] || { count: 0, revenue: 0 };
            const pct =
              resumen.mrrCobrado > 0
                ? Math.round((info.revenue / resumen.mrrCobrado) * 100)
                : 0;

            return (
              <div
                key={plan.key}
                className="bg-white border border-cream-darker rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`badge badge-${plan.key}`}>
                      {plan.label}
                    </span>
                    <button
                      type="button"
                      onClick={onAbrirPreciosPlanes}
                      className="inline-flex items-center gap-1 font-display text-[11.5px] font-semibold text-olive-dark hover:text-olive transition-colors cursor-pointer"
                      title="Modificar precio de este plan"
                    >
                      {formatARS(plan.price)}/mes
                      <Pencil size={10} className="text-muted" />
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted font-display mb-2">
                    <span>
                      {info.count} activos · Recauda {formatARS(info.revenue)}
                    </span>
                    <span>{pct}% MRR</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-cream-darker overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-olive"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla de control de cobros y suscripciones */}
      <div className="border border-cream-darker rounded-xl overflow-hidden bg-white">
        <div className="flex flex-wrap justify-between items-center gap-3 px-4 py-3.5 bg-cream border-b border-cream-darker">
          <div>
            <h3 className="font-display text-[13px] font-semibold text-olive-dark">
              Estado de facturacion por profesional
            </h3>
            <p className="text-[10.5px] text-muted">
              Actualiza el estado de pago en tiempo real sobre Supabase
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-cream-darker">
              {[
                { id: "todos", label: `Todos (${nutricionistas.length})` },
                { id: "activo", label: `Al dia (${resumen.cantActivos})` },
                {
                  id: "pago_pendiente",
                  label: `Pendientes (${resumen.cantPendientes})`,
                },
                {
                  id: "inactivo",
                  label: `Suspendidos (${resumen.cantInactivos})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFiltroCobro(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-display text-[10px] transition-all cursor-pointer ${filtroCobro === tab.id
                    ? "bg-olive text-cream shadow-sm"
                    : "text-muted hover:text-olive-dark"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!listaFiltrada.length) {
                  toast.error("No hay registros para exportar.");
                  return;
                }
                exportarExcelNutricionistas(
                  listaFiltrada,
                  "nutrioliva_facturacion.xlsx",
                  planesConfig
                );
                toast.success("Reporte de facturacion descargado (.xlsx)");
              }}
              className="px-3 py-1.5 rounded-lg border border-cream-darker bg-white
                        text-olive-dark font-display text-[10.5px] flex items-center gap-1.5
                        hover:bg-cream transition-colors cursor-pointer"
            >
              <Download size={12} className="text-olive" />
              Exportar reporte
            </motion.button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : listaFiltrada.length === 0 ? (
          <div className="text-center py-10 text-muted font-display text-sm">
            No hay suscripciones en este estado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[
                    "Profesional",
                    "Plan contratado",
                    "Cuota mensual",
                    "Estado actual",
                    "Acciones de cobro",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`bg-white text-muted font-display text-[9.5px] uppercase
                                  tracking-wide px-4 py-2.5 border-b border-cream-dark ${i === 4 ? "text-right" : "text-left"
                        }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody ref={tbodyRef}>
                {listaFiltrada.map((n) => {
                  const estKey = normalizarEstado(n.estado);
                  const st = STATUS_CONFIG[estKey] || STATUS_CONFIG.activo;
                  const planKey = (
                    n.plan_suscripcion || "starter"
                  ).toLowerCase();
                  const plan = planesConfig[planKey] || DEFAULT_PLANS.starter;
                  const cuota = n.precio_mensual_ars ?? plan.price;
                  const busy = procesandoId === n.id;

                  return (
                    <tr
                      key={n.id}
                      className="border-b border-cream last:border-0 hover:bg-cream/45 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="avatar text-[10px]">
                            {initials(n.nombre)}
                          </span>
                          <div>
                            <div className="font-semibold text-olive-dark text-[12px]">
                              {n.nombre}
                            </div>
                            <div className="text-[10px] text-muted">
                              {n.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onAbrirEdicion(n)}
                          className={`badge badge-${planKey} cursor-pointer hover:opacity-80 transition-opacity`}
                          title="Cambiar plan"
                        >
                          {plan.label}
                        </button>
                      </td>

                      <td className="px-4 py-3 font-display font-semibold text-[12.5px] text-olive-dark">
                        {formatARS(cuota)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-display ${st.pill}`}
                        >
                          <span className={`status-dot ${st.dot}`} />
                          {st.text}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {estKey !== "activo" && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.96 }}
                              disabled={busy}
                              onClick={() => actualizarCobro(n, "activo")}
                              className="px-2.5 py-1 rounded-lg bg-green-50 border border-green-200
                                        text-green-700 font-display text-[10px] flex items-center gap-1
                                        hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 size={11} />
                              Marcar al dia
                            </motion.button>
                          )}

                          {estKey !== "pago_pendiente" && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.96 }}
                              disabled={busy}
                              onClick={() =>
                                actualizarCobro(n, "pago_pendiente")
                              }
                              className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200
                                        text-amber-700 font-display text-[10px] flex items-center gap-1
                                        hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Clock size={11} />
                              Pago pendiente
                            </motion.button>
                          )}

                          {estKey !== "inactivo" && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.96 }}
                              disabled={busy}
                              onClick={() => actualizarCobro(n, "inactivo")}
                              className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/25
                                        text-accent font-display text-[10px] flex items-center gap-1
                                        hover:bg-accent/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Ban size={11} />
                              Suspender
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
