-- Crear una función RPC para crear perfiles de usuario
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID, role_id INTEGER DEFAULT 2)
RETURNS VOID AS $$
BEGIN
  -- Verificar si el perfil ya existe
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = user_id) THEN
    RETURN;
  END IF;
  
  -- Intentar insertar el perfil
  BEGIN
    INSERT INTO user_profiles (id, role_id, created_at, updated_at)
    VALUES (user_id, role_id, NOW(), NOW());
  EXCEPTION WHEN OTHERS THEN
    -- Si falla, intentar con menos campos
    BEGIN
      INSERT INTO user_profiles (id, role_id)
      VALUES (user_id, role_id);
    EXCEPTION WHEN OTHERS THEN
      -- Manejar el error final si es necesario
      RAISE NOTICE 'No se pudo crear el perfil para el usuario: %', user_id;
    END;
  END;
END;
$$ LANGUAGE plpgsql;
