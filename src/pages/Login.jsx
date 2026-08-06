import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Logo from '@/components/ui/Logo'

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Obtener el rol del usuario
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', data.user.id)
        .single()

      // Redirigir según el rol
      if (perfil?.rol === 'superadmin')         navigate('/admin',   { replace: true })
      else if (perfil?.rol === 'nutricionista') navigate('/panel',   { replace: true })
      else if (perfil?.rol === 'paciente')      navigate('/mi-plan', { replace: true })
      else navigate('/', { replace: true })

    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Mail o contraseña incorrectos.'
          : 'Ocurrió un error. Intentá de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white border border-cream-darker rounded-card shadow-card w-full max-w-sm p-10">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Logo size={44} />
        </div>

        <h1 className="font-display text-lg text-olive-dark text-center mb-6">
          Iniciar sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Mail</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="vos@mail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Ingresando...
                </span>
              : 'Iniciar sesión'
            }
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-5 cursor-pointer hover:text-olive-dark transition-colors">
          Olvidaste tu contraseña?
        </p>
      </div>
    </div>
  )
}
