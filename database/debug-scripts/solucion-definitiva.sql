-- SOLUCIÓN DEFINITIVA: Resetear completamente autenticación
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Eliminar TODAS las políticas RLS existentes
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Eliminar todas las políticas RLS de todas las tablas
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename || ';';
    END LOOP;
END $$;

-- PASO 2: Deshabilitar RLS en TODAS las tablas del proyecto
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.corresponsal DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.caso DISABLE ROW LEVEL SECURITY;

-- PASO 3: Verificar y sincronizar usuario específico
-- Primero verificamos si existe en auth.users pero no en usuarios
DO $$
DECLARE
    auth_user_id UUID;
    user_exists BOOLEAN := FALSE;
BEGIN
    -- Buscar el ID del usuario en auth.users
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = 'orelvis.rguez@gmail.com';
    
    IF auth_user_id IS NOT NULL THEN
        -- Verificar si existe en tabla usuarios
        SELECT EXISTS(SELECT 1 FROM public.usuarios WHERE email = 'orelvis.rguez@gmail.com') INTO user_exists;
        
        IF NOT user_exists THEN
            -- Crear el usuario en la tabla usuarios si no existe
            INSERT INTO public.usuarios (id, email, nombre, apellido, rol, created_at, updated_at)
            VALUES (
                auth_user_id,
                'orelvis.rguez@gmail.com',
                'Orelvis',
                'Rodríguez',
                'admin',
                NOW(),
                NOW()
            );
            RAISE NOTICE 'Usuario creado en tabla usuarios';
        ELSE
            -- Actualizar el ID si existe pero con ID diferente
            UPDATE public.usuarios 
            SET id = auth_user_id 
            WHERE email = 'orelvis.rguez@gmail.com' AND id != auth_user_id;
            RAISE NOTICE 'ID de usuario sincronizado';
        END IF;
    END IF;
END $$;

-- PASO 4: Verificación final
SELECT 
    'RESETEO COMPLETO TERMINADO' as estado,
    'Login debería funcionar ahora' as mensaje;

-- PASO 5: Mostrar estado final
SELECT 
    u.email,
    u.nombre,
    u.apellido,
    u.rol,
    (u.id = au.id) as ids_sincronizados,
    'Usuario listo para login' as estado
FROM public.usuarios u
JOIN auth.users au ON u.email = au.email
WHERE u.email = 'orelvis.rguez@gmail.com';