// ComidaSeleccionadaCard.jsx — Tarjeta de comida seleccionada del catalogo (estado bloqueado)
import { CheckCircle, X } from "lucide-react";

export default function ComidaSeleccionadaCard({ item, onLimpiar }) {
  return (
    <div className="rounded-xl border-2 border-olive/40 bg-olive/5 px-4 py-3">
      <div className="flex items-start gap-3">
        <CheckCircle size={16} className="text-olive flex-shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <p className="font-display text-[12.5px] font-semibold text-olive-dark leading-snug">
            {item.nombre}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.calorias_por_unidad && (
              <span className="bg-olive/15 text-olive-dark font-display font-bold text-[11px] px-2 py-0.5 rounded-lg">
                {Math.round(item.calorias_por_unidad)} kcal
              </span>
            )}
            {item.proteinas_g && (
              <span className="text-[10px] text-muted">
                P: {item.proteinas_g}g
              </span>
            )}
            {item.carbos_g && (
              <span className="text-[10px] text-muted">
                C: {item.carbos_g}g
              </span>
            )}
            {item.grasas_g && (
              <span className="text-[10px] text-muted">
                G: {item.grasas_g}g
              </span>
            )}
          </div>

          {item.objetivo_ideal && (
            <p className="text-[9.5px] text-muted mt-1 italic">
              {item.objetivo_ideal}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          title="Cambiar comida"
          className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-cream-darker
                      flex items-center justify-center text-muted hover:text-olive-dark
                    hover:border-olive/50 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
