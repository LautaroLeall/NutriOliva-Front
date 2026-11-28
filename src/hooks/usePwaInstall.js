// src/hooks/usePwaInstall.js
// Captura global temprana del evento beforeinstallprompt (Android/Chrome/Edge) y
// deteccion de instalacion manual en Safari iOS ("Compartir -> Agregar a inicio").

import { useState, useEffect, useCallback } from "react";
import {
  getAccessMode,
  isIosDevice,
  isRegularWeb,
} from "@/lib/platform";

const SNOOZE_STORAGE_KEY = "nutrioliva_pwa_banner_snooze_until";
const SNOOZE_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 dias

let globalDeferredPrompt = null;
let listenersInitialized = false;
const subscribers = new Set();

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

/**
 * Inicializa la escucha del evento beforeinstallprompt desde el arranque de la app
 * para no perderlo si el navegador lo dispara mientras el usuario esta en /login.
 */
export function initPwaInstallCapture() {
  if (typeof window === "undefined" || listenersInitialized) return;
  listenersInitialized = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    globalDeferredPrompt = event;
    notifySubscribers();
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    try {
      localStorage.removeItem(SNOOZE_STORAGE_KEY);
    } catch {
      // Ignorar modo privado sin almacenamiento
    }
    notifySubscribers();
  });
}

function readSnoozed() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(SNOOZE_STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    if (!Number.isFinite(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

export function usePwaInstall() {
  const [, forceRender] = useState(0);
  const [snoozed, setSnoozed] = useState(readSnoozed);

  useEffect(() => {
    initPwaInstallCapture();
    const onChange = () => forceRender((n) => n + 1);
    subscribers.add(onChange);
    return () => {
      subscribers.delete(onChange);
    };
  }, []);

  const accessMode = getAccessMode();
  const regularWeb = isRegularWeb();
  const ios = isIosDevice();

  const canPromptNativeInstall = regularWeb && Boolean(globalDeferredPrompt);
  const canShowIosGuide = regularWeb && ios && !globalDeferredPrompt;
  const canInstall = canPromptNativeInstall || canShowIosGuide;
  const bannerVisible = canInstall && !snoozed;

  const triggerInstall = useCallback(async () => {
    if (globalDeferredPrompt) {
      const promptEvent = globalDeferredPrompt;
      promptEvent.prompt();
      const choice = await promptEvent.userChoice.catch(() => ({
        outcome: "dismissed",
      }));
      if (choice?.outcome === "accepted") {
        globalDeferredPrompt = null;
      }
      notifySubscribers();
      return choice?.outcome === "accepted" ? "accepted" : "dismissed";
    }
    if (regularWeb && ios) {
      return "ios-guide";
    }
    return "unavailable";
  }, [regularWeb, ios]);

  const dismissBanner = useCallback(() => {
    try {
      localStorage.setItem(
        SNOOZE_STORAGE_KEY,
        String(Date.now() + SNOOZE_DURATION_MS)
      );
    } catch {
      // Ignorar errores de almacenamiento
    }
    setSnoozed(true);
  }, []);

  return {
    accessMode,
    canPromptNativeInstall,
    canShowIosGuide,
    canInstall,
    bannerVisible,
    triggerInstall,
    dismissBanner,
  };
}
