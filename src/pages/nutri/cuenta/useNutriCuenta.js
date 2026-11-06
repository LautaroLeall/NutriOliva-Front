// useNutriCuenta.js — Hook de datos reales y acciones para la seccion Cuenta del Nutricionista

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

const PLANES_FALLBACK = {
  starter: {
    id: "starter",
    nombre: "Starter",
    cupo_pacientes: 15,
    descripcion: "Ideal para consultorios individuales en crecimiento",
  },
  pro: {
    id: "pro",
    nombre: "Pro",
    cupo_pacientes: 50,
    descripcion: "Para profesionales consolidados con cartera activa",
  },
  clinic: {
    id: "clinic",
    nombre: "Clinic",
    cupo_pacientes: 9999,
    descripcion: "Capacidad ilimitada para equipos y centros de nutricion",
  },
};

export function useNutriCuenta() {
  const navigate = useNavigate();
  const { session, nombre, email, signOut, refreshPerfil } = useAuth();
  const userId = session?.user?.id;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil"); // "perfil" | "suscripcion" | "seguridad"

  // Datos de cuenta y estadisticas reales
  const [nutriData, setNutriData] = useState({
    plan_suscripcion: "starter",
    estado: "Activo",
    cupo_extra: 0,
    created_at: null,
  });
  const [planesMap, setPlanesMap] = useState(PLANES_FALLBACK);
  const [stats, setStats] = useState({
    pacientesTotal: 0,
    pacientesActivos: 0,
    pacientesInactivos: 0,
    planesTotal: 0,
    planesActivos: 0,
    evaluacionesClinicas: 0,
    alimentosPropios: 0,
    alimentosGlobales: 0,
    comidasSemana: 0,
    actividadesSemana: 0,
    comidasIA: 0,
    registrosTotalesComida: 0,
  });

  // Estado edicion de perfil
  const [nombreForm, setNombreForm] = useState(nombre || "");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  // Estado cambio de contrasena
  const [passNueva, setPassNueva] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [guardandoPass, setGuardandoPass] = useState(false);

  useEffect(() => {
    if (nombre) setNombreForm(nombre);
  }, [nombre]);

  const cargarDatosCuenta = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);
      const fecha7d = hace7Dias.toISOString().split("T")[0];

      const [
        nutriRes,
        planesSusRes,
        pacientesRes,
        planesRes,
        clinicosRes,
        catalogoRes,
        comidasRes,
        actividadesRes,
      ] = await Promise.all([
        supabase
          .from("nutricionistas")
          .select("plan_suscripcion, estado, cupo_extra, created_at")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("planes_suscripcion")
          .select("id, nombre, precio_mensual_ars, cupo_pacientes, descripcion"),
        supabase
          .from("pacientes")
          .select("id, estado, created_at")
          .eq("nutricionista_id", userId),
        supabase.from("planes").select("id, estado"),
        supabase.from("datos_clinicos").select("id", { count: "exact", head: true }),
        supabase.from("catalogo_alimentos").select("id, nutricionista_id"),
        supabase
          .from("registros_comida")
          .select("id, fecha, fuente_estimacion"),
        supabase.from("registros_actividad").select("id, fecha"),
      ]);

      if (nutriRes.data) {
        setNutriData({
          plan_suscripcion: (nutriRes.data.plan_suscripcion || "starter").toLowerCase(),
          estado: nutriRes.data.estado || "Activo",
          cupo_extra: Number(nutriRes.data.cupo_extra || 0),
          created_at:
            nutriRes.data.created_at || session?.user?.created_at || null,
        });
      } else {
        setNutriData((prev) => ({
          ...prev,
          created_at: session?.user?.created_at || null,
        }));
      }

      if (planesSusRes.data && planesSusRes.data.length > 0) {
        const nextMap = { ...PLANES_FALLBACK };
        planesSusRes.data.forEach((p) => {
          const key = (p.id || "").toLowerCase();
          if (nextMap[key]) {
            nextMap[key] = {
              ...nextMap[key],
              ...p,
            };
          }
        });
        setPlanesMap(nextMap);
      }

      const listaPac = pacientesRes.data || [];
      const pacActivos = listaPac.filter((p) => p.estado === "activo").length;
      const pacInactivos = listaPac.length - pacActivos;

      const listaPlanes = planesRes.data || [];
      const plActivos = listaPlanes.filter((p) => p.estado === "activo").length;

      const listaCat = catalogoRes.data || [];
      const propios = listaCat.filter((c) => c.nutricionista_id === userId).length;
      const globales = listaCat.length - propios;

      const listaComidas = comidasRes.data || [];
      const comidas7d = listaComidas.filter((c) => c.fecha >= fecha7d).length;
      const comidasConIA = listaComidas.filter(
        (c) => c.fuente_estimacion === "ia"
      ).length;

      const listaAct = actividadesRes.data || [];
      const actividades7d = listaAct.filter((a) => a.fecha >= fecha7d).length;

      setStats({
        pacientesTotal: listaPac.length,
        pacientesActivos: pacActivos,
        pacientesInactivos: pacInactivos,
        planesTotal: listaPlanes.length,
        planesActivos: plActivos,
        evaluacionesClinicas: clinicosRes.count ?? 0,
        alimentosPropios: propios,
        alimentosGlobales: globales,
        comidasSemana: comidas7d,
        actividadesSemana: actividades7d,
        comidasIA: comidasConIA,
        registrosTotalesComida: listaComidas.length,
      });
    } catch {
      // Mantiene valores por defecto si alguna consulta falla
    } finally {
      setLoading(false);
    }
  }, [userId, session?.user?.created_at]);

  useEffect(() => {
    cargarDatosCuenta();
  }, [cargarDatosCuenta]);

  // Calculos de cupo del plan
  const planActualKey = nutriData.plan_suscripcion || "starter";
  const planActual = planesMap[planActualKey] || PLANES_FALLBACK.starter;
  const cupoBase = Number(planActual.cupo_pacientes || 15);
  const esIlimitado = cupoBase >= 9999;
  const cupoMaximo = esIlimitado ? 9999 : cupoBase + nutriData.cupo_extra;
  const porcentajeCupo = esIlimitado
    ? Math.min(100, stats.pacientesActivos * 4)
    : Math.min(
      100,
      Math.round((stats.pacientesActivos / Math.max(1, cupoMaximo)) * 100)
    );

  async function handleGuardarPerfil(e) {
    e.preventDefault();
    const limpio = nombreForm.trim();
    if (limpio.length < 2) {
      toast.error("Ingresa un nombre profesional valido (minimo 2 caracteres).");
      return;
    }

    setGuardandoPerfil(true);
    const { error } = await supabase
      .from("perfiles")
      .update({ nombre: limpio })
      .eq("id", userId);
    setGuardandoPerfil(false);

    if (error) {
      toast.error("No se pudo actualizar el perfil: " + error.message);
      return;
    }

    await refreshPerfil?.();
    toast.success("Nombre profesional actualizado correctamente.");
  }

  async function handleCambiarPassword(e) {
    e.preventDefault();
    if (passNueva.length < 6) {
      toast.error("La nueva contrasena debe tener al menos 6 caracteres.");
      return;
    }
    if (passNueva !== passConfirm) {
      toast.error("Las contrasenas ingresadas no coinciden.");
      return;
    }

    setGuardandoPass(true);
    const { error } = await supabase.auth.updateUser({
      password: passNueva,
    });
    setGuardandoPass(false);

    if (error) {
      toast.error("Error al actualizar contrasena: " + error.message);
      return;
    }

    setPassNueva("");
    setPassConfirm("");
    toast.success("Contrasena actualizada con exito.");
  }

  return {
    navigate,
    userId,
    nombre,
    email,
    signOut,
    loading,
    activeTab,
    setActiveTab,
    nutriData,
    planActualKey,
    planActual,
    planesMap,
    cupoBase,
    cupoMaximo,
    esIlimitado,
    porcentajeCupo,
    stats,
    nombreForm,
    setNombreForm,
    guardandoPerfil,
    handleGuardarPerfil,
    passNueva,
    setPassNueva,
    passConfirm,
    setPassConfirm,
    guardandoPass,
    handleCambiarPassword,
    recargar: cargarDatosCuenta,
  };
}
