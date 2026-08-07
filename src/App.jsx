import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ProtectedRoute, RoleRoute, PublicRoute } from '@/components/layout/ProtectedRoute'

import Landing       from '@/pages/Landing'
import Login         from '@/pages/Login'
import NutriPanel    from '@/pages/nutri/NutriPanel'
import PatientDetail from '@/pages/nutri/PatientDetail'
import PatientPlan   from '@/pages/nutri/PatientPlan'
import PatientPanel  from '@/pages/patient/PatientPanel'
import AdminPanel    from '@/pages/admin/AdminPanel'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pública */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Panel nutricionista */}
          <Route
            path="/panel"
            element={
              <RoleRoute allowedRoles="nutricionista">
                <NutriPanel />
              </RoleRoute>
            }
          />
          <Route
            path="/panel/pacientes/:id"
            element={
              <RoleRoute allowedRoles="nutricionista">
                <PatientDetail />
              </RoleRoute>
            }
          />
          <Route
            path="/panel/pacientes/:id/plan"
            element={
              <RoleRoute allowedRoles="nutricionista">
                <PatientPlan />
              </RoleRoute>
            }
          />

          {/* Panel paciente */}
          <Route
            path="/mi-plan/*"
            element={
              <RoleRoute allowedRoles="paciente">
                <PatientPanel />
              </RoleRoute>
            }
          />

          {/* Panel superadmin — ruta separada /admin */}
          <Route
            path="/admin/*"
            element={
              <RoleRoute allowedRoles="superadmin">
                <AdminPanel />
              </RoleRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
