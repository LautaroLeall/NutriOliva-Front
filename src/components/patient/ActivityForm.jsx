// ActivityForm.jsx — Modal para registrar actividad física con labels flotantes, presets y CountUp

import { useState, useEffect } from "react";
import { Loader2, Dumbbell, Clock, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import Modal from "@/components/ui/Modal";
import { estimarCaloriasActividad } from "@/hooks/useBalance";
import { subirFoto } from "@/lib/storage";
import FotoInput from "./foodForm/FotoInput";

const INTENSIDADES = [
  { value: "baja", label: "Baja", desc: "Caminata, yoga, stretching" },
  { value: "media", label: "Media", desc: "Bici, natacion, trote" },
  { value: "alta", label: "Alta", desc: "HIIT, pesas, futbol, running" },
];

const DURACION_PRESETS = [20, 30, 45, 60, 90];

const FORM_VACIO = {
  tipo: "",
  duracion_min: "",
  intensidad: "media",
};

function validar(form) {
  const errs = {};
  if (!form.tipo.trim()) errs.tipo = "El tipo de actividad es obligatorio.";
  else if (form.tipo.trim().length < 2)
    errs.tipo = "Describi un poco mas la actividad.";

  if (!form.duracion_min) errs.duracion = "La duracion es obligatoria.";
  else {
    const n = Number(form.duracion_min);
    if (isNaN(n) || !Number.isInteger(n))
      errs.duracion = "Debe ser un numero entero.";
    else if (n < 1) errs.duracion = "La duracion minima es 1 minuto.";
    else if (n > 480) errs.duracion = "El maximo es 480 minutos (8 horas).";
  }
  return errs;
}

export default function ActivityForm({ open, onClose, onGuardar, pacienteId }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);

  const [focusTipo, setFocusTipo] = useState(false);
  const [focusDur, setFocusDur] = useState(false);

  const liftTipo = focusTipo || form.tipo?.length > 0;
  const liftDur = focusDur || form.duracion_min?.toString().length > 0;

  const calEst =
    form.duracion_min && Number(form.duracion_min) > 0
      ? estimarCaloriasActividad(Number(form.duracion_min), form.intensidad)
      : null;

  useEffect(() => {
    if (open) {
      setForm(FORM_VACIO);
      setErrors({});
      setFoto(null);
    }
  }, [open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name] || (name === "duracion_min" && errors.duracion)) {
      setErrors((er) => ({
        ...er,
        [name]: undefined,
        ...(name === "duracion_min" ? { duracion: undefined } : {}),
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validar(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    let foto_path = null;
    if (foto && pacienteId) {
      const { path, error: fotoErr } = await subirFoto(
        foto,
        "fotos-actividad",
        pacienteId
      );
      if (fotoErr) {
        setErrors({ _server: "Error al subir la foto: " + fotoErr });
        setLoading(false);
        return;
      }
      foto_path = path;
    }

    const { error } = await onGuardar({
      tipo: form.tipo.trim(),
      duracion_min: Number(form.duracion_min),
      intensidad: form.intensidad,
      calorias_gastadas: calEst,
      foto_path,
    });
    setLoading(false);
    if (error) {
      setErrors({ _server: error });
      return;
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar actividad">
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Tipo de actividad — label flotante */}
        <div className="flex flex-col">
          <div className="relative">
            <motion.div
              animate={{
                color: focusTipo ? "#6E7A4B" : "#9B9484",
                scale: focusTipo ? 1.1 : 1,
              }}
              transition={{ duration: 0.16 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <Dumbbell size={14} strokeWidth={1.75} />
            </motion.div>

            <input
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              onFocus={() => setFocusTipo(true)}
              onBlur={() => setFocusTipo(false)}
              placeholder=""
              autoFocus
              className={`w-full pl-9 pr-3 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                          font-body text-olive-dark
                          focus:outline-none focus:ring-2 transition-all duration-150
                          ${errors.tipo
                  ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                  : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                }`}
            />

            <motion.label
              animate={{
                top: liftTipo ? "6px" : "50%",
                y: liftTipo ? "0%" : "-50%",
                fontSize: liftTipo ? "9.5px" : "12.5px",
                color: focusTipo
                  ? "#6E7A4B"
                  : errors.tipo
                    ? "#D85A30"
                    : "#9B9484",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-9 right-3 font-display pointer-events-none leading-none"
            >
              Actividad (ej: correr, natacion, funcional...) *
            </motion.label>
          </div>

          <AnimatePresence>
            {errors.tipo && (
              <motion.p
                key="tipo-err"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.16 }}
                className="text-[10.5px] text-accent ml-1 overflow-hidden"
              >
                {errors.tipo}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Duración — label flotante + presets */}
        <div className="flex flex-col">
          <div className="relative">
            <motion.div
              animate={{
                color: focusDur ? "#6E7A4B" : "#9B9484",
                scale: focusDur ? 1.1 : 1,
              }}
              transition={{ duration: 0.16 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <Clock size={14} strokeWidth={1.75} />
            </motion.div>

            <input
              name="duracion_min"
              type="number"
              value={form.duracion_min}
              onChange={handleChange}
              onFocus={() => setFocusDur(true)}
              onBlur={() => setFocusDur(false)}
              placeholder=""
              min={1}
              max={480}
              className={`w-full pl-9 pr-11 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                          font-body text-olive-dark
                          focus:outline-none focus:ring-2 transition-all duration-150
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                          ${errors.duracion
                  ? "border-accent/60 focus:ring-accent/25 bg-accent/[0.04]"
                  : "border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                }`}
            />

            <motion.label
              animate={{
                top: liftDur ? "6px" : "50%",
                y: liftDur ? "0%" : "-50%",
                fontSize: liftDur ? "9.5px" : "12.5px",
                color: focusDur
                  ? "#6E7A4B"
                  : errors.duracion
                    ? "#D85A30"
                    : "#9B9484",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-9 right-11 font-display pointer-events-none leading-none"
            >
              Duracion *
            </motion.label>

            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted text-[10.5px] font-display pointer-events-none">
              min
            </span>
          </div>

          <AnimatePresence>
            {errors.duracion && (
              <motion.p
                key="dur-err"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.16 }}
                className="text-[10.5px] text-accent ml-1 overflow-hidden"
              >
                {errors.duracion}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Presets rápidos de duración */}
          <div className="flex items-center gap-1.5 mt-2">
            {DURACION_PRESETS.map((m) => {
              const active = Number(form.duracion_min) === m;
              return (
                <motion.button
                  key={m}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setForm((f) => ({ ...f, duracion_min: String(m) }));
                    setErrors((er) => ({ ...er, duracion: undefined }));
                  }}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-display transition-colors
                              ${active
                      ? "bg-olive text-cream font-semibold"
                      : "bg-cream text-muted hover:text-olive-dark"}`}
                >
                  {m} min
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Intensidad */}
        <div>
          <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1.5">
            Intensidad *
          </p>
          <div className="grid grid-cols-3 gap-2">
            {INTENSIDADES.map((i) => {
              const sel = form.intensidad === i.value;
              return (
                <motion.button
                  key={i.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setForm((f) => ({ ...f, intensidad: i.value }))}
                  className={`rounded-xl px-3 py-2 text-left transition-colors border-2
                              ${sel
                      ? "bg-olive text-cream border-olive shadow-sm"
                      : "bg-[#F5F2EA] border-cream-darker text-muted hover:border-olive/45"}`}
                >
                  <p
                    className={`font-display text-[11.5px] font-semibold ${sel ? "text-cream" : "text-olive-dark"
                      }`}
                  >
                    {i.label}
                  </p>
                  <p
                    className={`text-[9px] mt-0.5 leading-tight ${sel ? "text-cream/75" : "text-muted"
                      }`}
                  >
                    {i.desc}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Calorías estimadas animadas */}
        <AnimatePresence>
          {calEst !== null && (
            <motion.div
              key="cal-est"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-blue-500" />
                  <div>
                    <p className="font-display text-[11px] text-blue-700 font-semibold">
                      Calorias estimadas
                    </p>
                    <p className="text-[9.5px] text-blue-500">
                      Segun intensidad y duracion
                    </p>
                  </div>
                </div>
                <span className="font-display font-bold text-lg text-blue-600">
                  <CountUp end={calEst} duration={0.45} /> kcal
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Foto opcional */}
        <FotoInput
          foto={foto}
          onFoto={setFoto}
          onQuitarFoto={() => setFoto(null)}
        />

        <AnimatePresence>
          {errors._server && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-accent bg-accent/8 border border-accent/20 rounded-xl px-3.5 py-2"
            >
              {errors._server}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-2 pt-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="btn-ghost flex-1 py-2.5"
          >
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: "0 6px 20px rgba(110,122,75,0.3)" } : {}}
            whileTap={!loading ? { scale: 0.96 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="btn-primary flex-1 py-2.5 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Guardando...
              </span>
            ) : (
              "Registrar"
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
