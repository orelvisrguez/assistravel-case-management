'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Building2, Mail, Phone, Globe } from 'lucide-react';
import { useCorresponsalesStore, useAuthStore } from '@/stores';
import { ConfirmModal } from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function CorresponsalesPage() {
  const { user } = useAuthStore();
  const { 
    corresponsales, 
    loading, 
    error, 
    fetchCorresponsales, 
    deleteCorresponsal 
  } = useCorresponsalesStore();
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; corresponsalId: number | null }>({ 
    isOpen: false, 
    corresponsalId: null 
  });

  useEffect(() => {
    fetchCorresponsales();
  }, [fetchCorresponsales]);

  const handleDelete = async () => {
    if (deleteModal.corresponsalId) {
      await deleteCorresponsal(deleteModal.corresponsalId);
      setDeleteModal({ isOpen: false, corresponsalId: null });
    }
  };

  if (loading && corresponsales.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Solo admins pueden acceder
  if (user?.role !== 'admin') {
    return (
      <Alert 
        type="error" 
        title="Acceso Denegado" 
        message="No tienes permisos para acceder a esta sección." 
        className="mb-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corresponsales</h1>
          <p className="text-gray-600">Gestión de corresponsales y empresas de asistencia</p>
        </div>
        <Link href="/corresponsales/nuevo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Corresponsal
        </Link>
      </div>

      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {/* Lista de Corresponsales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {corresponsales.length > 0 ? (
          corresponsales.map((corresponsal) => (
            <div key={corresponsal.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 rounded-lg mr-3">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {corresponsal.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">{corresponsal.pais_sede}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/corresponsales/${corresponsal.id}/editar`}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, corresponsalId: corresponsal.id })}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Contacto:</span>
                  <span>{corresponsal.contacto}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`mailto:${corresponsal.email}`}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {corresponsal.email}
                  </a>
                </div>

                {corresponsal.telefonos && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{corresponsal.telefonos}</span>
                  </div>
                )}

                {corresponsal.pagina_web && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <a 
                      href={corresponsal.pagina_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 truncate"
                    >
                      {corresponsal.pagina_web}
                    </a>
                  </div>
                )}

                {corresponsal.direccion && (
                  <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    <span className="font-medium">Dirección:</span>
                    <p className="mt-1">{corresponsal.direccion}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="sm" className="mr-2" />
                Cargando corresponsales...
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay corresponsales
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza agregando tu primer corresponsal.
                </p>
                <Link href="/corresponsales/nuevo" className="btn-primary">
                  Crear Corresponsal
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, corresponsalId: null })}
        onConfirm={handleDelete}
        title="Eliminar Corresponsal"
        message="¿Estás seguro de que quieres eliminar este corresponsal? Esta acción eliminará también todos los casos asociados y no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}