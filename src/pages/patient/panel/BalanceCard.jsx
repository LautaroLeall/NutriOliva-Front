import { Flame, Dumbbell, Loader2 } from "lucide-react";

export default function BalanceCard({ balance, caloriasObjetivo, loading }) {
  const { consumidas, gastadas, netas, restante, pct, barColor, estaEnExceso } =
    balance;

  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-5 mb-4">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={18} className="animate-spin text-muted" />
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
                Balance del día
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-display font-bold text-3xl
                                  ${estaEnExceso ? "text-red-500" : "text-olive-dark"}`}
                >
                  {netas}
                </span>
                <span className="text-muted text-sm">
                  / {caloriasObjetivo} kcal
                </span>
              </div>
            </div>

            {/* Pills de desglose */}
            <div className="flex flex-col gap-1 items-end">
              <span className="flex items-center gap-1 text-[10.5px] font-display text-olive">
                <Flame size={11} /> +{consumidas} consumidas
              </span>
              <span className="flex items-center gap-1 text-[10.5px] font-display text-blue-400">
                <Dumbbell size={11} /> -{gastadas} gastadas
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>

          <div className="flex justify-between mt-1.5">
            <span className="text-[9.5px] text-muted">{pct}% del objetivo</span>
            <span
              className={`text-[9.5px] font-display font-medium
                              ${estaEnExceso ? "text-red-500" : "text-muted"}`}
            >
              {estaEnExceso
                ? `+${Math.abs(restante)} kcal sobre el objetivo`
                : `${restante} kcal restantes`}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
