import { Toaster } from "sonner";
import { ArrowLeft, Loader2, AlertCircle, ClipboardList } from "lucide-react";
import Logo from "@/components/ui/Logo";
import PlanBuilder from "@/components/plans/PlanBuilder";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { usePatientPlan } from "./plan/usePatientPlan";
import PlanHeader from "./plan/PlanHeader";
import VersionSelector from "./plan/VersionSelector";
import CaloriasEditor from "./plan/CaloriasEditor";
import NotasEditor from "./plan/NotasEditor";
import ModalNuevoPlan from "./plan/ModalNuevoPlan";

export default function PatientPlan() {
  const {
    id,
    navigate,
    signOut,
    planes,
    planActivo,
    loading,
    error,
    planVisible,
    readonly,
    planVisibleId,
    setPlanVisibleId,
    modalNuevo,
    setModalNuevo,
    caloriaInput,
    setCaloriaInput,
    calError,
    setCalError,
    publicando,
    setPublicando,
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
    setProcesando,
    handleCrearPlan,
    handlePublicar,
    handleNuevaVersion,
    handleEliminar,
    handleGuardarCalorias,
    handleGuardarNotas,
    agregarComida,
    editarComida,
    eliminarComida,
  } = usePatientPlan();

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/panel/pacientes/${id}`)}
            className="text-muted hover:text-olive-dark transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
            <Logo size={20} />
            NutriOliva
          </div>
        </div>
        <button onClick={signOut} className="btn-ghost text-xs px-3 py-1.5">
          Salir
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-display text-xl text-olive-dark">
              Plan alimenticio
            </h2>
            {planes.length > 0 && (
              <p className="text-xs text-muted mt-0.5">
                {planes.length} {planes.length === 1 ? "versión" : "versiones"}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setCaloriaInput("2000");
              setCalError("");
              setModalNuevo(true);
            }}
            className="btn-secondary text-xs px-4 py-2"
          >
            + Nuevo plan
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-muted">
            <Loader2 size={16} className="animate-spin" />
            <span className="font-display text-sm">Cargando plan...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="card p-5 flex items-center gap-2 text-red-500">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Sin planes */}
        {!loading && !error && planes.length === 0 && (
          <div className="card">
            <EmptyState
              icon={ClipboardList}
              title="Este paciente no tiene plan todavía"
              description="Creá el primer plan alimenticio, agregá las comidas y publicalo."
              action={
                <button
                  onClick={() => setModalNuevo(true)}
                  className="btn-primary text-sm"
                >
                  Crear primer plan
                </button>
              }
            />
          </div>
        )}

        {/* Plan visible */}
        {!loading && planVisible && (
          <>
            {/* Selector de versiones (dropdown) */}
            <VersionSelector
              planes={planes}
              planVisibleId={planVisible.id}
              onSelect={(p) => setPlanVisibleId(p.id)}
            />

            {/* Header del plan seleccionado */}
            <PlanHeader
              plan={planVisible}
              onPublicar={() => setConfirmPublicar(true)}
              onNuevaVersion={() => setConfirmVersion(true)}
              onEliminar={() => setConfirmEliminar(planVisible.id)}
              publicando={publicando}
            />

            {/* Notas del plan */}
            <NotasEditor
              planVisible={planVisible}
              readonly={readonly}
              editandoNotas={editandoNotas}
              setEditandoNotas={setEditandoNotas}
              notasInput={notasInput}
              setNotasInput={setNotasInput}
              handleGuardarNotas={handleGuardarNotas}
            />

            {/* Objetivo calórico */}
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

            {/* Constructor de comidas */}
            <PlanBuilder
              plan={planVisible}
              onAgregar={(comida) => agregarComida(planVisible.id, comida)}
              onEditar={editarComida}
              onEliminar={eliminarComida}
              readonly={readonly}
            />

            {readonly && (
              <p className="text-center text-[11px] text-muted italic mt-5">
                Plan archivado — solo lectura.
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Modal: crear nuevo plan ─────────────────────────────────────────── */}
      <ModalNuevoPlan
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        caloriaInput={caloriaInput}
        setCaloriaInput={setCaloriaInput}
        calError={calError}
        setCalError={setCalError}
        onCrear={handleCrearPlan}
      />

      {/* ── Confirm: publicar ───────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmPublicar}
        onClose={() => setConfirmPublicar(false)}
        onConfirm={handlePublicar}
        title="Publicar plan"
        message={`El plan v${planVisible?.version} pasará a estar Activo. ${planActivo && planActivo.id !== planVisible?.id ? "El plan activo actual quedará archivado." : ""}`}
        confirmLabel="Publicar"
        variant="default"
        loading={procesando}
      />

      {/* ── Confirm: nueva versión ──────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmVersion}
        onClose={() => setConfirmVersion(false)}
        onConfirm={handleNuevaVersion}
        title="Crear nueva versión"
        message={`Se copiará el plan v${planActivo?.version} con todas sus comidas como borrador. El plan activo seguirá vigente hasta que publiques la nueva versión.`}
        confirmLabel="Crear nueva versión"
        variant="warning"
        loading={procesando}
      />

      {/* ── Confirm: eliminar plan ──────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!confirmEliminar}
        onClose={() => setConfirmEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar plan"
        message="Esta acción es irreversible. Se eliminará el plan y todas sus comidas. No podés eliminar el plan activo."
        confirmLabel="Eliminar plan"
        variant="danger"
        loading={procesando}
      />
    </div>
  );
}
