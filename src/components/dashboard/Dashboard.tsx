'use client';

import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { useDashboardStore } from '@/stores';
import { formatCurrency, formatDate, getEstadoFactura, getEstadoFacturaClass } from '@/lib/utils';
import LoadingSpinner, { LoadingCard } from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';

export default function Dashboard() {
  const { 
    kpis, 
    casosPorPais, 
    casosRecientes, 
    casosAtencion, 
    loading, 
    error, 
    fetchDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        type="error" 
        title="Error al cargar dashboard" 
        message={error} 
        className="mb-6"
      />
    );
  }

  const kpiCards = [
    {
      title: 'Casos Abiertos',
      value: kpis?.casos_abiertos || 0,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Costo Mes Actual',
      value: formatCurrency(kpis?.costo_mes_actual || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Facturas Vencidas',
      value: kpis?.facturas_vencidas || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Casos Sin Factura (30d)',
      value: kpis?.casos_sin_factura_30d || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className={`card ${kpi.bgColor}`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className={`text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Casos por País */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
            Casos por País (Top 5)
          </h3>
          {casosPorPais.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casosPorPais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="pais" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'total_casos' ? value : formatCurrency(value as number),
                    name === 'total_casos' ? 'Casos' : 'Costo Total'
                  ]}
                />
                <Bar dataKey="total_casos" fill="#3b82f6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          )}
        </div>

        {/* Casos que Requieren Atención */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Casos que Requieren Atención
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {casosAtencion.length > 0 ? (
              casosAtencion.map((caso) => {
                const estado = getEstadoFactura(caso);
                return (
                  <div key={caso.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link 
                          href={`/casos/${caso.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-800"
                        >
                          {caso.nro_caso_assistravel}
                        </Link>
                        <p className="text-xs text-gray-600 mt-1">
                          {caso.corresponsal?.nombre} - {caso.pais}
                        </p>
                        <p className="text-xs text-gray-500">
                          Inicio: {formatDate(caso.fecha_de_inicio)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`${getEstadoFacturaClass(estado)} text-xs`}>
                          {estado}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatCurrency(caso.costo_total)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No hay casos que requieran atención inmediata</p>
            )}
          </div>
        </div>
      </div>

      {/* Últimos Casos Actualizados */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Últimos Casos Actualizados
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Corresponsal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {casosRecientes.length > 0 ? (
                casosRecientes.map((caso) => {
                  const estado = getEstadoFactura(caso);
                  return (
                    <tr key={caso.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/casos/${caso.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-800"
                        >
                          {caso.nro_caso_assistravel}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caso.corresponsal?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caso.pais}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getEstadoFacturaClass(estado)} text-xs`}>
                          {estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(caso.costo_total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(caso.updated_at, 'dd/MM/yyyy HH:mm')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No hay casos recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}