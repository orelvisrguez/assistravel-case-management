'use client';

import { useRouter } from 'next/navigation';
import CasoForm from '@/components/casos/CasoForm';
import { useCasosStore } from '@/stores';
import type { CasoFormData } from '@/types';

export default function NuevoCasoPage() {
  const router = useRouter();
  const { createCaso } = useCasosStore();

  const handleSubmit = async (data: CasoFormData) => {
    await createCaso(data);
    router.push('/casos');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Caso</h1>
        <p className="text-gray-600">Crear un nuevo caso de asistencia en viajes</p>
      </div>
      <CasoForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Crear Caso"
      />
    </div>
  );
}