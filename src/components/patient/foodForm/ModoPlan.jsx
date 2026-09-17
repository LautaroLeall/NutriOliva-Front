// ModoPlan.jsx — Panel del modo "Mi Plan" en el formulario de comida
import { X } from "lucide-react";
import { tipoLabel } from "@/lib/foodFormUtils";
import PlanMealPill from "./PlanMealPill";

export default function ModoPlan({
  tipoActual,
  comidasDelMomento,
  otrasComidasPlan,
  planSeleccionada,
  setPlanSel,
  errors,
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-display text-muted uppercase tracking-wide">
        {tipoLabel(tipoActual)} de tu plan
      </p>

      {/* Comidas del momento actual */}
      {comidasDelMomento.length > 0 ? (
        <div className="space-y-1.5">
          {comidasDelMomento.map((c) => (
            <PlanMealPill
              key={c.id}
              comida={c}
              selected={planSeleccionada?.id === c.id}
              onSelect={(c) =>
                setPlanSel((prev) => (prev?.id === c.id ? null : c))
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-[11.5px] text-muted italic">
          No hay {tipoLabel(tipoActual).toLowerCase()} en tu plan.
        </p>
      )}

      {/* Otras comidas del plan (colapsadas) */}
      {otrasComidasPlan.length > 0 && (
        <details className="mt-1">
          <summary className="text-[10.5px] text-muted cursor-pointer hover:text-olive-dark font-display">
            Ver otras comidas del plan
          </summary>
          <div className="space-y-1.5 mt-2">
            {otrasComidasPlan.map((c) => (
              <PlanMealPill
                key={c.id}
                comida={c}
                selected={planSeleccionada?.id === c.id}
                onSelect={(c) =>
                  setPlanSel((prev) => (prev?.id === c.id ? null : c))
                }
              />
            ))}
          </div>
        </details>
      )}

      {errors._plan && (
        <p className="text-[10.5px] text-red-500 flex items-center gap-1">
          <X size={10} /> {errors._plan}
        </p>
      )}
    </div>
  );
}
