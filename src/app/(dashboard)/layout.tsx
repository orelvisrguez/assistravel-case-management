'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useCasosStore } from '@/stores';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { setFiltros, fetchCasos, paginacion } = useCasosStore();
  
  const handleSearch = (query: string) => {
    const filtros = { busqueda: query };
    setFiltros(filtros);
    fetchCasos(filtros, 1, paginacion.limit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}