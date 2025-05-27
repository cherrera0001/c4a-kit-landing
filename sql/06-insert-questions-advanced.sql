-- Insertar preguntas de nivel avanzado (nivel_max_preguntas = 3)
-- Estas preguntas solo estarán disponibles en el plan Enterprise

-- Dominio: Gobierno de Ciberseguridad
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (1, '¿La organización tiene un marco de gobierno de seguridad alineado con estándares internacionales?', 
     'Evalúa si el gobierno de seguridad sigue estándares como ISO 27001, NIST o COBIT', 
     'El marco debe proporcionar una estructura completa para la gestión de la seguridad', 
     3, 61, true, NOW()),
    
    (1, '¿Se utilizan métricas e indicadores para evaluar la efectividad del programa de seguridad?', 
     'Evalúa si se mide objetivamente el desempeño de la seguridad', 
     'Las métricas deben ser relevantes, medibles y vinculadas a objetivos de negocio', 
     3, 62, true, NOW()),
    
    (1, '¿La alta dirección recibe informes regulares sobre el estado de la seguridad?', 
     'Evalúa si hay comunicación formal con la dirección sobre temas de seguridad', 
     'Los informes deben presentar una visión clara del riesgo y el desempeño de la seguridad', 
     3, 63, true, NOW()),
    
    (1, '¿Existe un presupuesto específico y adecuado para la seguridad de la información?', 
     'Evalúa si se asignan recursos financieros suficientes para la seguridad', 
     'El presupuesto debe ser proporcional a los riesgos y necesidades de la organización', 
     3, 64, true, NOW());

-- Dominio: Gestión de Riesgos
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (2, '¿Se utiliza un enfoque cuantitativo para la evaluación de riesgos?', 
     'Evalúa si se asignan valores numéricos al impacto y probabilidad de los riesgos', 
     'El enfoque cuantitativo permite una comparación más objetiva y precisa de los riesgos', 
     3, 65, true, NOW()),
    
    (2, '¿Se integra la gestión de riesgos de seguridad con la gestión de riesgos empresariales?', 
     'Evalúa si los riesgos de seguridad se consideran parte del riesgo global del negocio', 
     'La integración asegura que la seguridad se alinee con los objetivos estratégicos', 
     3, 66, true, NOW()),
    
    (2, '¿Se utilizan herramientas automatizadas para la gestión de riesgos?', 
     'Evalúa si se emplean soluciones tecnológicas para facilitar el proceso', 
     'Las herramientas pueden ayudar en la identificación, evaluación y seguimiento de riesgos', 
     3, 67, true, NOW()),
    
    (2, '¿Se consideran escenarios de amenazas avanzadas en la evaluación de riesgos?', 
     'Evalúa si se analizan amenazas sofisticadas como APTs o ataques dirigidos', 
     'Los escenarios avanzados ayudan a prepararse para amenazas más complejas y persistentes', 
     3, 68, true, NOW());

-- Dominio: Gestión de Activos
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (3, '¿Se utiliza una herramienta automatizada para el descubrimiento y gestión de activos?', 
     'Evalúa si se emplean soluciones para identificar y gestionar activos automáticamente', 
     'Las herramientas automatizadas mejoran la precisión y actualización del inventario', 
     3, 69, true, NOW()),
    
    (3, '¿Existe un proceso para la gestión de activos en la nube?', 
     'Evalúa si hay procedimientos específicos para activos alojados en servicios cloud', 
     'Los activos en la nube requieren consideraciones especiales de seguridad y gestión', 
     3, 70, true, NOW()),
    
    (3, '¿Se mantiene un mapa de dependencias entre activos críticos?', 
     'Evalúa si se documentan las relaciones y dependencias entre activos', 
     'El mapa ayuda a entender el impacto en cascada de problemas en activos específicos', 
     3, 71, true, NOW()),
    
    (3, '¿Se aplican controles de seguridad basados en el análisis de riesgo de cada activo?', 
     'Evalúa si los controles se ajustan al riesgo específico de cada activo', 
     'Los controles deben ser proporcionales al riesgo y valor del activo para la organización', 
     3, 72, true, NOW());

-- Dominio: Control de Acceso
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (4, '¿Se implementa gestión de identidades y accesos (IAM) con aprovisionamiento automatizado?', 
     'Evalúa si existe un sistema que automatiza la gestión de identidades y permisos', 
     'La automatización mejora la eficiencia y reduce errores en la gestión de accesos', 
     3, 73, true, NOW()),
    
    (4, '¿Se utiliza autenticación adaptativa basada en riesgos?', 
     'Evalúa si el nivel de autenticación varía según el riesgo de cada acceso', 
     'La autenticación adaptativa ajusta los requisitos según factores como ubicación, dispositivo o comportamiento', 
     3, 74, true, NOW()),
    
    (4, '¿Existe un sistema de gestión de accesos privilegiados (PAM)?', 
     'Evalúa si hay controles especiales para cuentas con altos privilegios', 
     'El PAM proporciona protección adicional para las cuentas más poderosas y de mayor riesgo', 
     3, 75, true, NOW()),
    
    (4, '¿Se implementa el principio de Zero Trust en la arquitectura de accesos?', 
     'Evalúa si se verifica cada acceso independientemente de su origen', 
     'Zero Trust asume que no hay perímetro seguro y verifica cada solicitud de acceso', 
     3, 76, true, NOW());

-- Dominio: Seguridad de Redes
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (5, '¿Se utiliza un sistema de detección/prevención de intrusiones (IDS/IPS)?', 
     'Evalúa si existen mecanismos para detectar y bloquear actividades maliciosas en la red', 
     'Los IDS/IPS monitorizan el tráfico de red en busca de patrones sospechosos o ataques conocidos', 
     3, 77, true, NOW()),
    
    (5, '¿Se implementa inspección SSL/TLS para el tráfico cifrado?', 
     'Evalúa si se analiza el contenido del tráfico cifrado', 
     'La inspección permite detectar amenazas ocultas en comunicaciones cifradas', 
     3, 78, true, NOW()),
    
    (5, '¿Existe una arquitectura de red definida por software (SDN)?', 
     'Evalúa si la red se gestiona mediante software centralizado', 
     'SDN proporciona mayor flexibilidad, control y capacidad para implementar políticas de seguridad', 
     3, 79, true, NOW()),
    
    (5, '¿Se utiliza análisis de comportamiento de red para detectar anomalías?', 
     'Evalúa si se monitoriza el comportamiento normal para identificar desviaciones', 
     'El análisis de comportamiento puede detectar amenazas desconocidas o avanzadas', 
     3, 80, true, NOW());

-- Continuar con los demás dominios siguiendo el mismo patrón...
-- Dominio: Seguridad de Endpoints
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (6, '¿Se implementa una solución EDR (Endpoint Detection and Response)?', 
     'Evalúa si existe una herramienta avanzada para detectar y responder a amenazas en endpoints', 
     'EDR proporciona visibilidad, detección y capacidad de respuesta a nivel de endpoint', 
     3, 81, true, NOW()),
    
    (6, '¿Se utiliza cifrado de disco completo en todos los dispositivos?', 
     'Evalúa si los datos almacenados en dispositivos están protegidos mediante cifrado', 
     'El cifrado de disco protege la información en caso de pérdida o robo del dispositivo', 
     3, 82, true, NOW()),
    
    (6, '¿Existe una solución de gestión de dispositivos móviles (MDM)?', 
     'Evalúa si hay controles específicos para dispositivos móviles', 
     'MDM permite aplicar políticas de seguridad en smartphones y tablets corporativos', 
     3, 83, true, NOW()),
    
    (6, '¿Se implementa micro-segmentación a nivel de endpoint?', 
     'Evalúa si se aplican controles granulares de comunicación entre endpoints', 
     'La micro-segmentación limita la propagación lateral de amenazas entre dispositivos', 
     3, 84, true, NOW());

-- Dominio: Seguridad de Aplicaciones
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (7, '¿Se utiliza un firewall de aplicaciones web (WAF) para aplicaciones críticas?', 
     'Evalúa si existe protección específica para aplicaciones web', 
     'El WAF protege contra ataques comunes como inyección SQL, XSS y otros de OWASP Top 10', 
     3, 85, true, NOW()),
    
    (7, '¿Se implementa análisis estático y dinámico de código (SAST/DAST)?', 
     'Evalúa si se utilizan herramientas automatizadas para analizar el código', 
     'SAST analiza el código fuente, mientras DAST prueba la aplicación en ejecución', 
     3, 86, true, NOW()),
    
    (7, '¿Existe un programa de recompensas por bugs o vulnerabilidades?', 
     'Evalúa si se incentiva la identificación de vulnerabilidades por terceros', 
     'Los programas de bug bounty aprovechan la experiencia de investigadores externos', 
     3, 87, true, NOW()),
    
    (7, '¿Se implementa gestión segura de secretos y credenciales en aplicaciones?', 
     'Evalúa si hay mecanismos para proteger claves, tokens y credenciales', 
     'La gestión segura de secretos evita la exposición de información sensible en el código', 
     3, 88, true, NOW());

-- Dominio: Gestión de Vulnerabilidades
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (8, '¿Se utiliza un sistema centralizado de gestión de vulnerabilidades?', 
     'Evalúa si existe una plataforma para gestionar todo el ciclo de vida de las vulnerabilidades', 
     'El sistema debe permitir identificar, priorizar, asignar y verificar la remediación', 
     3, 89, true, NOW()),
    
    (8, '¿Se integra inteligencia de amenazas en el proceso de gestión de vulnerabilidades?', 
     'Evalúa si se utiliza información sobre amenazas actuales para priorizar vulnerabilidades', 
     'La inteligencia de amenazas ayuda a enfocarse en vulnerabilidades que están siendo explotadas activamente', 
     3, 90, true, NOW()),
    
    (8, '¿Existe un proceso formal para la gestión de excepciones de vulnerabilidades?', 
     'Evalúa si hay un procedimiento para manejar vulnerabilidades que no pueden ser remediadas', 
     'El proceso debe incluir aprobaciones, controles compensatorios y revisiones periódicas', 
     3, 91, true, NOW()),
    
    (8, '¿Se realizan pruebas de penetración por terceros independientes?', 
     'Evalúa si se contratan servicios externos para evaluar la seguridad', 
     'Los pentesters externos aportan una perspectiva imparcial y experiencia especializada', 
     3, 92, true, NOW());

-- Dominio: Gestión de Incidentes
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (9, '¿Se utiliza un SIEM (Security Information and Event Management) para la detección de incidentes?', 
     'Evalúa si existe una plataforma para correlacionar y analizar eventos de seguridad', 
     'El SIEM centraliza logs y eventos, permitiendo detectar patrones y anomalías', 
     3, 93, true, NOW()),
    
    (9, '¿Existe un playbook documentado para diferentes tipos de incidentes?', 
     'Evalúa si hay procedimientos detallados para cada tipo de incidente', 
     'Los playbooks proporcionan pasos específicos para manejar diferentes escenarios', 
     3, 94, true, NOW()),
    
    (9, '¿Se realizan análisis forenses después de incidentes significativos?', 
     'Evalúa si se investigan a fondo los incidentes para entender su causa y alcance', 
     'El análisis forense ayuda a reconstruir el incidente y mejorar las defensas', 
     3, 95, true, NOW()),
    
    (9, '¿Existe colaboración con entidades externas (CERT, ISACs) para la respuesta a incidentes?', 
     'Evalúa si hay cooperación con organizaciones especializadas en ciberseguridad', 
     'La colaboración facilita el intercambio de información y mejores prácticas', 
     3, 96, true, NOW());

-- Dominio: Continuidad de Negocio
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (10, '¿Existe un plan específico de recuperación ante desastres cibernéticos?', 
     'Evalúa si hay un plan dedicado para incidentes de seguridad graves', 
     'El plan debe abordar escenarios como ransomware, brechas masivas o ataques destructivos', 
     3, 97, true, NOW()),
    
    (10, '¿Se realizan ejercicios de simulación de crisis cibernética?', 
     'Evalúa si se practican escenarios de incidentes graves', 
     'Los ejercicios prueban la capacidad de la organización para responder a crisis', 
     3, 98, true, NOW()),
    
    (10, '¿Se mantienen copias de seguridad aisladas (air-gapped) para recuperación?', 
     'Evalúa si existen backups desconectados de la red principal', 
     'Las copias aisladas protegen contra ataques que podrían comprometer los backups regulares', 
     3, 99, true, NOW()),
    
    (10, '¿Existe un equipo de gestión de crisis con roles claramente definidos?', 
     'Evalúa si hay personal designado para manejar situaciones críticas', 
     'El equipo debe incluir representantes de diferentes áreas y tener autoridad para tomar decisiones', 
     3, 100, true, NOW());

-- Dominio: Cumplimiento Normativo
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (11, '¿Se realizan auditorías externas de cumplimiento normativo?', 
     'Evalúa si entidades independientes verifican el cumplimiento', 
     'Las auditorías externas proporcionan una evaluación imparcial del cumplimiento', 
     3, 101, true, NOW()),
    
    (11, '¿Existe un programa formal de gestión de cumplimiento normativo?', 
     'Evalúa si hay un enfoque estructurado para gestionar obligaciones regulatorias', 
     'El programa debe incluir identificación, implementación y monitoreo de requisitos', 
     3, 102, true, NOW()),
    
    (11, '¿Se utilizan herramientas automatizadas para monitorizar el cumplimiento?', 
     'Evalúa si se emplean soluciones tecnológicas para verificar el cumplimiento', 
     'Las herramientas pueden ayudar a identificar desviaciones y generar evidencias', 
     3, 103, true, NOW()),
    
    (11, '¿Se realizan evaluaciones de impacto de privacidad para nuevos proyectos?', 
     'Evalúa si se analizan las implicaciones de privacidad antes de implementar cambios', 
     'Las evaluaciones ayudan a identificar y mitigar riesgos relacionados con datos personales', 
     3, 104, true, NOW());

-- Dominio: Concienciación y Formación
INSERT INTO public.questions (domain_id, text, description, help_text, maturity_level_id, order_index, active, created_at)
VALUES
    (12, '¿Existe un programa de formación continua en ciberseguridad?', 
     'Evalúa si la formación es un proceso constante, no eventos puntuales', 
     'La formación continua mantiene actualizados los conocimientos sobre amenazas y defensas', 
     3, 105, true, NOW()),
    
    (12, '¿Se mide la efectividad de los programas de concienciación?', 
     'Evalúa si se evalúa el impacto real de la formación', 
     'Las métricas pueden incluir tasas de reporte de phishing, resultados de simulacros, etc.', 
     3, 106, true, NOW()),
    
    (12, '¿Existe formación especializada para roles técnicos y de seguridad?', 
     'Evalúa si el personal técnico recibe capacitación avanzada', 
     'Los roles técnicos requieren conocimientos más profundos en sus áreas específicas', 
     3, 107, true, NOW()),
    
    (12, '¿Se fomenta una cultura de seguridad en toda la organización?', 
     'Evalúa si la seguridad forma parte de los valores y comportamientos organizacionales', 
     'Una cultura de seguridad va más allá de la formación, integrando la seguridad en el día a día', 
     3, 108, true, NOW());
