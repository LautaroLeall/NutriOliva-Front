// ModoCatalogo.jsx — Panel del modo "Catalogo" en el formulario de comida
import { Loader2, Search, X } from "lucide-react";
import FloatingDropdown from "@/components/ui/FloatingDropdown";
import ComidaSeleccionadaCard from "./ComidaSeleccionadaCard";
import ResultItem from "./ResultItem";

export default function ModoCatalogo({
  query,
  setQuery,
  setErrors,
  inputRef,
  buscando,
  sugs,
  itemSeleccionado,
  seleccionarItem,
  limpiarSeleccion,
  cambiarModo,
  errors,
}) {
  return (
    <div className="space-y-3">
      {/* Estado A: item ya seleccionado (bloqueado) */}
      {itemSeleccionado ? (
        <ComidaSeleccionadaCard
          item={itemSeleccionado}
          onLimpiar={limpiarSeleccion}
        />
      ) : (
        /* Estado B: buscando */
        <div>
          <label className="label">Buscar en el catálogo</label>

          <div className="relative">
            <input
              ref={inputRef}
              className={`input pr-9 ${errors.catalogo ? "border-red-400" : ""}`}
              placeholder="Ej: pollo, avena, pollo arroz, salmón..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setErrors((er) => ({ ...er, catalogo: undefined }));
              }}
              autoFocus
              autoComplete="off"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {buscando ? (
                <Loader2 size={14} className="text-muted animate-spin" />
              ) : (
                <Search size={14} className="text-muted" />
              )}
            </div>
          </div>

          {/* Hint de busqueda multi-palabra */}
          {!buscando &&
            query
              .trim()
              .split(/\s+/)
              .filter((w) => w.length >= 2).length > 1 && (
              <p className="text-[9.5px] text-olive mt-1 font-display">
                Buscando todos los terminos juntos...
              </p>
            )}

          {/* Dropdown de resultados */}
          <FloatingDropdown
            anchorRef={inputRef}
            visible={sugs.length > 0}
            maxH={280}
          >
            {sugs.map((item) => (
              <ResultItem
                key={item.nombre}
                item={item}
                onSelect={seleccionarItem}
              />
            ))}

            {/* Sin resultados — opcion de ir a Otra */}
            {query.trim().length >= 2 && sugs.length === 0 && !buscando && (
              <div className="px-4 py-3 text-center">
                <p className="text-[11px] text-muted">
                  No encontramos resultados para "{query}"
                </p>
                <button
                  type="button"
                  onClick={() => cambiarModo("otra")}
                  className="mt-1 text-[10.5px] text-olive font-display hover:underline"
                >
                  Cargar como "Otra comida"
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => cambiarModo("otra")}
              className="w-full text-left px-4 py-2.5 text-[11px] text-muted italic
                        hover:bg-cream transition-colors border-t border-cream-darker/40 font-display"
            >
              No encuentro lo que busco → Otra comida
            </button>
          </FloatingDropdown>
        </div>
      )}

      {errors.catalogo && (
        <p className="text-[10.5px] text-red-500 flex items-center gap-1">
          <X size={10} /> {errors.catalogo}
        </p>
      )}
    </div>
  );
}
