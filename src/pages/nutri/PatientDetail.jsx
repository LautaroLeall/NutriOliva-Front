import { Toaster } from "sonner";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";
import PatientForm from "@/components/patients/PatientForm";
import DatosClinicos from "@/components/nutri/DatosClinicos";

import { usePatientDetail } from "./detail/usePatientDetail";
import PatientHeader from "./detail/PatientHeader";
import PatientMetrics from "./detail/PatientMetrics";
import TabBar from "./detail/TabBar";
import TabFicha from "./detail/TabFicha";
import TabDiario from "./detail/TabDiario";
import TabClinica from "./detail/TabClinica";

export default function PatientDetail() {
  const {
    id,
    paciente,
    loading,
    error,
    editando,
    setEditando,
    editandoClinicos,
    setEditandoClinicos,
    tab,
    setTab,
    fechaDiario,
    setFechaDiario,
    comidasNutri,
    actividadesNutri,
    totalConsumidas,
    totalGastadas,
    loadingDiario,
    puntosSemanales,
    loadingTendencia,
    datosClinicos,
    planActivo,
    caloriasObjetivo,
    registrosHoy,
    caloriasHoy,
    activo,
    fetchPaciente,
    handleGuardar,
    handleGuardarClinicos,
    navigate,
    signOut,
    desactivarPaciente,
    reactivarPaciente,
  } = usePatientDetail();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted">
          <Loader2 size={16} className="animate-spin" />
          <span className="font-display text-sm">Cargando ficha...</span>
        </div>
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
        <div className="flex items-center gap-2 text-danger">
          <AlertCircle size={16} />
          <span className="font-display text-sm">
            {error || "Paciente no encontrado."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="top-center" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/panel")}
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <PatientHeader
          paciente={paciente}
          activo={activo}
          datosClinicos={datosClinicos}
          id={id}
          navigate={navigate}
          setEditando={setEditando}
          setEditandoClinicos={setEditandoClinicos}
          desactivarPaciente={desactivarPaciente}
          reactivarPaciente={reactivarPaciente}
          fetchPaciente={fetchPaciente}
        />

        <PatientMetrics
          caloriasHoy={caloriasHoy}
          planActivo={planActivo}
          datosClinicos={datosClinicos}
        />

        <div className="card overflow-hidden">
          <TabBar tab={tab} setTab={setTab} />

          {tab === "ficha" && (
            <TabFicha registros_comida={paciente.registros_comida} />
          )}

          {tab === "diario" && (
            <TabDiario
              fechaDiario={fechaDiario}
              setFechaDiario={setFechaDiario}
              loadingDiario={loadingDiario}
              comidasNutri={comidasNutri}
              actividadesNutri={actividadesNutri}
              totalConsumidas={totalConsumidas}
              totalGastadas={totalGastadas}
              caloriasObjetivo={caloriasObjetivo}
              puntosSemanales={puntosSemanales}
              loadingTendencia={loadingTendencia}
              nombrePaciente={paciente.nombre}
            />
          )}

          {tab === "clinica" && (
            <TabClinica
              datosClinicos={datosClinicos}
              paciente={paciente}
              setEditandoClinicos={setEditandoClinicos}
            />
          )}
        </div>
      </div>

      <PatientForm
        open={editando}
        onClose={() => setEditando(false)}
        paciente={paciente}
        onGuardar={handleGuardar}
      />

      <DatosClinicos
        open={editandoClinicos}
        onClose={() => setEditandoClinicos(false)}
        pacienteId={id}
        nombrePaciente={paciente?.nombre}
        datosIniciales={datosClinicos || null}
        onGuardado={handleGuardarClinicos}
      />
    </div>
  );
}
