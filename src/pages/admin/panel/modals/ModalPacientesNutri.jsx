// ModalPacientesNutri.jsx — Modal para gestionar pacientes, cupo extra y consumo IA de un nutricionista

import { useState, useEffect, useMemo } from "react";
import {
  Check,
  Loader2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Ban,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import {
  DEFAULT_PLANS,
  initials,
  formatFechaCorta,
  formatARS,
} from "../adminUtils";

export function ModalPacientesNutri({
  nutricionista,
  pacientesAll = [],
  registrosComida = [],
  planesConfig = DEFAULT_PLANS,
  onClose,
  actualizarCupoExtra,
  cambiarEstadoPacienteAdmin,
}) {
  const [cupoExtraLocal, setCupoExtraLocal] = useState(0);
  const [guardandoCupo, setGuardandoCupo] = useState(false);
  const [procesandoPacId, setProcesandoPacId] = useState(null);
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    if (nutricionista) {
      setCupoExtraLocal(nutricionista.cupo_extra || 0);
      setPagina(0);
    }
  }, [nutricionista]);

  const pacientesDelNutri = useMemo(() => {
    if (!nutricionista) return [];
    return pacientesAll.filter((p) => p.nutricionista_id === nutricionista.id);
  }, [pacientesAll, nutricionista]);

  // Consumo de IA por paciente de este nutricionista
  const iaPorPaciente = useMemo(() => {
    const map = {};
    registrosComida.forEach((r) => {
      if (!r.paciente_id) return;
      if (!map[r.paciente_id]) map[r.paciente_id] = { total: 0, ia: 0 };
      map[r.paciente_id].total += 1;
      if (r.fuente_estimacion === "ia") map[r.paciente_id].ia += 1;
    });
    return map;
  }, [registrosComida]);

  if (!nutricionista) return null;

  const costoUnitarioArs = Number(
    localStorage.getItem("nutrioliva_costo_ia_ars") ?? 2
  );
  const totalIANutri = pacientesDelNutri.reduce(
    (acc, p) => acc + (iaPorPaciente[p.id]?.ia || 0),
    0
  );

  const planKey = (nutricionista.plan_suscripcion || "starter").toLowerCase();
  const plan = planesConfig[planKey] || DEFAULT_PLANS.starter;
  const esIlimitado = plan.patients >= 9999;
  const cupoTotal = esIlimitado ? 9999 : plan.patients + cupoExtraLocal;
  const activosCount = pacientesDelNutri.filter(
    (p) => p.estado === "activo"
  ).length;
  const pctUso = esIlimitado
    ? Math.min(100, activosCount * 4)
    : Math.min(100, Math.round((activosCount / Math.max(1, cupoTotal)) * 100));

  const POR_PAGINA = 3;
  const totalPaginas = Math.max(
    1,
    Math.ceil(pacientesDelNutri.length / POR_PAGINA)
  );
  const paginaSegura = Math.min(pagina, totalPaginas - 1);
  const pacientesPaginados = pacientesDelNutri.slice(
    paginaSegura * POR_PAGINA,
    (paginaSegura + 1) * POR_PAGINA
  );

  async function guardarNuevoCupo() {
    setGuardandoCupo(true);
    const { error } = await actualizarCupoExtra(
      nutricionista.id,
      cupoExtraLocal
    );
    setGuardandoCupo(false);
    if (error) {
      toast.error("No se pudo actualizar el cupo: " + error);
    } else {
      toast.success(`Cupo de ${nutricionista.nombre} actualizado en Supabase`);
    }
  }

  async function toggleEstadoPaciente(p) {
    const nuevoEstado = p.estado === "activo" ? "inactivo" : "activo";
    setProcesandoPacId(p.id);
    const { error } = await cambiarEstadoPacienteAdmin(p.id, nuevoEstado);
    setProcesandoPacId(null);
    if (error) {
      toast.error("Error al cambiar estado del paciente: " + error);
    } else {
      toast.success(
        `Paciente ${p.nombre} marcado como ${nuevoEstado === "activo" ? "Activo" : "Inactivo"
        }`
      );
    }
  }

  return (
    <Modal
      open={Boolean(nutricionista)}
      onClose={onClose}
      title={`Pacientes y cupo — ${nutricionista.nombre}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Resumen de Cupo y Controles de Cupo Extra */}
        <div className="p-3.5 rounded-xl bg-cream border border-cream-darker space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`badge badge-${planKey}`}>{plan.label}</span>
              <span className="font-display text-[12px] font-semibold text-olive-dark">
                {activosCount} activos{" "}
                <span className="text-muted font-normal">
                  / {esIlimitado ? "Cupo ilimitado" : `${cupoTotal} cupo total`}
                </span>
              </span>
            </div>

            {!esIlimitado && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-display text-muted">
                  Cupo extra:
                </span>
                <button
                  type="button"
                  onClick={() => setCupoExtraLocal((v) => Math.max(0, v - 1))}
                  className="w-6 h-6 rounded-lg bg-white border border-cream-darker flex items-center justify-center text-olive-dark hover:bg-cream-dark cursor-pointer"
                >
                  <Minus size={11} />
                </button>
                <span className="w-8 text-center font-display text-[12px] font-semibold text-olive-dark">
                  +{cupoExtraLocal}
                </span>
                <button
                  type="button"
                  onClick={() => setCupoExtraLocal((v) => v + 1)}
                  className="w-6 h-6 rounded-lg bg-white border border-cream-darker flex items-center justify-center text-olive-dark hover:bg-cream-dark cursor-pointer"
                >
                  <Plus size={11} />
                </button>

                {cupoExtraLocal !== (nutricionista.cupo_extra || 0) && (
                  <motion.button
                    type="button"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    disabled={guardandoCupo}
                    onClick={guardarNuevoCupo}
                    className="ml-1 px-2.5 py-1 rounded-lg bg-olive text-cream font-display text-[10px] flex items-center gap-1 hover:bg-olive-deep cursor-pointer"
                  >
                    {guardandoCupo ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Check size={10} />
                    )}
                    Guardar
                  </motion.button>
                )}
              </div>
            )}
          </div>

          <div className="h-2 w-full rounded-full bg-cream-darker overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctUso}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={`h-full rounded-full ${pctUso >= 90
                  ? "bg-accent"
                  : pctUso >= 70
                    ? "bg-amber-500"
                    : "bg-olive"
                }`}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-2 text-[10px] text-muted font-display">
            <span>
              Base del plan {plan.label}:{" "}
              {esIlimitado ? "Ilimitado" : `${plan.patients} pacientes`}
            </span>
            <span className="inline-flex items-center gap-1 text-olive-dark font-semibold">
              <Sparkles size={11} className="text-olive" />
              Consumo IA del nutri: {totalIANutri} consultas (
              {formatARS(totalIANutri * costoUnitarioArs)})
            </span>
          </div>
        </div>

        {/* Lista de pacientes del nutricionista (paginada sin scroll) */}
        <div className="border border-cream-darker rounded-xl overflow-hidden bg-white">
          <div className="px-3.5 py-2.5 bg-[#FAF8F3] border-b border-cream-darker flex items-center justify-between">
            <span className="font-display text-[11px] font-semibold text-olive-dark">
              Cartera de pacientes ({pacientesDelNutri.length})
            </span>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={paginaSegura === 0}
                  onClick={() => setPagina((p) => Math.max(0, p - 1))}
                  className="w-6 h-6 rounded-md border border-cream-darker bg-white flex items-center justify-center text-olive-dark disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={12} />
                </button>
                <span className="font-display text-[10px] text-muted">
                  {paginaSegura + 1} / {totalPaginas}
                </span>
                <button
                  type="button"
                  disabled={paginaSegura >= totalPaginas - 1}
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas - 1, p + 1))
                  }
                  className="w-6 h-6 rounded-md border border-cream-darker bg-white flex items-center justify-center text-olive-dark disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            )}
          </div>

          {pacientesDelNutri.length === 0 ? (
            <div className="py-8 text-center text-muted font-display text-xs">
              Este profesional aun no tiene pacientes dados de alta.
            </div>
          ) : (
            <div className="divide-y divide-cream">
              {pacientesPaginados.map((p) => {
                const esActivo = p.estado === "activo";
                const busy = procesandoPacId === p.id;
                const iaPac = iaPorPaciente[p.id]?.ia || 0;
                return (
                  <div
                    key={p.id}
                    className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-cream/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="avatar text-[10px] flex-shrink-0">
                        {initials(p.nombre)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-olive-dark text-[12px] truncate">
                          {p.nombre}
                        </div>
                        <div className="text-[10px] text-muted truncate">
                          {p.email}
                          {p.telefono ? ` · ${p.telefono}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        title="Comidas estimadas con IA por este paciente"
                        className="text-[10px] text-olive-dark bg-cream px-2 py-0.5 rounded-md border border-cream-darker font-display"
                      >
                        IA: {iaPac} ({formatARS(iaPac * costoUnitarioArs)})
                      </span>

                      <span className="text-[10px] text-muted font-display hidden sm:inline">
                        {formatFechaCorta(p.created_at)}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-display ${esActivo
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-cream text-muted border-cream-darker"
                          }`}
                      >
                        <span
                          className={`status-dot ${esActivo ? "bg-success" : "bg-muted"
                            }`}
                        />
                        {esActivo ? "Activo" : "Inactivo"}
                      </span>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={busy}
                        onClick={() => toggleEstadoPaciente(p)}
                        className={`px-2.5 py-1 rounded-lg font-display text-[10px] flex items-center gap-1 cursor-pointer border transition-colors disabled:opacity-50 ${esActivo
                            ? "bg-accent/10 text-accent border-accent/25 hover:bg-accent/20"
                            : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          }`}
                      >
                        {busy ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : esActivo ? (
                          <>
                            <Ban size={10} /> Inactivar
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={10} /> Activar
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-olive text-cream font-display text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors"
          >
            Cerrar
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
