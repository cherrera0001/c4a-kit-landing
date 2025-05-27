-- Crear tabla para opciones de respuesta
CREATE TABLE IF NOT EXISTS public.response_options (
    id SERIAL PRIMARY KEY,
    value INTEGER NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar opciones de respuesta estándar
INSERT INTO public.response_options (value, label, description)
VALUES
    (0, 'No implementado', 'No existe ninguna medida implementada en este ámbito'),
    (1, 'Inicial', 'Existen algunas medidas básicas pero no están formalizadas'),
    (2, 'Básico', 'Existen medidas formalizadas pero no se aplican consistentemente'),
    (3, 'Definido', 'Existen medidas formalizadas que se aplican de manera consistente'),
    (4, 'Gestionado', 'Las medidas se monitorizan y se miden para verificar su efectividad'),
    (5, 'Optimizado', 'Las medidas se revisan y mejoran continuamente');
