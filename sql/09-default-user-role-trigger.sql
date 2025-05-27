-- sql/09-default-user-role-trigger.sql

-- Bloque para asegurar que los roles existan con los UUIDs correctos.
-- Esto se ejecutará una vez cuando apliques el script.
DO $$
DECLARE
    admin_role_uuid UUID := '21dafa54-4167-4b8f-8373-12b6cf86fabc';
    user_role_uuid UUID := '5077d75d-c434-44a4-90b0-b7622c8532cd';
    advisor_role_uuid UUID := '45239a2c-3500-43d4-be80-5cf7ea7a4973';
BEGIN
    -- Insertar o actualizar rol 'admin'
    INSERT INTO public.roles (id, name, description)
    VALUES (admin_role_uuid, 'admin', 'Administrador del sistema con acceso total.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
    RAISE NOTICE 'Rol "admin" asegurado con UUID %', admin_role_uuid;

    -- Insertar o actualizar rol 'user'
    INSERT INTO public.roles (id, name, description)
    VALUES (user_role_uuid, 'user', 'Usuario estándar con permisos básicos.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
    RAISE NOTICE 'Rol "user" asegurado con UUID %', user_role_uuid;

    -- Insertar o actualizar rol 'advisor'
    INSERT INTO public.roles (id, name, description)
    VALUES (advisor_role_uuid, 'advisor', 'Asesor o consultor con permisos específicos.')
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
    RAISE NOTICE 'Rol "advisor" asegurado con UUID %', advisor_role_uuid;
END
$$;

-- Función del trigger para asignar el rol de usuario por defecto y crear el perfil.
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    default_user_role_uuid UUID := '5077d75d-c434-44a4-90b0-b7622c8532cd'; -- UUID del rol 'user'
    user_full_name TEXT;
    user_email TEXT;
    user_avatar_url TEXT;
BEGIN
    -- Obtener metadatos del nuevo usuario.
    -- NEW.raw_user_meta_data es un JSONB.
    user_full_name := NEW.raw_user_meta_data->>'full_name';
    IF user_full_name IS NULL THEN
        -- Intentar obtener de otros campos comunes si full_name no está.
        user_full_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'preferred_username');
    END IF;
    
    user_email := NEW.email;
    user_avatar_url := NEW.raw_user_meta_data->>'avatar_url'; -- Para OAuth como Google

    RAISE NOTICE '[TRIGGER handle_new_user_signup] Nuevo usuario ID: %, Email: %, Nombre completo de metadata: %', NEW.id, user_email, user_full_name;

    -- Insertar un nuevo perfil en user_profiles.
    -- ON CONFLICT (id) DO NOTHING es más seguro si el perfil pudiese ser creado por otro medio casi simultáneamente,
    -- o si el trigger se dispara múltiples veces por alguna razón (aunque no debería con AFTER INSERT).
    -- Si queremos actualizar si ya existe (por ejemplo, si el trigger falló y luego se reintenta), usamos DO UPDATE.
    INSERT INTO public.user_profiles (id, role_id, full_name, email, avatar_url, updated_at, created_at)
    VALUES (
        NEW.id,                         -- El ID del usuario de auth.users
        default_user_role_uuid,         -- El UUID del rol 'user'
        user_full_name,                 -- Puede ser NULL si no se proveyó en el signUp o OAuth
        user_email,                     -- Email del usuario
        user_avatar_url,                -- URL del avatar si está disponible (ej. Google)
        NOW(),                          -- Fecha de actualización
        NOW()                           -- Fecha de creación
    )
    ON CONFLICT (id) DO UPDATE SET
        -- Si el perfil ya existe, actualizamos ciertos campos si son diferentes
        -- y si el nuevo valor no es NULL.
        -- Importante: No sobrescribir role_id si ya tiene uno asignado por un admin, por ejemplo.
        -- Solo actualizar role_id si es NULL o si queremos forzar el rol de usuario por defecto.
        -- Para un trigger de signup, generalmente queremos asignar el rol por defecto.
        role_id = EXCLUDED.role_id, -- Siempre asignar el rol por defecto en el signup
        full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
        email = COALESCE(EXCLUDED.email, public.user_profiles.email),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.user_profiles.avatar_url),
        updated_at = NOW();

    RAISE NOTICE '[TRIGGER handle_new_user_signup] Perfil creado/actualizado para usuario ID: % con role_id %', NEW.id, default_user_role_uuid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear o reemplazar el trigger en auth.users
DROP TRIGGER IF EXISTS trigger_handle_new_user_signup ON auth.users;
CREATE TRIGGER trigger_handle_new_user_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

COMMENT ON FUNCTION public.handle_new_user_signup() IS
'Al registrar un nuevo usuario en auth.users, crea una entrada correspondiente en public.user_profiles con el rol "user" por defecto y copia metadatos relevantes.';
