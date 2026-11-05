// heroTourData.js — Configuracion de pasos y animaciones del Hero

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: "easeOut" },
  },
});

export const TOUR_STEPS = [
  {
    id: 0,
    short: "01. Pacientes",
    url: "nutri-oliva.vercel.app/panel",
    topBadgeTitle: "Cartera centralizada",
    topBadgeSub: "24 pacientes · 18 registraron hoy",
    bottomBadgeTitle: "Deteccion automatica +48h",
    bottomBadgeSub: "Alerta visual si un paciente deja de registrar",
  },
  {
    id: 1,
    short: "02. Ficha clinica",
    url: "nutri-oliva.vercel.app/panel/pacientes/maria",
    topBadgeTitle: "Antropometria e IMC en vivo",
    topBadgeSub: "Peso: 64.2 kg (-1.8 kg este mes)",
    bottomBadgeTitle: "Historial clinico evolutivo",
    bottomBadgeSub: "Pliegues, perimetros y objetivo al dia",
  },
  {
    id: 2,
    short: "03. Plan e IA",
    url: "nutri-oliva.vercel.app/panel/pacientes/maria/plan",
    topBadgeTitle: "Plan v2 publicado al instante",
    topBadgeSub: "1,800 kcal · Macros calculados",
    bottomBadgeTitle: "Importacion desde PDF o Excel",
    bottomBadgeSub: "La IA estructura las comidas en segundos",
  },
  {
    id: 3,
    short: "04. Diario en vivo",
    url: "nutri-oliva.vercel.app/panel/pacientes/maria#diario",
    topBadgeTitle: "Maria registro su almuerzo",
    topBadgeSub: "1,640 / 1,800 kcal — 91% del objetivo",
    bottomBadgeTitle: "IA estimo las calorias",
    bottomBadgeSub: "Sincronizado en menos de 2 segundos",
  },
];

export const HERO_FEATURE_PILLS = [
  "Seguimiento en tiempo real",
  "Acceso inmediato",
  "Soporte directo por WhatsApp",
];
