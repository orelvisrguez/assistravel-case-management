# ASSISTRAVEL - Sistema de Gestión de Casos

Sistema web completo para la gestión de casos de asistencia en viajes, desarrollado con Next.js 14, TypeScript, Supabase y Tailwind CSS.

## 🚀 Características Principales

- ✅ **Autenticación completa** con Supabase Auth
- ✅ **Dashboard interactivo** con KPIs en tiempo real
- ✅ **Gestión de casos** con formularios avanzados
- ✅ **Gestión de corresponsales** 
- ✅ **Gráficos y reportes** con Recharts
- ✅ **Filtros avanzados** y búsqueda
- ✅ **Responsive design** con Tailwind CSS
- ✅ **TypeScript** para mayor seguridad
- ✅ **Deployment automático** en Vercel

## 🛠 Tecnologías

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Estado:** Zustand
- **Gráficos:** Recharts
- **Deployment:** Vercel

## 🏃‍♂️ Inicio Rápido

### 1. Clonar e instalar
```bash
git clone <repository-url>
cd assistravel
npm install
```

### 2. Configurar variables de entorno
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://zgpidurdqaxfwmbvuugq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncGlkdXJkcWF4ZndtYnZ1dWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MjA2NDAsImV4cCI6MjA3NTA5NjY0MH0.YLgfIVS3BlbGmhQqRSvDzd3I7CoUXM29bcRBsSyWx6g
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configurar base de datos
Ejecuta el script SQL en Supabase SQL Editor:
```bash
# Archivo: database/schema.sql
```

### 4. Ejecutar desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📊 Dashboard

El dashboard incluye:
- **KPIs principales:** Casos abiertos, costos mensuales, facturas vencidas
- **Gráficos interactivos:** Casos por país, tendencias mensuales
- **Tablas dinámicas:** Últimos casos, corresponsales activos
- **Filtros avanzados:** Por fecha, país, estado

## 🔐 Autenticación

- **Registro/Login** con email y contraseña
- **Roles de usuario:** Admin y User
- **Protección de rutas** con middleware
- **Gestión de sesiones** automática

## 🎯 Gestión de Casos

Funcionalidades completas:
- ✅ Crear, editar, eliminar casos
- ✅ Asociar a corresponsales
- ✅ Gestión de facturas y fechas
- ✅ Tracking de costos y fees
- ✅ Estados automáticos
- ✅ Filtros y búsqueda avanzada

## 🌐 Gestión de Corresponsales

- ✅ CRUD completo de corresponsales
- ✅ Información de contacto completa
- ✅ Asociación con casos
- ✅ Filtros por país

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (tu dominio de Vercel)

### Manual
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router (Next.js 14)
│   ├── auth/           # Páginas de autenticación
│   ├── (dashboard)/    # Páginas del dashboard
│   └── globals.css     # Estilos globales
├── components/         # Componentes React
│   ├── casos/         # Componentes de casos
│   ├── corresponsales/ # Componentes de corresponsales
│   ├── dashboard/     # Componentes del dashboard
│   ├── layout/        # Layout y navegación
│   └── ui/            # Componentes UI reutilizables
├── lib/               # Utilidades y configuración
├── stores/            # Estado global (Zustand)
└── types/             # Tipos TypeScript
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm start           # Servidor de producción
npm run lint        # Linting
npm run type-check  # Verificación de tipos
```

## 📊 Base de Datos

### Esquema Principal
- **usuarios**: Gestión de usuarios y roles
- **corresponsales**: Información de corresponsales
- **casos**: Gestión completa de casos

### Seguridad
- **Row Level Security (RLS)** configurado
- **Políticas de acceso** por roles
- **Autenticación JWT** con Supabase

## 🛠 Desarrollo

### Agregar nuevas funcionalidades
1. Crear componentes en `src/components/`
2. Agregar tipos en `src/types/`
3. Gestionar estado en `src/stores/`
4. Configurar rutas en `src/app/`

### Buenas prácticas
- ✅ Usa TypeScript para todo
- ✅ Componentes pequeños y reutilizables
- ✅ Estado global solo cuando sea necesario
- ✅ Validación con Zod
- ✅ Manejo de errores consistente

## 🐛 Troubleshooting

### Problemas comunes:
1. **Error de autenticación**: Verifica las variables de entorno
2. **Error de base de datos**: Revisa las políticas RLS
3. **Error de build**: Ejecuta `npm run type-check`

### Logs útiles:
- Browser Console (F12)
- Supabase Dashboard → Logs
- Vercel Dashboard → Functions

## 📞 Soporte

Para problemas técnicos:
1. Revisa los logs en la consola del navegador
2. Verifica la configuración de Supabase
3. Consulta la documentación de Next.js y Supabase

---

**ASSISTRAVEL** - Sistema de gestión profesional para asistencia en viajes 🌍