# Sistema de Gestión de Casos ASSISTRAVEL

Un sistema completo de gestión de casos de asistencia en viajes desarrollado con Next.js, Supabase y Tailwind CSS.

## Características

- ✅ **Frontend moderno** con Next.js 14 y Tailwind CSS
- ✅ **Autenticación y autorización** con Supabase Auth
- ✅ **Base de datos** PostgreSQL con Supabase
- ✅ **Gestión de estado** con Zustand
- ✅ **Validación de formularios** con React Hook Form + Zod
- ✅ **Dashboard con KPIs** inteligentes
- ✅ **CRUD completo** para casos y corresponsales
- ✅ **Sistema de roles** (Admin/Usuario)
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Interfaz responsiva** y moderna
- ✅ **Despliegue fácil** con Vercel

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estado global**: Zustand
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Despliegue**: Vercel

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/assistravel-case-management.git
cd assistravel-case-management
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ir a Settings > API para obtener las credenciales
3. Ejecutar el script SQL en `database/schema.sql` en el SQL Editor de Supabase

### 4. Variables de entorno

Copiar `.env.example` a `.env.local` y configurar las variables:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Ejecutar el proyecto

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 14
│   ├── (dashboard)/        # Rutas protegidas del dashboard
│   ├── auth/              # Páginas de autenticación
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/                # Componentes UI básicos
│   ├── layout/            # Componentes de layout
│   ├── dashboard/         # Componentes del dashboard
│   ├── casos/             # Componentes de casos
│   └── corresponsales/    # Componentes de corresponsales
├── lib/                   # Utilidades y configuraciones
│   ├── supabase.ts        # Cliente de Supabase
│   ├── utils.ts           # Funciones utilitarias
│   └── validations.ts     # Esquemas de validación Zod
├── stores/                # Stores de Zustand
│   ├── auth.ts            # Store de autenticación
│   ├── casos.ts           # Store de casos
│   ├── corresponsales.ts  # Store de corresponsales
│   └── dashboard.ts       # Store del dashboard
└── types/                 # Definiciones de tipos TypeScript
    └── index.ts           # Tipos principales
```

## Modelo de Datos

### Tabla `usuarios`
- `id`: UUID (PK, referencia a auth.users)
- `email`: TEXT
- `nombre`: TEXT
- `apellido`: TEXT
- `rol`: TEXT ('admin' | 'user')

### Tabla `corresponsal`
- `id`: SERIAL (PK)
- `nombre`: TEXT
- `contacto`: TEXT
- `email`: TEXT
- `telefonos`: TEXT
- `pagina_web`: TEXT
- `direccion`: TEXT
- `pais_sede`: TEXT

### Tabla `caso`
- `id`: SERIAL (PK)
- `corresponsal_id`: INTEGER (FK)
- `nro_caso_assistravel`: TEXT (UNIQUE)
- `nro_caso_corresponsal`: TEXT
- `fecha_de_inicio`: DATE
- `pais`: TEXT
- `fee`: REAL
- `costo_usd`: REAL
- `monto_agregado`: REAL
- `costo_total`: REAL (computed)
- `simbolo_ml`: TEXT
- `informe_medico`: BOOLEAN
- `tiene_factura`: BOOLEAN
- `fecha_emision_factura`: DATE
- `fecha_vencimiento_factura`: DATE
- `fecha_pago_factura`: DATE
- `nro_factura`: TEXT
- `observaciones`: TEXT
- `created_by`: UUID (FK)

## Funcionalidades Principales

### Dashboard
- KPIs en tiempo real (casos abiertos, costo mensual, facturas vencidas)
- Gráfico de casos por país
- Lista de casos que requieren atención
- Últimos casos actualizados

### Gestión de Casos
- Crear, leer, actualizar y eliminar casos
- Búsqueda avanzada y filtros
- Estados de facturación automáticos
- Paginación y ordenamiento

### Gestión de Corresponsales
- CRUD completo (solo para admins)
- Información de contacto completa
- Integración con casos

### Sistema de Autenticación
- Login/registro con email y contraseña
- Roles de usuario (admin/user)
- Protección de rutas basada en roles
- Sesiones persistentes

## Despliegue

### Vercel (Recomendado)

1. Hacer push del código a GitHub
2. Conectar el repositorio en [Vercel](https://vercel.com)
3. Configurar las variables de entorno en Vercel
4. Desplegar automáticamente

### Variables de entorno para producción

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_produccion
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_produccion
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter
- `npm run type-check` - Verificar tipos TypeScript

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Soporte

Si tienes alguna pregunta o necesitas ayuda, por favor abre un issue en GitHub o contacta al equipo de desarrollo.

---

**Desarrollado por MiniMax Agent** para ASSISTRAVEL