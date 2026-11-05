// LandingPricing.jsx — Seccion de Contacto Directo y Alta Profesional (reemplaza 100% a precios)

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Send,
  User,
  Users,
  Briefcase,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  ADMIN_EMAIL,
  ADMIN_TELEFONO_DISPLAY,
  ADMIN_WHATSAPP,
  buildEmailUrl,
  buildWhatsAppUrl,
  openInNewTab,
} from "@/utils/contactLinks";

export const WHATSAPP_VENTAS = ADMIN_WHATSAPP; // "5493813399463"
export const EMAIL_VENTAS = ADMIN_EMAIL; // "lautaroleal4@gmail.com"

function ContactFloatingField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || (value && value.toString().length > 0);

  return (
    <div className="relative">
      <motion.div
        animate={{
          color: focused ? "#6E7A4B" : "#9B9484",
          scale: focused ? 1.08 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
      >
        <Icon size={14} strokeWidth={1.75} />
      </motion.div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        className="w-full pl-9 pr-3.5 pt-[22px] pb-[7px] rounded-xl border border-cream-darker
                  bg-[#F6F1E7] text-[13px] font-body text-olive-dark
                    focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive/60 transition-all"
      />

      <motion.label
        animate={{
          top: lifted ? "6px" : "50%",
          y: lifted ? "0%" : "-50%",
          fontSize: lifted ? "9.5px" : "12.5px",
          color: focused ? "#6E7A4B" : "#9B9484",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute left-9 right-3 font-display pointer-events-none leading-none truncate"
      >
        {label}
      </motion.label>
    </div>
  );
}

export default function LandingPricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [copiedField, setCopiedField] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    consultorio: "",
    pacientes: "",
    mensaje: "",
  });

  function handleCopy(text, key) {
    navigator.clipboard?.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function construirTextoConsulta() {
    const partes = [
      "Hola Lautaro, me contacto desde el sitio web de NutriOliva.",
      form.nombre.trim() ? `Nombre: ${form.nombre.trim()}` : null,
      form.consultorio.trim()
        ? `Especialidad / Consultorio: ${form.consultorio.trim()}`
        : null,
      form.pacientes.trim()
        ? `Pacientes aprox.: ${form.pacientes.trim()}`
        : null,
      form.mensaje.trim()
        ? `Consulta: ${form.mensaje.trim()}`
        : "Me gustaria recibir informacion para implementar NutriOliva con mis pacientes.",
    ].filter(Boolean);
    return partes.join("\n");
  }

  function handleEnviarWhatsApp(e) {
    e.preventDefault();
    const url = buildWhatsAppUrl(WHATSAPP_VENTAS, construirTextoConsulta());
    openInNewTab(url);
  }

  function handleEnviarEmail() {
    const subject = `Consulta NutriOliva${form.nombre.trim() ? " — " + form.nombre.trim() : ""
      }`;
    const body = construirTextoConsulta();
    const url = buildEmailUrl(EMAIL_VENTAS, subject, body);
    openInNewTab(url);
  }

  return (
    <section id="contacto" ref={ref} className="py-24 px-6 bg-[#EFEAE0]">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5
                        rounded-full uppercase tracking-widest mb-4"
          >
            Contacto directo
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            ¿Queres implementar NutriOliva en tu consultorio?
          </h2>
          <p className="text-muted text-[14px] mt-3 max-w-lg mx-auto">
            Comunicate directamente con nosotros por WhatsApp o correo
            electronico para coordinar una demostracion y dar de alta tu cuenta
            profesional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Columna izquierda: Canales directos (WhatsApp y Email) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Tarjeta WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-olive-dark text-cream rounded-2xl p-6 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-olive flex items-center justify-center">
                    <Phone size={18} className="text-cream" />
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#C5D48A]/20 text-[#C5D48A] font-display text-[10px] font-semibold">
                    Respuesta rapida
                  </span>
                </div>

                <div className="font-display text-[11px] uppercase tracking-wider text-cream/60">
                  WhatsApp / Telefono directo
                </div>
                <div className="font-display text-[21px] font-bold text-cream mt-1">
                  {ADMIN_TELEFONO_DISPLAY}
                </div>
                <p className="text-[12px] text-cream/70 mt-1.5 leading-relaxed">
                  Escribinos para resolver dudas al instante y activar tu acceso
                  profesional.
                </p>
              </div>

              <div className="flex gap-2 mt-5">
                <a
                  href={buildWhatsAppUrl(
                    ADMIN_WHATSAPP,
                    "Hola Lautaro, quiero consultar por NutriOliva para mi consultorio."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cream text-olive-dark font-display font-semibold text-[12px] flex items-center justify-center gap-1.5 hover:bg-cream-dark transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Abrir WhatsApp</span>
                  <ExternalLink size={11} className="opacity-75" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(ADMIN_TELEFONO_DISPLAY, "phone")}
                  className="px-3.5 py-2.5 rounded-xl bg-cream/10 border border-cream/20 text-cream font-display text-[11.5px] flex items-center gap-1.5 hover:bg-cream/20 transition-colors cursor-pointer"
                >
                  {copiedField === "phone" ? (
                    <>
                      <Check size={13} className="text-[#C5D48A]" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copiar
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Tarjeta Email */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-cream-darker text-olive-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-olive/10 flex items-center justify-center">
                    <Mail size={18} className="text-olive" />
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cream text-muted font-display text-[10px] font-semibold">
                    Atencion personalizada
                  </span>
                </div>

                <div className="font-display text-[11px] uppercase tracking-wider text-muted">
                  Correo electronico
                </div>
                <div className="font-display text-[18px] font-bold text-olive-dark mt-1 break-all">
                  {ADMIN_EMAIL}
                </div>
                <p className="text-[12px] text-muted mt-1.5 leading-relaxed">
                  Envianos tu consulta para clinicas, equipos de nutricion o
                  profesionales independientes.
                </p>
              </div>

              <div className="flex gap-2 mt-5">
                <a
                  href={buildEmailUrl(
                    ADMIN_EMAIL,
                    "Consulta sobre NutriOliva",
                    "Hola Lautaro, me gustaria recibir informacion sobre NutriOliva para mi consultorio."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-olive text-cream font-display font-semibold text-[12px] flex items-center justify-center gap-1.5 hover:bg-olive-deep transition-colors"
                >
                  <Mail size={14} />
                  <span>Enviar correo</span>
                  <ExternalLink size={11} className="opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(ADMIN_EMAIL, "email")}
                  className="px-3.5 py-2.5 rounded-xl bg-cream border border-cream-darker text-olive-dark font-display text-[11.5px] flex items-center gap-1.5 hover:bg-cream-darker transition-colors cursor-pointer"
                >
                  {copiedField === "email" ? (
                    <>
                      <Check size={13} className="text-olive" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copiar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha: Formulario directo para armar el mensaje */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-7 bg-white border border-cream-darker rounded-2xl p-7 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="mb-5">
                <h3 className="font-display font-bold text-olive-dark text-[18px]">
                  Envianos tu consulta en un clic
                </h3>
                <p className="text-muted text-[12.5px] mt-1">
                  Completa tus datos y elige si prefieres iniciar la
                  conversacion por WhatsApp o por correo electronico.
                </p>
              </div>

              <form onSubmit={handleEnviarWhatsApp} className="space-y-3.5">
                <ContactFloatingField
                  label="Tu nombre y apellido"
                  name="nombre"
                  icon={User}
                  value={form.nombre}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ContactFloatingField
                    label="Especialidad o consultorio"
                    name="consultorio"
                    icon={Briefcase}
                    value={form.consultorio}
                    onChange={handleChange}
                  />

                  <ContactFloatingField
                    label="Pacientes activos aprox."
                    name="pacientes"
                    icon={Users}
                    value={form.pacientes}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <textarea
                    name="mensaje"
                    rows={3}
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Contanos brevemente como trabajas hoy y que te gustaria optimizar en el seguimiento de tus pacientes..."
                    className="w-full p-3.5 rounded-xl border border-cream-darker bg-[#F6F1E7]
                                text-[12.5px] font-body text-olive-dark placeholder:text-muted/70
                                focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive/60 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-3 px-4 rounded-xl bg-olive text-cream font-display font-semibold text-[12.5px]
                                flex items-center justify-center gap-2 hover:bg-olive-deep transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Consultar por WhatsApp</span>
                    <ExternalLink size={11} className="opacity-80" />
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnviarEmail}
                    className="py-3 px-4 rounded-xl bg-cream border border-cream-darker text-olive-dark font-display font-semibold text-[12.5px]
                                flex items-center justify-center gap-2 hover:bg-cream-darker transition-colors cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>Consultar por Email</span>
                    <ExternalLink size={11} className="opacity-70" />
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Puntos de acompanamiento */}
            <div className="mt-6 pt-4 border-t border-cream flex flex-wrap items-center justify-between gap-3 text-[11px] font-display text-muted">
              {[
                "Alta inmediata de cuenta",
                "Importacion asistida de planes",
                "Soporte directo con el desarrollador",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-olive" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
