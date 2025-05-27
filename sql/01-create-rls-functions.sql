-- Crear una función para establecer el ID del usuario actual
CREATE OR REPLACE FUNCTION set_current_user_id(user_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear una función para obtener el ID del usuario actual
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_user_id', TRUE);
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear una función para verificar si el usuario actual es administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Obtener el rol del usuario actual
    SELECT r.name INTO user_role
    FROM roles r
    JOIN user_profiles up ON r.id = up.role_id
    WHERE up.id = current_user_id();
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
