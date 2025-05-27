-- Políticas para companies

-- Los usuarios pueden ver empresas asignadas a ellos
CREATE POLICY "Users can view assigned companies" 
ON companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM advisor_company_assignments
    WHERE advisor_company_assignments.company_id = companies.id
    AND advisor_company_assignments.advisor_id = current_user_id()
  )
);

-- Los administradores pueden ver todas las empresas
CREATE POLICY "Admins can view all companies" 
ON companies 
FOR SELECT 
USING (is_admin());

-- Los administradores pueden actualizar todas las empresas
CREATE POLICY "Admins can update all companies" 
ON companies 
FOR UPDATE 
USING (is_admin());

-- Los administradores pueden insertar empresas
CREATE POLICY "Admins can insert companies" 
ON companies 
FOR INSERT 
WITH CHECK (is_admin());

-- Los administradores pueden eliminar empresas
CREATE POLICY "Admins can delete companies" 
ON companies 
FOR DELETE 
USING (is_admin());
