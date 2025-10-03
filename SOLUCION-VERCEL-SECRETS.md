# 🚨 SOLUCIÓN: Error de Secrets en Vercel

## ❌ Error Actual
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url", which does not exist.
```

## 🎯 Problema
Vercel está configurado incorrectamente - está intentando usar "Secrets" en lugar de "Environment Variables" normales.

## ✅ Solución Paso a Paso

### 1. Ir a la Configuración de Vercel
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto "assistravel-case-management"
3. Ve a **Settings** → **Environment Variables**

### 2. Eliminar Configuración Incorrecta
1. **Busca** las variables que están causando problemas
2. **Elimina** cualquier variable que esté referenciando secrets
3. **Elimina** las siguientes si existen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`

### 3. Agregar Variables Correctamente

#### ⚠️ IMPORTANTE: Usar "Environment Variables", NO "Secrets"

Agrega estas 3 variables **una por una**:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://tuproyecto.supabase.co` (tu URL real)
- **Environment:** Production, Preview, Development (selecciona todas)

#### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu anon key real)
- **Environment:** Production, Preview, Development (selecciona todas)

#### Variable 3:
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://tu-dominio.vercel.app` (tu dominio de Vercel)
- **Environment:** Production, Preview, Development (selecciona todas)

### 4. 🔄 Re-desplegar
Después de configurar las variables:
1. Ve a **Deployments** en tu proyecto de Vercel
2. Encuentra el último deployment
3. Haz clic en los **3 puntos** → **Redeploy**
4. Selecciona **Use existing Build Cache** → **Redeploy**

## 🎯 Diferencia Importante: Environment Variables vs Secrets

### ✅ Environment Variables (Lo que necesitas)
```
NEXT_PUBLIC_SUPABASE_URL = https://abc123.supabase.co
```
Se configura **directamente** con el valor

### ❌ Secrets (Lo que está causando el error)
```
NEXT_PUBLIC_SUPABASE_URL = @next_public_supabase_url
```
Hace **referencia** a un secret que no existe

## 🔍 Cómo Verificar si está Correcto

### En Vercel Dashboard:
- ✅ La variable debe mostrar el valor completo (aunque censurado)
- ❌ NO debe mostrar algo como `@secret_name`

### En el Build Log:
- ✅ No debe haber errores sobre secrets faltantes
- ✅ El build debe completarse exitosamente

## 📱 Obtener las Credenciales de Supabase

### Para NEXT_PUBLIC_SUPABASE_URL:
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia **Project URL**

### Para NEXT_PUBLIC_SUPABASE_ANON_KEY:
1. En la misma página de API
2. Copia **Project API anon key** (el público, no el service_role)

### Para NEXT_PUBLIC_APP_URL:
- Usa tu dominio de Vercel: `https://tu-proyecto.vercel.app`

## 🚨 Notas Importantes

1. **NUNCA** uses la `service_role` key para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **SIEMPRE** usa la `anon public` key
3. Las variables `NEXT_PUBLIC_*` son **públicas** y se envían al cliente
4. **NO** configures secrets para variables públicas

## 🔄 Si el Error Persiste

1. **Limpia completamente** todas las environment variables del proyecto
2. **Espera 5 minutos**
3. **Vuelve a agregar** las variables una por una
4. **Re-despliega** el proyecto

¿Ya configuraste las variables correctamente en Vercel?