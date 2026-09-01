import { CheckCircle2, X, FilePen } from "lucide-react";

export default function CaloriasEditor({
  planVisible,
  readonly,
  editandoCal,
  setEditandoCal,
  nuevasCal,
  setNuevasCal,
  calEditError,
  setCalEditError,
  handleGuardarCalorias,
}) {
  return (
    <div className="card px-5 py-4 mb-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
          Objetivo calórico diario
        </p>
        {editandoCal ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={`input py-1 text-sm w-32 ${calEditError ? "border-red-400" : ""}`}
                value={nuevasCal}
                onChange={(e) => {
                  setNuevasCal(e.target.value);
                  setCalEditError("");
                }}
                autoFocus
                min={500}
                max={6000}
              />
              <span className="text-sm text-muted">kcal</span>
              <button
                onClick={handleGuardarCalorias}
                className="text-green-500 hover:text-green-600 transition-colors"
              >
                <CheckCircle2 size={18} />
              </button>
              <button
                onClick={() => {
                  setEditandoCal(false);
                  setCalEditError("");
                }}
                className="text-muted hover:text-olive-dark transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {calEditError && (
              <p className="text-[10.5px] text-red-500">{calEditError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-xl text-olive-dark">
              {planVisible.calorias_objetivo}
            </span>
            <span className="text-sm text-muted">kcal / día</span>
            {!readonly && (
              <button
                onClick={() => {
                  setNuevasCal(String(planVisible.calorias_objetivo));
                  setEditandoCal(true);
                  setCalEditError("");
                }}
                className="text-muted hover:text-olive transition-colors ml-1"
              >
                <FilePen size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resumen calorías del plan */}
      {planVisible.comidas_plan?.length > 0 &&
        (() => {
          const total = planVisible.comidas_plan.reduce(
            (s, c) => s + (c.calorias_aprox || 0),
            0,
          );
          const diff = total - planVisible.calorias_objetivo;
          if (total === 0) return null;
          return (
            <div className="text-right flex-shrink-0">
              <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-0.5">
                Total en el plan
              </p>
              <p
                className={`font-display font-semibold text-xl ${
                  Math.abs(diff) < 100
                    ? "text-green-500"
                    : diff > 0
                      ? "text-red-500"
                      : "text-olive-dark"
                }`}
              >
                {total} kcal
              </p>
              <p className="text-[10px] text-muted">
                {diff > 0 ? `+${diff}` : diff} vs objetivo
              </p>
            </div>
          );
        })()}
    </div>
  );
}
