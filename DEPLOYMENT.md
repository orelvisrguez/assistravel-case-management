# ASSISTRAVEL - Guía de Deployment

Guía completa para el deployment de ASSISTRAVEL en Vercel.

## 🚀 Deployment en Vercel

### 1. **Preparación del proyecto**

Asegúrate de que tu proyecto esté listo:
```bash
# 1. Instalar dependencias
npm install

# 2. Verificar build local
npm run build

# 3. Verificar tipos
npm run type-check
```

### 2. **Configuración de variables de entorno**

En Vercel Dashboard → Settings → Environment Variables, agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zgpidurdqaxfwmbvuugq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncGlkdXJkcWF4ZndtYnZ1dWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MjA2NDAsImV4cCI6MjA3NTA5NjY0MH0.YLgfIVS3BlbGmhQqRSvDzd3I7CoUXM29bcRBsSyWx6g
NEXT_PUBLIC_APP_URL=https://assistravel-case-management.vercel.app
```

**⚠️ IMPORTANTE:** 
- No crear archivos `vercel.json` - Vercel detecta automáticamente Next.js
- Usar las variables de entorno del dashboard, NO "Secrets"

### 3. **Deployment automático**

1. **Conectar repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno

2. **Deploy automático:**
   - Cada push a `main` deployará automáticamente
   - Cada PR tendrá un preview deployment

### 4. **Configuración de base de datos**

En Supabase Dashboard:

1. **Ejecutar schema:**
   ```sql
   -- Ejecutar en Supabase SQL Editor
   -- Archivo: database/schema.sql
   ```

2. **Configurar RLS (Row Level Security):**
   - Las políticas ya están incluidas en el schema
   - Verificar que estén activas en Dashboard → Authentication → Policies

3. **Crear usuario admin inicial:**
   ```sql
   -- Ejecutar después del primer registro
   UPDATE public.usuarios 
   SET rol = 'admin' 
   WHERE email = 'tu-email@ejemplo.com';
   ```

### 5. **Verificación del deployment**

Después del deployment, verifica:

- ✅ **Login funciona:** `https://tu-dominio.vercel.app/auth/login`
- ✅ **Dashboard carga:** `https://tu-dominio.vercel.app/dashboard`
- ✅ **Variables de entorno:** En consola del navegador (F12)
- ✅ **Base de datos:** Crear un caso de prueba

### 6. **Dominios personalizados**

Para usar tu propio dominio:

1. **En Vercel Dashboard:**
   - Settings → Domains
   - Add Domain → `tu-dominio.com`

2. **Actualizar DNS:**
   - Crear CNAME: `tu-dominio.com` → `cname.vercel-dns.com`

3. **Actualizar variable:**
   ```env
   NEXT_PUBLIC_APP_URL=https://tu-dominio.com
   ```

## 🔧 Configuraciones específicas

### Next.js optimizaciones
El proyecto está configurado para:
- ✅ **Static optimization** automática
- ✅ **Image optimization** con Next/Image
- ✅ **Font optimization** con Next/Font
- ✅ **Bundle analysis** con webpack

### Supabase configuración
- ✅ **Row Level Security** habilitado
- ✅ **Auth policies** configuradas
- ✅ **Real-time** deshabilitado (no necesario)
- ✅ **JWT expiration** configurado

## 🐛 Troubleshooting

### Error común: Variables de entorno no funcionan
**Solución:**
1. Verificar que las variables estén en Vercel Dashboard
2. NO usar archivo `vercel.json`
3. Re-deploy después de cambiar variables

### Error: "Function runtime must have a valid version"
**Solución:**
1. Eliminar cualquier archivo `vercel.json` del proyecto
2. Dejar que Vercel detecte automáticamente Next.js

### Error: "Infinite recursion detected in policy"
**Solución:**
1. Ejecutar script de corrección RLS en Supabase
2. Ubicación: `database/debug-scripts/solucion-definitiva.sql`

### Error: Auth no funciona en producción
**Solución:**
1. Verificar `NEXT_PUBLIC_APP_URL` apunte al dominio correcto
2. Configurar redirect URLs en Supabase:
   - Dashboard → Authentication → URL Configuration
   - Site URL: `https://tu-dominio.vercel.app`
   - Redirect URLs: `https://tu-dominio.vercel.app/**`

## 📊 Monitoreo y logs

### Vercel Analytics
- Habilitado automáticamente
- Ver métricas en Dashboard → Analytics

### Logs de errores
- **Frontend:** Browser Console (F12)
- **Backend:** Vercel Dashboard → Functions → Logs
- **Database:** Supabase Dashboard → Logs

### Performance
- **Core Web Vitals:** Vercel Analytics
- **Database queries:** Supabase Dashboard → Performance

## 🔄 CI/CD Pipeline

El proyecto incluye:
- ✅ **Auto-deployment** en cada push
- ✅ **Preview deployments** para PRs
- ✅ **Build optimization** automática
- ✅ **Type checking** en build
- ✅ **Linting** automático

### Scripts de build
```json
{
  "build": "next build",
  "start": "next start",
  "type-check": "tsc --noEmit"
}
```

## 🚀 Optimizaciones de producción

### Performance
- ✅ **Image optimization** con Next/Image
- ✅ **Font preloading** con Next/Font
- ✅ **Code splitting** automático
- ✅ **Tree shaking** habilitado

### SEO
- ✅ **Meta tags** configurados
- ✅ **Sitemap** generado automáticamente
- ✅ **Open Graph** configurado

### Security
- ✅ **HTTPS** forzado
- ✅ **Security headers** configurados
- ✅ **CSP** (Content Security Policy)

---

**ASSISTRAVEL** - Deployment profesional en Vercel 🚀