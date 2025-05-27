-- Función para obtener estadísticas generales del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_evaluations INTEGER,
  completed_evaluations INTEGER,
  total_companies INTEGER,
  total_sectors INTEGER,
  avg_score NUMERIC,
  avg_progress NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM evaluations) AS total_evaluations,
    (SELECT COUNT(*) FROM evaluations WHERE status = 'completed') AS completed_evaluations,
    (SELECT COUNT(*) FROM companies) AS total_companies,
    (SELECT COUNT(*) FROM sectors) AS total_sectors,
    (SELECT COALESCE(AVG(score), 0) FROM evaluations WHERE score IS NOT NULL) AS avg_score,
    (SELECT COALESCE(AVG(progress), 0) FROM evaluations) AS avg_progress;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener la distribución de niveles de madurez
CREATE OR REPLACE FUNCTION get_maturity_distribution()
RETURNS TABLE (
  level INTEGER,
  name TEXT,
  count INTEGER,
  percentage NUMERIC
) AS $$
DECLARE
  total INTEGER;
BEGIN
  -- Obtener el total de evaluaciones con puntuación
  SELECT COUNT(*) INTO total FROM evaluations WHERE score IS NOT NULL;
  
  -- Si no hay evaluaciones, devolver cero para todos los niveles
  IF total = 0 THEN
    RETURN QUERY
    SELECT 
      ml.level,
      ml.name,
      0::INTEGER AS count,
      0::NUMERIC AS percentage
    FROM maturity_levels ml
    ORDER BY ml.level;
    RETURN;
  END IF;
  
  -- Calcular la distribución
  RETURN QUERY
  WITH eval_levels AS (
    SELECT
      CASE
        WHEN score < 1.5 THEN 1
        WHEN score < 2.5 THEN 2
        WHEN score < 3.5 THEN 3
        WHEN score < 4.5 THEN 4
        ELSE 5
      END AS level
    FROM evaluations
    WHERE score IS NOT NULL
  )
  SELECT
    ml.level,
    ml.name,
    COUNT(el.level)::INTEGER AS count,
    (COUNT(el.level) * 100.0 / total)::NUMERIC AS percentage
  FROM maturity_levels ml
  LEFT JOIN eval_levels el ON ml.level = el.level
  GROUP BY ml.level, ml.name
  ORDER BY ml.level;
END;
$$ LANGUAGE plpgsql;
