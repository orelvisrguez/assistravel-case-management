'use client';

import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-400',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-400',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
    iconColor: 'text-blue-400',
  },
};

export default function Alert({ type = 'info', title, message, onClose, className }: AlertProps) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div className={cn(
      'border rounded-lg p-4',
      style.container,
      className
    )}>
      <div className="flex">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', style.iconColor)} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'ml-auto flex-shrink-0 p-1 rounded-md transition-colors',
              type === 'success' ? 'hover:bg-green-100' :
              type === 'error' ? 'hover:bg-red-100' :
              type === 'warning' ? 'hover:bg-yellow-100' : 'hover:bg-blue-100'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}