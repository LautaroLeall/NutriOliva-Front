import { Loader2 } from "lucide-react";
import BalanceCard from "./BalanceCard";
import DayCalendar from "@/components/patient/DayCalendar";
import Timeline from "@/components/patient/Timeline";
import { formatFechaLegible } from "./patientPanelUtils";

export default function TabHoy({
  balance,
  caloriasObjetivo,
  loadingInf,
  loadingReg,
  fecha,
  setFecha,
  comidas,
  actividades,
  comidasPlan,
  pacienteId,
  handleEliminarComida,
  handleEliminarActividad,
  handleEditarComida,
}) {
  return (
    <>
      {/* Balance */}
      <BalanceCard
        balance={balance}
        caloriasObjetivo={caloriasObjetivo}
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
  );
}
