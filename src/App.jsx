import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import {
  ProtectedRoute,
  RoleRoute,
  PublicRoute,
} from "@/components/layout/ProtectedRoute";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const SetPassword = lazy(() => import("@/pages/SetPassword"));
const NutriPanel = lazy(() => import("@/pages/nutri/NutriPanel"));
const PatientDetail = lazy(() => import("@/pages/nutri/PatientDetail"));
const PatientPlan = lazy(() => import("@/pages/nutri/PatientPlan"));
const Catalogo = lazy(() => import("@/pages/nutri/Catalogo"));
const PatientPanel = lazy(() => import("@/pages/patient/PatientPanel"));
const AdminPanel = lazy(() => import("@/pages/admin/AdminPanel"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              Cargando...
            </div>
          }
        >
          <Routes>
            {/* Publica */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Ruta publica para definir/restablecer contraseña — NO protegida */}
            {/* Supabase redirige aqui con el token en el hash */}
            <Route path="/set-password" element={<SetPassword />} />

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

            <Route
              path="/panel/catalogo"
              element={
                <RoleRoute allowedRoles="nutricionista">
                  <Catalogo />
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
