'use client';

import { useEffect, useState } from 'react';

type NotificationProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // en milisegundos
};

export function Notification({ message, type = 'success', duration = 4000 }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Limpia los parámetros de la URL después de ocultar
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const colorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[type]} flex items-center gap-3 shadow-sm`}>
      <span className="text-xl">{iconMap[type]}</span>
      <p className="font-medium">{message}</p>
    </div>
  );
}