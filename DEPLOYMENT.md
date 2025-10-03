# Instrucciones de Despliegue para ASSISTRAVEL

## Configuración de Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se configure (puede tomar unos minutos)

### 2. Configurar Base de Datos
1. Ve a SQL Editor en tu proyecto de Supabase
2. Copia y pega el contenido del archivo `database/schema.sql`
3. Ejecuta el script para crear las tablas y configuraciones

### 3. Obtener Credenciales
1. Ve a Settings > API en tu proyecto de Supabase
2. Copia:
   - Project URL
   - Project API anon key

## Despliegue en Vercel

### 1. Preparar el Repositorio
```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: ASSISTRAVEL case management system"

# Agregar repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/assistravel-case-management.git

# Push al repositorio
git push -u origin main
```

### 2. Configurar Variables de Entorno en Vercel
1. Ve a [Vercel](https://vercel.com) y crea una cuenta
2. Importa tu repositorio de GitHub
3. En la configuración del proyecto, agrega las siguientes variables de entorno:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXTAUTH_SECRET=un_secreto_aleatorio_seguro
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 3. Desplegar
1. Vercel detectará automáticamente que es un proyecto Next.js
2. Haz clic en "Deploy"
3. Espera a que el despliegue se complete

## Configuración Post-Despliegue

### 1. Crear Usuario Administrador
1. Ve a tu aplicación desplegada
2. Registra el primer usuario con rol "admin"
3. Este será tu usuario administrador principal

### 2. Configurar Corresponsales
1. Inicia sesión como administrador
2. Ve a la sección "Corresponsales"
3. Agrega los corresponsales de tu empresa

### 3. Configurar RLS (Row Level Security)
Las políticas de seguridad ya están configuradas en el script SQL, pero verifica que estén activas:

1. Ve a Authentication > Policies en Supabase
2. Asegúrate de que todas las políticas estén habilitadas

## URLs y Recursos

- **Aplicación**: https://tu-dominio.vercel.app
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Verificar tipos
npm run type-check

# Linter
npm run lint
```

## Solución de Problemas

### Error de Autenticación
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que la URL de la aplicación esté configurada en Supabase

### Error de Base de Datos
- Verifica que el script SQL se haya ejecutado correctamente
- Revisa los logs en Supabase para errores específicos

### Error de Despliegue
- Revisa los logs de build en Vercel
- Asegúrate de que todas las dependencias estén en package.json

## Mantenimiento

### Backup de Base de Datos
1. Ve a Settings > Database en Supabase
2. Programa backups automáticos
3. Descarga backups manuales cuando sea necesario

### Monitoreo
1. Configura alertas en Vercel para errores de aplicación
2. Monitorea el uso de la base de datos en Supabase
3. Revisa los logs regularmente

### Actualizaciones
1. Mantén las dependencias actualizadas
2. Sigue las mejores prácticas de seguridad
3. Realiza backups antes de actualizaciones importantes