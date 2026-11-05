// Catalogo.jsx — Orquestador del panel de alimentos del nutricionista
// Lógica  → useCatalogoPage
// Filtros → CatalogoFiltros
// Tabla   → CatalogoTable
// Modal   → CatalogoModal
// Confirm → ConfirmDialog

import { Toaster } from "sonner";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import NutriNavbar from "@/components/nutri/NutriNavbar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useCatalogoPage } from "./catalogo/useCatalogoPage";
import CatalogoFiltros from "./catalogo/CatalogoFiltros";
import CatalogoTable from "./catalogo/CatalogoTable";
import CatalogoModal from "./catalogo/CatalogoModal";

export default function Catalogo() {
  const {
    alimentos, loading, error,
    busqueda, filtroKcal, setPagina,
    filtrados, visibles, totalPaginas, paginaActual,
    hayFiltros, searchFocused, setSearchFocused,
    onBusqueda, onFiltroKcal,
    modalAbierto, setModalAbierto,
    editando, form, errors, guardando,
    abrirNuevo, abrirEdicion, handleChange, handleGuardar,
    confirmEliminar, setConfirmEliminar,
    eliminando, handleEliminar,
  } = useCatalogoPage();

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* ── Navbar unificado y 100% responsive ───────────────────────── */}
      <NutriNavbar subtitulo="Catalogo de alimentos" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-between items-start gap-3 mb-6"
        >
          <div>
            <h2 className="font-display text-xl font-bold text-olive-dark">
              Catalogo de alimentos
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {alimentos.length > 0
                ? `${alimentos.length} alimento${alimentos.length !== 1 ? "s" : ""} en tu catalogo`
                : "Gestiona los alimentos disponibles para tus pacientes"}
            </p>
          </div>
          <motion.button
            onClick={abrirNuevo}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(110,122,75,0.32)" }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus size={14} />
            Agregar alimento
          </motion.button>
        </motion.div>

        {/* ── Card principal ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="card overflow-visible"
        >
          <CatalogoFiltros
            busqueda={busqueda}
            filtroKcal={filtroKcal}
            filtrados={filtrados}
            hayFiltros={hayFiltros}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            onBusqueda={onBusqueda}
            onFiltroKcal={onFiltroKcal}
          />

          <CatalogoTable
            loading={loading}
            error={error}
            alimentos={alimentos}
            filtrados={filtrados}
            visibles={visibles}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            setPagina={setPagina}
            onBusqueda={onBusqueda}
            onFiltroKcal={onFiltroKcal}
            abrirNuevo={abrirNuevo}
            abrirEdicion={abrirEdicion}
            setConfirmEliminar={setConfirmEliminar}
          />
        </motion.div>
      </div>

      {/* ── Modal alta/edición ───────────────────────────────────────────── */}
      <CatalogoModal
        open={modalAbierto}
        editando={editando}
        form={form}
        errors={errors}
        guardando={guardando}
        onClose={() => setModalAbierto(false)}
        onChange={handleChange}
        onSubmit={handleGuardar}
      />

      {/* ── Confirm eliminar ────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!confirmEliminar}
        onClose={() => setConfirmEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar alimento"
        message={`Eliminas "${confirmEliminar?.nombre}" del catalogo. Los registros de comida existentes no se veran afectados.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={eliminando}
      />
    </div>
  );
}
