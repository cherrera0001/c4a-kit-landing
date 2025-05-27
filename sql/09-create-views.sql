-- Vista para obtener resultados de evaluación por dominio
CREATE OR REPLACE VIEW public.evaluation_domain_results AS
SELECT
    er.evaluation_id,
    q.domain_id,
    d.name AS domain_name,
    COUNT(er.id) AS answered_questions,
    COALESCE(AVG(er.response_value), 0) AS avg_score,
    (COALESCE(SUM(er.response_value), 0) / (COUNT(er.id) * 5)) * 100 AS score_percentage,
    CASE
        WHEN COALESCE(AVG(er.response_value), 0) < 1 THEN 'Inicial'
        WHEN COALESCE(AVG(er.response_value), 0) < 2 THEN 'Básico'
        WHEN COALESCE(AVG(er.response_value), 0) < 3 THEN 'Definido'
        WHEN COALESCE(AVG(er.response_value), 0) < 4 THEN 'Gestionado'
        ELSE 'Optimizado'
    END AS maturity_level
FROM
    public.evaluation_responses er
JOIN
    public.questions q ON er.question_id = q.id
JOIN
    public.domains d ON q.domain_id = d.id
GROUP BY
    er.evaluation_id, q.domain_id, d.name;

-- Vista para obtener resultados completos de evaluación
CREATE OR REPLACE VIEW public.evaluation_results AS
SELECT
    e.id AS evaluation_id,
    e.name AS evaluation_name,
    c.name AS company_name,
    e.score AS overall_score,
    e.progress,
    e.created_at,
    e.completed_at,
    json_agg(
        json_build_object(
            'domain_id', dr.domain_id,
            'domain_name', dr.domain_name,
            'score', dr.score_percentage,
            'maturity_level', dr.maturity_level,
            'answered_questions', dr.answered_questions
        )
    ) AS domain_results
FROM
    public.evaluations e
JOIN
    public.companies c ON e.company_id = c.id
LEFT JOIN
    public.evaluation_domain_results dr ON e.id = dr.evaluation_id
GROUP BY
    e.id, c.name;
