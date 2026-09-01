import WeeklyCaloriesChart from "@/components/ui/WeeklyCaloriesChart";

export default function TabTendencia({ puntosSemanales, loadingTendencia, caloriasObjetivo }) {
  return (
    <div className="space-y-4">
      <WeeklyCaloriesChart
        puntos={puntosSemanales}
        loading={loadingTendencia}
        titulo="Mis últimos 7 días"
        caloriasObjetivo={caloriasObjetivo}
      />

      {/* Resumen textual */}
      {!loadingTendencia &&
        puntosSemanales.length > 0 &&
        (() => {
          const conDatos = puntosSemanales.filter(
            (p) => p.registroExistente,
          );
          const diasCumple = conDatos.filter(
            (p) => p.estado === "cumple",
          ).length;
          const diasExceso = conDatos.filter(
            (p) => p.estado === "exceso",
          ).length;
          const promedio =
            conDatos.length > 0
              ? Math.round(
                  conDatos.reduce((s, p) => s + (p.netas || 0), 0) /
                    conDatos.length,
                )
              : 0;
          return (
            <div className="bg-white rounded-2xl border border-cream-darker p-5">
              <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-3">
                Resumen de la semana
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Dias registrados",
                    value: conDatos.length,
                    unit: `/ ${puntosSemanales.length}`,
                  },
                  {
                    label: "Dias en objetivo",
                    value: diasCumple,
                    unit: "dias",
                  },
                  {
                    label: "Promedio diario",
                    value: promedio,
                    unit: "kcal",
                  },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="text-center">
                    <div className="font-display font-bold text-xl text-olive-dark">
                      {value}
                    </div>
                    <div className="text-[9px] text-muted mt-0.5 font-display">
                      {unit}
                    </div>
                    <div className="text-[9px] text-muted mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              {diasExceso > 0 && (
                <p className="text-[10.5px] text-muted mt-4 pt-3 border-t border-cream">
                  {diasExceso === 1
                    ? "Tuviste 1 dia con exceso calorico esta semana."
                    : `Tuviste ${diasExceso} dias con exceso calorico esta semana.`}
                </p>
              )}
            </div>
          );
        })()}
    </div>
  );
}
