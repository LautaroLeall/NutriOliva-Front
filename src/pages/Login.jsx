import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/ui/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para recuperacion de contrasena
  const [modoReset, setModoReset] = useState(false);
  const [emailReset, setEmailReset] = useState("");
  const [resetEnviado, setResetEnviado] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (authError) throw authError;

      // Obtener el rol del usuario
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", data.user.id)
        .single();

      // Redirigir segun el rol
      if (perfil?.rol === "superadmin") navigate("/admin", { replace: true });
      else if (perfil?.rol === "nutricionista")
        navigate("/panel", { replace: true });
      else if (perfil?.rol === "paciente")
        navigate("/mi-plan", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Mail o contraseña incorrectos."
          : "Ocurrió un error. Intentá de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!emailReset.trim()) {
      setError("Ingresá tu mail para continuar.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
      emailReset.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/login` },
    );
    setLoading(false);
    if (resetErr) {
      setError("No se pudo enviar el mail. Verificá el correo ingresado.");
    } else {
      setResetEnviado(true);
    }
  }

  function volverAlLogin() {
    setModoReset(false);
    setResetEnviado(false);
    setEmailReset("");
    setError("");
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white border border-cream-darker rounded-card shadow-card w-full max-w-sm p-10">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Logo size={44} />
        </div>

        {/* ── Pantalla de confirmacion de reset ── */}
        {modoReset && resetEnviado ? (
          <div className="text-center space-y-4">
            <h1 className="font-display text-lg text-olive-dark">
              Revisá tu correo
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Te enviamos un link para restablecer tu contraseña a{" "}
              <span className="font-medium text-olive-dark">{emailReset}</span>.
            </p>
            <p className="text-xs text-muted">
              Si no lo ves, revisá la carpeta de spam.
            </p>
            <button
              onClick={volverAlLogin}
              className="btn-ghost w-full py-2.5 flex items-center justify-center gap-2 text-sm mt-2"
            >
              <ArrowLeft size={14} />
              Volver al inicio de sesion
            </button>
          </div>
        ) : modoReset ? (
          /* ── Formulario de reset ── */
          <>
            <h1 className="font-display text-lg text-olive-dark text-center mb-2">
              Restablecer contraseña
            </h1>
            <p className="text-xs text-muted text-center mb-6">
              Ingresá tu mail y te enviamos un link para crear una contraseña
              nueva.
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="emailReset" className="label">
                  Mail
                </label>
                <input
                  id="emailReset"
                  type="email"
                  className="input"
                  placeholder="vos@mail.com"
                  value={emailReset}
                  onChange={(e) => {
                    setEmailReset(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs text-accent bg-accent-bg rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Enviar link de recuperacion"
                )}
              </button>
            </form>

            <button
              onClick={volverAlLogin}
              className="mt-4 w-full text-center text-xs text-muted hover:text-olive-dark transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={12} />
              Volver al inicio de sesion
            </button>
          </>
        ) : (
          /* ── Formulario de login principal ── */
          <>
            <h1 className="font-display text-lg text-olive-dark text-center mb-6">
              Iniciar sesion
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="vos@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-xs text-accent bg-accent-bg rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Ingresando...
                  </span>
                ) : (
                  "Iniciar sesion"
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setModoReset(true);
                setError("");
              }}
              className="mt-5 w-full text-center text-xs text-muted hover:text-olive-dark transition-colors cursor-pointer"
            >
              Olvidaste tu contraseña?
            </button>
          </>
        )}
      </div>
    </div>
  );
}
