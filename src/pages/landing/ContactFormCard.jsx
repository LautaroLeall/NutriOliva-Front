// ContactFormCard.jsx — Formulario de contacto con validaciones en tiempo real
// Valida Nombre, Email (@), Telefono (numero), Consultorio (texto), Pacientes (numero) y Mensaje (texto)
// y abre SIEMPRE en una nueva pestaña / ventana tanto para WhatsApp como para Email.

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Send,
  User,
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquareText,
} from "lucide-react";
import {
  ADMIN_EMAIL,
  ADMIN_WHATSAPP,
  MAX_MENSAJE_CONTACTO,
  buildEmailUrl,
  buildWhatsAppUrl,
  openInNewTab,
  validarCampoContacto,
} from "@/utils/contactLinks";

function ValidatedFloatingField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  isValid,
  showFeedback,
  icon: Icon,
  type = "text",
  inputMode,
  maxLength = 100,
  hint,
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || (value && value.toString().length > 0);
  const hasError = showFeedback && Boolean(error);
  const hasSuccess = showFeedback && isValid && !error;

  return (
    <div>
      <div className="relative">
        <motion.div
          animate={{
            color: hasError
              ? "#C4573F"
              : hasSuccess
                ? "#6E9B5C"
                : focused
                  ? "#6E7A4B"
                  : "#9B9484",
            scale: focused ? 1.08 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          <Icon size={14} strokeWidth={1.75} />
        </motion.div>

        <input
          type={type}
          inputMode={inputMode}
          name={name}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholder=""
          aria-invalid={hasError}
          className={`w-full pl-9 pr-9 pt-[21px] pb-[7px] rounded-xl border bg-[#F6F1E7] text-[13px] font-body text-olive-dark focus:outline-none focus:ring-2 transition-all ${hasError
            ? "border-danger/70 focus:ring-danger/25 focus:border-danger bg-[#FDF7F5]"
            : hasSuccess
              ? "border-success/70 focus:ring-success/25 focus:border-success"
              : "border-cream-darker focus:ring-olive/30 focus:border-olive/60"
            }`}
        />

        <motion.label
          animate={{
            top: lifted ? "6px" : "50%",
            y: lifted ? "0%" : "-50%",
            fontSize: lifted ? "9.5px" : "12px",
            color: hasError
              ? "#C4573F"
              : hasSuccess
                ? "#5C6740"
                : focused
                  ? "#6E7A4B"
                  : "#9B9484",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute left-9 right-8 font-display pointer-events-none leading-none truncate"
        >
          {label}
        </motion.label>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {hasError && <AlertCircle size={14} className="text-danger" />}
          {hasSuccess && <CheckCircle2 size={14} className="text-success" />}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            className="text-[10.5px] font-display text-danger mt-1 pl-1 flex items-center gap-1"
          >
            <span>{error}</span>
          </motion.p>
        ) : hint && focused ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-display text-muted/80 mt-1 pl-1"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ContactFormCard({ inView }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    consultorio: "",
    pacientes: "",
    mensaje: "",
  });

  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    telefono: false,
    consultorio: false,
    pacientes: false,
    mensaje: false,
  });

  const [ultimoEnvio, setUltimoEnvio] = useState(null);

  const errors = useMemo(
    () => ({
      nombre: validarCampoContacto("nombre", form.nombre),
      email: validarCampoContacto("email", form.email),
      telefono: validarCampoContacto("telefono", form.telefono),
      consultorio: validarCampoContacto("consultorio", form.consultorio),
      pacientes: validarCampoContacto("pacientes", form.pacientes),
      mensaje: validarCampoContacto("mensaje", form.mensaje),
    }),
    [form]
  );

  const camposValidosCount = useMemo(
    () => Object.values(errors).filter((err) => err === "").length,
    [errors]
  );

  const formEsValido = camposValidosCount === 6;

  function handleChange(e) {
    const { name, value } = e.target;
    let nextVal = value;

    if (name === "pacientes") {
      nextVal = value.replace(/[^\d]/g, "").slice(0, 4);
    } else if (name === "telefono") {
      nextVal = value.replace(/[^0-9+\s()-]/g, "").slice(0, 22);
    } else if (name === "email") {
      nextVal = value.replace(/\s+/g, "");
    }

    setForm((prev) => ({ ...prev, [name]: nextVal }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (ultimoEnvio) setUltimoEnvio(null);
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function marcarTodosTocados() {
    setTouched({
      nombre: true,
      email: true,
      telefono: true,
      consultorio: true,
      pacientes: true,
      mensaje: true,
    });
  }

  function construirTextoConsulta() {
    return [
      "Hola equipo de NutriOliva, me contacto desde el formulario oficial del sitio web.",
      `Nombre: ${form.nombre.trim()}`,
      `Correo: ${form.email.trim()}`,
      `Telefono / WhatsApp: ${form.telefono.trim()}`,
      `Especialidad / Consultorio: ${form.consultorio.trim()}`,
      `Pacientes activos aprox.: ${form.pacientes.trim()}`,
      `Mensaje: ${form.mensaje.trim()}`,
    ].join("\n");
  }

  function handleEnviar(canal, e) {
    if (e) e.preventDefault();
    marcarTodosTocados();

    if (!formEsValido) {
      const primerError = Object.values(errors).find(Boolean);
      toast.error(
        primerError || "Revisa los campos marcados en rojo antes de enviar."
      );
      return;
    }

    const texto = construirTextoConsulta();

    if (canal === "whatsapp") {
      const url = buildWhatsAppUrl(ADMIN_WHATSAPP, texto);
      openInNewTab(url);
      setUltimoEnvio("WhatsApp");
      toast.success(
        "Abriendo WhatsApp en una nueva pestaña con tu consulta lista."
      );
    } else {
      const subject = `Consulta NutriOliva — ${form.nombre.trim()} (${form.consultorio.trim()})`;
      const url = buildEmailUrl(ADMIN_EMAIL, subject, texto);
      openInNewTab(url);
      setUltimoEnvio("Correo electronico");
      toast.success(
        "Abriendo redaccion de correo en una nueva pestaña con tus datos."
      );
    }
  }

  const msgLen = form.mensaje.trim().length;
  const msgShowFeedback = touched.mensaje || form.mensaje.length > 0;
  const msgHasError = msgShowFeedback && Boolean(errors.mensaje);
  const msgHasSuccess = msgShowFeedback && !errors.mensaje;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="lg:col-span-7 bg-white border border-cream-darker rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-olive-dark text-[18px]">
              Envianos tu consulta en un clic
            </h3>
            <p className="text-muted text-[12px] mt-0.5">
              Completa tus datos validados en tiempo real. Se abrira siempre en
              una nueva pestaña.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-display text-[10.5px] font-semibold transition-colors ${formEsValido
              ? "bg-success/15 text-success border border-success/30"
              : "bg-cream text-muted border border-cream-darker"
              }`}
          >
            <CheckCircle2
              size={12}
              className={formEsValido ? "text-success" : "text-muted"}
            />
            <span>{camposValidosCount}/6 campos listos</span>
          </span>
        </div>

        <form
          onSubmit={(e) => handleEnviar("whatsapp", e)}
          noValidate
          className="space-y-3"
        >
          <ValidatedFloatingField
            label="Nombre y apellido *"
            name="nombre"
            icon={User}
            value={form.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.nombre}
            isValid={!errors.nombre}
            showFeedback={touched.nombre || form.nombre.length > 0}
            maxLength={70}
            hint="Ejemplo: Lic. Mariana Gomez (solo letras)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ValidatedFloatingField
              label="Tu correo electronico (@) *"
              name="email"
              type="email"
              inputMode="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              isValid={!errors.email}
              showFeedback={touched.email || form.email.length > 0}
              maxLength={90}
              hint="Debe incluir @ y dominio (ej: @gmail.com)"
            />

            <ValidatedFloatingField
              label="Tu WhatsApp / Telefono *"
              name="telefono"
              type="tel"
              inputMode="tel"
              icon={Phone}
              value={form.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.telefono}
              isValid={!errors.telefono}
              showFeedback={touched.telefono || form.telefono.length > 0}
              maxLength={22}
              hint="Solo numeros con codigo de area (8 a 15 digitos)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ValidatedFloatingField
              label="Especialidad o consultorio *"
              name="consultorio"
              icon={Briefcase}
              value={form.consultorio}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.consultorio}
              isValid={!errors.consultorio}
              showFeedback={touched.consultorio || form.consultorio.length > 0}
              maxLength={80}
              hint="Ej: Nutricion clinica, deportiva, consultorio"
            />

            <ValidatedFloatingField
              label="Pacientes activos aprox. *"
              name="pacientes"
              type="text"
              inputMode="numeric"
              icon={Users}
              value={form.pacientes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.pacientes}
              isValid={!errors.pacientes}
              showFeedback={touched.pacientes || form.pacientes.length > 0}
              maxLength={4}
              hint="Solo numeros enteros (ej: 15, 30, 60)"
            />
          </div>

          <div>
            <div className="relative">
              <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1 bg-[#F6F1E7] rounded-t-xl border-x border-t border-cream-darker">
                <span className="inline-flex items-center gap-1.5 font-display text-[10.5px] text-muted">
                  <MessageSquareText size={12} className="text-olive" />
                  <span>Tu mensaje o consulta *</span>
                </span>
                <span
                  className={`font-display text-[10px] font-semibold ${msgHasError
                    ? "text-danger"
                    : msgHasSuccess
                      ? "text-success"
                      : "text-muted"
                    }`}
                >
                  {msgLen}/{MAX_MENSAJE_CONTACTO} caracteres
                </span>
              </div>

              <textarea
                name="mensaje"
                rows={3}
                maxLength={MAX_MENSAJE_CONTACTO}
                value={form.mensaje}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Contanos brevemente como trabajas hoy y que te gustaria optimizar en el seguimiento de tus pacientes..."
                aria-invalid={msgHasError}
                className={`w-full px-3.5 py-2.5 rounded-b-xl border bg-[#F6F1E7] text-[12.5px] font-body text-olive-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 transition-all resize-none ${msgHasError
                  ? "border-danger/70 focus:ring-danger/25 focus:border-danger bg-[#FDF7F5]"
                  : msgHasSuccess
                    ? "border-success/70 focus:ring-success/25 focus:border-success"
                    : "border-cream-darker focus:ring-olive/30 focus:border-olive/60"
                  }`}
              />
            </div>

            <AnimatePresence mode="wait">
              {msgHasError && (
                <motion.p
                  key="msg-error"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10.5px] font-display text-danger mt-1 pl-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} className="flex-shrink-0" />
                  <span>{errors.mensaje}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {ultimoEnvio && (
            <div className="px-3.5 py-2 rounded-xl bg-olive/10 border border-olive/25 text-olive-dark font-display text-[11px] flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-olive flex-shrink-0" />
                <span>
                  Se abrio una nueva pestaña de <strong>{ultimoEnvio}</strong>{" "}
                  con tu mensaje listo para enviar.
                </span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="py-3 px-4 rounded-xl bg-olive text-cream font-display font-semibold text-[12.5px]
                          flex items-center justify-center gap-2 hover:bg-olive-deep transition-colors cursor-pointer shadow-sm"
            >
              <Send size={14} />
              <span>Enviar por WhatsApp</span>
              <ExternalLink size={11} className="opacity-85" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleEnviar("email", e)}
              className="py-3 px-4 rounded-xl bg-cream border border-cream-darker text-olive-dark font-display font-semibold text-[12.5px]
                          flex items-center justify-center gap-2 hover:bg-cream-darker transition-colors cursor-pointer"
            >
              <Mail size={14} />
              <span>Enviar por Email</span>
              <ExternalLink size={11} className="opacity-75" />
            </motion.button>
          </div>
        </form>
      </div>

      <div className="mt-5 pt-3.5 border-t border-cream flex flex-wrap items-center justify-between gap-2.5 text-[10.5px] font-display text-muted">
        {[
          "Alta inmediata de cuenta",
          "Soporte directo y personalizado",
        ].map((item) => (
          <span key={item} className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-olive" />
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
