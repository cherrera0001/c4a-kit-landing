-- Función para verificar si una característica está disponible para un tipo de diagnóstico
CREATE OR REPLACE FUNCTION is_feature_available(tipo_diagnostico_id UUID, feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_available BOOLEAN;
BEGIN
    -- Verificar si la característica está disponible para el tipo de diagnóstico
    EXECUTE format('
        SELECT %I FROM public.tipos_diagnostico_config
        WHERE id = $1
    ', feature_name)
    INTO is_available
    USING tipo_diagnostico_id;
    
    RETURN COALESCE(is_available, false);
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el nivel máximo de preguntas disponible para un tipo de diagnóstico
CREATE OR REPLACE FUNCTION get_max_question_level(tipo_diagnostico_id UUID)
RETURNS INTEGER AS $$
DECLARE
    max_level INTEGER;
BEGIN
    -- Obtener el nivel máximo de preguntas
    SELECT nivel_max_preguntas INTO max_level
    FROM public.tipos_diagnostico_config
    WHERE id = tipo_diagnostico_id;
    
    RETURN COALESCE(max_level, 1);
END;
$$ LANGUAGE plpgsql;

-- Función para filtrar preguntas según el nivel de diagnóstico
CREATE OR REPLACE FUNCTION filter_questions_by_subscription(tipo_diagnostico_id UUID)
RETURNS SETOF public.questions AS $$
DECLARE
    max_level INTEGER;
BEGIN
    -- Obtener el nivel máximo de preguntas
    SELECT get_max_question_level(tipo_diagnostico_id) INTO max_level;
    
    -- Devolver preguntas hasta el nivel máximo
    RETURN QUERY
    SELECT q.*
    FROM public.questions q
    JOIN public.maturity_levels ml ON q.maturity_level_id = ml.id
    WHERE q.active = true
    AND ml.level <= max_level
    ORDER BY q.order_index;
END;
$$ LANGUAGE plpgsql;
