-- Habilitar RLS en las tablas principales
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_options ENABLE ROW LEVEL SECURITY;

-- Políticas para dominios
CREATE POLICY "Todos pueden ver dominios activos" 
ON public.domains FOR SELECT 
USING (active = true);

CREATE POLICY "Solo administradores pueden modificar dominios" 
ON public.domains FOR ALL 
USING (is_admin());

-- Políticas para preguntas
CREATE POLICY "Todos pueden ver preguntas activas" 
ON public.questions FOR SELECT 
USING (active = true);

CREATE POLICY "Solo administradores pueden modificar preguntas" 
ON public.questions FOR ALL 
USING (is_admin());

-- Políticas para niveles de madurez
CREATE POLICY "Todos pueden ver niveles de madurez" 
ON public.maturity_levels FOR SELECT 
USING (true);

CREATE POLICY "Solo administradores pueden modificar niveles de madurez" 
ON public.maturity_levels FOR ALL 
USING (is_admin());

-- Políticas para empresas
CREATE POLICY "Usuarios pueden ver sus empresas asignadas" 
ON public.companies FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.advisor_company_assignments aca
        WHERE aca.company_id = companies.id
        AND aca.advisor_id = current_user_id()
    )
    OR is_admin()
);

CREATE POLICY "Solo administradores pueden modificar empresas" 
ON public.companies FOR ALL 
USING (is_admin());

-- Políticas para evaluaciones
CREATE POLICY "Usuarios pueden ver evaluaciones de sus empresas" 
ON public.evaluations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.advisor_company_assignments aca
        WHERE aca.company_id = evaluations.company_id
        AND aca.advisor_id = current_user_id()
    )
    OR created_by = current_user_id()
    OR is_admin()
);

CREATE POLICY "Usuarios pueden crear evaluaciones para sus empresas" 
ON public.evaluations FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.advisor_company_assignments aca
        WHERE aca.company_id = evaluations.company_id
        AND aca.advisor_id = current_user_id()
    )
    OR is_admin()
);

CREATE POLICY "Usuarios pueden modificar sus evaluaciones" 
ON public.evaluations FOR UPDATE 
USING (
    created_by = current_user_id()
    OR is_admin()
);

-- Políticas para respuestas de evaluación
CREATE POLICY "Usuarios pueden ver respuestas de sus evaluaciones" 
ON public.evaluation_responses FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.evaluations e
        WHERE e.id = evaluation_responses.evaluation_id
        AND (
            e.created_by = current_user_id()
            OR EXISTS (
                SELECT 1 FROM public.advisor_company_assignments aca
                WHERE aca.company_id = e.company_id
                AND aca.advisor_id = current_user_id()
            )
            OR is_admin()
        )
    )
);

CREATE POLICY "Usuarios pueden crear respuestas para sus evaluaciones" 
ON public.evaluation_responses FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.evaluations e
        WHERE e.id = evaluation_responses.evaluation_id
        AND (
            e.created_by = current_user_id()
            OR is_admin()
        )
    )
);

CREATE POLICY "Usuarios pueden modificar respuestas de sus evaluaciones" 
ON public.evaluation_responses FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.evaluations e
        WHERE e.id = evaluation_responses.evaluation_id
        AND (
            e.created_by = current_user_id()
            OR is_admin()
        )
    )
);

-- Políticas para opciones de respuesta
CREATE POLICY "Todos pueden ver opciones de respuesta" 
ON public.response_options FOR SELECT 
USING (true);

CREATE POLICY "Solo administradores pueden modificar opciones de respuesta" 
ON public.response_options FOR ALL 
USING (is_admin());
