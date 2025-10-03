-- Scripts SQL para la base de datos ASSISTRAVEL en Supabase

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios con roles
CREATE TABLE public.usuarios (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Corresponsal
CREATE TABLE public.corresponsal (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  contacto TEXT NOT NULL,
  email TEXT NOT NULL,
  telefonos TEXT,
  pagina_web TEXT,
  direccion TEXT,
  pais_sede TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Caso
CREATE TABLE public.caso (
  id SERIAL PRIMARY KEY,
  corresponsal_id INTEGER REFERENCES public.corresponsal(id) ON DELETE CASCADE,
  nro_caso_assistravel TEXT UNIQUE NOT NULL,
  nro_caso_corresponsal TEXT,
  fecha_de_inicio DATE NOT NULL,
  pais TEXT NOT NULL,
  fee REAL DEFAULT 0,
  costo_usd REAL DEFAULT 0,
  monto_agregado REAL DEFAULT 0,
  costo_moneda_local REAL,
  costo_total REAL GENERATED ALWAYS AS (COALESCE(fee, 0) + COALESCE(costo_usd, 0) + COALESCE(monto_agregado, 0)) STORED,
  simbolo_ml TEXT DEFAULT 'USD',
  informe_medico BOOLEAN DEFAULT FALSE,
  tiene_factura BOOLEAN DEFAULT FALSE,
  fecha_emision_factura DATE,
  fecha_vencimiento_factura DATE,
  fecha_pago_factura DATE,
  nro_factura TEXT,
  observaciones TEXT,
  created_by UUID REFERENCES public.usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para crear usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, apellido, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Nuevo'),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_corresponsal_updated_at
  BEFORE UPDATE ON public.corresponsal
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_caso_updated_at
  BEFORE UPDATE ON public.caso
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar rendimiento
CREATE INDEX idx_caso_corresponsal_id ON public.caso(corresponsal_id);
CREATE INDEX idx_caso_fecha_inicio ON public.caso(fecha_de_inicio);
CREATE INDEX idx_caso_pais ON public.caso(pais);
CREATE INDEX idx_caso_tiene_factura ON public.caso(tiene_factura);
CREATE INDEX idx_caso_fecha_vencimiento ON public.caso(fecha_vencimiento_factura);
CREATE INDEX idx_caso_fecha_pago ON public.caso(fecha_pago_factura);

-- Políticas RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corresponsal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caso ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Solo admins pueden ver todos los usuarios" ON public.usuarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Políticas para corresponsal
CREATE POLICY "Usuarios autenticados pueden ver corresponsales" ON public.corresponsal
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden crear corresponsales" ON public.corresponsal
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar corresponsales" ON public.corresponsal
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar corresponsales" ON public.corresponsal
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Políticas para casos
CREATE POLICY "Usuarios autenticados pueden ver casos" ON public.caso
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden crear casos" ON public.caso
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden actualizar casos que crearon o admins" ON public.caso
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar casos" ON public.caso
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Datos de ejemplo para corresponsales
INSERT INTO public.corresponsal (nombre, contacto, email, telefonos, pagina_web, direccion, pais_sede) VALUES
('Assist Global Mexico', 'Carlos Rodriguez', 'carlos@assistglobal.mx', '+52-555-1234567', 'www.assistglobal.mx', 'Av. Reforma 123, CDMX', 'México'),
('European Assistance', 'Marie Dubois', 'marie@euroassist.fr', '+33-1-42345678', 'www.euroassist.fr', '15 Rue de la Paix, París', 'Francia'),
('Asia Travel Aid', 'Hiroshi Tanaka', 'tanaka@asiatravelaid.jp', '+81-3-12345678', 'www.asiatravelaid.jp', 'Shibuya 2-1-1, Tokio', 'Japón'),
('South America Support', 'Ana Silva', 'ana@sasupport.br', '+55-11-98765432', 'www.sasupport.br', 'Av. Paulista 1000, São Paulo', 'Brasil'),
('Africa Care Services', 'John Mthembu', 'john@africacare.za', '+27-11-1234567', 'www.africacare.za', '123 Nelson Mandela Square, Johannesburg', 'Sudáfrica');

-- Datos de ejemplo para casos
INSERT INTO public.caso (
  corresponsal_id, nro_caso_assistravel, nro_caso_corresponsal, 
  fecha_de_inicio, pais, fee, costo_usd, monto_agregado, 
  simbolo_ml, informe_medico, tiene_factura, observaciones
) VALUES
(1, 'AST-2024-001', 'MEX-001', '2024-09-15', 'México', 150.00, 2500.00, 100.00, 'MXN', true, true, 'Accidente de tráfico, hospitalización de 3 días'),
(2, 'AST-2024-002', 'EUR-045', '2024-09-20', 'Francia', 200.00, 3200.00, 0.00, 'EUR', false, false, 'Consulta médica por intoxicación alimentaria'),
(3, 'AST-2024-003', 'JPN-123', '2024-09-25', 'Japón', 300.00, 4500.00, 250.00, 'JPY', true, true, 'Emergencia dental, tratamiento especializado'),
(1, 'AST-2024-004', 'MEX-002', '2024-10-01', 'México', 100.00, 1800.00, 50.00, 'MXN', false, false, 'Consulta médica general'),
(4, 'AST-2024-005', 'BRA-067', '2024-10-02', 'Brasil', 180.00, 2800.00, 0.00, 'BRL', true, false, 'Accidente deportivo, radiografías');

-- Vista para KPIs
CREATE OR REPLACE VIEW public.kpi_dashboard AS
SELECT 
  -- Total de casos abiertos (sin fecha de pago)
  (SELECT COUNT(*) FROM public.caso WHERE fecha_pago_factura IS NULL) as casos_abiertos,
  
  -- Costo total USD del mes actual
  (SELECT COALESCE(SUM(costo_usd), 0) 
   FROM public.caso 
   WHERE EXTRACT(YEAR FROM fecha_de_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)
   AND EXTRACT(MONTH FROM fecha_de_inicio) = EXTRACT(MONTH FROM CURRENT_DATE)) as costo_mes_actual,
  
  -- Facturas vencidas
  (SELECT COUNT(*) 
   FROM public.caso 
   WHERE fecha_vencimiento_factura < CURRENT_DATE 
   AND fecha_pago_factura IS NULL) as facturas_vencidas,
  
  -- Casos sin factura después de 30 días
  (SELECT COUNT(*) 
   FROM public.caso 
   WHERE tiene_factura = false 
   AND fecha_de_inicio < CURRENT_DATE - INTERVAL '30 days') as casos_sin_factura_30d;

-- Vista para casos por país
CREATE OR REPLACE VIEW public.casos_por_pais AS
SELECT 
  pais,
  COUNT(*) as total_casos,
  SUM(costo_total) as costo_total_pais
FROM public.caso
GROUP BY pais
ORDER BY total_casos DESC
LIMIT 5;