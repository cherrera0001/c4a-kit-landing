-- Insertar preguntas de nivel básico (nivel_max_preguntas = 1)
-- Estas preguntas estarán disponibles en todos los planes (Básico, Profesional, Enterprise)

-- Dominio: Gobierno de Ciberseguridad
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (1, '¿La organización tiene una política de seguridad de la información documentada?', 
     'Evalúa si existe una política formal que establezca los principios y directrices de seguridad', 
     'Una política de seguridad debe ser aprobada por la dirección, comunicada a todos los empleados y revisada periódicamente', 
     1, 1, true, NOW()),
    
    (1, '¿Existe un responsable designado para la seguridad de la información?', 
     'Evalúa si hay una persona o rol específico encargado de la seguridad', 
     'Este rol puede ser a tiempo completo o parcial, dependiendo del tamaño de la organización, pero debe tener responsabilidades claramente definidas', 
     1, 2, true, NOW());

-- Dominio: Gestión de Riesgos
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (2, '¿Se realiza algún tipo de evaluación de riesgos de seguridad?', 
     'Evalúa si la organización identifica y evalúa riesgos de seguridad', 
     'La evaluación de riesgos puede ser formal o informal, pero debe existir algún proceso para identificar amenazas y vulnerabilidades', 
     1, 3, true, NOW()),
    
    (2, '¿Se documentan los resultados de las evaluaciones de riesgos?', 
     'Evalúa si se mantiene un registro de los riesgos identificados', 
     'La documentación de riesgos ayuda a priorizar esfuerzos y recursos para su mitigación', 
     1, 4, true, NOW());

-- Dominio: Gestión de Activos
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (3, '¿Existe un inventario de activos de información?', 
     'Evalúa si la organización mantiene un registro de sus activos de información', 
     'El inventario debe incluir hardware, software, datos y servicios críticos', 
     1, 5, true, NOW()),
    
    (3, '¿Se clasifican los activos según su criticidad o sensibilidad?', 
     'Evalúa si existe un esquema de clasificación para los activos', 
     'La clasificación ayuda a determinar qué activos requieren mayor protección', 
     1, 6, true, NOW());

-- Dominio: Control de Acceso
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (4, '¿Existe un proceso para la creación y eliminación de cuentas de usuario?', 
     'Evalúa si hay procedimientos para gestionar el ciclo de vida de las cuentas', 
     'Debe haber un proceso para crear cuentas cuando un empleado se incorpora y eliminarlas cuando se va', 
     1, 7, true, NOW()),
    
    (4, '¿Se utilizan contraseñas fuertes para acceder a los sistemas?', 
     'Evalúa si existen requisitos de complejidad para las contraseñas', 
     'Las contraseñas deben tener una longitud mínima y combinar diferentes tipos de caracteres', 
     1, 8, true, NOW());

-- Dominio: Seguridad de Redes
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (5, '¿La red corporativa está protegida por un firewall?', 
     'Evalúa si existe una barrera de protección entre la red interna y externa', 
     'El firewall debe estar correctamente configurado para permitir solo el tráfico necesario', 
     1, 9, true, NOW()),
    
    (5, '¿Las redes inalámbricas están protegidas con cifrado?', 
     'Evalúa si las redes WiFi utilizan protocolos de seguridad', 
     'Se debe utilizar al menos WPA2 o WPA3 para proteger las redes inalámbricas', 
     1, 10, true, NOW());

-- Dominio: Seguridad de Endpoints
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (6, '¿Los dispositivos tienen software antivirus instalado y actualizado?', 
     'Evalúa si existe protección contra malware en los endpoints', 
     'El software antivirus debe actualizarse regularmente y realizar escaneos periódicos', 
     1, 11, true, NOW()),
    
    (6, '¿Se aplican actualizaciones de seguridad a los sistemas operativos?', 
     'Evalúa si se mantienen los sistemas actualizados con parches de seguridad', 
     'Las actualizaciones deben aplicarse de manera oportuna, especialmente para vulnerabilidades críticas', 
     1, 12, true, NOW());

-- Dominio: Seguridad de Aplicaciones
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (7, '¿Se realizan pruebas de seguridad en las aplicaciones antes de su despliegue?', 
     'Evalúa si se verifica la seguridad de las aplicaciones antes de ponerlas en producción', 
     'Las pruebas pueden incluir análisis de código, pruebas de penetración o revisiones de seguridad', 
     1, 13, true, NOW()),
    
    (7, '¿Las aplicaciones web implementan controles básicos de seguridad?', 
     'Evalúa si se aplican medidas para proteger las aplicaciones web', 
     'Los controles básicos incluyen validación de entradas, gestión de sesiones y protección contra inyecciones', 
     1, 14, true, NOW());

-- Dominio: Gestión de Vulnerabilidades
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (8, '¿Se realizan escaneos de vulnerabilidades en los sistemas?', 
     'Evalúa si se buscan activamente vulnerabilidades en la infraestructura', 
     'Los escaneos deben realizarse periódicamente para identificar debilidades que podrían ser explotadas', 
     1, 15, true, NOW()),
    
    (8, '¿Existe un proceso para priorizar y remediar vulnerabilidades?', 
     'Evalúa si hay un método para abordar las vulnerabilidades identificadas', 
     'Las vulnerabilidades deben priorizarse según su criticidad y riesgo para la organización', 
     1, 16, true, NOW());

-- Dominio: Gestión de Incidentes
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (9, '¿Existe un procedimiento documentado para responder a incidentes de seguridad?', 
     'Evalúa si hay un plan para manejar brechas o ataques de seguridad', 
     'El procedimiento debe definir roles, responsabilidades y pasos a seguir durante un incidente', 
     1, 17, true, NOW()),
    
    (9, '¿Se registran y analizan los incidentes de seguridad?', 
     'Evalúa si se mantiene un registro de incidentes para su análisis', 
     'El análisis de incidentes ayuda a prevenir futuros problemas y mejorar la respuesta', 
     1, 18, true, NOW());

-- Dominio: Continuidad de Negocio
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (10, '¿Existen copias de seguridad de los datos críticos?', 
     'Evalúa si se realizan backups de la información importante', 
     'Las copias de seguridad deben realizarse regularmente y almacenarse en ubicaciones seguras', 
     1, 19, true, NOW()),
    
    (10, '¿Se han probado los procedimientos de recuperación de datos?', 
     'Evalúa si se verifica que las copias de seguridad funcionan correctamente', 
     'Es importante probar periódicamente que los datos pueden restaurarse en caso de necesidad', 
     1, 20, true, NOW());

-- Dominio: Cumplimiento Normativo
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (11, '¿Se han identificado las regulaciones de seguridad aplicables a la organización?', 
     'Evalúa si se conocen los requisitos legales y normativos', 
     'Dependiendo del sector y ubicación, pueden aplicar diferentes regulaciones como GDPR, LOPD, etc.', 
     1, 21, true, NOW()),
    
    (11, '¿Se realizan revisiones para verificar el cumplimiento de las políticas internas?', 
     'Evalúa si se comprueba que se siguen las políticas establecidas', 
     'Las revisiones pueden ser auditorías internas o evaluaciones periódicas', 
     1, 22, true, NOW());

-- Dominio: Concienciación y Formación
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (12, '¿Los empleados reciben algún tipo de formación en seguridad?', 
     'Evalúa si existe educación sobre ciberseguridad para el personal', 
     'La formación puede incluir reconocimiento de phishing, gestión de contraseñas, etc.', 
     1, 23, true, NOW()),
    
    (12, '¿Se comunican regularmente consejos o alertas de seguridad a los empleados?', 
     'Evalúa si hay comunicación continua sobre temas de seguridad', 
     'Las comunicaciones regulares mantienen la seguridad presente en la mente de los empleados', 
     1, 24, true, NOW());
