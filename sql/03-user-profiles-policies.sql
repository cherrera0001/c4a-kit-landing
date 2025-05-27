-- Políticas para user_profiles

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" 
ON user_profiles 
FOR SELECT 
USING (id = current_user_id());

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" 
ON user_profiles 
FOR UPDATE 
USING (id = current_user_id());

-- Los administradores pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" 
ON user_profiles 
FOR SELECT 
USING (is_admin());

-- Los administradores pueden actualizar todos los perfiles
CREATE POLICY "Admins can update all profiles" 
ON user_profiles 
FOR UPDATE 
USING (is_admin());

-- Permitir inserción para el servicio de autenticación
CREATE POLICY "Auth service can insert profiles" 
ON user_profiles 
FOR INSERT 
WITH CHECK (true);
