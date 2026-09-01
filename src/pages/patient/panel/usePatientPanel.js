import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useRegistros } from "@/hooks/useRegistros";
import { useBalance } from "@/hooks/useBalance";
import { useWeeklyBalance } from "@/hooks/useWeeklyBalance";
import { toLocalISO } from "./patientPanelUtils";

export function usePatientPanel() {
  const { session, nombre, signOut } = useAuth();
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(toLocalISO(new Date()));
  const [pacienteId, setPacienteId] = useState(null);
  const [planActivo, setPlanActivo] = useState(null);
  const [loadingInf, setLoadingInf] = useState(true);
  const [fabAbierto, setFabAbierto] = useState(false);
  const [modalComida, setModalComida] = useState(false);
  const [modalActiv, setModalActiv] = useState(false);
  const [tab, setTab] = useState("hoy"); // 'hoy' | 'plan' | 'tendencia'
  const [cuentaDesactivada, setCuentaDesactivada] = useState(false);

  // Hook de tendencia semanal — solo activo cuando el paciente ya está cargado
  const { puntos: puntosSemanales, loading: loadingTendencia } =
    useWeeklyBalance(pacienteId, planActivo?.calorias_objetivo || 0);

  // Cargar info del paciente y su plan activo
  useEffect(() => {
    async function cargarPaciente() {
      if (!session?.user?.id) return;
      setLoadingInf(true);
      setCuentaDesactivada(false);

      // Buscar el perfil sin filtrar por estado para detectar cuenta desactivada
      const { data: pac } = await supabase
        .from("pacientes")
        .select("id, nutricionista_id, estado")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!pac) {
        // Sin perfil — sesion inconsistente
        setLoadingInf(false);
        return;
      }

      if (pac.estado !== "activo") {
        // Cuenta desactivada por el nutricionista
        setCuentaDesactivada(true);
        setLoadingInf(false);
        return;
      }

      setPacienteId(pac.id);
      // Traer plan activo
      const { data: plan } = await supabase
        .from("planes")
        .select("id, calorias_objetivo, version, comidas_plan(*)")
        .eq("paciente_id", pac.id)
        .eq("estado", "activo")
        .single();
      setPlanActivo(plan || null);
      setLoadingInf(false);
    }
    cargarPaciente();
  }, [session]);

  const {
    comidas,
    actividades,
    loading: loadingReg,
    agregarComida,
    editarComida,
    eliminarComida,
    agregarActividad,
    eliminarActividad,
  } = useRegistros(pacienteId, fecha);

  const balance = useBalance(
    comidas,
    actividades,
    planActivo?.calorias_objetivo || 2000,
  );

  async function handleGuardarComida(datos) {
    const { error } = await agregarComida(datos);
    if (!error) toast.success("Comida registrada.");
    else toast.error(error);
    return { error };
  }

  async function handleGuardarActividad(datos) {
    const { error } = await agregarActividad(datos);
    if (!error) toast.success("Actividad registrada.");
    else toast.error(error);
    return { error };
  }

  async function handleEliminarComida(id) {
    const { error } = await eliminarComida(id);
    if (!error) toast.success("Registro eliminado.");
    else toast.error(error);
  }

  async function handleEliminarActividad(id) {
    const { error } = await eliminarActividad(id);
    if (!error) toast.success("Actividad eliminada.");
    else toast.error(error);
  }

  async function handleEditarComida(id, datos) {
    const { error } = await editarComida(id, datos);
    if (!error) toast.success("Registro actualizado.");
    return { error };
  }

  const esPasado = fecha < toLocalISO(new Date());

  // Ordenar comidas por tipo para mostrar el plan
  const ORDEN_TIPO = {
    desayuno: 1,
    almuerzo: 2,
    merienda: 3,
    cena: 4,
    snack: 5,
  };
  const comidasPlan = [...(planActivo?.comidas_plan || [])].sort(
    (a, b) =>
      (ORDEN_TIPO[a.tipo_comida] || 9) - (ORDEN_TIPO[b.tipo_comida] || 9),
  );

  return {
    session,
    nombre,
    signOut,
    navigate,
    fecha,
    setFecha,
    pacienteId,
    planActivo,
    loadingInf,
    cuentaDesactivada,
    fabAbierto,
    setFabAbierto,
    modalComida,
    setModalComida,
    modalActiv,
    setModalActiv,
    tab,
    setTab,
    puntosSemanales,
    loadingTendencia,
    comidas,
    actividades,
    loadingReg,
    balance,
    esPasado,
    comidasPlan,
    handleGuardarComida,
    handleGuardarActividad,
    handleEliminarComida,
    handleEliminarActividad,
    handleEditarComida,
  };
}
