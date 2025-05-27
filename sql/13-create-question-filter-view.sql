-- Vista para filtrar preguntas según el nivel de suscripción
CREATE OR REPLACE VIEW public.filtered_questions AS
SELECT 
    q.*,
    ml.level AS maturity_level_number,
    d.name AS domain_name
FROM 
    public.questions q
JOIN 
    public.maturity_levels ml ON q.maturity_level_id = ml.id
JOIN 
    public.domains d ON q.domain_id = d.id
WHERE 
    q.active = true;

-- Función para obtener preguntas filtradas por tipo de diagnóstico
CREATE OR REPLACE FUNCTION get_questions_by_subscription(tipo_diagnostico_id UUID)
RETURNS TABLE (
    id INTEGER,
    domain_id INTEGER,
    text TEXT,
    description TEXT,
    help_text TEXT,
    maturity_level_id INTEGER,
    order_index INTEGER,
    active BOOLEAN,
    created_at TIMESTAMPTZ,
    maturity_level_number INTEGER,
    domain_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fq.*
    FROM 
        public.filtered_questions fq
    WHERE 
        fq.maturity_level_number <= (
            SELECT nivel_max_preguntas 
            FROM public.tipos_diagnostico_config 
            WHERE id = tipo_diagnostico_id
        )
    ORDER BY 
        fq.domain_id, fq.order_index;
END;
$$ LANGUAGE plpgsql;
