-- Script para asignar el rol de administrador a un usuario específico
-- Reemplaza 'crherrera@c4a.cl' con el email del usuario deseado.

DO $$
DECLARE
    target_user_email TEXT := 'crherrera@c4a.cl'; -- Email del usuario a modificar
    target_user_id UUID;                          -- ID del usuario obtenido de auth.users
    admin_role_uuid UUID := '21dafa54-4167-4b8f-8373-12b6cf86fabc'; -- UUID del rol 'admin'
    user_role_uuid UUID := '5077d75d-c434-44a4-90b0-b7622c8532cd';    -- UUID del rol 'user'
    advisor_role_uuid UUID := '45239a2c-3500-43d4-be80-5cf7ea7a4973'; -- UUID del rol 'advisor'
    
    user_full_name TEXT;
    user_avatar_url TEXT;
    -- auth_user_exists BOOLEAN; -- No se usa, se puede remover
BEGIN
    -- PASO 1: Asegurar que los roles base existan con los UUIDs correctos en public.roles
    RAISE NOTICE 'Paso 1: Asegurando roles base...';
    INSERT INTO public.roles (id, name, description)
    VALUES (admin_role_uuid, 'admin', 'Administrador del sistema con acceso total.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

    INSERT INTO public.roles (id, name, description)
    VALUES (user_role_uuid, 'user', 'Usuario estándar con permisos básicos.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

    INSERT INTO public.roles (id, name, description)
    VALUES (advisor_role_uuid, 'advisor', 'Asesor o consultor con permisos específicos.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
    RAISE NOTICE 'Roles base asegurados.';

    -- PASO 2: Obtener el ID y metadatos del usuario desde auth.users usando su email (case-insensitive)
    RAISE NOTICE 'Paso 2: Buscando usuario en auth.users con email % ...', target_user_email;
    SELECT 
        u.id, 
        u.raw_user_meta_data->>'full_name', 
        u.raw_user_meta_data->>'avatar_url'
    INTO 
        target_user_id, 
        user_full_name, 
        user_avatar_url
    FROM auth.users u
    WHERE lower(u.email) = lower(target_user_email); -- Comparación insensible a mayúsculas/minúsculas

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Paso 2 Fallido: Usuario con email % no encontrado en auth.users. Por favor, regístralo primero.', target_user_email;
        RETURN;
    END IF;
    RAISE NOTICE 'Paso 2 Exitoso: Usuario encontrado en auth.users. ID: %, Email: %, FullName: %, AvatarURL: %', 
                 target_user_id, target_user_email, COALESCE(user_full_name, 'N/A'), COALESCE(user_avatar_url, 'N/A');

    -- PASO 2.1: Verificar explícitamente que el ID obtenido existe en auth.users (redundante pero para diagnóstico)
    RAISE NOTICE 'Paso 2.1: Verificando existencia del ID % en auth.users ...', target_user_id;
    PERFORM 1 FROM auth.users WHERE id = target_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Paso 2.1 Fallido: El ID de usuario % (obtenido para email %) no parece existir en auth.users al momento de la verificación. Esto es inesperado.', target_user_id, target_user_email;
        RETURN;
    END IF;
    RAISE NOTICE 'Paso 2.1 Exitoso: El ID de usuario % está confirmado en auth.users.', target_user_id;

    -- PASO 3: Insertar o actualizar el perfil del usuario en public.user_profiles
    RAISE NOTICE 'Paso 3: Intentando insertar/actualizar perfil para usuario ID % con role_id de administrador % ...', target_user_id, admin_role_uuid;
    INSERT INTO public.user_profiles (id, role_id, email, full_name, avatar_url, created_at, updated_at)
    VALUES (
        target_user_id,    -- ID del usuario (debe existir en auth.users)
        admin_role_uuid,   -- UUID del rol 'admin'
        target_user_email, -- Email del usuario
        user_full_name,    -- Nombre completo (puede ser NULL)
        user_avatar_url,   -- URL del avatar (puede ser NULL)
        NOW(),             -- Fecha de creación (solo se aplica en INSERT)
        NOW()              -- Fecha de actualización
    )
    ON CONFLICT (id) DO UPDATE SET
        role_id = EXCLUDED.role_id, -- Forzar la asignación del rol de admin
        email = COALESCE(EXCLUDED.email, public.user_profiles.email),
        full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.user_profiles.avatar_url),
        updated_at = NOW();
    RAISE NOTICE 'Paso 3 Exitoso: Perfil para usuario ID % (Email: %) asignado/actualizado con role_id de administrador: %', 
                 target_user_id, target_user_email, admin_role_uuid;

    -- PASO 4: Verificar el resultado (opcional pero recomendado)
    RAISE NOTICE 'Paso 4: Verificando el rol asignado...';
    PERFORM * FROM public.user_profiles WHERE id = target_user_id AND role_id = admin_role_uuid;
    IF FOUND THEN
        RAISE NOTICE 'VERIFICACIÓN EXITOSA: El usuario % (ID: %) ahora tiene el rol de administrador (role_id: %).', 
                     target_user_email, target_user_id, admin_role_uuid;
    ELSE
        RAISE WARNING 'VERIFICACIÓN FALLIDA: No se pudo confirmar el rol de administrador para el usuario % (ID: %). Revise la tabla user_profiles.', 
                      target_user_email, target_user_id;
    END IF;

    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE WARNING 'ERROR DE CLAVE FORÁNEA (23503) al operar en user_profiles para ID %: %', target_user_id, SQLERRM;
            -- Línea corregida: Se añaden los parámetros faltantes para los placeholders '%'
            RAISE WARNING 'Esto usualmente significa que la columna public.user_profiles.id tiene una FK "user_profiles_id_fkey" que apunta a una tabla (posiblemente "public.users") donde el ID % no existe, O que el ID % no existe en "auth.users" a pesar de la verificación previa (muy inusual).', target_user_id, target_user_id;
            RAISE WARNING 'Por favor, verifica la definición de la FK "user_profiles_id_fkey" en la tabla "public.user_profiles". Debería referenciar a "auth.users(id)".';
        WHEN OTHERS THEN
            RAISE WARNING 'Error inesperado durante la asignación de rol de administrador: SQLSTATE: %, SQLERRM: %', SQLSTATE, SQLERRM;
END $$;
