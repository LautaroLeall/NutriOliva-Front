import { Loader2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/ui/Logo'

/**
 * Pantalla de carga mientras se resuelve la sesión.
 * Evita flashes de redirect antes de conocer el rol.
 */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Logo size={40} className="opacity-80" />
        <div className="flex items-center gap-2 text-muted">
          <Loader2 size={14} className="animate-spin" />
          <span className="font-display text-sm">Cargando...</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Ruta protegida que requiere autenticación.
 * Si no hay sesión, redirige al login.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

/**
 * Ruta que solo puede ver cierto rol.
 * @param {string|string[]} allowedRoles
 */
export function RoleRoute({ allowedRoles, children }) {
  const { isAuthenticated, loading, rol } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  if (!roles.includes(rol)) return <Navigate to="/" replace />
  return children
}

/**
 * Ruta pública — si ya está logueado, redirige al panel correcto.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, loading, rol } = useAuth()
  if (loading) return <LoadingScreen />
  if (isAuthenticated) {
    if (rol === 'superadmin')    return <Navigate to="/admin"   replace />
    if (rol === 'nutricionista') return <Navigate to="/panel"   replace />
    if (rol === 'paciente')      return <Navigate to="/mi-plan" replace />
  }
  return children
}
