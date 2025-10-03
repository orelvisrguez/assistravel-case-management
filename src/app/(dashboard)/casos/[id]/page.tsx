'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft, DollarSign, Calendar, User, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCasosStore, useAuthStore } from '@/stores';
import { formatDate, formatCurrency, getEstadoFactura, getEstadoFacturaClass, getCurrencySymbol } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import type { Caso } from '@/types';

export default function CasoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getCasoById, loading, error } = useCasosStore();
  const [caso, setCaso] = useState<Caso | null>(null);

  const casoId = Number(params.id);

  useEffect(() => {
    const fetchCaso = async () => {
      if (casoId) {
        const casoData = await getCasoById(casoId);
        setCaso(casoData);
      }
    };
    fetchCaso();
  }, [casoId, getCasoById]);

  if (loading || !caso) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        type="error" 
        title="Error al cargar el caso" 
        message={error} 
        className="mb-6"
      />
    );
  }

  const estado = getEstadoFactura(caso);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Caso {caso.nro_caso_assistravel}
            </h1>
            <p className="text-gray-600">Detalles completos del caso</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`${getEstadoFacturaClass(estado)} text-sm`}>
            {estado}
          </span>
          <Link
            href={`/casos/${caso.id}/editar`}
            className="btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Número de Caso ASSISTRAVEL</label>
                <p className="text-sm text-gray-900 font-medium">{caso.nro_caso_assistravel}</p>
              </div>
              {caso.nro_caso_corresponsal && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Número de Caso Corresponsal</label>
                  <p className="text-sm text-gray-900">{caso.nro_caso_corresponsal}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">País</label>
                <p className="text-sm text-gray-900">{caso.pais}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Inicio</label>
                <p className="text-sm text-gray-900">{formatDate(caso.fecha_de_inicio)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Informe Médico</label>
                <div className="flex items-center">
                  {caso.informe_medico ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-700">Sí</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">No</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Financiera */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Información Financiera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Fee</label>
                <p className="text-sm text-gray-900 font-medium">{formatCurrency(caso.fee)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Costo USD</label>
                <p className="text-sm text-gray-900 font-medium">{formatCurrency(caso.costo_usd)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Monto Agregado</label>
                <p className="text-sm text-gray-900 font-medium">{formatCurrency(caso.monto_agregado)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Costo Total</label>
                <p className="text-lg text-gray-900 font-bold">{formatCurrency(caso.costo_total)}</p>
              </div>
              {caso.costo_moneda_local && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Costo Moneda Local</label>
                    <p className="text-sm text-gray-900">
                      {getCurrencySymbol(caso.simbolo_ml)} {caso.costo_moneda_local.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Moneda</label>
                    <p className="text-sm text-gray-900">{caso.simbolo_ml}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Información de Facturación */}
          {caso.tiene_factura && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Información de Facturación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caso.nro_factura && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Número de Factura</label>
                    <p className="text-sm text-gray-900 font-medium">{caso.nro_factura}</p>
                  </div>
                )}
                {caso.fecha_emision_factura && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Emisión</label>
                    <p className="text-sm text-gray-900">{formatDate(caso.fecha_emision_factura)}</p>
                  </div>
                )}
                {caso.fecha_vencimiento_factura && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
                    <p className="text-sm text-gray-900">{formatDate(caso.fecha_vencimiento_factura)}</p>
                  </div>
                )}
                {caso.fecha_pago_factura && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Pago</label>
                    <p className="text-sm text-gray-900">{formatDate(caso.fecha_pago_factura)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observaciones */}
          {caso.observaciones && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Observaciones</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{caso.observaciones}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Corresponsal */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              Corresponsal
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-sm text-gray-900 font-medium">{caso.corresponsal?.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Contacto</label>
                <p className="text-sm text-gray-900">{caso.corresponsal?.contacto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">
                  <a 
                    href={`mailto:${caso.corresponsal?.email}`}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {caso.corresponsal?.email}
                  </a>
                </p>
              </div>
              {caso.corresponsal?.telefonos && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Teléfonos</label>
                  <p className="text-sm text-gray-900">{caso.corresponsal.telefonos}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">País Sede</label>
                <p className="text-sm text-gray-900">{caso.corresponsal?.pais_sede}</p>
              </div>
              {caso.corresponsal?.pagina_web && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Página Web</label>
                  <p className="text-sm text-gray-900">
                    <a 
                      href={caso.corresponsal.pagina_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {caso.corresponsal.pagina_web}
                    </a>
                  </p>
                </div>
              )}
              {caso.corresponsal?.direccion && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dirección</label>
                  <p className="text-sm text-gray-900">{caso.corresponsal.direccion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadatos */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadatos</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Creado</label>
                <p className="text-sm text-gray-900">{formatDate(caso.created_at, 'dd/MM/yyyy HH:mm')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Última Actualización</label>
                <p className="text-sm text-gray-900">{formatDate(caso.updated_at, 'dd/MM/yyyy HH:mm')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}