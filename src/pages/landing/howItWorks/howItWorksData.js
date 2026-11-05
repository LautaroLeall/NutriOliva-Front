// howItWorksData.js — Datos, pasos y constantes para LandingHowItWorks

import { ClipboardList, Utensils, BarChart2 } from "lucide-react";

export const GOAL = 2000;

export const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Creas el plan",
    desc: "Arma el plan alimenticio en minutos desde el panel del nutricionista. Organizalo por tipo de comida — desayuno, almuerzo, merienda, cena. O importalo con IA: pega el texto de un plan existente y Claude lo estructura automaticamente.",
    color: "#6E7A4B",
    bg: "#DCE3C8",
  },
  {
    number: "02",
    icon: Utensils,
    title: "Tu paciente lo sigue",
    desc: "El paciente recibe acceso por email y empieza a registrar cada comida y actividad fisica desde su celular. Busca en el catalogo, elige de su plan o carga otra comida, y el sistema calcula el balance al instante.",
    color: "#5C6740",
    bg: "#E8EDDA",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "Ves el progreso",
    desc: 'El panel del nutricionista muestra el balance calorico en tiempo real, el historial completo de registros y cuanto se esta cumpliendo el plan. Sin llamadas, sin preguntar "como vas". Los datos hablan solos.',
    color: "#3F4A2B",
    bg: "#D5DEAD",
  },
];

export const INITIAL_REGISTROS = [
  {
    id: "reg-1",
    tipo: "comida",
    descripcion: "Pollo pata/muslo + arroz con arvejas",
    hora: "11:33",
    kcal: 600,
    fuente: "catalogo",
  },
];

export const CATALOGO_SUGERENCIAS = [
  { nombre: "Pollo pata/muslo + arroz con arvejas", kcal: 600 },
  { nombre: "Omelette de claras y espinaca", kcal: 290 },
  { nombre: "Yogur natural con avena y frutos rojos", kcal: 260 },
  { nombre: "Filet de merluza al horno con calabaza", kcal: 410 },
];

export const ACTIVIDADES_SUGERENCIAS = [
  { nombre: "Funcional", duracion: 45, intensidad: "Alta", kcal: 310 },
  { nombre: "Caminata rapida", duracion: 30, intensidad: "Media", kcal: 150 },
  { nombre: "Natacion", duracion: 45, intensidad: "Media", kcal: 270 },
  { nombre: "Running", duracion: 30, intensidad: "Alta", kcal: 290 },
];

export const DAYS_DEMO = [
  { label: "Lun", num: 2, disabled: false },
  { label: "Mar", num: 3, disabled: false },
  { label: "Mie", num: 4, disabled: false },
  { label: "Jue", num: 5, disabled: false },
  { label: "Vie", num: 6, disabled: true },
  { label: "Sab", num: 7, disabled: true },
  { label: "Dom", num: 8, disabled: true },
];

export function getHoraActual() {
  const now = new Date();
  return (
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0")
  );
}
