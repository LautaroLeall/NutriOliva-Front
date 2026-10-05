// CatalogoTable.jsx — Tabla de alimentos con skeleton, filas animadas y paginación

import { Pencil, Trash2, Loader2, AlertCircle, ChevronLeft, ChevronRight, UtensilsCrossed, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";
import { POR_PAGINA } from "./catalogoConstants";

// ── Skeleton shimmer ─────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="divide-y divide-cream">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3.5">
          <div className="h-2.5 bg-cream-darker rounded-full w-40 animate-pulse" />
          <div className="flex gap-4 ml-auto">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-2.5 bg-cream-darker rounded-full w-10 animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Fila de alimento animada ─────────────────────────────────────────────
function AlimentoRow({ alimento, onEditar, onEliminar, index }) {
  const a = alimento;
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      className="border-b border-cream last:border-0 group hover:bg-cream/50 transition-colors duration-150"
    >
      <td className="px-5 py-3">
        <span className="font-medium text-olive-dark text-[13px] group-hover:text-olive transition-colors">
          {a.nombre}
        </span>
      </td>
      <td className="px-5 py-3">
        <span className="font-semibold text-olive-dark text-[13px]">{a.calorias_por_unidad}</span>
        <span className="text-[10px] text-muted ml-0.5">kcal</span>
      </td>
      <td className="px-5 py-3 text-[12px] text-muted">{a.proteinas_g != null ? `${a.proteinas_g}g` : "—"}</td>
      <td className="px-5 py-3 text-[12px] text-muted">{a.carbos_g != null ? `${a.carbos_g}g` : "—"}</td>
      <td className="px-5 py-3 text-[12px] text-muted">{a.grasas_g != null ? `${a.grasas_g}g` : "—"}</td>
      <td className="px-5 py-3">
        <span className="inline-block bg-cream-darker text-muted text-[10px] font-display
                          px-2 py-0.5 rounded-full">
          {a.unidad}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <motion.button
            onClick={() => onEditar(a)}
            whileHover={{ scale: 1.15, backgroundColor: "#F0EDE4" }}
            whileTap={{ scale: 0.85 }}
            title="Editar"
            className="p-2 rounded-xl text-muted hover:text-olive transition-colors focus:outline-none"
          >
            <Pencil size={13} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            onClick={() => onEliminar(a)}
            whileHover={{ scale: 1.15, backgroundColor: "#FEF2F2" }}
            whileTap={{ scale: 0.85 }}
            title="Eliminar"
            className="p-2 rounded-xl text-muted hover:text-accent transition-colors focus:outline-none"
          >
            <Trash2 size={13} strokeWidth={1.8} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Paginación ────────────────────────────────────────────────────────────
function Paginacion({ paginaActual, totalPaginas, filtrados, setPagina }) {
  if (totalPaginas <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between px-5 py-3 border-t border-cream-darker"
    >
      <span className="text-[10.5px] text-muted font-display">
        Mostrando {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, filtrados.length)} de {filtrados.length}
      </span>

      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <motion.button
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={paginaActual === 1}
          whileHover={paginaActual > 1 ? { scale: 1.1 } : {}}
          whileTap={paginaActual > 1 ? { scale: 0.9 } : {}}
          className="p-1.5 rounded-lg text-muted hover:text-olive-dark hover:bg-cream
                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none"
        >
          <ChevronLeft size={14} />
        </motion.button>

        {/* Números */}
        <div className="flex gap-1">
          {[...Array(totalPaginas)].map((_, i) => {
            const p = i + 1;
            if (totalPaginas <= 5 || p === 1 || p === totalPaginas ||
              (p >= paginaActual - 1 && p <= paginaActual + 1)) {
              return (
                <motion.button
                  key={p}
                  onClick={() => setPagina(p)}
                  animate={{
                    backgroundColor: p === paginaActual ? "#6E7A4B" : "transparent",
                    color: p === paginaActual ? "#F6F1E7" : "#69644D",
                  }}
                  whileHover={p !== paginaActual ? { backgroundColor: "#EDE8DF" } : {}}
                  transition={{ duration: 0.15 }}
                  className="w-7 h-7 rounded-lg text-[11px] font-display focus:outline-none"
                >
                  {p}
                </motion.button>
              );
            }
            if (p === paginaActual - 2 || p === paginaActual + 2) {
              return <span key={p} className="w-7 h-7 flex items-end justify-center text-[11px] text-muted pb-0.5">…</span>;
            }
            return null;
          })}
        </div>

        {/* Next */}
        <motion.button
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaActual === totalPaginas}
          whileHover={paginaActual < totalPaginas ? { scale: 1.1 } : {}}
          whileTap={paginaActual < totalPaginas ? { scale: 0.9 } : {}}
          className="p-1.5 rounded-lg text-muted hover:text-olive-dark hover:bg-cream
                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none"
        >
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Componente principal de la tabla ─────────────────────────────────────
export default function CatalogoTable({
  loading, error, alimentos, filtrados, visibles,
  paginaActual, totalPaginas, setPagina,
  busqueda, onBusqueda, onFiltroKcal,
  abrirNuevo, abrirEdicion, setConfirmEliminar,
}) {
  return (
    <>
      {/* Skeleton */}
      {loading && <TableSkeleton />}

      {/* Error */}
      {!loading && error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-5 py-4 text-accent text-sm">
          <AlertCircle size={14} /> {error}
        </motion.div>
      )}

      {/* Catálogo vacío */}
      {!loading && !error && alimentos.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title="Tu catalogo esta vacio"
          description="Agrega alimentos para que tus pacientes puedan buscarlos al registrar comidas."
          action={
            <motion.button
              onClick={abrirNuevo}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={14} /> Agregar primer alimento
            </motion.button>
          }
        />
      )}

      {/* Sin resultados de búsqueda */}
      {!loading && !error && alimentos.length > 0 && filtrados.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="py-12 text-center">
          <p className="font-display text-sm text-muted">Sin resultados para la busqueda actual.</p>
          <button
            onClick={() => { onBusqueda(""); onFiltroKcal(0); }}
            className="mt-2 text-[11px] text-olive hover:text-olive-dark underline underline-offset-2 transition-colors"
          >
            Limpiar filtros
          </button>
        </motion.div>
      )}

      {/* Tabla */}
      {!loading && !error && visibles.length > 0 && (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Alimento", "Kcal", "Prot.", "Carbos", "Grasas", "Unidad", ""].map((h) => (
                  <th key={h}
                    className="bg-white text-muted font-display text-[9.5px] uppercase
                                tracking-wide text-left px-5 py-2.5 border-b border-cream-dark">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {visibles.map((a, i) => (
                  <AlimentoRow
                    key={a.id}
                    alimento={a}
                    index={i}
                    onEditar={abrirEdicion}
                    onEliminar={setConfirmEliminar}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            filtrados={filtrados}
            setPagina={setPagina}
          />
        </>
      )}
    </>
  );
}
