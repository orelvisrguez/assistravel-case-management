import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { EstadoFactura, Caso } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear fechas
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

// Formatear moneda
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Determinar estado de factura
export const getEstadoFactura = (caso: Caso): EstadoFactura => {
  if (!caso.tiene_factura) return 'Sin Factura';
  if (caso.fecha_pago_factura) return 'Pagada';
  if (caso.fecha_vencimiento_factura && new Date(caso.fecha_vencimiento_factura) < new Date()) {
    return 'Vencida';
  }
  return 'Pendiente';
};

// Obtener clase CSS para estado de factura
export const getEstadoFacturaClass = (estado: EstadoFactura): string => {
  switch (estado) {
    case 'Pagada':
      return 'badge-success';
    case 'Pendiente':
      return 'badge-info';
    case 'Vencida':
      return 'badge-danger';
    case 'Sin Factura':
      return 'badge-warning';
    default:
      return 'badge-info';
  }
};

// Generar número de caso único
export const generateCaseNumber = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `AST-${year}-${timestamp}`;
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce función
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Lista de países comunes
export const PAISES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador',
  'España', 'Estados Unidos', 'Francia', 'Guatemala', 'México',
  'Panamá', 'Paraguay', 'Perú', 'República Dominicana', 'Uruguay',
  'Venezuela', 'Alemania', 'Italia', 'Reino Unido', 'Japón',
  'China', 'Corea del Sur', 'India', 'Tailandia', 'Australia',
  'Canadá', 'Costa Rica', 'El Salvador', 'Honduras', 'Nicaragua'
].sort();

// Monedas comunes
export const MONEDAS = [
  { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: '$' },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
  { codigo: 'MXN', nombre: 'Peso Mexicano', simbolo: '$' },
  { codigo: 'BRL', nombre: 'Real Brasileño', simbolo: 'R$' },
  { codigo: 'ARS', nombre: 'Peso Argentino', simbolo: '$' },
  { codigo: 'CLP', nombre: 'Peso Chileno', simbolo: '$' },
  { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: '$' },
  { codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/' },
  { codigo: 'JPY', nombre: 'Yen Japonés', simbolo: '¥' },
  { codigo: 'GBP', nombre: 'Libra Esterlina', simbolo: '£' },
  { codigo: 'CAD', nombre: 'Dólar Canadiense', simbolo: 'C$' },
];

// Obtener símbolo de moneda
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = MONEDAS.find(m => m.codigo === currencyCode);
  return currency?.simbolo || currencyCode;
};