-- Crear tabla para registrar eventos de auditoría, especialmente cambios de roles

-- Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at);

-- Función para registrar cambios de rol
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
DECLARE
    old_role_name TEXT;
    new_role_name TEXT;
    current_user_id UUID;
BEGIN
    -- Obtener el ID del usuario que realiza la acción
    current_user_id := auth.uid();
    
    -- Si no hay usuario autenticado, usar un valor especial
    IF current_user_id IS NULL THEN
        current_user_id := '00000000-0000-0000-0000-000000000000';
    END IF;
    
    -- Obtener los nombres de los roles
    IF OLD.role_id IS NOT NULL THEN
        SELECT name INTO old_role_name FROM public.roles WHERE id = OLD.role_id;
    END IF;
    
    IF NEW.role_id IS NOT NULL THEN
        SELECT name INTO new_role_name FROM public.roles WHERE id = NEW.role_id;
    END IF;
    
    -- Registrar el cambio
    INSERT INTO public.audit_logs (
        user_id,
        action,
        details
    ) VALUES (
        current_user_id,
        'role_change',
        jsonb_build_object(
            'target_user_id', NEW.id,
            'old_role', old_role_name,
            'new_role', new_role_name,
            'changed_by', current_user_id
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para detectar cambios de rol
DROP TRIGGER IF EXISTS on_role_change ON public.user_profiles;
CREATE TRIGGER on_role_change
    AFTER UPDATE OF role_id ON public.user_profiles
    FOR EACH ROW
    WHEN (OLD.role_id IS DISTINCT FROM NEW.role_id)
    EXECUTE FUNCTION public.log_role_change();

-- Trigger para nuevos usuarios con rol asignado
CREATE OR REPLACE FUNCTION public.log_new_user_role()
RETURNS TRIGGER AS $$
DECLARE
    role_name TEXT;
    current_user_id UUID;
BEGIN
    -- Obtener el ID del usuario que realiza la acción
    current_user_id := auth.uid();
    
    -- Si no hay usuario autenticado, usar un valor especial
    IF current_user_id IS NULL THEN
        current_user_id := '00000000-0000-0000-0000-000000000000';
    END IF;
    
    -- Obtener el nombre del rol
    IF NEW.role_id IS NOT NULL THEN
        SELECT name INTO role_name FROM public.roles WHERE id = NEW.role_id;
        
        -- Registrar la asignación inicial de rol
        INSERT INTO public.audit_logs (
            user_id,
            action,
            details
        ) VALUES (
            current_user_id,
            'role_change',
            jsonb_build_object(
                'target_user_id', NEW.id,
                'role', role_name,
                'action', 'initial_assignment',
                'created_by', current_user_id
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_new_user_role ON public.user_profiles;
CREATE TRIGGER on_new_user_role
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW
    WHEN (NEW.role_id IS NOT NULL)
    EXECUTE FUNCTION public.log_new_user_role();

-- Habilitar RLS en la tabla de auditoría
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Política: solo administradores pueden ver los logs de auditoría
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.roles r ON up.role_id = r.id
            WHERE up.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Política: permitir inserción de logs (pero solo desde funciones con SECURITY DEFINER)
CREATE POLICY "System can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Comentario explicativo
COMMENT ON TABLE public.audit_logs IS 
'Registra eventos importantes de seguridad, especialmente cambios de roles de usuario.
Solo los administradores pueden ver estos registros.';
