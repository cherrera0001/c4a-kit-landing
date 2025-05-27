-- Insertar dominios de ciberseguridad
INSERT INTO public.domains (name, description, order_index, active, created_at)
VALUES
    ('Gobierno de Ciberseguridad', 'Políticas, procedimientos y estructura organizativa para gestionar la ciberseguridad', 1, true, NOW()),
    ('Gestión de Riesgos', 'Identificación, evaluación y mitigación de riesgos de ciberseguridad', 2, true, NOW()),
    ('Gestión de Activos', 'Inventario y clasificación de activos de información', 3, true, NOW()),
    ('Control de Acceso', 'Gestión de identidades y control de acceso a sistemas y datos', 4, true, NOW()),
    ('Seguridad de Redes', 'Protección de la infraestructura de red y comunicaciones', 5, true, NOW()),
    ('Seguridad de Endpoints', 'Protección de dispositivos finales como ordenadores y móviles', 6, true, NOW()),
    ('Seguridad de Aplicaciones', 'Desarrollo seguro y protección de aplicaciones', 7, true, NOW()),
    ('Gestión de Vulnerabilidades', 'Identificación y remediación de vulnerabilidades', 8, true, NOW()),
    ('Gestión de Incidentes', 'Detección, respuesta y recuperación ante incidentes', 9, true, NOW()),
    ('Continuidad de Negocio', 'Planes para mantener operaciones críticas durante incidentes', 10, true, NOW()),
    ('Cumplimiento Normativo', 'Adherencia a regulaciones y estándares de seguridad', 11, true, NOW()),
    ('Concienciación y Formación', 'Educación de empleados sobre ciberseguridad', 12, true, NOW());
