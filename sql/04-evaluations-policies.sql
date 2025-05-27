-- Políticas para evaluations

-- Los usuarios pueden ver sus propias evaluaciones
CREATE POLICY "Users can view own evaluations" 
ON evaluations 
FOR SELECT 
USING (created_by = current_user_id());

-- Los usuarios pueden actualizar sus propias evaluaciones
CREATE POLICY "Users can update own evaluations" 
ON evaluations 
FOR UPDATE 
USING (created_by = current_user_id());

-- Los usuarios pueden insertar evaluaciones asignándose como creador
CREATE POLICY "Users can insert evaluations" 
ON evaluations 
FOR INSERT 
WITH CHECK (created_by = current_user_id());

-- Los usuarios pueden eliminar sus propias evaluaciones
CREATE POLICY "Users can delete own evaluations" 
ON evaluations 
FOR DELETE 
USING (created_by = current_user_id());

-- Los administradores pueden ver todas las evaluaciones
CREATE POLICY "Admins can view all evaluations" 
ON evaluations 
FOR SELECT 
USING (is_admin());

-- Los administradores pueden actualizar todas las evaluaciones
CREATE POLICY "Admins can update all evaluations" 
ON evaluations 
FOR UPDATE 
USING (is_admin());

-- Los administradores pueden insertar evaluaciones para cualquier usuario
CREATE POLICY "Admins can insert evaluations" 
ON evaluations 
FOR INSERT 
WITH CHECK (is_admin());

-- Los administradores pueden eliminar cualquier evaluación
CREATE POLICY "Admins can delete evaluations" 
ON evaluations 
FOR DELETE 
USING (is_admin());
