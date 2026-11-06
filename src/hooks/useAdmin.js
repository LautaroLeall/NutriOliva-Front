// useAdmin.js — Hook para el panel de Super Admin con datos y acciones 100% reales en Supabase

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_PLANS } from "@/pages/admin/panel/adminUtils";

export function useAdmin() {
  const [nutricionistas, setNutricionistas] = useState([]);
  const [planesDB, setPlanesDB] = useState([]);
  const [pacientesAll, setPacientesAll] = useState([]);
  const [registrosComida, setRegistrosComida] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [catalogoCount, setCatalogoCount] = useState(0);
  const [pingMs, setPingMs] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const t0 = performance.now();

    const [nutriRes, planesRes, pacRes, regComidaRes, perfilesRes, catRes] =
      await Promise.all([
        supabase
          .from("admin_nutricionistas_view")
          .select(
            "id, nombre, email, plan_suscripcion, estado, total_pacientes, total_pacientes_historico, cupo_extra, cupo_maximo, fecha_alta, precio_mensual_ars"
          )
          .order("fecha_alta", { ascending: false }),
        supabase
          .from("planes_suscripcion")
          .select(
            "id, nombre, precio_mensual_ars, cupo_pacientes, descripcion"
          ),
        supabase
          .from("pacientes")
          .select(
            "id, nutricionista_id, nombre, email, telefono, estado, created_at"
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("registros_comida")
          .select("id, paciente_id, fecha, fuente_estimacion"),
        supabase
          .from("perfiles")
          .select("id, rol, nombre, email, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("catalogo_alimentos")
          .select("id", { count: "exact", head: true }),
      ]);

    const elapsed = Math.round(performance.now() - t0);
    setPingMs(elapsed);
    setLastSync(new Date());

    if (nutriRes.error) {
      setError(nutriRes.error.message);
    } else {
      setNutricionistas(nutriRes.data || []);
    }

    if (!planesRes.error && planesRes.data) {
      setPlanesDB(planesRes.data);
    }

    if (!pacRes.error && pacRes.data) {
      setPacientesAll(pacRes.data);
    }

    if (!regComidaRes.error && regComidaRes.data) {
      setRegistrosComida(regComidaRes.data);
    }

    if (!perfilesRes.error && perfilesRes.data) {
      setPerfiles(perfilesRes.data);
    }

    if (!catRes.error && typeof catRes.count === "number") {
      setCatalogoCount(catRes.count);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Mapa de planes reactivo (combina valores de Supabase con fallback seguro)
  const planesConfig = useMemo(() => {
    const map = {
      starter: { ...DEFAULT_PLANS.starter },
      pro: { ...DEFAULT_PLANS.pro },
      clinic: { ...DEFAULT_PLANS.clinic },
    };
    planesDB.forEach((row) => {
      const k = (row.id || "").toLowerCase();
      if (map[k]) {
        const cupo = Number(row.cupo_pacientes) || map[k].patients;
        map[k] = {
          key: k,
          label: row.nombre || map[k].label,
          price: Number(row.precio_mensual_ars) || 0,
          patients: cupo,
          desc:
            row.descripcion ||
            (cupo >= 9999
              ? "Pacientes ilimitados"
              : `Hasta ${cupo} pacientes activos`),
        };
      }
    });
    return map;
  }, [planesDB]);

  // ── Medir latencia en vivo ────────────────────────────────────────────────
  async function medirLatencia() {
    const t0 = performance.now();
    const { error: err } = await supabase
      .from("perfiles")
      .select("id", { count: "exact", head: true });
    const ms = Math.round(performance.now() - t0);
    if (!err) {
      setPingMs(ms);
      setLastSync(new Date());
    }
    return { ms, error: err?.message || null };
  }

  // ── Cambiar estado de cobro / cuenta ──────────────────────────────────────
  async function cambiarEstado(id, nuevoEstado) {
    const { error: err } = await supabase
      .from("nutricionistas")
      .update({ estado: nuevoEstado })
      .eq("id", id);
    if (err) return { error: err.message };
    await fetchAll();
    return { error: null };
  }

  // ── Actualizar nutricionista completo (nombre + plan + estado + cupo_extra)
  async function actualizarNutricionista(
    id,
    { nombre, plan_suscripcion, estado, cupo_extra }
  ) {
    if (nombre?.trim()) {
      const { error: perfErr } = await supabase
        .from("perfiles")
        .update({ nombre: nombre.trim() })
        .eq("id", id);
      if (perfErr) return { error: perfErr.message };
    }

    const updatePayload = {
      plan_suscripcion,
      estado,
    };
    if (typeof cupo_extra === "number" && !Number.isNaN(cupo_extra)) {
      updatePayload.cupo_extra = Math.max(0, cupo_extra);
    }

    const { error: nutErr } = await supabase
      .from("nutricionistas")
      .update(updatePayload)
      .eq("id", id);

    if (nutErr) return { error: nutErr.message };
    await fetchAll();
    return { error: null };
  }

  // ── Actualizar cupo extra de un nutricionista ─────────────────────────────
  async function actualizarCupoExtra(nutricionistaId, nuevoCupoExtra) {
    const valor = Math.max(0, Number(nuevoCupoExtra) || 0);
    const { error: err } = await supabase
      .from("nutricionistas")
      .update({ cupo_extra: valor })
      .eq("id", nutricionistaId);
    if (err) return { error: err.message };
    await fetchAll();
    return { error: null };
  }

  // ── Cambiar estado (activo/inactivo) de un paciente desde Super Admin ─────
  async function cambiarEstadoPacienteAdmin(pacienteId, nuevoEstado) {
    const { error: err } = await supabase
      .from("pacientes")
      .update({ estado: nuevoEstado })
      .eq("id", pacienteId);
    if (err) return { error: err.message };
    await fetchAll();
    return { error: null };
  }

  // ── Actualizar precios y cupos de los planes en Supabase ──────────────────
  async function actualizarPlanesSuscripcion(planesEditados) {
    const updates = Object.entries(planesEditados).map(
      async ([id, valores]) => {
        const cupo = Number(valores.patients) || 15;
        const precio = Math.max(0, Number(valores.price) || 0);
        const descripcion =
          cupo >= 9999
            ? "Pacientes ilimitados"
            : `Hasta ${cupo} pacientes activos`;

        const { error: err } = await supabase
          .from("planes_suscripcion")
          .update({
            precio_mensual_ars: precio,
            cupo_pacientes: cupo,
            descripcion,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (err) throw new Error(err.message);
      }
    );

    try {
      await Promise.all(updates);
      await fetchAll();
      return { error: null };
    } catch (e) {
      return { error: e.message || "Error al actualizar los planes." };
    }
  }

  // ── Crear nuevo nutricionista via Edge Function ───────────────────────────
  async function crearNutricionista({ nombre, email, password, plan }) {
    const { data, error: err } = await supabase.functions.invoke(
      "create-nutricionista",
      {
        body: { nombre, email, password, plan },
      }
    );
    if (err) {
      const msg =
        err?.context?.json?.error ??
        err.message ??
        "Error al crear el nutricionista.";
      return { data: null, error: msg };
    }
    await fetchAll();
    return { data, error: null };
  }

  // ── Actualizar nombre del propio Super Admin ──────────────────────────────
  async function actualizarPerfilAdmin(userId, nuevoNombre) {
    const { error: err } = await supabase
      .from("perfiles")
      .update({ nombre: nuevoNombre.trim() })
      .eq("id", userId);
    if (err) return { error: err.message };
    await fetchAll();
    return { error: null };
  }

  // ── Cambiar contraseña del Super Admin en Supabase Auth ───────────────────
  async function cambiarPasswordAdmin(newPassword) {
    const { error: err } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (err) return { error: err.message };
    return { error: null };
  }

  return {
    nutricionistas,
    planesConfig,
    pacientesAll,
    registrosComida,
    perfiles,
    catalogoCount,
    pingMs,
    lastSync,
    loading,
    error,
    cambiarEstado,
    actualizarNutricionista,
    actualizarCupoExtra,
    cambiarEstadoPacienteAdmin,
    actualizarPlanesSuscripcion,
    crearNutricionista,
    actualizarPerfilAdmin,
    cambiarPasswordAdmin,
    medirLatencia,
    refetch: fetchAll,
  };
}
