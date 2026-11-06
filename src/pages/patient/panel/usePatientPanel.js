import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useRegistros } from "@/hooks/useRegistros";
import { useBalance } from "@/hooks/useBalance";
import { useWeeklyBalance } from "@/hooks/useWeeklyBalance";
import { toLocalISO } from "@/lib/dateUtils";

export function usePatientPanel() {
  const { session, nombre, signOut } = useAuth();

  const [fecha, setFecha] = useState(toLocalISO(new Date()));
  const [pacienteId, setPacienteId] = useState(null);
  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [nutricionistaInfo, setNutricionistaInfo] = useState(null);
  const [datosClinicos, setDatosClinicos] = useState([]);
  const [planActivo, setPlanActivo] = useState(null);
  const [loadingInf, setLoadingInf] = useState(true);
  const [fabAbierto, setFabAbierto] = useState(false);
  const [modalComida, setModalComida] = useState(false);
  const [modalActiv, setModalActiv] = useState(false);
  const [tab, setTab] = useState("hoy"); // 'hoy' | 'plan' | 'tendencia' | 'cuenta'
  const [cuentaDesactivada, setCuentaDesactivada] = useState(false);

  // Hook de tendencia semanal — solo activo cuando el paciente ya está cargado
  const {
    puntos: puntosSemanales,
    loading: loadingTendencia,
    refetchWeekly,
  } = useWeeklyBalance(pacienteId, planActivo?.calorias_objetivo || 0);

  // Cargar info del paciente, su plan activo, su nutricionista y su ficha clinica
  useEffect(() => {
    async function cargarPaciente() {
      if (!session?.user?.id) return;
      setLoadingInf(true);
      setCuentaDesactivada(false);

      // Buscar el perfil sin filtrar por estado para detectar cuenta desactivada
      const { data: pac } = await supabase
        .from("pacientes")
        .select(
          "id, nutricionista_id, nombre, email, telefono, fecha_nacimiento, estado, created_at"
        )
        .eq("auth_user_id", session.user.id)
        .single();

      if (!pac) {
        setLoadingInf(false);
        return;
      }

      setPacienteInfo(pac);

      if (pac.estado !== "activo") {
        // Cuenta desactivada por el nutricionista (igual cargamos el nutricionista para contacto)
        if (pac.nutricionista_id) {
          const { data: nutri } = await supabase
            .from("perfiles")
            .select("id, nombre, email")
            .eq("id", pac.nutricionista_id)
            .maybeSingle();
          setNutricionistaInfo(nutri || null);
        }
        setCuentaDesactivada(true);
        setLoadingInf(false);
        return;
      }

      setPacienteId(pac.id);

      // Traer plan activo, nutricionista asignado e historial de datos clinicos en paralelo
      const [planRes, nutriRes, clinicosRes] = await Promise.all([
        supabase
          .from("planes")
          .select("id, calorias_objetivo, version, notas, created_at, comidas_plan(*)")
          .eq("paciente_id", pac.id)
          .eq("estado", "activo")
          .maybeSingle(),
        pac.nutricionista_id
          ? supabase
            .from("perfiles")
            .select("id, nombre, email")
            .eq("id", pac.nutricionista_id)
            .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("datos_clinicos")
          .select("*")
          .eq("paciente_id", pac.id)
          .order("fecha_registro", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);

      setPlanActivo(planRes.data || null);
      setNutricionistaInfo(nutriRes.data || null);
      setDatosClinicos(clinicosRes.data || []);
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
    planActivo?.calorias_objetivo || 2000
  );

  async function handleGuardarComida(datos) {
    const { error } = await agregarComida(datos);
    if (!error) {
      toast.success("Comida registrada.");
      refetchWeekly?.();
    } else toast.error(error);
    return { error };
  }

  async function handleGuardarActividad(datos) {
    const { error } = await agregarActividad(datos);
    if (!error) {
      toast.success("Actividad registrada.");
      refetchWeekly?.();
    } else toast.error(error);
    return { error };
  }

  async function handleEliminarComida(id) {
    const { error } = await eliminarComida(id);
    if (!error) {
      toast.success("Registro eliminado.");
      refetchWeekly?.();
    } else toast.error(error);
  }

  async function handleEliminarActividad(id) {
    const { error } = await eliminarActividad(id);
    if (!error) {
      toast.success("Actividad eliminada.");
      refetchWeekly?.();
    } else toast.error(error);
  }

  async function handleEditarComida(id, datos) {
    const { error } = await editarComida(id, datos);
    if (!error) {
      toast.success("Registro actualizado.");
      refetchWeekly?.();
    }
    return { error };
  }

  async function handleCambiarPassword(nuevaPassword) {
    const { error } = await supabase.auth.updateUser({
      password: nuevaPassword,
    });
    if (error) {
      toast.error(error.message || "No se pudo actualizar la contrasena.");
      return { error: error.message };
    }
    toast.success("Contrasena actualizada correctamente.");
    return { error: null };
  }

  // Ordenar comidas por tipo para mostrar el plan
  const ORDEN_TIPO = {
    desayuno: 1,
    colacion: 2,
    almuerzo: 3,
    merienda: 4,
    cena: 5,
    colacion_nocturna: 6,
    snack: 7,
  };
  const comidasPlan = [...(planActivo?.comidas_plan || [])].sort(
    (a, b) =>
      (ORDEN_TIPO[a.tipo_comida] || 9) - (ORDEN_TIPO[b.tipo_comida] || 9)
  );

  return {
    session,
    nombre,
    signOut,
    fecha,
    setFecha,
    pacienteId,
    pacienteInfo,
    nutricionistaInfo,
    datosClinicos,
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
    comidasPlan,
    handleGuardarComida,
    handleGuardarActividad,
    handleEliminarComida,
    handleEliminarActividad,
    handleEditarComida,
    handleCambiarPassword,
  };
}
