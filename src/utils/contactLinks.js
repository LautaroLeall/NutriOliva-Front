// contactLinks.js — Generadores centralizados de enlaces de WhatsApp, Email e Instagram
// + Validadores en tiempo real del formulario de contacto.
// Garantiza que TODOS los enlaces de correo, WhatsApp e Instagram se abran SIEMPRE
// en una nueva pestaña / ventana sin reemplazar ni cerrar la pantalla actual de NutriOliva.

export const ADMIN_WHATSAPP = "5493813399463";
export const ADMIN_TELEFONO_DISPLAY = "+549 381 339 9463";
export const ADMIN_EMAIL = "nutriolivaa@gmail.com";
export const ADMIN_INSTAGRAM_HANDLE = "@nutri_olivaa";
export const ADMIN_INSTAGRAM_URL = "https://www.instagram.com/nutri_olivaa/";
export const SITE_CANONICAL_URL = "https://nutri-oliva.vercel.app";

export const MAX_MENSAJE_CONTACTO = 500;
export const MIN_MENSAJE_CONTACTO = 10;

/**
 * Construye URL oficial de WhatsApp lista para abrir siempre en una nueva pestaña.
 */
export function buildWhatsAppUrl(phone = ADMIN_WHATSAPP, text = "") {
  const digits = String(phone || ADMIN_WHATSAPP).replace(/\D/g, "");
  const cleanPhone = digits.startsWith("54") ? digits : `549${digits}`;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${cleanPhone}${query}`;
}

/**
 * Construye URL de correo electronico (Gmail Compose Web) que abre SIEMPRE
 * en una nueva pestaña / pantalla sin salir de NutriOliva.
 */
export function buildEmailUrl(to = ADMIN_EMAIL, subject = "", body = "") {
  const targetEmail = (to || ADMIN_EMAIL).trim();
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: targetEmail,
  });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Propiedades estandar para etiquetas <a> de correo que abren siempre en nueva pestaña.
 */
export function getEmailLinkProps(to = ADMIN_EMAIL, subject = "", body = "") {
  return {
    href: buildEmailUrl(to, subject, body),
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

/**
 * Abre cualquier URL externa SIEMPRE en una nueva pestaña / ventana (_blank).
 * Si window.open es restringido por el navegador, dispara un <a target="_blank"> dinamico
 * para garantizar que nunca reemplace la pestaña actual.
 */
export function openInNewTab(url) {
  if (!url || typeof window === "undefined") return;

  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) {
    win.opener = null;
    return;
  }

  if (typeof document !== "undefined") {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Validador en tiempo real para cada campo del formulario de contacto.
 * Devuelve "" si el campo es valido o el mensaje exacto del error si no cumple.
 */
export function validarCampoContacto(name, rawValue) {
  const val = String(rawValue ?? "").trim();

  switch (name) {
    case "nombre": {
      if (!val) return "Ingresa tu nombre y apellido.";
      if (/\d/.test(val)) return "El nombre no debe contener numeros.";
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/.test(val)) {
        return "El nombre solo puede contener letras y espacios.";
      }
      if (val.length < 3) return "Ingresa al menos 3 letras.";
      if (val.split(/\s+/).filter(Boolean).length < 2) {
        return "Ingresa tu nombre y apellido completos.";
      }
      return "";
    }

    case "email": {
      if (!val) return "Ingresa tu correo electronico.";
      if (/\s/.test(val)) return "El correo no puede contener espacios.";
      if (!val.includes("@")) return "El correo debe incluir el signo '@'.";
      const partes = val.split("@");
      if (partes.length !== 2 || !partes[0]) {
        return "Ingresa un usuario valido antes del '@'.";
      }
      if (!partes[1] || !partes[1].includes(".")) {
        return "Completa el dominio despues del '@' (ej: @gmail.com).";
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
        return "Formato de correo invalido (ej: nombre@dominio.com).";
      }
      return "";
    }

    case "telefono": {
      if (!val) return "Ingresa tu numero de WhatsApp o telefono.";
      if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(val)) {
        return "El telefono solo debe contener numeros.";
      }
      if (!/^[0-9+\s()-]+$/.test(val)) {
        return "Solo se permiten numeros, espacios, '+' o guiones.";
      }
      const soloDigitos = val.replace(/\D/g, "");
      if (soloDigitos.length < 8) {
        return `Faltan digitos: ingresa al menos 8 numeros con codigo de area (${soloDigitos.length}/8).`;
      }
      if (soloDigitos.length > 15) {
        return "El numero no puede superar los 15 digitos.";
      }
      return "";
    }

    case "consultorio": {
      if (!val) return "Ingresa tu especialidad o nombre del consultorio.";
      if (/^\d+$/.test(val)) {
        return "Ingresa un texto descriptivo, no solo numeros.";
      }
      if (val.length < 3) return "Debe tener al menos 3 caracteres.";
      return "";
    }

    case "pacientes": {
      if (!val) return "Indica la cantidad aproximada de pacientes.";
      if (!/^\d+$/.test(val)) return "Ingresa unicamente numeros enteros.";
      const num = Number(val);
      if (num < 1 || num > 9999) return "Ingresa un numero entre 1 y 9999.";
      return "";
    }

    case "mensaje": {
      if (!val) return "Escribe tu consulta o mensaje.";
      if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]{3,}/.test(val)) {
        return "El mensaje debe contener texto descriptivo valido.";
      }
      if (val.length < MIN_MENSAJE_CONTACTO) {
        return `Escribe al menos ${MIN_MENSAJE_CONTACTO} caracteres (faltan ${MIN_MENSAJE_CONTACTO - val.length
          }).`;
      }
      if (val.length > MAX_MENSAJE_CONTACTO) {
        return `El mensaje no puede superar los ${MAX_MENSAJE_CONTACTO} caracteres.`;
      }
      return "";
    }

    default:
      return "";
  }
}
