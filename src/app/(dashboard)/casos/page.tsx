'use client';

import { useState } from 'react';
import CasosList from '@/components/casos/CasosList';

export default function CasosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Casos</h1>
        <p className="text-gray-600">Gestión y visualización de todos los casos</p>
      </div>
      <CasosList searchQuery={searchQuery} />
    </div>
  );
}