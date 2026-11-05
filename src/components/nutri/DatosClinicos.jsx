// DatosClinicos.jsx — Modal multi-paso de datos clinicos (orquestador modular)

import { useState, useEffect } from "react";
import { Loader2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  STEPS,
  FORM_VACIO,
  calcIMC,
  imcInfo,
  cinturaRiesgo,
  validarPaso,
} from "./datosClinicos/datosClinicosUtils";
import { StepIndicator } from "./datosClinicos/DatosClinicosUI";
import {
  StepDatosBasicos,
  StepComposicion,
  StepObjetivoActividad,
  StepInformacionClinica,
} from "./datosClinicos/DatosClinicosSteps";

export default function DatosClinicos({
  open,
  onClose,
  pacienteId,
  nombrePaciente,
  datosIniciales = null,
  onGuardado,
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...FORM_VACIO });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const esEdicion = Boolean(datosIniciales);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setErrors({});
    setForm(
      datosIniciales
        ? {
          peso: datosIniciales.peso?.toString() ?? "",
          altura: datosIniciales.altura?.toString() ?? "",
          edad: datosIniciales.edad?.toString() ?? "",
          sexo: datosIniciales.sexo ?? "",
          porcentaje_grasa: datosIniciales.porcentaje_grasa?.toString() ?? "",
          masa_muscular_kg: datosIniciales.masa_muscular_kg?.toString() ?? "",
          cintura_cm: datosIniciales.cintura_cm?.toString() ?? "",
          objetivo: datosIniciales.objetivo ?? "",
          nivel_actividad: datosIniciales.nivel_actividad ?? "",
          patologias: datosIniciales.patologias ?? "",
          alergias: datosIniciales.alergias ?? "",
          medicacion: datosIniciales.medicacion ?? "",
          observaciones: datosIniciales.observaciones ?? "",
        }
        : { ...FORM_VACIO }
    );
  }, [open, datosIniciales]);

  const imc = calcIMC(form.peso, form.altura);
  const imcData = imcInfo(imc);
  const cintData = cinturaRiesgo(form.cintura_cm, form.sexo);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function handleChange(e) {
    setField(e.target.name, e.target.value);
  }

  function handleBlur(e) {
    const errs = validarPaso(step, { ...form, [e.target.name]: e.target.value });
    if (errs[e.target.name]) {
      setErrors((er) => ({ ...er, [e.target.name]: errs[e.target.name] }));
    }
  }

  function handleNext() {
    const errs = validarPaso(step, form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    const errs = validarPaso(step, form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const n = (v) => (v !== "" ? Number(v) : null);
    const { error } = await supabase.from("datos_clinicos").insert({
      paciente_id: pacienteId,
      fecha_registro: new Date().toISOString().split("T")[0],
      peso: n(form.peso),
      altura: n(form.altura),
      edad: n(form.edad),
      sexo: form.sexo || null,
      objetivo: form.objetivo || null,
      nivel_actividad: form.nivel_actividad || null,
      porcentaje_grasa: n(form.porcentaje_grasa),
      masa_muscular_kg: n(form.masa_muscular_kg),
      cintura_cm: n(form.cintura_cm),
      patologias: form.patologias.trim() || null,
      alergias: form.alergias.trim() || null,
      medicacion: form.medicacion.trim() || null,
      observaciones: form.observaciones.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Error al guardar: " + error.message);
      return;
    }
    toast.success(
      esEdicion ? "Datos clinicos actualizados." : "Datos clinicos guardados."
    );
    onGuardado?.();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        esEdicion
          ? `Actualizar datos — ${nombrePaciente ?? ""}`
          : `Nuevo registro — ${nombrePaciente ?? ""}`
      }
      preventOverlayClose
    >
      <div className="flex flex-col gap-3">
        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepDatosBasicos
              form={form}
              errors={errors}
              imc={imc}
              imcData={imcData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setField={setField}
            />
          )}
          {step === 2 && (
            <StepComposicion
              form={form}
              errors={errors}
              cintData={cintData}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          )}
          {step === 3 && (
            <StepObjetivoActividad form={form} setField={setField} />
          )}
          {step === 4 && (
            <StepInformacionClinica form={form} handleChange={handleChange} />
          )}
        </AnimatePresence>

        {/* Barra de navegacion inferior */}
        <div className="flex items-center gap-2 pt-2 border-t border-cream-darker">
          {step > 1 ? (
            <motion.button
              type="button"
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-cream-darker
                        text-muted hover:text-olive-dark hover:border-olive/40
                          font-display text-[11.5px] transition-colors"
            >
              <ChevronLeft size={13} /> Anterior
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="px-3.5 py-2 rounded-xl border border-cream-darker text-muted
                        hover:text-olive-dark font-display text-[11.5px] transition-colors"
            >
              Cancelar
            </motion.button>
          )}

          <div className="flex-1 flex items-center justify-center gap-1.5">
            {STEPS.map((s) => (
              <motion.div
                key={s.id}
                animate={{
                  width: s.id === step ? 16 : 8,
                  backgroundColor:
                    s.id === step
                      ? "#6E7A4B"
                      : s.id < step
                        ? "rgba(110,122,75,0.4)"
                        : "#E5E0D8",
                }}
                transition={{ duration: 0.25 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          {step < STEPS.length ? (
            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 6px 20px rgba(110,122,75,0.28)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-olive text-cream
                          hover:bg-olive-deep font-display text-[11.5px] font-medium transition-colors"
            >
              Siguiente <ChevronRight size={13} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={
                !loading
                  ? { scale: 1.03, boxShadow: "0 6px 20px rgba(110,122,75,0.28)" }
                  : {}
              }
              whileTap={!loading ? { scale: 0.96 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-olive text-cream
                        hover:bg-olive-deep font-display text-[11.5px] font-medium
                          disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Check size={12} strokeWidth={2.5} />{" "}
                  {esEdicion ? "Actualizar" : "Guardar"}
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </Modal>
  );
}
