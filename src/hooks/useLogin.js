// useLogin.js — Toda la logica de autenticacion del login
// Estados: email, password, showPassword, error, loading, mounted
// Estados: modoReset, emailReset, resetEnviado
// Handlers: handleLogin, handleReset, volverAlLogin

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export function useLogin() {
  const navigate = useNavigate();

  // Login
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [mounted, setMounted]         = useState(false);

  // Reset de contrasena
  const [modoReset, setModoReset]       = useState(false);
  const [emailReset, setEmailReset]     = useState("");
  const [resetEnviado, setResetEnviado] = useState(false);

  // Montaje para animacion de entrada
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", data.user.id)
        .single();

      if (perfil?.rol === "superadmin")       navigate("/admin",   { replace: true });
      else if (perfil?.rol === "nutricionista") navigate("/panel",   { replace: true });
      else if (perfil?.rol === "paciente")      navigate("/mi-plan", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Mail o contrasena incorrectos."
          : "Ocurrio un error. Intentalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!emailReset.trim()) {
      setError("Ingresa tu mail para continuar.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
      emailReset.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/set-password` }
    );
    setLoading(false);
    if (resetErr) setError("No se pudo enviar el mail. Verifica el correo ingresado.");
    else setResetEnviado(true);
  }

  function volverAlLogin() {
    setModoReset(false);
    setResetEnviado(false);
    setEmailReset("");
    setError("");
  }

  return {
    // Estado login
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error, setError,
    loading,
    mounted,
    // Estado reset
    modoReset, setModoReset,
    emailReset, setEmailReset,
    resetEnviado,
    // Handlers
    handleLogin,
    handleReset,
    volverAlLogin,
  };
}
