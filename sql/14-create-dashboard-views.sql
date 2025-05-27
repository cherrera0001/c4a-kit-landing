-- Vista para estadísticas generales del dashboard
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
    COUNT(DISTINCT e.id) AS total_evaluations,
    COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) AS completed_evaluations,
    COUNT(DISTINCT CASE WHEN e.status = 'in_progress' THEN e.id END) AS in_progress_evaluations,
    COUNT(DISTINCT c.id) AS total_companies,
    COALESCE(AVG(e.score) FILTER (WHERE e.status = 'completed'), 0) AS avg_score
FROM
    public.evaluations e
JOIN
    public.companies c ON e.company_id = c.id;

-- Vista para estadísticas por sector
CREATE OR REPLACE VIEW public.sector_stats AS
SELECT
    s.id AS sector_id,
    s.name AS sector_name,
    COUNT(DISTINCT c.id) AS company_count,
    COUNT(DISTINCT e.id) AS evaluation_count,
    COALESCE(AVG(e.score) FILTER (WHERE e.status = 'completed'), 0) AS avg_score
FROM
    public.sectors s
LEFT JOIN
    public.companies c ON s.id = c.sector_id
LEFT JOIN
    public.evaluations e ON c.id = e.company_id
GROUP BY
    s.id, s.name;

-- Vista para estadísticas por dominio
CREATE OR REPLACE VIEW public.domain_stats AS
SELECT
    d.id AS domain_id,
    d.name AS domain_name,
    COUNT(DISTINCT er.evaluation_id) AS evaluation_count,
    COALESCE(AVG(er.response_value), 0) AS avg_score,
    CASE
        WHEN COALESCE(AVG(er.response_value), 0) < 1 THEN 'Inicial'
        WHEN COALESCE(AVG(er.response_value), 0) < 2 THEN 'Básico'
        WHEN COALESCE(AVG(er.response_value), 0) < 3 THEN 'Definido'
        WHEN COALESCE(AVG(er.response_value), 0) < 4 THEN 'Gestionado'
        ELSE 'Optimizado'
    END AS avg_maturity_level
FROM
    public.domains d
LEFT JOIN
    public.questions q ON d.id = q.domain_id
LEFT JOIN
    public.evaluation_responses er ON q.id = er.question_id
WHERE
    d.active = true
GROUP BY
    d.id, d.name;

-- Vista para tendencias de evaluación por mes
CREATE OR REPLACE VIEW public.evaluation_trends AS
SELECT
    DATE_TRUNC('month', e.created_at) AS month,
    COUNT(DISTINCT e.id) AS new_evaluations,
    COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) AS completed_evaluations,
    COALESCE(AVG(e.score) FILTER (WHERE e.status = 'completed'), 0) AS avg_score
FROM
    public.evaluations e
GROUP BY
    DATE_TRUNC('month', e.created_at)
ORDER BY
    month;
