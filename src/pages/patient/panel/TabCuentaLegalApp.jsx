// src/pages/patient/panel/TabCuentaLegalApp.jsx
// Tarjeta de Modo de Aplicacion (instalacion Web App PWA) + Privacidad y Solicitud de Baja
// de Cuenta (requisito normativo Ley 25.326, Google Play Data Safety y Apple Guideline 5.1.1v).

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Download,
  Share,
  PlusSquare,
  FileText,
  Trash2,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { getAccessModeLabel } from "@/lib/platform";
import { ADMIN_EMAIL, getEmailLinkProps } from "@/utils/contactLinks";

export default function TabCuentaLegalApp({
  nombrePaciente,
  emailPaciente,
  nutricionistaInfo,
}) {
  const {
    accessMode,
    canPromptNativeInstall,
    canShowIosGuide,
    triggerInstall,
  } = usePwaInstall();

  const [guiaIosAbierta, setGuiaIosAbierta] = useState(false);
  const [bajaAbierta, setBajaAbierta] = useState(false);

  const modoLabel = getAccessModeLabel();
  const instalada = accessMode === "pwa" || accessMode === "native";

  async function handleInstalarManual() {
    if (canShowIosGuide) {
      setGuiaIosAbierta((v) => !v);
      return;
    }
    const res = await triggerInstall();
    if (res === "accepted") {
      toast.success("NutriOliva quedo instalada en tu dispositivo.");
    }
  }

  const asuntoBaja = `Solicitud de eliminacion de cuenta — ${nombrePaciente} (${emailPaciente})`;
  const cuerpoBaja = [
    "Hola equipo de Privacidad de NutriOliva,",
    "",
    `Solicito la baja y eliminacion definitiva de mi cuenta de paciente y mis registros asociados:`,
    `- Nombre: ${nombrePaciente}`,
    `- Correo registrado: ${emailPaciente}`,
    nutricionistaInfo?.nombre
      ? `- Profesional asignado: Lic. ${nutricionistaInfo.nombre}`
      : null,
    "",
    "Confirmo que comprendo que esta accion eliminara mi acceso y mis registros diarios.",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.18 }}
      className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card space-y-4"
    >
      {/* 1. Estado de instalacion de la App en el dispositivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
            <Smartphone size={17} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-[14px] text-olive-dark">
                Aplicacion en este dispositivo
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-display font-semibold px-2 py-0.5 rounded-full ${instalada
                  ? "bg-olive/12 text-olive"
                  : "bg-cream-dark text-muted"
                  }`}
              >
                {instalada && <CheckCircle2 size={10} />}
                {modoLabel}
              </span>
            </div>
            <p className="text-[11px] text-muted truncate">
              {instalada
                ? "Ya estas usando NutriOliva a pantalla completa."
                : "Podes instalar el acceso directo en tu pantalla de inicio."}
            </p>
          </div>
        </div>

        {(canPromptNativeInstall || canShowIosGuide) && (
          <button
            type="button"
            onClick={handleInstalarManual}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-olive text-cream font-display font-semibold text-[11.5px] hover:bg-olive-dark transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            <Download size={13} />
            <span>
              {canPromptNativeInstall
                ? "Instalar Web App"
                : guiaIosAbierta
                  ? "Ocultar pasos"
                  : "Instalar en iPhone"}
            </span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {canShowIosGuide && guiaIosAbierta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-cream/60 border border-cream-darker p-3.5 space-y-1.5 text-[11.5px] text-olive-dark">
              <p className="flex items-center gap-1.5 flex-wrap">
                <strong>1.</strong> Toca{" "}
                <span className="inline-flex items-center gap-1 font-display font-semibold text-olive">
                  <Share size={12} /> Compartir
                </span>{" "}
                en la barra de Safari.
              </p>
              <p className="flex items-center gap-1.5 flex-wrap">
                <strong>2.</strong> Selecciona{" "}
                <span className="inline-flex items-center gap-1 font-display font-semibold text-olive">
                  <PlusSquare size={12} /> Agregar a inicio
                </span>{" "}
                y toca <strong>Agregar</strong>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Enlaces legales y Solicitud de Baja de Cuenta */}
      <div className="pt-3 border-t border-cream-darker flex flex-wrap items-center justify-between gap-2 text-[11.5px]">
        <Link
          to="/privacidad"
          className="inline-flex items-center gap-1.5 font-display font-medium text-olive hover:text-olive-dark transition-colors"
        >
          <FileText size={13} />
          <span>Politica de privacidad y datos clinicos</span>
        </Link>

        <button
          type="button"
          onClick={() => setBajaAbierta((v) => !v)}
          className="inline-flex items-center gap-1 font-display text-muted hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
          <span>Privacidad y baja de cuenta</span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${bajaAbierta ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {bajaAbierta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-3.5 space-y-2.5 text-[11.5px]">
              <p className="font-display font-semibold text-olive-dark">
                Solicitar eliminacion definitiva de cuenta y datos
              </p>
              <p className="text-muted leading-relaxed">
                Conforme a la Ley 25.326, podes solicitar la supresion total de
                tu usuario de acceso, registros de comidas, actividad fisica y
                fotografias privadas. El equipo procesa la baja definitiva en un
                plazo maximo de 72 horas habiles.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  {...getEmailLinkProps(ADMIN_EMAIL, asuntoBaja, cuerpoBaja)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-display font-semibold text-[11px] hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={12} />
                  <span>Solicitar eliminacion de mi cuenta</span>
                  <ExternalLink size={11} className="opacity-80" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
