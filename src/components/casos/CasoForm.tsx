'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { casoSchema } from '@/lib/validations';
import { useCorresponsalesStore, useCasosStore } from '@/stores';
import { PAISES, MONEDAS, generateCaseNumber } from '@/lib/utils';
import type { CasoFormData } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

interface CasoFormProps {
  initialData?: Partial<CasoFormData>;
  onSubmit: (data: CasoFormData) => Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  isEditing?: boolean;
}

export default function CasoForm({
  initialData,
  onSubmit,
  onCancel,
  submitText = 'Crear Caso',
  isEditing = false
}: CasoFormProps) {
  const { corresponsales, loading: loadingCorresponsales, fetchCorresponsales } = useCorresponsalesStore();
  const { loading: submitting, error } = useCasosStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<CasoFormData>({
    resolver: zodResolver(casoSchema),
    defaultValues: {
      nro_caso_assistravel: initialData?.nro_caso_assistravel || generateCaseNumber(),
      fee: 0,
      costo_usd: 0,
      monto_agregado: 0,
      simbolo_ml: 'USD',
      informe_medico: false,
      tiene_factura: false,
      ...initialData,
    },
  });

  const watchTieneFactura = watch('tiene_factura');
  const watchFee = watch('fee');
  const watchCostoUsd = watch('costo_usd');
  const watchMontoAgregado = watch('monto_agregado');

  useEffect(() => {
    fetchCorresponsales();
  }, [fetchCorresponsales]);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        fecha_de_inicio: initialData.fecha_de_inicio?.split('T')[0],
        fecha_emision_factura: initialData.fecha_emision_factura?.split('T')[0] || '',
        fecha_vencimiento_factura: initialData.fecha_vencimiento_factura?.split('T')[0] || '',
        fecha_pago_factura: initialData.fecha_pago_factura?.split('T')[0] || '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CasoFormData) => {
    try {
      await onSubmit(data);
      if (!isEditing) {
        reset();
        setValue('nro_caso_assistravel', generateCaseNumber());
      }
    } catch (error) {
      // Error manejado por el store
    }
  };

  const costoTotal = (watchFee || 0) + (watchCostoUsd || 0) + (watchMontoAgregado || 0);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {/* Información Básica */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Caso ASSISTRAVEL *
            </label>
            <input
              {...register('nro_caso_assistravel')}
              className="input-field"
              placeholder="AST-2024-001"
            />
            {errors.nro_caso_assistravel && (
              <p className="text-red-500 text-sm mt-1">{errors.nro_caso_assistravel.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Caso Corresponsal
            </label>
            <input
              {...register('nro_caso_corresponsal')}
              className="input-field"
              placeholder="MEX-001"
            />
            {errors.nro_caso_corresponsal && (
              <p className="text-red-500 text-sm mt-1">{errors.nro_caso_corresponsal.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corresponsal *
            </label>
            <select
              {...register('corresponsal_id', { valueAsNumber: true })}
              className="input-field"
              disabled={loadingCorresponsales}
            >
              <option value="">Seleccionar corresponsal</option>
              {corresponsales.map((corresponsal) => (
                <option key={corresponsal.id} value={corresponsal.id}>
                  {corresponsal.nombre} - {corresponsal.pais_sede}
                </option>
              ))}
            </select>
            {errors.corresponsal_id && (
              <p className="text-red-500 text-sm mt-1">{errors.corresponsal_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <select {...register('pais')} className="input-field">
              <option value="">Seleccionar país</option>
              {PAISES.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
            {errors.pais && (
              <p className="text-red-500 text-sm mt-1">{errors.pais.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              {...register('fecha_de_inicio')}
              className="input-field"
            />
            {errors.fecha_de_inicio && (
              <p className="text-red-500 text-sm mt-1">{errors.fecha_de_inicio.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('informe_medico')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Tiene informe médico</span>
            </label>
          </div>
        </div>
      </div>

      {/* Información Financiera */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Financiera</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('fee', { valueAsNumber: true })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.fee && (
              <p className="text-red-500 text-sm mt-1">{errors.fee.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo USD
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('costo_usd', { valueAsNumber: true })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.costo_usd && (
              <p className="text-red-500 text-sm mt-1">{errors.costo_usd.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto Agregado
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('monto_agregado', { valueAsNumber: true })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.monto_agregado && (
              <p className="text-red-500 text-sm mt-1">{errors.monto_agregado.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo Total
            </label>
            <input
              type="number"
              value={costoTotal.toFixed(2)}
              className="input-field bg-gray-50"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo Moneda Local
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('costo_moneda_local', { valueAsNumber: true })}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo Moneda *
            </label>
            <select {...register('simbolo_ml')} className="input-field">
              {MONEDAS.map((moneda) => (
                <option key={moneda.codigo} value={moneda.codigo}>
                  {moneda.codigo} - {moneda.nombre}
                </option>
              ))}
            </select>
            {errors.simbolo_ml && (
              <p className="text-red-500 text-sm mt-1">{errors.simbolo_ml.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Información de Facturación */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Facturación</h3>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('tiene_factura')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Tiene factura</span>
          </label>
        </div>

        {watchTieneFactura && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Factura
              </label>
              <input
                {...register('nro_factura')}
                className="input-field"
                placeholder="FAC-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Emisión
              </label>
              <input
                type="date"
                {...register('fecha_emision_factura')}
                className="input-field"
              />
              {errors.fecha_emision_factura && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_emision_factura.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                {...register('fecha_vencimiento_factura')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago
              </label>
              <input
                type="date"
                {...register('fecha_pago_factura')}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Observaciones */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h3>
        <textarea
          {...register('observaciones')}
          rows={4}
          className="input-field"
          placeholder="Observaciones adicionales sobre el caso..."
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={submitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={submitting}
        >
          {submitting && <LoadingSpinner size="sm" className="mr-2" />}
          {submitText}
        </button>
      </div>
    </form>
  );
}