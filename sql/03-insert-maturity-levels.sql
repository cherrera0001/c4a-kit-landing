-- Insertar niveles de madurez
INSERT INTO public.maturity_levels (name, description, level, color, created_at)
VALUES
    ('Inicial', 'Procesos ad hoc, no formalizados o documentados', 1, '#FF4D4F', NOW()),
    ('Básico', 'Procesos documentados pero no consistentemente aplicados', 2, '#FAAD14', NOW()),
    ('Definido', 'Procesos estandarizados y aplicados consistentemente', 3, '#1890FF', NOW()),
    ('Gestionado', 'Procesos medidos y controlados cuantitativamente', 4, '#52C41A', NOW()),
    ('Optimizado', 'Mejora continua de procesos basada en métricas', 5, '#722ED1', NOW());
