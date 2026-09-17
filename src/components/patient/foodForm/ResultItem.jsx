// ResultItem.jsx — Resultado individual del dropdown de busqueda del catalogo
import { tipoLabel } from "@/lib/foodFormUtils";

export default function ResultItem({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="w-full text-left px-4 py-3 hover:bg-cream transition-colors
                  border-b border-cream-darker/40 last:border-0 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="font-display text-[12px] text-olive-dark font-medium leading-snug
                        group-hover:text-olive transition-colors"
          >
            {item.nombre}
          </p>

          {item.descripcion_completa && (
            <p className="text-[9.5px] text-muted mt-0.5 leading-snug line-clamp-1">
              {item.descripcion_completa}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.proteinas_g && (
              <span className="text-[9px] text-muted">
                P: {item.proteinas_g}g
              </span>
            )}
            {item.carbos_g && (
              <span className="text-[9px] text-muted">C: {item.carbos_g}g</span>
            )}
            {item.grasas_g && (
              <span className="text-[9px] text-muted">G: {item.grasas_g}g</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          {item.calorias_por_unidad && (
            <span
              className="inline-block bg-olive/10 text-olive-dark font-display font-bold
                          text-[11px] px-2 py-0.5 rounded-lg"
            >
              {Math.round(item.calorias_por_unidad)} kcal
            </span>
          )}
          {item.tipo_comida && (
            <p className="text-[9px] text-muted mt-0.5">
              {tipoLabel(item.tipo_comida)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
