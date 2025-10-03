# 🚨 SOLUCIÓN: Error "infinite recursion detected in policy for relation usuarios"

## ❌ Problema
```
infinite recursion detected in policy for relation "usuarios"
```

## 🎯 Causa del Error
Las políticas RLS (Row Level Security) están creando **recursión infinita** porque:
1. La política intenta verificar si el usuario es admin
2. Para eso consulta la tabla `usuarios` 
3. Pero esa consulta activa la misma política
4. Creando un bucle infinito ♾️

## ✅ SOLUCIÓN INMEDIATA

### Opción A: Script de Corrección (Recomendado)
1. Ve a **Supabase** → Tu proyecto → **SQL Editor**
2. Copia y pega **TODO** el contenido del archivo `database/fix-rls-recursion.sql`
3. Haz clic en **Run**

### Opción B: Deshabilitar RLS Temporalmente (Desarrollo)
1. Ve a **Supabase** → Tu proyecto → **SQL Editor**  
2. Copia y pega **TODO** el contenido del archivo `database/disable-rls-dev.sql`
3. Haz clic en **Run**

## 🔧 Lo que Hace el Script de Corrección

### ANTES (❌ Problemático):
```sql
CREATE POLICY "Solo admins pueden ver todos los usuarios" ON public.usuarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios  ← RECURSIÓN AQUÍ
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
```

### DESPUÉS (✅ Correcto):
```sql
-- Función auxiliar SIN recursión
CREATE FUNCTION public.is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política que usa la función auxiliar
CREATE POLICY "Solo admins pueden crear corresponsales" ON public.corresponsal
  FOR INSERT WITH CHECK (public.is_admin_user());
```

## 🎯 Archivos Creados para la Solución

### 📁 `database/fix-rls-recursion.sql`
- **Propósito:** Script completo de corrección RLS
- **Uso:** Para sistemas en producción con seguridad completa
- **Resultado:** RLS funcional sin recursión

### 📁 `database/disable-rls-dev.sql`  
- **Propósito:** Deshabilitar RLS para desarrollo
- **Uso:** Para desarrollo inicial y testing
- **Resultado:** Sin restricciones de acceso

### 📁 `database/schema.sql`
- **Estado:** Actualizado con las correcciones
- **Cambios:** Políticas RLS corregidas sin recursión

## 🚀 Pasos Post-Corrección

1. **Ejecutar script** en Supabase SQL Editor
2. **Reiniciar aplicación** si está corriendo localmente
3. **Re-desplegar** en Vercel si es necesario
4. **Verificar funcionamiento** - el error debe desaparecer

## 🔍 Verificación

El script debe ejecutarse **sin errores** y mostrar:
```
Políticas RLS aplicadas correctamente sin recursión
```

## ⚠️ Si Aún Hay Problemas

Si el primer script da errores, usa la **Opción B** (deshabilitar RLS):
- Es **seguro para desarrollo**
- Permite que la aplicación funcione
- Puedes habilitar RLS más tarde

## 🎯 Resultado Final

✅ **Sin recursión infinita**  
✅ **Aplicación funcional**  
✅ **Políticas de seguridad correctas**  
✅ **Deploy exitoso**

¿Qué opción prefieres ejecutar primero?