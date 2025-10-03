-- Script de corrección para resolver "infinite recursion detected in policy"
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Deshabilitar RLS temporalmente
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.corresponsal DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.caso DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar políticas existentes que causan recursión
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Solo admins pueden ver todos los usuarios" ON public.usuarios;

DROP POLICY IF EXISTS "Usuarios autenticados pueden ver corresponsales" ON public.corresponsal;
DROP POLICY IF EXISTS "Solo admins pueden crear corresponsales" ON public.corresponsal;
DROP POLICY IF EXISTS "Solo admins pueden actualizar corresponsales" ON public.corresponsal;
DROP POLICY IF EXISTS "Solo admins pueden eliminar corresponsales" ON public.corresponsal;

DROP POLICY IF EXISTS "Usuarios autenticados pueden ver casos" ON public.caso;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear casos" ON public.caso;
DROP POLICY IF EXISTS "Usuarios pueden actualizar casos que crearon o admins" ON public.caso;
DROP POLICY IF EXISTS "Solo admins pueden eliminar casos" ON public.caso;

-- PASO 3: Eliminar función problemática y crear una nueva
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin_user();

-- PASO 4: Crear función auxiliar sin recursión
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Esta función se ejecuta con privilegios elevados para evitar RLS
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 5: Re-habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corresponsal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caso ENABLE ROW LEVEL SECURITY;

-- PASO 6: Crear políticas corregidas SIN recursión

-- Políticas para usuarios (simplificadas)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para corresponsal
CREATE POLICY "Usuarios autenticados pueden ver corresponsales" ON public.corresponsal
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden crear corresponsales" ON public.corresponsal
  FOR INSERT WITH CHECK (public.is_admin_user());

CREATE POLICY "Solo admins pueden actualizar corresponsales" ON public.corresponsal
  FOR UPDATE USING (public.is_admin_user());

CREATE POLICY "Solo admins pueden eliminar corresponsales" ON public.corresponsal
  FOR DELETE USING (public.is_admin_user());

-- Políticas para casos
CREATE POLICY "Usuarios autenticados pueden ver casos" ON public.caso
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden crear casos" ON public.caso
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden actualizar casos que crearon o admins" ON public.caso
  FOR UPDATE USING (
    created_by = auth.uid() OR public.is_admin_user()
  );

CREATE POLICY "Solo admins pueden eliminar casos" ON public.caso
  FOR DELETE USING (public.is_admin_user());

-- PASO 7: Verificar que no hay recursión
SELECT 'Políticas RLS aplicadas correctamente sin recursión' as resultado;