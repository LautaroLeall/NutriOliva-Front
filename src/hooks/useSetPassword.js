// useSetPassword.js — Toda la logica del flujo de creacion/restablecimiento de contrasena
// Estados, validaciones, handlers y efectos de sesion

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export function useSetPassword() {
  const navigate = useNavigate();

  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [listo, setListo]           = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [tipoFlujo, setTipoFlujo]   = useState("invite"); // 'invite' | 'recovery'
  const [sessionLista, setSessionLista] = useState(false);

  // Animacion de entrada
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Detectar tipo de flujo desde el hash de la URL
  // Supabase redirige con: /set-password#access_token=xxx&type=invite
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setTipoFlujo("recovery");
    else if (hash.includes("type=invite")) setTipoFlujo("invite");
  }, []);

  // Esperar a que el SDK de Supabase procese el token del hash
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          (event === "SIGNED_IN" ||
           event === "USER_UPDATED" ||
           event === "PASSWORD_RECOVERY") &&
          session
        ) {
          setSessionLista(true);
        }
      }
    );
    // Si ya hay sesion activa (recarga), marcarla de inmediato
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionLista(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Validaciones
  function validar() {
    if (!password)                return "Ingresa una contrasena.";
    if (password.length < 8)      return "La contrasena debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password))  return "Agrega al menos una mayuscula.";
    if (!/[0-9]/.test(password))  return "Agrega al menos un numero.";
    if (!confirm)                 return "Confirma tu contrasena.";
    if (password !== confirm)     return "Las contraseñas no coinciden.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validar();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateErr) {
      setError(
        updateErr.message === "Auth session missing!"
          ? "El link expiro. Pedile al nutricionista que te reenvie la invitacion."
          : updateErr.message
      );
      return;
    }

    setListo(true);

    // Redirigir segun rol del usuario
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", session.user.id)
        .maybeSingle();

      setTimeout(() => {
        if (perfil?.rol === "nutricionista") navigate("/panel",   { replace: true });
        else if (perfil?.rol === "superadmin") navigate("/admin", { replace: true });
        else navigate("/mi-plan", { replace: true });
      }, 2200);
    } else {
      setTimeout(() => navigate("/login", { replace: true }), 2200);
    }
  }

  // Derivado: las contraseñas no coinciden (solo cuando hay algo en confirm)
  const noCoinciden = confirm.length > 0 && password !== confirm;

  return {
    password, setPassword,
    confirm, setConfirm,
    showPass, setShowPass,
    showConf, setShowConf,
    error, setError,
    loading,
    listo,
    mounted,
    tipoFlujo,
    sessionLista,
    noCoinciden,
    handleSubmit,
  };
}
