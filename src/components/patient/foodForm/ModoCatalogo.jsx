// ModoCatalogo.jsx — Panel del modo "Catálogo" con input de label flotante e ícono animado

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [focused, setFocused] = useState(false);
  const hasValue = query?.length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="space-y-2.5">
      {itemSeleccionado ? (
        <ComidaSeleccionadaCard
          item={itemSeleccionado}
          onLimpiar={limpiarSeleccion}
        />
      ) : (
        <div className="flex flex-col">
          {/* Wrapper interno de altura fija — el error vive fuera */}
          <div className="relative">
            <motion.div
              animate={{
                color: focused ? "#6E7A4B" : "#9B9484",
                scale: focused ? 1.1 : 1,
              }}
              transition={{ duration: 0.16 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              {buscando ? (
                <Loader2 size={14} className="animate-spin text-olive" />
              ) : (
                <Search size={14} strokeWidth={1.75} />
              )}
            </motion.div>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setErrors((er) => ({ ...er, catalogo: undefined }));
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder=""
              autoFocus
              autoComplete="off"
              className={`w-full pl-9 pr-3 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                          font-body text-olive-dark
                          focus:outline-none focus:ring-2 transition-all duration-150
                          ${errors.catalogo
                  ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                  : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                }`}
            />

            <motion.label
              animate={{
                top: lifted ? "6px" : "50%",
                y: lifted ? "0%" : "-50%",
                fontSize: lifted ? "9.5px" : "12.5px",
                color: focused ? "#6E7A4B" : errors.catalogo ? "#D85A30" : "#9B9484",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-9 right-3 font-display pointer-events-none leading-none"
            >
              Buscar en el catalogo (ej: pollo, avena, salmon...)
            </motion.label>
          </div>

          {/* Error animado fuera del wrapper */}
          <AnimatePresence>
            {errors.catalogo && (
              <motion.p
                key="cat-err"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.16 }}
                className="text-[10.5px] text-accent ml-1 overflow-hidden"
              >
                {errors.catalogo}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Hint de búsqueda multi-palabra */}
          {!buscando &&
            query
              .trim()
              .split(/\s+/)
              .filter((w) => w.length >= 2).length > 1 && (
              <p className="text-[9.5px] text-olive mt-1 font-display ml-1">
                Buscando todos los terminos juntos...
              </p>
            )}

          {/* Dropdown de resultados */}
          <FloatingDropdown
            anchorRef={inputRef}
            visible={sugs.length > 0 || (query.trim().length >= 2 && !buscando)}
            maxH={260}
          >
            {sugs.map((item) => (
              <ResultItem
                key={item.nombre}
                item={item}
                onSelect={seleccionarItem}
              />
            ))}

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
              No encuentro lo que busco — Otra comida
            </button>
          </FloatingDropdown>
        </div>
      )}
    </div>
  );
}
