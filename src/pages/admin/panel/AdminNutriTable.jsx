// AdminNutriTable.jsx — Tabla de nutricionistas con barra de cupo interactiva y acciones rapidas

import {
  Users,
  Pencil,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  DEFAULT_PLANS,
  normalizarEstado,
  initials,
  formatARS,
  formatFechaCorta,
  ActionBtn,
  StatusColorDot,
  TableSkeleton,
} from "./adminUtils";

export default function AdminNutriTable({
  loading,
  filtrados,
  planesConfig = DEFAULT_PLANS,
  actualizandoId,
  onAbrirEdicion,
  onAbrirPacientes,
  onCambioRapidoEstado,
}) {
  const [tbodyRef] = useAutoAnimate({ duration: 200 });

  if (loading) {
    return <TableSkeleton rows={5} />;
  }

  if (filtrados.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="font-display text-sm text-olive-dark">
          No se encontraron nutricionistas con esos filtros.
        </p>
        <p className="text-xs text-muted mt-1">
          Prueba limpiando la busqueda o creando un nuevo profesional.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {[
              "Profesional",
              "Plan",
              "Pacientes / Cupo",
              "Estado",
              "Alta",
              "Acciones",
            ].map((h, i) => (
              <th
                key={h}
                className={`bg-white text-muted font-display text-[9.5px] uppercase tracking-wide px-4 py-2.5 border-b border-cream-dark ${
                  i === 5
                    ? "text-right"
                    : i === 3
                      ? "text-center"
                      : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {filtrados.map((n) => {
            const estKey = normalizarEstado(n.estado);
            const planKey = (n.plan_suscripcion || "starter").toLowerCase();
            const planInfo = planesConfig[planKey] || DEFAULT_PLANS.starter;
            const pacCount = n.total_pacientes || 0;
            const cupoExtra = n.cupo_extra || 0;
            const maxPac = n.cupo_maximo || planInfo.patients + cupoExtra;
            const esIlimitado = planInfo.patients >= 9999;
            const pctUso = esIlimitado
              ? Math.min(100, pacCount * 4)
              : Math.min(100, Math.round((pacCount / Math.max(1, maxPac)) * 100));
            const isBusy = actualizandoId === n.id;

            return (
              <tr
                key={n.id}
                className="border-b border-cream last:border-0 hover:bg-cream/45 transition-colors"
              >
                {/* Profesional */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="avatar text-[10px] flex-shrink-0">
                      {initials(n.nombre)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-olive-dark text-[12px] truncate">
                        {n.nombre}
                      </div>
                      <div className="text-[10.5px] text-muted truncate">
                        {n.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onAbrirEdicion(n)}
                    className="flex flex-col items-start gap-0.5 cursor-pointer group"
                    title="Cambiar plan o editar profesional"
                  >
                    <span
                      className={`badge badge-${planKey} group-hover:opacity-85 transition-opacity`}
                    >
                      {planInfo.label}
                    </span>
                    <span className="text-[9.5px] text-muted font-display group-hover:text-olive-dark transition-colors">
                      {formatARS(n.precio_mensual_ars ?? planInfo.price)}/mes
                    </span>
                  </button>
                </td>

                {/* Pacientes y barra de cupo interactiva */}
                <td className="px-4 py-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAbrirPacientes(n)}
                    className="w-36 text-left p-2 rounded-xl border border-transparent hover:border-cream-darker hover:bg-cream/70 transition-all cursor-pointer group"
                    title="Haz clic para ver pacientes y ajustar cupo"
                  >
                    <div className="flex justify-between items-baseline text-[11px] mb-1">
                      <span className="font-semibold text-olive-dark group-hover:text-olive transition-colors">
                        {pacCount}{" "}
                        <span className="font-normal text-[10px] text-muted">
                          pac.
                        </span>
                      </span>
                      <span className="text-[9.5px] text-muted font-display">
                        / {esIlimitado ? "Ilimitado" : maxPac}
                        {cupoExtra > 0 && !esIlimitado ? ` (+${cupoExtra})` : ""}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-cream-darker overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pctUso}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          pctUso >= 90
                            ? "bg-accent"
                            : pctUso >= 70
                              ? "bg-amber-500"
                              : "bg-olive"
                        }`}
                      />
                    </div>
                    <div className="text-[9px] text-olive font-display mt-1 opacity-80 group-hover:opacity-100">
                      Gestionar cupo y lista
                    </div>
                  </motion.button>
                </td>

                {/* Estado (identificado solo por color: verde activo, amarillo pago pendiente, rojo inactivo) */}
                <td className="px-4 py-3 text-center">
                  <StatusColorDot estKey={estKey} />
                </td>

                {/* Fecha de alta */}
                <td className="px-4 py-3 text-[11px] text-muted font-display whitespace-nowrap">
                  {formatFechaCorta(n.fecha_alta)}
                </td>

                {/* Acciones con tooltips animados */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn
                      tooltip="Pacientes y cupo"
                      onClick={() => onAbrirPacientes(n)}
                    >
                      <Users size={13} />
                    </ActionBtn>

                    {estKey !== "activo" && (
                      <ActionBtn
                        tooltip="Marcar como Activo"
                        variant="success"
                        disabled={isBusy}
                        onClick={() => onCambioRapidoEstado(n, "activo")}
                      >
                        <CheckCircle2 size={13} />
                      </ActionBtn>
                    )}

                    {estKey !== "pago_pendiente" && (
                      <ActionBtn
                        tooltip="Marcar Pago pendiente"
                        variant="warning"
                        disabled={isBusy}
                        onClick={() => onCambioRapidoEstado(n, "pago_pendiente")}
                      >
                        <Clock size={13} />
                      </ActionBtn>
                    )}

                    {estKey !== "inactivo" && (
                      <ActionBtn
                        tooltip="Suspender / Inactivar"
                        variant="danger"
                        disabled={isBusy}
                        onClick={() => onCambioRapidoEstado(n, "inactivo")}
                      >
                        <Ban size={13} />
                      </ActionBtn>
                    )}

                    <ActionBtn
                      tooltip="Editar nutricionista"
                      onClick={() => onAbrirEdicion(n)}
                    >
                      <Pencil size={13} />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
