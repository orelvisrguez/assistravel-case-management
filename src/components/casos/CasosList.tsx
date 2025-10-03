'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCasosStore, useCorresponsalesStore, useAuthStore } from '@/stores';
import { formatDate, formatCurrency, getEstadoFactura, getEstadoFacturaClass, PAISES } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import type { FiltrosCaso, EstadoFactura } from '@/types';

interface CasosListProps {
  searchQuery?: string;
}

export default function CasosList({ searchQuery }: CasosListProps) {
  const { user } = useAuthStore();
  const { 
    casos, 
    loading, 
    error, 
    filtros, 
    paginacion, 
    fetchCasos, 
    deleteCaso, 
    setFiltros 
  } = useCasosStore();
  const { corresponsales, fetchCorresponsales } = useCorresponsalesStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; casoId: number | null }>({ 
    isOpen: false, 
    casoId: null 
  });
  const [localFiltros, setLocalFiltros] = useState<FiltrosCaso>({});

  useEffect(() => {
    fetchCorresponsales();
  }, [fetchCorresponsales]);

  useEffect(() => {
    const filtrosActualizados = { ...filtros };
    if (searchQuery) {
      filtrosActualizados.busqueda = searchQuery;
    }
    fetchCasos(filtrosActualizados, 1, paginacion.limit);
  }, [searchQuery]);

  useEffect(() => {
    fetchCasos(filtros, paginacion.page, paginacion.limit);
  }, [fetchCasos]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filtrosConBusqueda = { ...localFiltros };
    if (searchQuery) {
      filtrosConBusqueda.busqueda = searchQuery;
    }
    setFiltros(filtrosConBusqueda);
    fetchCasos(filtrosConBusqueda, 1, paginacion.limit);
  };

  const handleClearFilters = () => {
    setLocalFiltros({});
    const filtrosLimpios = searchQuery ? { busqueda: searchQuery } : {};
    setFiltros(filtrosLimpios);
    fetchCasos(filtrosLimpios, 1, paginacion.limit);
  };

  const handleDelete = async () => {
    if (deleteModal.casoId) {
      await deleteCaso(deleteModal.casoId);
      setDeleteModal({ isOpen: false, casoId: null });
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCasos(filtros, newPage, paginacion.limit);
  };

  const estadosFactura: EstadoFactura[] = ['Pendiente', 'Pagada', 'Vencida', 'Sin Factura'];

  if (loading && casos.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
        </div>

        {showFilters && (
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corresponsal
                </label>
                <select
                  value={localFiltros.corresponsal_id || ''}
                  onChange={(e) => setLocalFiltros(prev => ({
                    ...prev,
                    corresponsal_id: e.target.value ? Number(e.target.value) : undefined
                  }))}
                  className="input-field"
                >
                  <option value="">Todos los corresponsales</option>
                  {corresponsales.map((corresponsal) => (
                    <option key={corresponsal.id} value={corresponsal.id}>
                      {corresponsal.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <select
                  value={localFiltros.pais || ''}
                  onChange={(e) => setLocalFiltros(prev => ({
                    ...prev,
                    pais: e.target.value || undefined
                  }))}
                  className="input-field"
                >
                  <option value="">Todos los países</option>
                  {PAISES.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de Factura
                </label>
                <select
                  value={localFiltros.estado_factura || ''}
                  onChange={(e) => setLocalFiltros(prev => ({
                    ...prev,
                    estado_factura: e.target.value as EstadoFactura || undefined
                  }))}
                  className="input-field"
                >
                  <option value="">Todos los estados</option>
                  {estadosFactura.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={localFiltros.fecha_inicio || ''}
                  onChange={(e) => setLocalFiltros(prev => ({
                    ...prev,
                    fecha_inicio: e.target.value || undefined
                  }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={localFiltros.fecha_fin || ''}
                  onChange={(e) => setLocalFiltros(prev => ({
                    ...prev,
                    fecha_fin: e.target.value || undefined
                  }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Aplicar Filtros
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-secondary"
              >
                Limpiar Filtros
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabla de casos */}
      <div className="card p-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Casos ({paginacion.total})
            </h3>
            <Link href="/casos/nuevo" className="btn-primary">
              Nuevo Caso
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Caso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Corresponsal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo USD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {casos.length > 0 ? (
                casos.map((caso) => {
                  const estado = getEstadoFactura(caso);
                  return (
                    <tr key={caso.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {caso.nro_caso_assistravel}
                          </div>
                          {caso.nro_caso_corresponsal && (
                            <div className="text-sm text-gray-500">
                              {caso.nro_caso_corresponsal}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caso.corresponsal?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caso.pais}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(caso.fecha_de_inicio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(caso.costo_total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getEstadoFacturaClass(estado)} text-xs`}>
                          {estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/casos/${caso.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/casos/${caso.id}/editar`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, casoId: caso.id })}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Cargando casos...
                      </div>
                    ) : (
                      'No se encontraron casos'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
                {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
                {paginacion.total} casos
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1 || loading}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Página {paginacion.page} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page === paginacion.totalPages || loading}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, casoId: null })}
        onConfirm={handleDelete}
        title="Eliminar Caso"
        message="¿Estás seguro de que quieres eliminar este caso? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}