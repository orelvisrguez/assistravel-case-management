'use client';

import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema de gestión de casos</p>
      </div>
      <Dashboard />
    </div>
  );
}