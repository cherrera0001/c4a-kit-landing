-- Políticas para reports

-- Los usuarios pueden ver sus propios informes
CREATE POLICY "Users can view own reports" 
ON reports 
FOR SELECT 
USING (created_by = current_user_id());

-- Los usuarios pueden actualizar sus propios informes
CREATE POLICY "Users can update own reports" 
ON reports 
FOR UPDATE 
USING (created_by = current_user_id());

-- Los usuarios pueden insertar informes asignándose como creador
CREATE POLICY "Users can insert reports" 
ON reports 
FOR INSERT 
WITH CHECK (created_by = current_user_id());

-- Los usuarios pueden eliminar sus propios informes
CREATE POLICY "Users can delete own reports" 
ON reports 
FOR DELETE 
USING (created_by = current_user_id());

-- Los administradores pueden ver todos los informes
CREATE POLICY "Admins can view all reports" 
ON reports 
FOR SELECT 
USING (is_admin());

-- Los administradores pueden actualizar todos los informes
CREATE POLICY "Admins can update all reports" 
ON reports 
FOR UPDATE 
USING (is_admin());

-- Los administradores pueden insertar informes para cualquier usuario
CREATE POLICY "Admins can insert reports" 
ON reports 
FOR INSERT 
WITH CHECK (is_admin());

-- Los administradores pueden eliminar cualquier informe
CREATE POLICY "Admins can delete reports" 
ON reports 
FOR DELETE 
USING (is_admin());
