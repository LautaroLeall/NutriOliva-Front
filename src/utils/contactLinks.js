// contactLinks.js — Generadores centralizados de enlaces de WhatsApp y Email
// Garantiza que todos los links de contacto abran siempre en una nueva pestaña
// sin cerrar ni reemplazar la pestaña actual de NutriOliva.

export const ADMIN_WHATSAPP = "5493813399463";
export const ADMIN_TELEFONO_DISPLAY = "+549 381 339 9463";
export const ADMIN_EMAIL = "lautaroleal4@gmail.com";

/**
 * Construye URL de WhatsApp lista para abrir en nueva pestaña.
 */
export function buildWhatsAppUrl(phone = ADMIN_WHATSAPP, text = "") {
  const digits = String(phone || ADMIN_WHATSAPP).replace(/\D/g, "");
  const cleanPhone = digits.startsWith("54") ? digits : `549${digits}`;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${cleanPhone}${query}`;
}

/**
 * Construye URL de correo electronico que siempre abre en una nueva pestaña:
 * - En moviles abre el cliente nativo (mailto:).
 * - En escritorio abre Gmail Compose en una nueva pestaña para no cerrar ni
 *   reemplazar nunca la pestaña actual de la aplicacion.
 */
export function buildEmailUrl(to = ADMIN_EMAIL, subject = "", body = "") {
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    const qs = params.toString();
    return `mailto:${to}${qs ? `?${qs}` : ""}`;
  }

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: to || ADMIN_EMAIL,
  });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Abre cualquier URL externa en una nueva pestaña de forma segura.
 */
export function openInNewTab(url) {
  if (!url || typeof window === "undefined") return;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) win.opener = null;
}
