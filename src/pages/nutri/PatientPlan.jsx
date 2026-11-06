// PatientPlan.jsx — Orquestador de planes alimenticios (/panel/pacientes/:id/plan)

import { useState } from "react";
import { Toaster, toast } from "sonner";
import {
  AlertCircle,
  ClipboardList,
  ClipboardPaste,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NutriNavbar from "@/components/nutri/NutriNavbar";
import PlanBuilder from "@/components/plans/PlanBuilder";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { usePatientPlan } from "./plan/usePatientPlan";
import PlanHeader from "./plan/PlanHeader";
import VersionSelector from "./plan/VersionSelector";
import CaloriasEditor from "./plan/CaloriasEditor";
import NotasEditor from "./plan/NotasEditor";
import ModalNuevoPlan from "./plan/ModalNuevoPlan";
import ModalParsePdf from "./plan/ModalParsePdf";

function PlanSkeleton() {
  return (
    <div className="space-y-4">
      <div className="card p-5 space-y-2.5">
        <div className="h-4 w-36 bg-cream-darker rounded-full animate-pulse" />
        <div className="h-3 w-48 bg-cream-darker rounded-full animate-pulse" />
      </div>
      <div className="card p-4 space-y-2">
        <div className="h-2.5 w-24 bg-cream-darker rounded-full animate-pulse" />
        <div className="h-4 w-56 bg-cream-darker rounded-full animate-pulse" />
      </div>
      <div className="card p-4 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-2.5 w-32 bg-cream-darker rounded-full animate-pulse" />
          <div className="h-6 w-28 bg-cream-darker rounded-lg animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-cream-darker rounded-lg animate-pulse" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-cream-darker rounded-xl p-4 bg-white space-y-2"
        >
          <div className="h-3.5 w-28 bg-cream-darker rounded-full animate-pulse" />
          <div className="h-8 w-full bg-cream rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function PatientPlan() {
  const {
    id,
    planes,
    planActivo,
    loading,
    error,
    planVisible,
    readonly,
    setPlanVisibleId,
    modalNuevo,
    setModalNuevo,
    caloriaInput,
    setCaloriaInput,
    calError,
    setCalError,
    editandoCal,
    setEditandoCal,
    nuevasCal,
    setNuevasCal,
    calEditError,
    setCalEditError,
    editandoNotas,
    setEditandoNotas,
    notasInput,
    setNotasInput,
    confirmEliminar,
    setConfirmEliminar,
    confirmPublicar,
    setConfirmPublicar,
    confirmVersion,
    setConfirmVersion,
    procesando,
    handleCrearPlan,
    handlePublicar,
    handleNuevaVersion,
    handleEliminar,
    handleGuardarCalorias,
    handleGuardarNotas,
    agregarComida,
    agregarComidasLote,
    editarComida,
    eliminarComida,
  } = usePatientPlan();

  const [modalPdf, setModalPdf] = useState(false);

  async function handleConfirmarPdf(comidas) {
    if (!planVisible || !comidas?.length) return;
    const { error: err } = await agregarComidasLote(planVisible.id, comidas);
    if (!err) {
      toast.success(
        `${comidas.length} comida${comidas.length !== 1 ? "s" : ""} agregada${comidas.length !== 1 ? "s" : ""} al plan.`
      );
    } else {
      toast.error("Error al agregar las comidas al plan.");
    }
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar unificado */}
      <NutriNavbar
        backTo={`/panel/pacientes/${id}`}
        backLabel="Volver a la ficha"
        subtitulo="Plan alimenticio"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex flex-wrap justify-between items-center gap-3 mb-5"
        >
          <div>
            <h2 className="font-display font-semibold text-xl text-olive-dark">
              Plan alimenticio
            </h2>
            {planes.length > 0 && (
              <p className="text-xs text-muted mt-0.5 font-display">
                {planes.length} {planes.length === 1 ? "version" : "versiones"}
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {planVisible && !readonly && (
              <motion.button
                type="button"
                onClick={() => setModalPdf(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5"
                title="Importar comidas pegando el texto del plan (Word, Google Docs, email)"
              >
                <ClipboardPaste size={13} />
                Importar con IA
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={() => {
                setCaloriaInput("2000");
                setCalError("");
                setModalNuevo(true);
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(110,122,75,0.25)" }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Plus size={13} />
              Nuevo plan
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PlanSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5 flex items-center gap-2 text-accent"
            >
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}

          {/* Sin planes */}
          {!loading && !error && planes.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <EmptyState
                icon={ClipboardList}
                title="Este paciente no tiene plan todavia"
                description="Crea el primer plan alimenticio, agrega las comidas y publicalo."
                action={
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModalNuevo(true)}
                    className="btn-primary text-sm"
                  >
                    Crear primer plan
                  </motion.button>
                }
              />
            </motion.div>
          )}

          {/* Plan visible */}
          {!loading && planVisible && (
            <motion.div
              key={planVisible.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <VersionSelector
                planes={planes}
                planVisibleId={planVisible.id}
                onSelect={(p) => setPlanVisibleId(p.id)}
              />

              <PlanHeader
                plan={planVisible}
                onPublicar={() => setConfirmPublicar(true)}
                onNuevaVersion={() => setConfirmVersion(true)}
                onEliminar={() => setConfirmEliminar(planVisible.id)}
                publicando={procesando}
              />

              <NotasEditor
                planVisible={planVisible}
                readonly={readonly}
                editandoNotas={editandoNotas}
                setEditandoNotas={setEditandoNotas}
                notasInput={notasInput}
                setNotasInput={setNotasInput}
                handleGuardarNotas={handleGuardarNotas}
              />

              <CaloriasEditor
                planVisible={planVisible}
                readonly={readonly}
                editandoCal={editandoCal}
                setEditandoCal={setEditandoCal}
                nuevasCal={nuevasCal}
                setNuevasCal={setNuevasCal}
                calEditError={calEditError}
                setCalEditError={setCalEditError}
                handleGuardarCalorias={handleGuardarCalorias}
              />

              <PlanBuilder
                plan={planVisible}
                onAgregar={(comida) => agregarComida(planVisible.id, comida)}
                onAgregarLote={(comidas) => agregarComidasLote(planVisible.id, comidas)}
                onEditar={editarComida}
                onEliminar={eliminarComida}
                readonly={readonly}
              />

              {readonly && (
                <p className="text-center text-[11px] text-muted italic mt-5">
                  Plan archivado — solo lectura.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal: crear nuevo plan */}
      <ModalNuevoPlan
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        caloriaInput={caloriaInput}
        setCaloriaInput={setCaloriaInput}
        calError={calError}
        setCalError={setCalError}
        onCrear={handleCrearPlan}
      />

      {/* Confirm: publicar */}
      <ConfirmDialog
        open={confirmPublicar}
        onClose={() => setConfirmPublicar(false)}
        onConfirm={handlePublicar}
        title="Publicar plan"
        message={`El plan v${planVisible?.version} pasara a estar Activo. ${planActivo && planActivo.id !== planVisible?.id ? "El plan activo actual quedara archivado." : ""}`}
        confirmLabel="Publicar"
        variant="default"
        loading={procesando}
      />

      {/* Confirm: nueva version */}
      <ConfirmDialog
        open={confirmVersion}
        onClose={() => setConfirmVersion(false)}
        onConfirm={handleNuevaVersion}
        title="Crear nueva version"
        message={`Se copiara el plan v${planActivo?.version} con todas sus comidas como borrador. El plan activo seguira vigente hasta que publiques la nueva version.`}
        confirmLabel="Crear nueva version"
        variant="warning"
        loading={procesando}
      />

      {/* Confirm: eliminar plan */}
      <ConfirmDialog
        open={!!confirmEliminar}
        onClose={() => setConfirmEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar plan"
        message="Esta accion es irreversible. Se eliminara el plan y todas sus comidas. No podes eliminar el plan activo."
        confirmLabel="Eliminar plan"
        variant="danger"
        loading={procesando}
      />

      {/* Modal: cargar plan con IA */}
      <ModalParsePdf
        open={modalPdf}
        onClose={() => setModalPdf(false)}
        onConfirmar={handleConfirmarPdf}
      />
    </div>
  );
}
