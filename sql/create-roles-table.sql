-- Verificar si la tabla roles existe
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Insertar roles predefinidos con UUIDs específicos
INSERT INTO roles (id, name, description)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Administrador del sistema'),
  ('00000000-0000-0000-0000-000000000002', 'user', 'Usuario regular')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description;
