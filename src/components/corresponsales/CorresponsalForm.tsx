'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { corresponsalSchema } from '@/lib/validations';
import { useCorresponsalesStore } from '@/stores';
import { PAISES } from '@/lib/utils';
import type { CorresponsalFormData } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

interface CorresponsalFormProps {
  initialData?: Partial<CorresponsalFormData>;
  onSubmit: (data: CorresponsalFormData) => Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  isEditing?: boolean;
}

export default function CorresponsalForm({
  initialData,
  onSubmit,
  onCancel,
  submitText = 'Crear Corresponsal',
  isEditing = false
}: CorresponsalFormProps) {
  const { loading: submitting, error } = useCorresponsalesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CorresponsalFormData>({
    resolver: zodResolver(corresponsalSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CorresponsalFormData) => {
    try {
      await onSubmit(data);
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      // Error manejado por el store
    }
  };

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
              Nombre del Corresponsal *
            </label>
            <input
              {...register('nombre')}
              className="input-field"
              placeholder="Nombre de la empresa"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacto *
            </label>
            <input
              {...register('contacto')}
              className="input-field"
              placeholder="Nombre del contacto"
            />
            {errors.contacto && (
              <p className="text-red-500 text-sm mt-1">{errors.contacto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="email@empresa.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País Sede *
            </label>
            <select {...register('pais_sede')} className="input-field">
              <option value="">Seleccionar país</option>
              {PAISES.map((pais) => (
                <option key={pais} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
            {errors.pais_sede && (
              <p className="text-red-500 text-sm mt-1">{errors.pais_sede.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfonos
            </label>
            <input
              {...register('telefonos')}
              className="input-field"
              placeholder="Teléfonos separados por coma"
            />
            <p className="text-sm text-gray-500 mt-1">
              Puede incluir varios teléfonos separados por coma
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Página Web
            </label>
            <input
              type="url"
              {...register('pagina_web')}
              className="input-field"
              placeholder="https://www.empresa.com"
            />
            {errors.pagina_web && (
              <p className="text-red-500 text-sm mt-1">{errors.pagina_web.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <textarea
              {...register('direccion')}
              rows={3}
              className="input-field"
              placeholder="Dirección completa"
            />
          </div>
        </div>
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