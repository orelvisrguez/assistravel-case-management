-- Script alternativo: RLS simplificado para desarrollo inicial
-- Si el script anterior aún da problemas, usar este

-- OPCIÓN 1: Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.corresponsal DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.caso DISABLE ROW LEVEL SECURITY;

-- Las tablas estarán disponibles para todos los usuarios autenticados
-- Puedes habilitar RLS más tarde cuando el sistema esté funcionando

-- OPCIÓN 2: RLS muy básico sin verificación de roles
-- Solo descomenta si quieres RLS básico:

-- ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.corresponsal ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.caso ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Permitir todo a usuarios autenticados - usuarios" ON public.usuarios
--   FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Permitir todo a usuarios autenticados - corresponsal" ON public.corresponsal
--   FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Permitir todo a usuarios autenticados - caso" ON public.caso
--   FOR ALL USING (auth.role() = 'authenticated');

SELECT 'RLS deshabilitado temporalmente para desarrollo' as resultado;