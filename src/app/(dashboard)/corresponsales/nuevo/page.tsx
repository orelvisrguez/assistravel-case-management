'use client';

import { useRouter } from 'next/navigation';
import CorresponsalForm from '@/components/corresponsales/CorresponsalForm';
import { useCorresponsalesStore } from '@/stores';
import type { CorresponsalFormData } from '@/types';

export default function NuevoCorresponsalPage() {
  const router = useRouter();
  const { createCorresponsal } = useCorresponsalesStore();

  const handleSubmit = async (data: CorresponsalFormData) => {
    await createCorresponsal(data);
    router.push('/corresponsales');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Corresponsal</h1>
        <p className="text-gray-600">Agregar un nuevo corresponsal al sistema</p>
      </div>
      <CorresponsalForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Crear Corresponsal"
      />
    </div>
  );
}