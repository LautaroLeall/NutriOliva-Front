// PatientForm.jsx — Modal de alta y edición de paciente

import { useState, useEffect } from "react";
import {
  Loader2, User, Mail, Phone, Calendar,
  CheckCircle, Send, UserPen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";

const FORM_VACIO = { nombre: "", email: "", telefono: "", fecha_nacimiento: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[+\d\s\-().]{6,20}$/;

function validar(form, original) {
  const errs = {};
  const nombre = form.nombre.trim();
  if (!nombre) errs.nombre = "El nombre es obligatorio.";
  else if (nombre.length < 2) errs.nombre = "Al menos 2 caracteres.";
  else if (/\d/.test(nombre)) errs.nombre = "El nombre no puede contener numeros.";

  const email = form.email.trim();
  if (!email) errs.email = "El mail es obligatorio.";
  else if (!EMAIL_RE.test(email)) errs.email = "El formato del mail no es valido.";

  if (form.telefono?.trim() && !TEL_RE.test(form.telefono.trim()))
    errs.telefono = "El telefono no es valido.";

  if (form.fecha_nacimiento) {
    const fecha = new Date(form.fecha_nacimiento);
    if (isNaN(fecha.getTime())) errs.fecha_nacimiento = "La fecha no es valida.";
    else if (fecha > new Date()) errs.fecha_nacimiento = "La fecha no puede ser futura.";
    else if (fecha < new Date("1900-01-01")) errs.fecha_nacimiento = "La fecha no es realista.";
  }

  if (original) {
    const sin_cambios =
      nombre === (original.nombre || "").trim() &&
      email === (original.email || "").trim() &&
      (form.telefono || "") === (original.telefono || "") &&
      (form.fecha_nacimiento || "") === (original.fecha_nacimiento || "");
    if (sin_cambios) errs._nochanges = "No realizaste ningun cambio.";
  }

  return errs;
}

// ── Campo con label flotante + icono + error animado ─────────────────────
function Field({ label, name, type = "text", value, onChange, error, icon: Icon, placeholder, autoFocus, min, max }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value?.length > 0;
  // type=date: el browser siempre muestra "dd/mm/aaaa", label siempre arriba
  const lifted = focused || hasValue || type === "date";

  return (
    // Wrapper externo: NO relative — solo apila input + error
    <div className="flex flex-col">
      {/* Wrapper interno: relative de ALTURA FIJA del input solamente */}
      <div className="relative">
        {/* Icono — top-1/2 del wrapper INTERNO (solo input), nunca se mueve */}
        <motion.div
          animate={{ color: focused ? "#6E7A4B" : "#9B9484", scale: focused ? 1.08 : 1 }}
          transition={{ duration: 0.18 }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          <Icon size={13} />
        </motion.div>

        {/* Input */}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=""
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          min={min}
          max={max}
          className={`w-full pl-9 pr-3 pt-[22px] pb-[7px] rounded-xl border text-[13px]
                      font-body text-olive-dark bg-[#F5F2EA]
                      focus:outline-none focus:ring-2 transition-all duration-150
                      ${error
              ? "border-accent/60 focus:ring-accent/25"
              : "border-cream-darker focus:ring-olive/30 focus:border-olive/60"
            }`}
        />

        {/* Label flotante — top-1/2 del wrapper INTERNO, no baja con el error */}
        <motion.label
          animate={{
            top: lifted ? "6px" : "50%",
            y: lifted ? "0%" : "-50%",
            fontSize: lifted ? "10px" : "13px",
            color: focused ? "#6E7A4B" : error ? "#D85A30" : "#9B9484",
          }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="absolute left-9 font-display pointer-events-none leading-none"
        >
          {label}
        </motion.label>
      </div>

      {/* Error — fuera del wrapper interno para que no afecte el top-1/2 del icono */}
      <AnimatePresence>
        {error && (
          <motion.p
            key={name + "-err"}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[10.5px] text-accent ml-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
export default function PatientForm({ open, onClose, paciente = null, onGuardar }) {
  const esEdicion = !!paciente;

  const [form, setForm] = useState(FORM_VACIO);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        paciente
          ? {
            nombre: paciente.nombre || "",
            email: paciente.email || "",
            telefono: paciente.telefono || "",
            fecha_nacimiento: paciente.fecha_nacimiento || "",
          }
          : FORM_VACIO
      );
      setErrors({});
    }
  }, [open, paciente]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (errors._nochanges) setErrors((prev) => ({ ...prev, _nochanges: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validar(form, esEdicion ? paciente : null);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const { error: err } = await onGuardar({
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      telefono: form.telefono.trim() || null,
      fecha_nacimiento: form.fecha_nacimiento || null,
    });
    setLoading(false);
    if (err) {
      setErrors({ _server: err.message || "Ocurrio un error al guardar." });
    } else {
      onClose();
    }
  }

  // Progreso visual: cuantos campos obligatorios estan completos
  const progreso = [
    form.nombre.trim().length >= 2 && !/\d/.test(form.nombre),
    EMAIL_RE.test(form.email.trim()),
  ].filter(Boolean).length; // 0, 1 o 2

  return (
    <Modal
      open={open}
      onClose={() => { if (!loading) onClose(); }}
      title={esEdicion ? "Editar paciente" : "Nuevo paciente"}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

        {/* Indicador de completitud */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-1.5 flex-1">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                animate={{ backgroundColor: i < progreso ? "#6E7A4B" : "#E5E0D8" }}
                transition={{ duration: 0.3 }}
                className="h-0.5 flex-1 rounded-full"
              />
            ))}
          </div>
          <AnimatePresence>
            {progreso === 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <CheckCircle size={13} className="text-success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nombre */}
        <Field
          label="Nombre completo *"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          error={errors.nombre}
          icon={esEdicion ? UserPen : User}
          autoFocus
        />

        {/* Email */}
        <Field
          label="Mail *"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
        />

        {/* Telefono + Fecha en grid */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            error={errors.telefono}
            icon={Phone}
            placeholder="+54 9 11..."
          />
          <Field
            label="Fecha de nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            error={errors.fecha_nacimiento}
            icon={Calendar}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Info envio de invitacion */}
        <AnimatePresence>
          {!esEdicion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 bg-olive/8 border border-olive/15
                          rounded-xl px-3.5 py-2.5"
            >
              <Send size={12} className="text-olive mt-0.5 flex-shrink-0" />
              <p className="text-[10.5px] text-olive-dark leading-relaxed">
                El paciente recibira un mail de invitacion para crear su cuenta.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Errores globales */}
        <AnimatePresence>
          {errors._nochanges && (
            <motion.p
              key="nochange"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200
                          rounded-xl px-3.5 py-2.5"
            >
              {errors._nochanges}
            </motion.p>
          )}
          {errors._server && (
            <motion.p
              key="server"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-accent bg-accent/8 border border-accent/20
                          rounded-xl px-3.5 py-2.5"
            >
              {errors._server}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Botones */}
        <div className="flex gap-2 pt-1">
          <motion.button
            type="button"
            onClick={() => { if (!loading) onClose(); }}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
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
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                Guardando...
              </span>
            ) : esEdicion ? (
              "Guardar cambios"
            ) : (
              "Crear paciente"
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
