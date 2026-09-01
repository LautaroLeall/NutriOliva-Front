import { Flame, Dumbbell } from "lucide-react";

export default function BalanceDia({
  consumidas,
  gastadas,
  caloriasObjetivo,
  loading,
}) {
  if (loading) return null;
  const netas = consumidas - gastadas;
  const exceso = caloriasObjetivo > 0 && netas > caloriasObjetivo;
  const pct =
    caloriasObjetivo > 0 ? Math.min((netas / caloriasObjetivo) * 100, 100) : 0;

  return (
    <div className="bg-cream border border-cream-darker rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9.5px] font-display text-muted uppercase tracking-wide">
          Balance del día
        </span>
        {caloriasObjetivo > 0 && (
          <span
            className={`text-[10.5px] font-display font-semibold
                            ${exceso ? "text-red-500" : "text-olive"}`}
          >
            {exceso
              ? `+${netas - caloriasObjetivo} kcal sobre el objetivo`
              : `${caloriasObjetivo - netas} kcal restantes`}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span
          className={`font-display font-bold text-2xl
                          ${exceso ? "text-red-500" : "text-olive-dark"}`}
        >
          {netas}
        </span>
        {caloriasObjetivo > 0 && (
          <span className="text-muted text-sm">/ {caloriasObjetivo} kcal</span>
        )}
      </div>

      {caloriasObjetivo > 0 && (
        <div className="w-full bg-white rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className={`h-1.5 rounded-full transition-all duration-500
                        ${exceso ? "bg-red-400" : "bg-olive"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="flex gap-4">
        <span className="flex items-center gap-1 text-[10.5px] font-display text-olive">
          <Flame size={11} /> +{consumidas} consumidas
        </span>
        <span className="flex items-center gap-1 text-[10.5px] font-display text-blue-400">
          <Dumbbell size={11} /> -{gastadas} gastadas
        </span>
      </div>
    </div>
  );
}
