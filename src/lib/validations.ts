import { z } from 'zod';

// Schema para el caso
export const casoSchema = z.object({
  corresponsal_id: z.number({ required_error: 'Seleccione un corresponsal' }).min(1, 'Seleccione un corresponsal'),
  nro_caso_assistravel: z.string().min(1, 'Número de caso requerido'),
  nro_caso_corresponsal: z.string().optional(),
  fecha_de_inicio: z.string().min(1, 'Fecha de inicio requerida'),
  pais: z.string().min(1, 'País requerido'),
  fee: z.number().min(0, 'El fee debe ser mayor o igual a 0'),
  costo_usd: z.number().min(0, 'El costo USD debe ser mayor o igual a 0'),
  monto_agregado: z.number().min(0, 'El monto agregado debe ser mayor o igual a 0'),
  costo_moneda_local: z.number().optional(),
  simbolo_ml: z.string().min(1, 'Símbolo de moneda requerido'),
  informe_medico: z.boolean(),
  tiene_factura: z.boolean(),
  fecha_emision_factura: z.string().optional(),
  fecha_vencimiento_factura: z.string().optional(),
  fecha_pago_factura: z.string().optional(),
  nro_factura: z.string().optional(),
  observaciones: z.string().optional(),
}).refine((data) => {
  // Si tiene factura, debe tener fecha de emisión
  if (data.tiene_factura && !data.fecha_emision_factura) {
    return false;
  }
  // Si tiene fecha de pago, debe tener fecha de emisión
  if (data.fecha_pago_factura && !data.fecha_emision_factura) {
    return false;
  }
  // Si tiene fecha de vencimiento, debe tener fecha de emisión
  if (data.fecha_vencimiento_factura && !data.fecha_emision_factura) {
    return false;
  }
  return true;
}, {
  message: 'Si el caso tiene factura, debe especificar la fecha de emisión',
  path: ['fecha_emision_factura']
});

// Schema para el corresponsal
export const corresponsalSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(100, 'Nombre muy largo'),
  contacto: z.string().min(1, 'Contacto requerido').max(100, 'Contacto muy largo'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  telefonos: z.string().optional(),
  pagina_web: z.string().url('URL inválida').optional().or(z.literal('')),
  direccion: z.string().optional(),
  pais_sede: z.string().min(1, 'País sede requerido'),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Schema para registro
export const registerSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme la contraseña'),
  nombre: z.string().min(1, 'Nombre requerido').max(50, 'Nombre muy largo'),
  apellido: z.string().min(1, 'Apellido requerido').max(50, 'Apellido muy largo'),
  rol: z.enum(['admin', 'user'], { required_error: 'Seleccione un rol' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema para filtros
export const filtrosSchema = z.object({
  corresponsal_id: z.number().optional(),
  pais: z.string().optional(),
  estado_factura: z.enum(['Pendiente', 'Pagada', 'Vencida', 'Sin Factura']).optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  busqueda: z.string().optional(),
});

// Tipos inferidos de los esquemas
export type CasoFormData = z.infer<typeof casoSchema>;
export type CorresponsalFormData = z.infer<typeof corresponsalSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type FiltrosFormData = z.infer<typeof filtrosSchema>;