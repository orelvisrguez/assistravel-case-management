// Tipos para la base de datos
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Corresponsal {
  id: number;
  nombre: string;
  contacto: string;
  email: string;
  telefonos?: string;
  pagina_web?: string;
  direccion?: string;
  pais_sede: string;
  created_at: string;
  updated_at: string;
}

export interface Caso {
  id: number;
  corresponsal_id: number;
  nro_caso_assistravel: string;
  nro_caso_corresponsal?: string;
  fecha_de_inicio: string;
  pais: string;
  fee: number;
  costo_usd: number;
  monto_agregado: number;
  costo_moneda_local?: number;
  costo_total: number;
  simbolo_ml: string;
  informe_medico: boolean;
  tiene_factura: boolean;
  fecha_emision_factura?: string;
  fecha_vencimiento_factura?: string;
  fecha_pago_factura?: string;
  nro_factura?: string;
  observaciones?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  corresponsal?: Corresponsal;
}

// Tipos para formularios
export interface CasoFormData {
  corresponsal_id: number;
  nro_caso_assistravel: string;
  nro_caso_corresponsal?: string;
  fecha_de_inicio: string;
  pais: string;
  fee: number;
  costo_usd: number;
  monto_agregado: number;
  costo_moneda_local?: number;
  simbolo_ml: string;
  informe_medico: boolean;
  tiene_factura: boolean;
  fecha_emision_factura?: string;
  fecha_vencimiento_factura?: string;
  fecha_pago_factura?: string;
  nro_factura?: string;
  observaciones?: string;
}

export interface CorresponsalFormData {
  nombre: string;
  contacto: string;
  email: string;
  telefonos?: string;
  pagina_web?: string;
  direccion?: string;
  pais_sede: string;
}

// Tipos para KPIs
export interface KPIDashboard {
  casos_abiertos: number;
  costo_mes_actual: number;
  facturas_vencidas: number;
  casos_sin_factura_30d: number;
}

export interface CasosPorPais {
  pais: string;
  total_casos: number;
  costo_total_pais: number;
}

// Tipos para autenticación
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  nombre: string;
  apellido: string;
}

// Estados de factura
export type EstadoFactura = 'Pendiente' | 'Pagada' | 'Vencida' | 'Sin Factura';

// Filtros y búsqueda
export interface FiltrosCaso {
  corresponsal_id?: number;
  pais?: string;
  estado_factura?: EstadoFactura;
  fecha_inicio?: string;
  fecha_fin?: string;
  busqueda?: string;
}

export interface ResultadoPaginado<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}