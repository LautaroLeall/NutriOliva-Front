# NutriOliva — Frontend

Plataforma web para gestión nutricional, diseño de planes alimenticios y seguimiento diario de pacientes en tiempo real.

## Descripcion General

NutriOliva conecta a nutricionistas con sus pacientes en una interfaz unificada:

- **Nutricionistas**: Gestionan su nómina de pacientes, crean y editan planes de alimentación personalizados con calculo automático de macronutrientes, administran versiones de planes y realizan seguimiento de los registros diarios.
- **Pacientes**: Acceden a su plan asignado, registran sus comidas diarias (usando el catálogo global o personalizado), computan actividad física y visualizan su línea de tiempo nutricional.

## Tecnologias Utilizadas

| Componente        | Tecnologia                   |
| ----------------- | ---------------------------- |
| Framework         | React 18 (Vite 5)            |
| Estilos           | Vanilla CSS + Tailwind CSS 3 |
| Iconos            | Lucide React                 |
| Notificaciones    | Sonner (Toasts)              |
| Cliente DB / Auth | `@supabase/supabase-js` v2   |
| Enrutamiento      | React Router DOM v6          |

## Estructura del Proyecto

```text
Frontend/
├── public/                     # Archivos estaticos y favicon
├── src/
│   ├── components/             # Componentes modulares
│   │   ├── layout/             # Componentes de estructura (ProtectedRoute)
│   │   ├── patient/            # Formularios y timeline para paciente (FoodForm, ActivityForm, Timeline, DayCalendar)
│   │   ├── patients/           # Administracion de pacientes (PatientForm, PatientRow)
│   │   ├── plans/              # Constructor de planes (PlanBuilder)
│   │   └── ui/                 # Componentes UI reutilizables (ConfirmDialog, Modal, EmptyState, Logo)
│   ├── hooks/                  # Hooks personalizados de logica y datos
│   │   ├── useAuth.jsx         # Contexto y estado de autenticacion
│   │   ├── useBalance.js       # Calculos de balance calorico
│   │   ├── usePatients.js      # CRUD de pacientes
│   │   ├── usePlans.js         # Gestion y versiones de planes
│   │   └── useRegistros.js     # Registros diarios de comida y ejercicio
│   ├── lib/
│   │   └── supabaseClient.js   # Inicializacion del cliente de Supabase
│   ├── pages/                  # Vistas principales de la aplicacion
│   │   ├── admin/              # Panel de administracion
│   │   ├── nutri/              # Paneles del nutricionista (NutriPanel, PatientDetail, PatientPlan)
│   │   ├── patient/            # Panel del paciente (PatientPanel)
│   │   ├── Landing.jsx         # Pagina principal pública
│   │   └── Login.jsx           # Formulario de inicio de sesion
│   ├── styles/
│   │   └── index.css           # Estilos globales y utilidades CSS
│   ├── App.jsx                 # Router centralizado
│   └── main.jsx                # Punto de entrada de React
├── .env.example                # Plantilla de variables de entorno
├── package.json                # Dependencias y scripts de Node
├── tailwind.config.js          # Configuracion de Tailwind CSS
└── vite.config.js              # Configuracion de Vite
```

## Modulos y Funcionalidades

### 1. Autenticacion y Roles (E0)

- Inicio de sesión unificado en `/login` para Nutricionistas, Pacientes y Administradores.
- Control de acceso por rol mediante `ProtectedRoute`.
- Persistencia de sesión con almacenamiento seguro en Supabase Auth.

### 2. Gestion de Pacientes (E1)

- Creación, actualización y eliminación de pacientes.
- Formulario de edición con precargado automático de datos clínicos y personales.
- Validaciones estrictas en formato de correo electrónico, campos obligatorios y tipos numéricos.
- Diálogos de doble confirmación (`ConfirmDialog`) previos a cualquier modificación o borrado.

### 3. Constructor de Planes Alimenticios (E2)

- Creación de versiones de planes alimenticios por paciente.
- Cálculo dinámico de calorías y distribución de macronutrientes (proteínas, carbohidratos, grasas).
- Organización por tomas diarias (desayuno, almuerzo, merienda, cena, colaciones).
- Activación, desactivación y edición del plan vigente.

### 4. Diario del Paciente y Timeline (E3)

- Registro fácil de alimentos desde el catálogo global o ingresos manuales.
- Registro de actividades físicas realizadas.
- Calendario diario (`DayCalendar`) y línea de tiempo interactiva (`Timeline`).
- Notificaciones breves y claras mediante la librería Sonner.

## Requisitos Previos

- Node.js versión 18 o superior.
- npm o yarn como gestor de paquetes.

## Instalacion y Configuracion

1. Clonar el repositorio e ingresar al directorio:

```bash
cd Frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo de entorno `.env` basándose en `.env.example`:

```bash
cp .env.example .env
```

4. Configurar las credenciales de Supabase en `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tu_key_aqui
```

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo Vite.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Sirve la build de producción localmente.
- `npm run lint`: Ejecuta ESLint para verificar calidad de código.
