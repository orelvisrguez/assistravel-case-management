'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import type { RegisterFormData } from '@/lib/validations';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function RegisterPage() {
  const { signUp, loading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await signUp(data.email, data.password, {
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
      });
      // Redirigir al login con mensaje de éxito
      router.push('/auth/login?message=account-created');
    } catch (error) {
      // Error ya manejado por el store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">AT</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestión de Casos ASSISTRAVEL
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={clearError}
              className="mb-4"
            />
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre *
                </label>
                <input
                  {...register('nombre')}
                  type="text"
                  className="input-field mt-1"
                  placeholder="Juan"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido *
                </label>
                <input
                  {...register('apellido')}
                  type="text"
                  className="input-field mt-1"
                  placeholder="Pérez"
                />
                {errors.apellido && (
                  <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="input-field mt-1"
                placeholder="usuario@assistravel.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                Rol *
              </label>
              <select
                {...register('rol')}
                className="input-field mt-1"
              >
                <option value="">Seleccionar rol</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              {errors.rol && (
                <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña *
              </label>
              <div className="relative mt-1">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              Crear Cuenta
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}