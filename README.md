# NutriOliva — Frontend (Web SaaS Multi-Rol)

Aplicacion web SPA construida en **React + Vite + Tailwind CSS** para gestion clinica nutricional, armado inteligente de planes alimenticios, seguimiento diario de pacientes en tiempo real y administracion comercial SaaS.

---

## 1. Descripcion General por Rol

NutriOliva unifica cuatro experiencias adaptadas a cada dispositivo dentro de una arquitectura modular (**141 archivos en `src/`**):

1. **Landing Comercial Interactiva (`/`)**:
   - Tour interactivo guiado en el mockup del Hero (`HeroAppMockup`).
   - Simulador en vivo **Celular del Paciente + Espejo del Nutricionista en Tiempo Real** (`PhonePatientSimulator` + `NutriRealtimeMirror`).
   - Tabla de planes sincronizada con tarifas dinamicas desde Supabase (`planes_suscripcion`), FAQ desplegable y canales directos de contacto (`contactLinks.js`).
2. **Panel del Nutricionista (`/panel/*`)**:
   - Barra superior unificada y 100% responsive (`<NutriNavbar />`) con buscador global instantaneo de pacientes (`Ctrl+K`) y menu movil adaptable.
   - Nomina de pacientes con control real de cupo segun suscripcion, reactivacion en un clic, invitacion por email y alertas de inactividad (+48h sin registros).
   - **Ficha Clinica Integral (`/panel/pacientes/:id`)**: Diario por fecha con fotos firmadas, grafica semanal de adherencia, wizard clinico de 3 pasos (antropometria, composicion corporal, patologias, alergias, medicacion, 5 niveles de actividad y 7 objetivos) e historial de evolucion.
   - **Constructor de Planes (`/panel/pacientes/:id/plan`)**: Versionado (`borrador`, `activo`, `archivado`), 7 tiempos de comida, autocompletado desde el catalogo, **importacion asistida con IA** (`ModalParsePdf`) e **importador directo de Excel/CSV** (`ExcelImporter`).
   - **Catalogo Nutricional (`/panel/catalogo`)**: +205 alimentos y preparaciones clinicas globales mas creacion de alimentos propios del consultorio.
   - **Mi Cuenta (`/panel/cuenta`)**: Perfil del consultorio, metricas de uso, estado de suscripcion/cupo y seguridad.
3. **App Web Mobile-First del Paciente (`/mi-plan/*`)**:
   - Navegacion inferior de 4 pestañas: **Hoy**, **Plan**, **Tendencia** y **Mi Cuenta**.
   - Carga diaria de comidas en **3 modos** (`Del plan` con sugerencia segun horario, `Catalogo` con buscador instantaneo y `Otra comida` con estimacion calorica por IA y adjunto de foto validada hasta 5 MB).
   - Registro de actividad fisica con calculo de gasto calorico, calendario semanal local sin desfase de zona horaria y linea de tiempo editable en movil y escritorio.
   - Visualizacion de notas generales del plan, evolucion antropometrica propia y contacto directo con su nutricionista asignado.
4. **Suite Super Admin Full-Screen (`/admin/*`)**:
   - Layout de pantalla completa (`h-screen`) con sidebar fijo a la izquierda y panel derecho desplazable 100% responsive.
   - **Nutricionistas**: Alta directa via Edge Function, edicion de plan/estado, gestion de `cupo_extra` y pacientes por profesional, indicadores cromaticos de estado (`StatusColorDot`) y tooltips renderizados en portal (`createPortal`).
   - **Facturacion**: Control de cobros mensuales, MRR e ingresos proyectados segun estado comercial.
   - **Metricas y Consumo IA**: KPIs del negocio y modulo `AdminConsumoIA` con desglose real de llamadas y costo estimado de IA (ARS y USD) global, por nutricionista y por paciente.
   - **Ajustes**: Edicion en vivo de precios y cupos de `planes_suscripcion` y perfil del Super Admin.

---

## 2. Stack Tecnologico

| Categoria              | Tecnologia                                                       |
| ---------------------- | ---------------------------------------------------------------- |
| Framework UI           | React `18.3` + Vite `5.4`                                        |
| Estilos y Diseno       | Tailwind CSS `3.4` + CSS Custom Tokens                           |
| Animaciones            | Framer Motion `13.4` + `@formkit/auto-animate`                   |
| Graficos y Metricas    | Recharts `3.10` + `react-countup`                                |
| Importacion Planillas  | SheetJS (`xlsx` `0.18`)                                          |
| Backend / Auth / DB    | `@supabase/supabase-js` `2.45`                                   |
| Enrutamiento           | `react-router-dom` `6.27` (`React.lazy` + `Suspense`)            |
| Iconografia y Feedback | `lucide-react` + `sonner` (notificaciones toast)                 |
| Despliegue             | Vercel (`vercel.json` con cabeceras de seguridad y SPA rewrites) |

---

## 3. Mapa de Rutas (`src/App.jsx`)

| Ruta                        | Acceso / Guard                   | Vista Principal | Descripcion                                                   |
| --------------------------- | -------------------------------- | --------------- | ------------------------------------------------------------- |
| `/`                         | `PublicRoute`                    | `Landing`       | Landing comercial con simulador en tiempo real y precios      |
| `/login`                    | `PublicRoute`                    | `Login`         | Acceso unificado por rol y recuperacion de contraseña         |
| `/set-password`             | Publica (token hash de Supabase) | `SetPassword`   | Activacion de invitacion o restablecimiento de clave          |
| `/panel`                    | `RoleRoute` (`nutricionista`)    | `NutriPanel`    | Listado de pacientes, buscador, filtros y alta                |
| `/panel/pacientes/:id`      | `RoleRoute` (`nutricionista`)    | `PatientDetail` | Ficha del paciente: Diario, Clinica y Datos personales        |
| `/panel/pacientes/:id/plan` | `RoleRoute` (`nutricionista`)    | `PatientPlan`   | Constructor de planes, versiones, IA y Excel                  |
| `/panel/catalogo`           | `RoleRoute` (`nutricionista`)    | `Catalogo`      | Gestion del catalogo global y propio de alimentos             |
| `/panel/cuenta`             | `RoleRoute` (`nutricionista`)    | `NutriCuenta`   | Perfil profesional, cupo de suscripcion y seguridad           |
| `/mi-plan/*`                | `RoleRoute` (`paciente`)         | `PatientPanel`  | Diario Hoy, Plan activo, Tendencia semanal y Mi Cuenta        |
| `/admin/*`                  | `RoleRoute` (`superadmin`)       | `AdminPanel`    | Suite SaaS: Nutricionistas, Facturacion, Metricas/IA, Ajustes |

---

## 4. Estructura del Proyecto

```text
Frontend/
├── public/                              # Favicon, iconos, robots.txt y sitemap.xml
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── ProtectedRoute.jsx       # Guards RoleRoute y PublicRoute con redireccion por rol
│   │   ├── nutri/
│   │   │   ├── NutriNavbar.jsx          # Navbar unificado responsive + buscador Ctrl+K
│   │   │   ├── DatosClinicos.jsx        # Orquestador del wizard clinico
│   │   │   └── datosClinicos/           # Pasos, calculos IMC/cintura y subcomponentes UI
│   │   ├── patient/
│   │   │   ├── DayCalendar.jsx          # Selector semanal local (Lunes a Domingo)
│   │   │   ├── Timeline.jsx             # Linea de tiempo combinada (comidas + actividad)
│   │   │   ├── TimelineEntry.jsx        # Item con foto firmada y acciones en portal
│   │   │   ├── ActivityForm.jsx         # Carga de ejercicio fisico y gasto calorico
│   │   │   ├── FoodForm.jsx             # Modal de registro de comidas en 3 modos
│   │   │   └── foodForm/                # ModoPlan, ModoCatalogo, ModoOtra, FotoInput, pills
│   │   ├── patients/
│   │   │   ├── PatientForm.jsx          # Modal de alta/edicion de paciente e invitacion
│   │   │   └── PatientRow.jsx           # Fila con estado, alerta 48h y tooltips en portal
│   │   ├── plans/
│   │   │   ├── PlanBuilder.jsx          # Constructor interactivo de comidas y macros
│   │   │   └── builder/                 # AddMealForm, ExcelImporter, MealGroup, MealRow
│   │   └── ui/                          # Modal, ConfirmDialog, EmptyState, FloatingDropdown,
│   │                                    # Logo, ScrollToTop, WeeklyCaloriesChart
│   ├── hooks/
│   │   ├── useAuth.jsx                  # Sesion, rol, perfil y refreshPerfil
│   │   ├── useAdmin.js                  # Operaciones reales del Super Admin en Supabase
│   │   ├── usePatients.js               # CRUD de pacientes, cupo e invitaciones
│   │   ├── usePlans.js                  # Versiones de planes, carga individual y por lote
│   │   ├── useCatalogo.js               # Consulta y CRUD del catalogo nutricional
│   │   ├── useRegistros.js              # Registros diarios del paciente + fotos Storage
│   │   ├── useRegistrosNutri.js         # Lectura de registros del paciente para el nutri
│   │   ├── useFoodForm.js               # Logica de los 3 modos de comida + llamada a IA
│   │   ├── useBalance.js                # Calculo de balance calorico diario
│   │   ├── useWeeklyBalance.js          # Balance de los ultimos 7 dias para graficas
│   │   ├── useLogin.js                  # Autenticacion y envio de recuperacion
│   │   └── useSetPassword.js            # Validacion de sesion temporal y timeout de enlace
│   ├── lib/
│   │   ├── supabaseClient.js            # Inicializacion del cliente Supabase
│   │   ├── storage.js                   # Subida, borrado y URLs firmadas en Storage
│   │   ├── dateUtils.js                 # Fechas locales YYYY-MM-DD y generacion de semana
│   │   └── foodFormUtils.js             # Helpers de sugerencia horaria y tipos de comida
│   ├── pages/
│   │   ├── Landing.jsx & landing/       # Hero tour, simulador movil + espejo nutri, precios, FAQ
│   │   ├── Login.jsx & login/           # Formulario de ingreso y showcase animado de 4 vistas
│   │   ├── SetPassword.jsx & set-password/ # Definicion de clave y aviso de link expirado
│   │   ├── nutri/                       # NutriPanel, PatientDetail, PatientPlan, Catalogo, NutriCuenta
│   │   │   ├── catalogo/                # Filtros, tabla, modal y constantes del catalogo
│   │   │   ├── cuenta/                  # Perfil de consultorio, suscripcion/cupo y seguridad
│   │   │   ├── detail/                  # Diario, Clinica, Ficha, metricas y balance diario
│   │   │   └── plan/                    # Versiones, calorias, notas, ModalNuevoPlan, ModalParsePdf
│   │   ├── patient/
│   │   │   ├── PatientPanel.jsx         # Contenedor mobile-first del paciente
│   │   │   └── panel/                   # TabHoy, TabPlan, TabTendencia, TabCuenta, TabCuentaClinica
│   │   └── admin/
│   │       ├── AdminPanel.jsx           # Layout full-screen con sidebar fijo
│   │       └── panel/                   # Nutricionistas, Tabla, Facturacion, Metricas, ConsumoIA, Ajustes, Modales
│   ├── styles/
│   │   └── index.css                    # Estilos base, tipografias y utilidades globales
│   ├── utils/
│   │   └── contactLinks.js              # Enlaces centralizados de WhatsApp y correo comercial
│   ├── App.jsx                          # Enrutador principal con carga diferida (lazy)
│   └── main.jsx                         # Punto de entrada React + Toaster de Sonner
├── .env.example                         # Plantilla de variables de entorno
├── package.json                         # Dependencias y scripts
├── tailwind.config.js                   # Paleta NutriOliva (olive, cream, accent) y tokens
├── vercel.json                          # Rewrites SPA y cabeceras HTTP de seguridad
└── vite.config.js                       # Alias '@' -> './src' y configuracion de build
```

---

## 5. Requisitos e Instalacion Local

### Requisitos Previos

- **Node.js** `18+` y **npm** `9+`.
- Proyecto Supabase con las 17 migraciones y 4 Edge Functions desplegadas (ver `../Backend/README.md`).

### Pasos de Configuracion

1. Ingresar a la carpeta `Frontend` e instalar dependencias:

```bash
cd Frontend
npm install
```

2. Crear el archivo `.env.local` (o `.env`) a partir de `.env.example`:

```bash
cp .env.example .env.local
```

3. Completar las variables de entorno de Supabase:

```env
VITE_SUPABASE_URL=https://cvrgckctgtgcpdtjzxjp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tu_clave_publica
```

4. Iniciar el entorno de desarrollo:

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`.

---

## 6. Scripts Disponibles

| Comando           | Descripcion                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `npm run dev`     | Inicia el servidor de desarrollo Vite con HMR en `http://localhost:5173` |
| `npm run build`   | Genera el bundle optimizado de produccion en `dist/`                     |
| `npm run preview` | Sirve localmente la compilacion de produccion para verificacion          |
| `npm run lint`    | Ejecuta ESLint sobre `src/**/*.{js,jsx}` (`--max-warnings 0`)            |

---

## 7. Despliegue en Produccion (Vercel)

El repositorio incluye `vercel.json` preconfigurado con:

- **SPA Fallback Rewrite**: Todas las rutas profundas (`/panel/*`, `/mi-plan/*`, `/admin/*`, `/set-password`) resuelven a `/index.html`.
- **Cache Inmutable de Assets**: `Cache-Control: public, max-age=31536000, immutable` para `/assets/*`.
- **Cabeceras de Seguridad**: `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy` y `Permissions-Policy`.

Variables requeridas en el panel de **Vercel -> Settings -> Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
