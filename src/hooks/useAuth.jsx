import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AuthContext = createContext(null)

/**
 * AuthProvider — envuelve toda la app y provee el estado de sesión global.
 * Detecta el rol del usuario (superadmin | nutricionista | paciente)
 * leyendo la tabla `perfiles` en Supabase.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchPerfil(session.user.id)
      else setLoading(false)
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) fetchPerfil(session.user.id)
        else { setPerfil(null); setLoading(false) }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchPerfil(userId) {
    setLoading(true)
    const { data } = await supabase
      .from('perfiles')
      .select('rol, nombre')
      .eq('id', userId)
      .single()
    setPerfil(data)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    perfil,
    loading,
    signOut,
    isAuthenticated: !!session,
    rol: perfil?.rol ?? null,
    nombre: perfil?.nombre ?? session?.user?.email ?? '',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook de acceso al contexto de autenticación */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
