-- Crear tabla para registrar eventos de sesión
CREATE TABLE IF NOT EXISTS session_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_type VARCHAR(50) NOT NULL,
  event_reason VARCHAR(100),
  ip_address VARCHAR(50),
  user_agent TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para mejorar el rendimiento de las consultas
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_session_logs_user_id ON session_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_event_type ON session_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_session_logs_created_at ON session_logs(created_at);

-- Crear políticas RLS para la tabla session_logs
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- Política para administradores: pueden ver todos los registros
CREATE POLICY admin_session_logs_policy ON session_logs 
  FOR ALL 
  TO authenticated 
  USING (is_admin());

-- Política para usuarios: solo pueden ver sus propios registros
CREATE POLICY user_session_logs_policy ON session_logs 
  FOR SELECT 
  TO authenticated 
  USING (user_id = current_user_id());
