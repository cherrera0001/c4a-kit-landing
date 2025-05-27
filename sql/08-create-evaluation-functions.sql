-- Función para calcular la puntuación de una evaluación
CREATE OR REPLACE FUNCTION calculate_evaluation_score(evaluation_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_score NUMERIC := 0;
    total_questions INTEGER := 0;
    max_score INTEGER := 5; -- Valor máximo de respuesta
BEGIN
    -- Obtener la suma de valores de respuesta y el conteo de preguntas respondidas
    SELECT 
        COALESCE(SUM(er.response_value), 0),
        COUNT(er.id)
    INTO 
        total_score,
        total_questions
    FROM 
        public.evaluation_responses er
    WHERE 
        er.evaluation_id = calculate_evaluation_score.evaluation_id;
    
    -- Calcular y devolver la puntuación como porcentaje
    IF total_questions > 0 THEN
        RETURN (total_score / (total_questions * max_score)) * 100;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar automáticamente la puntuación de una evaluación
CREATE OR REPLACE FUNCTION update_evaluation_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar la puntuación de la evaluación
    UPDATE public.evaluations
    SET 
        score = calculate_evaluation_score(NEW.evaluation_id),
        updated_at = NOW()
    WHERE 
        id = NEW.evaluation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar la puntuación cuando se inserta o actualiza una respuesta
CREATE TRIGGER trigger_update_evaluation_score
AFTER INSERT OR UPDATE ON public.evaluation_responses
FOR EACH ROW
EXECUTE FUNCTION update_evaluation_score();

-- Trigger para actualizar la puntuación cuando se elimina una respuesta
CREATE TRIGGER trigger_update_evaluation_score_on_delete
AFTER DELETE ON public.evaluation_responses
FOR EACH ROW
EXECUTE FUNCTION update_evaluation_score();
