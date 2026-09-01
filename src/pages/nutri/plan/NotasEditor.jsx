import { Pencil, X, Check } from "lucide-react";

export default function NotasEditor({
  planVisible,
  readonly,
  editandoNotas,
  setEditandoNotas,
  notasInput,
  setNotasInput,
  handleGuardarNotas,
}) {
  return (
    <div className="card px-5 py-4 mb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[9.5px] font-display text-muted uppercase tracking-wide">
          Notas del plan
        </p>
        {!readonly && !editandoNotas && (
          <button
            onClick={() => {
              setNotasInput(planVisible.notas || "");
              setEditandoNotas(true);
            }}
            className="text-muted hover:text-olive transition-colors"
          >
            <Pencil size={12} />
          </button>
        )}
      </div>
      {editandoNotas ? (
        <div className="space-y-2">
          <input
            className="input text-sm"
            placeholder="Ej: Plan de mantenimiento — Fase 1"
            value={notasInput}
            onChange={(e) => setNotasInput(e.target.value)}
            maxLength={100}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => setEditandoNotas(false)}
              className="flex-1 py-1.5 rounded-lg border border-cream-darker bg-white text-muted
                        font-display text-[11px] hover:bg-cream transition-colors"
            >
              <X size={11} className="inline mr-1" />
              Cancelar
            </button>
            <button
              onClick={handleGuardarNotas}
              className="flex-1 py-1.5 rounded-lg bg-olive text-cream font-display text-[11px]
                        hover:bg-olive-deep transition-colors"
            >
              <Check size={11} className="inline mr-1" />
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[12px] text-olive-dark">
          {planVisible.notas || (
            <span className="text-muted italic">Sin notas</span>
          )}
        </p>
      )}
    </div>
  );
}
