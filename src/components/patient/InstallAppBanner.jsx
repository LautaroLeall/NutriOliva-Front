// src/components/patient/InstallAppBanner.jsx
// Banner inteligente para instalar NutriOliva como Web App (PWA) en Android, Desktop e iPhone.
// Se oculta automaticamente cuando el paciente ya abrio desde la Web App instalada o App Nativa.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, PlusSquare, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function InstallAppBanner() {
  const {
    bannerVisible,
    canPromptNativeInstall,
    canShowIosGuide,
    triggerInstall,
    dismissBanner,
  } = usePwaInstall();

  const [mostrarPasosIos, setMostrarPasosIos] = useState(false);
  const [instalando, setInstalando] = useState(false);

  if (!bannerVisible) return null;

  async function handleInstalarClick() {
    if (canShowIosGuide) {
      setMostrarPasosIos((v) => !v);
      return;
    }
    setInstalando(true);
    const outcome = await triggerInstall();
    setInstalando(false);
    if (outcome === "accepted") {
      toast.success("NutriOliva se agrego a tu pantalla de inicio.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="mb-4 rounded-2xl border border-olive/25 bg-white p-3.5 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-olive text-cream flex items-center justify-center flex-shrink-0 mt-0.5">
            <Smartphone size={17} />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[12.5px] text-olive-dark leading-snug">
              Instala NutriOliva en tu inicio
            </p>
            <p className="text-[11px] text-muted mt-0.5 leading-snug">
              Entra en 1 toque y a pantalla completa para registrar tus comidas
              mas rapido.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissBanner}
          aria-label="Ocultar aviso de instalacion"
          title="Ocultar por ahora"
          className="text-muted hover:text-olive-dark p-1 rounded-lg hover:bg-cream transition-colors flex-shrink-0 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={dismissBanner}
          className="px-3 py-1.5 rounded-xl text-[11px] font-display text-muted hover:text-olive-dark hover:bg-cream transition-colors cursor-pointer"
        >
          Ahora no
        </button>
        <button
          type="button"
          disabled={instalando}
          onClick={handleInstalarClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-olive text-cream font-display font-semibold text-[11.5px] hover:bg-olive-dark transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Download size={13} />
          <span>
            {canPromptNativeInstall
              ? instalando
                ? "Instalando..."
                : "Instalar App"
              : mostrarPasosIos
                ? "Ocultar pasos"
                : "Como instalar en iPhone"}
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {canShowIosGuide && mostrarPasosIos && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-cream-darker space-y-2 text-[11.5px] text-olive-dark">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-olive/12 text-olive font-display font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Toca el boton{" "}
                  <strong className="inline-flex items-center gap-1 font-display text-olive">
                    <Share size={12} /> Compartir
                  </strong>{" "}
                  en la barra de Safari.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-olive/12 text-olive font-display font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Elige{" "}
                  <strong className="inline-flex items-center gap-1 font-display text-olive">
                    <PlusSquare size={12} /> Agregar a inicio
                  </strong>{" "}
                  y confirma con <strong>Agregar</strong>.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
