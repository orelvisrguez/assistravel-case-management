'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { debounce } from '@/lib/utils';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const debouncedSearch = debounce((query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Ver Casos', href: '/casos', icon: '📋' },
    { name: 'Nuevo Caso', href: '/casos/nuevo', icon: '➕' },
    ...(user?.role === 'admin' ? [
      { name: 'Corresponsales', href: '/corresponsales', icon: '🏢' }
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="flex items-center">
              <div className="bg-primary-600 text-white p-2 rounded-lg mr-3">
                <span className="font-bold text-lg">AT</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                ASSISTRAVEL
              </span>
            </Link>
          </div>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-field pl-10"
                placeholder="Buscar casos por número, país o corresponsal..."
              />
            </div>
          </div>

          {/* Navegación - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Usuario y menú - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {user?.nombre} {user?.apellido}
              </span>
              {user?.role === 'admin' && (
                <span className="badge-info text-xs">Admin</span>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Barra de búsqueda - Móvil */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="input-field pl-10"
                  placeholder="Buscar casos..."
                />
              </div>
            </div>

            {/* Navegación - Móvil */}
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Usuario - Móvil */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user?.nombre} {user?.apellido}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="badge-info text-xs">Admin</span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}