// datosClinicosUtils.js — Constantes, opciones y validaciones para el modal de Datos Clinicos

import { User, Activity, HeartPulse, ClipboardList } from "lucide-react";

export const OBJETIVO_OPTS = [
  { value: "bajar", label: "Bajar de peso", desc: "Deficit calorico" },
  { value: "bajar_fuerza", label: "Bajar + fuerza", desc: "Grasa y musculo" },
  { value: "mantener", label: "Mantener peso", desc: "Equilibrio nutricional" },
  { value: "subir", label: "Aumentar peso", desc: "Superavit calorico" },
  { value: "subir_fuerza", label: "Aumentar + fuerza", desc: "Hipertrofia" },
  { value: "rendimiento_deportivo", label: "Rendimiento deportivo", desc: "Nutricion periodizada" },
  { value: "recomposicion", label: "Recomposicion corporal", desc: "Perder grasa, ganar musculo" },
];

export const ACTIVIDAD_OPTS = [
  { value: "sedentario", label: "Sedentario", desc: "Sin ejercicio", factor: "x1.2" },
  { value: "leve", label: "Leve", desc: "1–2 veces/semana", factor: "x1.375" },
  { value: "moderado", label: "Moderado", desc: "3–4 veces/semana", factor: "x1.55" },
  { value: "activo", label: "Activo", desc: "5–6 veces/semana", factor: "x1.725" },
  { value: "muy_activo", label: "Muy activo", desc: "Atleta / doble turno", factor: "x1.9" },
];

export const SEXO_OPTS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "otro", label: "Otro" },
];

export const STEPS = [
  { id: 1, label: "Datos basicos", icon: User },
  { id: 2, label: "Composicion", icon: Activity },
  { id: 3, label: "Objetivo", icon: HeartPulse },
  { id: 4, label: "Clinica", icon: ClipboardList },
];

export const CLINICA_FIELDS = [
  { name: "patologias", label: "Patologias", placeholder: "Ej: Diabetes tipo 2, HTA...", hint: "Separar por coma" },
  { name: "alergias", label: "Alergias e intolerancias", placeholder: "Ej: Lactosa, celiaquia...", hint: "Importante para el plan" },
  { name: "medicacion", label: "Medicacion actual", placeholder: "Ej: Metformina 500mg...", hint: "Afecta absorcion" },
  { name: "observaciones", label: "Observaciones", placeholder: "Notas del nutricionista...", hint: "" },
];

export const FORM_VACIO = {
  peso: "",
  altura: "",
  edad: "",
  sexo: "",
  porcentaje_grasa: "",
  masa_muscular_kg: "",
  cintura_cm: "",
  objetivo: "",
  nivel_actividad: "",
  patologias: "",
  alergias: "",
  medicacion: "",
  observaciones: "",
};

export function calcIMC(peso, altura) {
  const p = Number(peso);
  const a = Number(altura);
  if (!p || !a || a <= 0) return null;
  return (p / (a / 100) ** 2).toFixed(1);
}

export function imcInfo(imc) {
  if (!imc) return null;
  const v = Number(imc);
  if (v < 18.5)
    return {
      label: "Bajo peso",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      bar: "bg-blue-400",
      pct: 12,
    };
  if (v < 25)
    return {
      label: "Normal",
      color: "text-green-700",
      bg: "bg-green-50 border-green-200",
      bar: "bg-green-500",
      pct: 42,
    };
  if (v < 30)
    return {
      label: "Sobrepeso",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      bar: "bg-amber-400",
      pct: 63,
    };
  if (v < 35)
    return {
      label: "Obesidad I",
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
      bar: "bg-orange-500",
      pct: 81,
    };
  return {
    label: "Obesidad II+",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    bar: "bg-red-500",
    pct: 100,
  };
}

export function cinturaRiesgo(cm, sexo) {
  const v = Number(cm);
  if (!v) return null;
  const limite = sexo === "F" ? 88 : 102;
  if (v >= limite)
    return {
      label: "Riesgo cardiovascular elevado",
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
    };
  if (v >= limite * 0.9)
    return {
      label: "Riesgo moderado",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    };
  return {
    label: "Sin riesgo detectado",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  };
}

export function validarPaso(step, form) {
  const errs = {};
  if (step === 1) {
    const p = Number(form.peso);
    const a = Number(form.altura);
    const e = Number(form.edad);
    if (!form.peso.trim()) errs.peso = "Obligatorio.";
    else if (isNaN(p) || p < 20 || p > 300) errs.peso = "20–300 kg.";
    if (!form.altura.trim()) errs.altura = "Obligatoria.";
    else if (isNaN(a) || a < 100 || a > 250) errs.altura = "100–250 cm.";
    if (form.edad !== "" && (isNaN(e) || e < 5 || e > 110))
      errs.edad = "5–110 anos.";
  }
  if (step === 2) {
    const g = Number(form.porcentaje_grasa);
    const m = Number(form.masa_muscular_kg);
    const c = Number(form.cintura_cm);
    if (form.porcentaje_grasa !== "" && (isNaN(g) || g < 3 || g > 65))
      errs.porcentaje_grasa = "3–65%.";
    if (form.masa_muscular_kg !== "" && (isNaN(m) || m < 5 || m > 120))
      errs.masa_muscular_kg = "5–120 kg.";
    if (form.cintura_cm !== "" && (isNaN(c) || c < 40 || c > 200))
      errs.cintura_cm = "40–200 cm.";
  }
  return errs;
}
