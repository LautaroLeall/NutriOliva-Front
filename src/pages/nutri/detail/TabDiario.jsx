import { Loader2 } from "lucide-react";
import DayCalendar from "@/components/patient/DayCalendar";
import Timeline from "@/components/patient/Timeline";
import WeeklyCaloriesChart from "@/components/ui/WeeklyCaloriesChart";
import BalanceDia from "./BalanceDia";
import { formatFechaLegible } from "./patientDetailUtils";

export default function TabDiario({
  fechaDiario,
  setFechaDiario,
  loadingDiario,
  comidasNutri,
  actividadesNutri,
  totalConsumidas,
  totalGastadas,
  caloriasObjetivo,
  puntosSemanales,
  loadingTendencia,
  nombrePaciente,
}) {
  return (
    <div className="p-4">
      <DayCalendar fechaActiva={fechaDiario} onChange={setFechaDiario} />

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-semibold text-olive-dark capitalize">
          {formatFechaLegible(fechaDiario)}
        </h3>
        {loadingDiario && (
          <Loader2 size={14} className="animate-spin text-muted" />
        )}
      </div>

      {!loadingDiario &&
        (comidasNutri.length > 0 || actividadesNutri.length > 0) && (
          <BalanceDia
            consumidas={totalConsumidas}
            gastadas={totalGastadas}
            caloriasObjetivo={caloriasObjetivo}
            loading={loadingDiario}
          />
        )}

      {!loadingDiario && (
        <Timeline
          comidas={comidasNutri}
          actividades={actividadesNutri}
          onEliminarComida={null}
          onEliminarActividad={null}
          onEditarComida={null}
        />
      )}

      <div className="border-t border-cream-darker my-4" />

      <WeeklyCaloriesChart
        puntos={puntosSemanales}
        loading={loadingTendencia}
        titulo={`Adherencia de ${nombrePaciente} — últimos 7 días`}
        caloriasObjetivo={caloriasObjetivo}
      />
    </div>
  );
}
