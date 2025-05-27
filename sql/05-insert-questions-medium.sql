-- Insertar preguntas de nivel medio (nivel_max_preguntas = 2)
-- Estas preguntas estarán disponibles en los planes Profesional y Enterprise

-- Dominio: Gobierno de Ciberseguridad
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (1, '¿Existe un comité de seguridad que se reúne regularmente?', 
     'Evalúa si hay un grupo formal que supervisa la seguridad de la información', 
     'El comité debe incluir representantes de diferentes áreas y reunirse periódicamente para revisar temas de seguridad', 
     2, 25, true, NOW()),
    
    (1, '¿Se revisan y actualizan las políticas de seguridad al menos anualmente?', 
     'Evalúa si las políticas se mantienen actualizadas', 
     'Las políticas deben revisarse para reflejar cambios en la organización, tecnología o amenazas', 
     2, 26, true, NOW()),
    
    (1, '¿Se realizan auditorías internas de seguridad?', 
     'Evalúa si se verifican internamente los controles de seguridad', 
     'Las auditorías internas ayudan a identificar deficiencias antes de que sean explotadas', 
     2, 27, true, NOW());

-- Dominio: Gestión de Riesgos
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (2, '¿Existe una metodología formal para la evaluación de riesgos?', 
     'Evalúa si hay un enfoque estructurado para identificar y evaluar riesgos', 
     'La metodología debe definir criterios para la identificación, análisis y evaluación de riesgos', 
     2, 28, true, NOW()),
    
    (2, '¿Se mantiene un registro de riesgos con planes de tratamiento?', 
     'Evalúa si se documentan los riesgos y las acciones para mitigarlos', 
     'El registro debe incluir la descripción del riesgo, su impacto, probabilidad y medidas de mitigación', 
     2, 29, true, NOW()),
    
    (2, '¿Se revisan periódicamente los riesgos identificados?', 
     'Evalúa si hay un proceso de revisión continua de riesgos', 
     'Los riesgos deben reevaluarse regularmente para verificar si han cambiado o si las medidas de mitigación son efectivas', 
     2, 30, true, NOW());

-- Dominio: Gestión de Activos
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (3, '¿El inventario de activos se actualiza regularmente?', 
     'Evalúa si se mantiene actualizado el registro de activos', 
     'El inventario debe actualizarse cuando se adquieren nuevos activos o se retiran los antiguos', 
     2, 31, true, NOW()),
    
    (3, '¿Existe un proceso formal para la gestión del ciclo de vida de los activos?', 
     'Evalúa si hay procedimientos para adquirir, usar y desechar activos', 
     'El proceso debe incluir la adquisición, mantenimiento, y eliminación segura de activos', 
     2, 32, true, NOW()),
    
    (3, '¿Se aplican controles específicos según la clasificación de los activos?', 
     'Evalúa si los controles de seguridad se ajustan a la importancia del activo', 
     'Los activos más críticos o sensibles deben tener medidas de protección más estrictas', 
     2, 33, true, NOW());

-- Dominio: Control de Acceso
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (4, '¿Se implementa el principio de mínimo privilegio para los accesos?', 
     'Evalúa si los usuarios solo tienen los permisos necesarios para su trabajo', 
     'Los usuarios deben tener acceso únicamente a los recursos que necesitan para sus funciones', 
     2, 34, true, NOW()),
    
    (4, '¿Se utiliza autenticación multifactor para accesos críticos?', 
     'Evalúa si se requiere más de un factor para verificar la identidad', 
     'La autenticación multifactor combina algo que el usuario sabe, tiene o es', 
     2, 35, true, NOW()),
    
    (4, '¿Se revisan periódicamente los privilegios de acceso?', 
     'Evalúa si se verifican regularmente los permisos asignados', 
     'Las revisiones ayudan a identificar y corregir privilegios excesivos o innecesarios', 
     2, 36, true, NOW());

-- Dominio: Seguridad de Redes
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (5, '¿La red está segmentada para separar sistemas críticos?', 
     'Evalúa si hay separación lógica entre diferentes partes de la red', 
     'La segmentación limita el movimiento lateral en caso de compromiso', 
     2, 37, true, NOW()),
    
    (5, '¿Se monitorizan los logs de los dispositivos de red?', 
     'Evalúa si se revisan los registros de actividad de la red', 
     'El monitoreo ayuda a detectar actividades sospechosas o intentos de intrusión', 
     2, 38, true, NOW()),
    
    (5, '¿Se utilizan VPNs para conexiones remotas a la red corporativa?', 
     'Evalúa si las conexiones externas se protegen con túneles cifrados', 
     'Las VPNs proporcionan un canal seguro para acceder a recursos internos desde fuera', 
     2, 39, true, NOW());

-- Continuar con los demás dominios siguiendo el mismo patrón...
-- Dominio: Seguridad de Endpoints
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (6, '¿Se utiliza una solución de gestión centralizada de endpoints?', 
     'Evalúa si existe una plataforma para administrar dispositivos de forma centralizada', 
     'La gestión centralizada facilita la aplicación de políticas y la respuesta a incidentes', 
     2, 40, true, NOW()),
    
    (6, '¿Existe un proceso formal para la aplicación de parches?', 
     'Evalúa si hay un procedimiento estructurado para actualizar sistemas', 
     'El proceso debe incluir pruebas, aprobación y despliegue controlado de parches', 
     2, 41, true, NOW()),
    
    (6, '¿Se implementan controles para prevenir la fuga de datos?', 
     'Evalúa si existen medidas para evitar la extracción no autorizada de información', 
     'Los controles pueden incluir restricciones de USB, cifrado y monitoreo de transferencias', 
     2, 42, true, NOW());

-- Dominio: Seguridad de Aplicaciones
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (7, '¿Se integra la seguridad en el ciclo de desarrollo de software?', 
     'Evalúa si la seguridad forma parte del proceso de desarrollo', 
     'La seguridad debe considerarse desde el diseño hasta la implementación y mantenimiento', 
     2, 43, true, NOW()),
    
    (7, '¿Se realizan pruebas de penetración en aplicaciones críticas?', 
     'Evalúa si se buscan activamente vulnerabilidades en las aplicaciones', 
     'Las pruebas de penetración simulan ataques reales para identificar debilidades', 
     2, 44, true, NOW()),
    
    (7, '¿Existe un proceso para gestionar vulnerabilidades en aplicaciones?', 
     'Evalúa si hay un método para abordar las debilidades encontradas', 
     'El proceso debe incluir la priorización, remediación y verificación de vulnerabilidades', 
     2, 45, true, NOW());

-- Dominio: Gestión de Vulnerabilidades
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (8, '¿Se realizan escaneos de vulnerabilidades con una frecuencia definida?', 
     'Evalúa si hay un calendario establecido para los escaneos', 
     'Los escaneos deben realizarse regularmente, no solo de forma reactiva', 
     2, 46, true, NOW()),
    
    (8, '¿Se utilizan múltiples fuentes para identificar vulnerabilidades?', 
     'Evalúa si se consideran diferentes orígenes de información sobre vulnerabilidades', 
     'Las fuentes pueden incluir boletines de seguridad, alertas de proveedores y feeds de inteligencia', 
     2, 47, true, NOW()),
    
    (8, '¿Existe un proceso para verificar la efectividad de las remediaciones?', 
     'Evalúa si se comprueba que las vulnerabilidades han sido correctamente mitigadas', 
     'Después de aplicar correcciones, debe verificarse que la vulnerabilidad ya no existe', 
     2, 48, true, NOW());

-- Dominio: Gestión de Incidentes
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (9, '¿Existe un equipo designado para la respuesta a incidentes?', 
     'Evalúa si hay personal asignado específicamente para manejar incidentes', 
     'El equipo debe tener roles y responsabilidades claramente definidos', 
     2, 49, true, NOW()),
    
    (9, '¿Se realizan simulacros de respuesta a incidentes?', 
     'Evalúa si se practican los procedimientos de respuesta', 
     'Los simulacros ayudan a preparar al personal y identificar mejoras en los procesos', 
     2, 50, true, NOW()),
    
    (9, '¿Se documentan las lecciones aprendidas después de los incidentes?', 
     'Evalúa si se analizan los incidentes para mejorar', 
     'El análisis post-incidente ayuda a prevenir problemas similares en el futuro', 
     2, 51, true, NOW());

-- Dominio: Continuidad de Negocio
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (10, '¿Existe un plan de continuidad de negocio documentado?', 
     'Evalúa si hay un plan formal para mantener operaciones críticas', 
     'El plan debe identificar procesos críticos y estrategias para mantenerlos funcionando', 
     2, 52, true, NOW()),
    
    (10, '¿Se realizan pruebas periódicas del plan de continuidad?', 
     'Evalúa si se verifica la efectividad del plan', 
     'Las pruebas pueden incluir simulacros, ejercicios de mesa o pruebas completas', 
     2, 53, true, NOW()),
    
    (10, '¿Existen sitios alternativos para la recuperación de operaciones?', 
     'Evalúa si hay ubicaciones de respaldo para continuar operaciones', 
     'Los sitios alternativos pueden ser físicos o basados en la nube', 
     2, 54, true, NOW());

-- Dominio: Cumplimiento Normativo
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (11, '¿Se realizan evaluaciones formales de cumplimiento normativo?', 
     'Evalúa si se verifica sistemáticamente el cumplimiento de regulaciones', 
     'Las evaluaciones deben ser periódicas y cubrir todas las regulaciones aplicables', 
     2, 55, true, NOW()),
    
    (11, '¿Existe un registro de requisitos legales y normativos aplicables?', 
     'Evalúa si se documentan las obligaciones de cumplimiento', 
     'El registro debe mantenerse actualizado con los cambios en la legislación', 
     2, 56, true, NOW()),
    
    (11, '¿Se implementan controles específicos para cumplir con regulaciones?', 
     'Evalúa si hay medidas concretas para asegurar el cumplimiento', 
     'Los controles deben abordar requisitos específicos de las regulaciones aplicables', 
     2, 57, true, NOW());

-- Dominio: Concienciación y Formación
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (12, '¿Existe un programa formal de concienciación en seguridad?', 
     'Evalúa si hay un plan estructurado para educar al personal', 
     'El programa debe incluir diferentes temas y métodos de formación', 
     2, 58, true, NOW()),
    
    (12, '¿Se realizan simulacros de phishing para evaluar la concienciación?', 
     'Evalúa si se prueba la capacidad de los empleados para identificar ataques', 
     'Los simulacros ayudan a medir la efectividad de la formación y identificar áreas de mejora', 
     2, 59, true, NOW()),
    
    (12, '¿Se proporciona formación específica según el rol de cada empleado?', 
     'Evalúa si la formación se adapta a las responsabilidades de cada persona', 
     'Diferentes roles pueden requerir conocimientos específicos de seguridad', 
     2, 60, true, NOW());
