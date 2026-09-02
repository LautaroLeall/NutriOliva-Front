import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, KeyRound, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/ui/Logo";

/**
 * Pagina que maneja dos flujos:
 * 1. type=invite   — el paciente define su contrasena por primera vez
 * 2. type=recovery — cualquier usuario restablece su contrasena
 *
 * Supabase redirige aqui con el token en el hash de la URL:
 * /set-password#access_token=xxx&refresh_token=xxx&type=invite
 *
 * El SDK de Supabase detecta el hash automaticamente y establece la sesion.
 * Luego llamamos a updateUser({ password }) para guardar la contrasena.
 */
export default function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(false);
  const [tipoFlujo, setTipoFlujo] = useState("invite"); // 'invite' | 'recovery'
  const [sessionLista, setSessionLista] = useState(false);

  // Detectar el tipo de flujo desde el hash de la URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setTipoFlujo("recovery");
    else if (hash.includes("type=invite")) setTipoFlujo("invite");
  }, []);

  // Esperar a que el SDK de Supabase procese el token del hash
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" ||
          event === "USER_UPDATED" ||
          event === "PASSWORD_RECOVERY") &&
        session
      ) {
        setSessionLista(true);
      }
    });
    // Si ya hay sesion activa por el hash, tambien marcar como lista
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionLista(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  function validar() {
    if (!password) return "Ingresa una contrasena.";
    if (password.length < 6)
      return "La contrasena debe tener al menos 6 caracteres.";
    if (password !== confirm) return "Las contraseñas no coinciden.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validar();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);

    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateErr) {
      setError(
        updateErr.message === "Auth session missing!"
          ? "El link de invitacion expiro. Pedile al nutricionista que te reenvie la invitacion."
          : updateErr.message,
      );
      return;
    }

    setListo(true);

    // Redirigir segun el rol del usuario
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", session.user.id)
        .single();

      setTimeout(() => {
        if (perfil?.rol === "nutricionista")
          navigate("/panel", { replace: true });
        else if (perfil?.rol === "superadmin")
          navigate("/admin", { replace: true });
        else navigate("/mi-plan", { replace: true });
      }, 2000);
    } else {
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    }
  }

  const titulo =
    tipoFlujo === "invite"
      ? "Bienvenido a NutriOliva"
      : "Restablecer contraseña";

  const subtitulo =
    tipoFlujo === "invite"
      ? "Crea tu contrasena para acceder a tu plan nutricional."
      : "Ingresa tu nueva contrasena para continuar.";

  return (
    <div className="page min-h-screen bg-[#EFEAE0] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white border border-cream-darker rounded-card shadow-card w-full max-w-sm p-10">
        <div className="flex justify-center mb-5">
          <Logo size={44} />
        </div>

        {listo ? (
          /* ── Pantalla de exito ── */
          <div className="text-center space-y-3">
            <CheckCircle size={36} className="text-success mx-auto" />
            <h1 className="font-display text-lg text-olive-dark">
              Contraseña creada
            </h1>
            <p className="text-sm text-muted">Ingresando a tu cuenta...</p>
          </div>
        ) : (
          /* ── Formulario de contrasena ── */
          <>
            <div className="text-center mb-6">
              <KeyRound size={28} className="text-olive mx-auto mb-3" />
              <h1 className="font-display text-lg text-olive-dark mb-1">
                {titulo}
              </h1>
              <p className="text-xs text-muted">{subtitulo}</p>
            </div>

            {!sessionLista && (
              <div className="flex items-center justify-center gap-2 py-4 text-muted mb-4">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs">Verificando el link...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nueva contraseña</label>
                <input
                  type="password"
                  className={`input ${error && !confirm ? "border-red-400" : ""}`}
                  placeholder="Minimo 6 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoFocus
                  disabled={!sessionLista}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="label">Confirmar contraseña</label>
                <input
                  type="password"
                  className={`input ${error && confirm && password !== confirm ? "border-red-400" : ""}`}
                  placeholder="Repetir contraseña"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError("");
                  }}
                  disabled={!sessionLista}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-xs text-accent bg-accent-bg rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={loading || !sessionLista}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Guardando...
                  </span>
                ) : tipoFlujo === "invite" ? (
                  "Crear cuenta"
                ) : (
                  "Guardar nueva contraseña"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
