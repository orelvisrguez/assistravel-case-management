'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CorresponsalForm from '@/components/corresponsales/CorresponsalForm';
import { useCorresponsalesStore } from '@/stores';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import type { CorresponsalFormData, Corresponsal } from '@/types';

export default function EditarCorresponsalPage() {
  const params = useParams();
  const router = useRouter();
  const { getCorresponsalById, updateCorresponsal, loading, error } = useCorresponsalesStore();
  const [corresponsal, setCorresponsal] = useState<Corresponsal | null>(null);
  const [loadingCorresponsal, setLoadingCorresponsal] = useState(true);

  const corresponsalId = Number(params.id);

  useEffect(() => {
    const fetchCorresponsal = async () => {
      if (corresponsalId) {
        setLoadingCorresponsal(true);
        const corresponsalData = await getCorresponsalById(corresponsalId);
        setCorresponsal(corresponsalData);
        setLoadingCorresponsal(false);
      }
    };
    fetchCorresponsal();
  }, [corresponsalId, getCorresponsalById]);

  const handleSubmit = async (data: CorresponsalFormData) => {
    await updateCorresponsal(corresponsalId, data);
    router.push('/corresponsales');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loadingCorresponsal || !corresponsal) {
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
        title="Error al cargar el corresponsal" 
        message={error} 
        className="mb-6"
      />
    );
  }

  // Convertir el corresponsal a formato de formulario
  const initialData: CorresponsalFormData = {
    nombre: corresponsal.nombre,
    contacto: corresponsal.contacto,
    email: corresponsal.email,
    telefonos: corresponsal.telefonos || '',
    pagina_web: corresponsal.pagina_web || '',
    direccion: corresponsal.direccion || '',
    pais_sede: corresponsal.pais_sede,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Corresponsal: {corresponsal.nombre}
        </h1>
        <p className="text-gray-600">Modificar la información del corresponsal</p>
      </div>
      <CorresponsalForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Actualizar Corresponsal"
        isEditing={true}
      />
    </div>
  );
}