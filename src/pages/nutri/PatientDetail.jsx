// PatientDetail.jsx — Orquestador de la ficha del paciente (/panel/pacientes/:id)

import { Toaster } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NutriNavbar from "@/components/nutri/NutriNavbar";
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
    caloriasHoy,
    activo,
    fetchPaciente,
    handleGuardar,
    handleGuardarClinicos,
    navigate,
    desactivarPaciente,
    reactivarPaciente,
  } = usePatientDetail();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 text-muted"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={24} className="text-olive/70" />
          </motion.div>
          <span className="font-display text-xs tracking-wide">
            Cargando ficha del paciente...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card px-6 py-5 flex items-center gap-2.5 text-danger"
        >
          <AlertCircle size={16} />
          <span className="font-display text-sm">
            {error || "Paciente no encontrado."}
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar unificado */}
      <NutriNavbar
        backTo="/panel"
        backLabel="Volver a pacientes"
        subtitulo={paciente.nombre}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="card overflow-hidden"
        >
          <TabBar tab={tab} setTab={setTab} />

          <AnimatePresence mode="wait">
            {tab === "ficha" && (
              <motion.div
                key="ficha"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TabFicha registros_comida={paciente.registros_comida} />
              </motion.div>
            )}

            {tab === "diario" && (
              <motion.div
                key="diario"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            )}

            {tab === "clinica" && (
              <motion.div
                key="clinica"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TabClinica
                  datosClinicos={datosClinicos}
                  paciente={paciente}
                  setEditandoClinicos={setEditandoClinicos}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
