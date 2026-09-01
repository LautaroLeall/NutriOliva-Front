import { ClipboardList, Loader2 } from "lucide-react";

export default function TabPlan({ loadingInf, planActivo, comidasPlan }) {
  return (
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
  );
}
