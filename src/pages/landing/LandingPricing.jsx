// LandingPricing.jsx — Seccion de Contacto Directo y Alta Profesional (WhatsApp, Email e Instagram)

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  ADMIN_EMAIL,
  ADMIN_INSTAGRAM_HANDLE,
  ADMIN_INSTAGRAM_URL,
  ADMIN_TELEFONO_DISPLAY,
  ADMIN_WHATSAPP,
  buildWhatsAppUrl,
  getEmailLinkProps,
} from "@/utils/contactLinks";
import ContactFormCard from "./ContactFormCard";

export const WHATSAPP_VENTAS = ADMIN_WHATSAPP;
export const EMAIL_VENTAS = ADMIN_EMAIL;

function InstagramIcon({ size = 18, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function LandingPricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [copiedField, setCopiedField] = useState(null);

  function handleCopy(text, key) {
    navigator.clipboard?.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  }

  const emailLinkProps = getEmailLinkProps(
    ADMIN_EMAIL,
    "Consulta sobre NutriOliva",
    "Hola equipo de NutriOliva, me gustaria recibir informacion sobre la plataforma para mi consultorio."
  );

  return (
    <section id="contacto" ref={ref} className="py-24 px-5 sm:px-6 bg-[#EFEAE0]">
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
          <h2 className="font-display font-bold text-olive-dark text-[26px] sm:text-[28px] leading-tight">
            ¿Queres implementar NutriOliva en tu consultorio?
          </h2>
          <p className="text-muted text-[14px] mt-3 max-w-lg mx-auto">
            Comunicate directamente con nosotros por WhatsApp, correo
            electronico o Instagram para coordinar una demostracion y activar tu
            cuenta profesional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Columna izquierda: Canales directos (WhatsApp, Email e Instagram) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Tarjeta WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-olive-dark text-cream rounded-2xl p-5 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-olive flex items-center justify-center">
                    <Phone size={16} className="text-cream" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5D48A]/20 text-[#C5D48A] font-display text-[10px] font-semibold">
                    Respuesta rapida
                  </span>
                </div>

                <div className="font-display text-[10.5px] uppercase tracking-wider text-cream/60">
                  WhatsApp / Telefono directo
                </div>
                <div className="font-display text-[19px] font-bold text-cream mt-0.5">
                  {ADMIN_TELEFONO_DISPLAY}
                </div>
                <p className="text-[11.5px] text-cream/70 mt-1 leading-relaxed">
                  Escribinos para resolver dudas al instante y activar tu acceso
                  profesional.
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  href={buildWhatsAppUrl(
                    ADMIN_WHATSAPP,
                    "Hola! Quiero consultar por NutriOliva para mi consultorio."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-cream text-olive-dark font-display font-semibold text-[11.5px] flex items-center justify-center gap-1.5 hover:bg-cream-dark transition-colors"
                >
                  <MessageCircle size={13} />
                  <span>Abrir WhatsApp</span>
                  <ExternalLink size={11} className="opacity-75" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(ADMIN_TELEFONO_DISPLAY, "phone")}
                  className="px-3 py-2.5 rounded-xl bg-cream/10 border border-cream/20 text-cream font-display text-[11px] flex items-center gap-1.5 hover:bg-cream/20 transition-colors cursor-pointer"
                >
                  {copiedField === "phone" ? (
                    <>
                      <Check size={12} className="text-[#C5D48A]" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copiar
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Tarjeta Email */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.18 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-cream-darker text-olive-dark rounded-2xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center">
                    <Mail size={16} className="text-olive" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream text-muted font-display text-[10px] font-semibold">
                    Correo oficial
                  </span>
                </div>

                <div className="font-display text-[10.5px] uppercase tracking-wider text-muted">
                  Correo electronico
                </div>
                <div className="font-display text-[17px] font-bold text-olive-dark mt-0.5 break-all">
                  {ADMIN_EMAIL}
                </div>
                <p className="text-[11.5px] text-muted mt-1 leading-relaxed">
                  Consultas para consultorios individuales, clinicas o equipos
                  de nutricion.
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  {...emailLinkProps}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-olive text-cream font-display font-semibold text-[11.5px] flex items-center justify-center gap-1.5 hover:bg-olive-deep transition-colors"
                >
                  <Mail size={13} />
                  <span>Enviar correo</span>
                  <ExternalLink size={11} className="opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(ADMIN_EMAIL, "email")}
                  className="px-3 py-2.5 rounded-xl bg-cream border border-cream-darker text-olive-dark font-display text-[11px] flex items-center gap-1.5 hover:bg-cream-darker transition-colors cursor-pointer"
                >
                  {copiedField === "email" ? (
                    <>
                      <Check size={12} className="text-olive" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copiar
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Tarjeta Instagram Oficial */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-cream-darker text-olive-dark rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
                  <InstagramIcon size={17} />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-[10px] uppercase tracking-wider text-muted">
                    Instagram oficial
                  </div>
                  <div className="font-display text-[14.5px] font-bold text-olive-dark truncate">
                    {ADMIN_INSTAGRAM_HANDLE}
                  </div>
                </div>
              </div>

              <a
                href={ADMIN_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3.5 rounded-xl bg-cream hover:bg-olive hover:text-cream text-olive-dark font-display font-semibold text-[11.5px] flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <span>Ver perfil</span>
                <ExternalLink size={11} className="opacity-75" />
              </a>
            </motion.div>
          </div>

          {/* Columna derecha: Formulario con validaciones en tiempo real */}
          <ContactFormCard inView={inView} />
        </div>
      </div>
    </section>
  );
}
