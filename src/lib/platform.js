// src/lib/platform.js
// Deteccion unificada del modo de ejecucion de NutriOliva:
// 1. "web"    -> Navegador tradicional en celular o escritorio
// 2. "pwa"    -> Web App instalada en pantalla de inicio (display-mode: standalone)
// 3. "native" -> App Nativa empaquetada con Capacitor (Android / iOS)

function getCapacitorGlobal() {
  if (typeof window === "undefined") return null;
  return window.Capacitor || null;
}

/**
 * Indica si la app corre dentro del contenedor nativo de Capacitor (Android o iOS).
 * Funciona sin acoplar dependencias antes de instalar @capacitor/core.
 */
export function isNativeApp() {
  const cap = getCapacitorGlobal();
  if (!cap) return false;
  if (typeof cap.isNativePlatform === "function") {
    return Boolean(cap.isNativePlatform());
  }
  const p = typeof cap.getPlatform === "function" ? cap.getPlatform() : "web";
  return p === "android" || p === "ios";
}

/**
 * Devuelve la plataforma activa: "android" | "ios" | "web"
 */
export function nativePlatform() {
  const cap = getCapacitorGlobal();
  if (cap && typeof cap.getPlatform === "function") {
    return cap.getPlatform();
  }
  return "web";
}

/**
 * Indica si la aplicacion fue abierta desde el icono instalado como Web App (PWA).
 */
export function isInstalledPWA() {
  if (typeof window === "undefined" || isNativeApp()) return false;
  const standaloneMedia =
    typeof window.matchMedia === "function" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches);
  const iosStandalone = window.navigator?.standalone === true;
  return Boolean(standaloneMedia || iosStandalone);
}

/**
 * Indica si el usuario esta navegando en una pestaña comun del navegador.
 */
export function isRegularWeb() {
  return !isNativeApp() && !isInstalledPWA();
}

/**
 * Detecta dispositivos iPhone, iPad o iPod (incluyendo iPadOS con userAgent Mac + touch).
 */
export function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOSClassic = /iPhone|iPad|iPod/i.test(ua);
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOSClassic || iPadOS;
}

/**
 * Detecta Android desde el navegador movil.
 */
export function isAndroidDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

/**
 * Retorna el identificador del modo actual: "native" | "pwa" | "web"
 */
export function getAccessMode() {
  if (isNativeApp()) return "native";
  if (isInstalledPWA()) return "pwa";
  return "web";
}

/**
 * Etiqueta legible para mostrar en Mi Cuenta.
 */
export function getAccessModeLabel() {
  const mode = getAccessMode();
  if (mode === "native") return "App Movil instalada";
  if (mode === "pwa") return "Web App instalada";
  return "Navegador Web";
}
