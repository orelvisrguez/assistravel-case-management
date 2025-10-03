'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CasoForm from '@/components/casos/CasoForm';
import { useCasosStore } from '@/stores';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import type { CasoFormData, Caso } from '@/types';

export default function EditarCasoPage() {
  const params = useParams();
  const router = useRouter();
  const { getCasoById, updateCaso, loading, error } = useCasosStore();
  const [caso, setCaso] = useState<Caso | null>(null);
  const [loadingCaso, setLoadingCaso] = useState(true);

  const casoId = Number(params.id);

  useEffect(() => {
    const fetchCaso = async () => {
      if (casoId) {
        setLoadingCaso(true);
        const casoData = await getCasoById(casoId);
        setCaso(casoData);
        setLoadingCaso(false);
      }
    };
    fetchCaso();
  }, [casoId, getCasoById]);

  const handleSubmit = async (data: CasoFormData) => {
    await updateCaso(casoId, data);
    router.push(`/casos/${casoId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loadingCaso || !caso) {
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

  // Convertir el caso a formato de formulario
  const initialData: CasoFormData = {
    corresponsal_id: caso.corresponsal_id,
    nro_caso_assistravel: caso.nro_caso_assistravel,
    nro_caso_corresponsal: caso.nro_caso_corresponsal || '',
    fecha_de_inicio: caso.fecha_de_inicio,
    pais: caso.pais,
    fee: caso.fee,
    costo_usd: caso.costo_usd,
    monto_agregado: caso.monto_agregado,
    costo_moneda_local: caso.costo_moneda_local,
    simbolo_ml: caso.simbolo_ml,
    informe_medico: caso.informe_medico,
    tiene_factura: caso.tiene_factura,
    fecha_emision_factura: caso.fecha_emision_factura || '',
    fecha_vencimiento_factura: caso.fecha_vencimiento_factura || '',
    fecha_pago_factura: caso.fecha_pago_factura || '',
    nro_factura: caso.nro_factura || '',
    observaciones: caso.observaciones || '',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Caso {caso.nro_caso_assistravel}
        </h1>
        <p className="text-gray-600">Modificar la información del caso</p>
      </div>
      <CasoForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Actualizar Caso"
        isEditing={true}
      />
    </div>
  );
}