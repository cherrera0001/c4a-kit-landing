-- Políticas para evaluation_responses

-- Los usuarios pueden ver respuestas de sus propias evaluaciones
CREATE POLICY "Users can view own evaluation responses" 
ON evaluation_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM evaluations
    WHERE evaluations.id = evaluation_responses.evaluation_id
    AND evaluations.created_by = current_user_id()
  )
);

-- Los usuarios pueden actualizar respuestas de sus propias evaluaciones
CREATE POLICY "Users can update own evaluation responses" 
ON evaluation_responses 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM evaluations
    WHERE evaluations.id = evaluation_responses.evaluation_id
    AND evaluations.created_by = current_user_id()
  )
);

-- Los usuarios pueden insertar respuestas para sus propias evaluaciones
CREATE POLICY "Users can insert evaluation responses" 
ON evaluation_responses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM evaluations
    WHERE evaluations.id = evaluation_responses.evaluation_id
    AND evaluations.created_by = current_user_id()
  )
);

-- Los usuarios pueden eliminar respuestas de sus propias evaluaciones
CREATE POLICY "Users can delete own evaluation responses" 
ON evaluation_responses 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM evaluations
    WHERE evaluations.id = evaluation_responses.evaluation_id
    AND evaluations.created_by = current_user_id()
  )
);

-- Los administradores pueden ver todas las respuestas
CREATE POLICY "Admins can view all evaluation responses" 
ON evaluation_responses 
FOR SELECT 
USING (is_admin());

-- Los administradores pueden actualizar todas las respuestas
CREATE POLICY "Admins can update all evaluation responses" 
ON evaluation_responses 
FOR UPDATE 
USING (is_admin());

-- Los administradores pueden insertar respuestas para cualquier evaluación
CREATE POLICY "Admins can insert evaluation responses" 
ON evaluation_responses 
FOR INSERT 
WITH CHECK (is_admin());

-- Los administradores pueden eliminar cualquier respuesta
CREATE POLICY "Admins can delete evaluation responses" 
ON evaluation_responses 
FOR DELETE 
USING (is_admin());
