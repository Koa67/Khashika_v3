'use client';

import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-emerald mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-0 py-3 bg-transparent border-0 border-b-2 border-emerald/30',
          'focus:border-emerald focus:outline-none',
          'text-emerald placeholder:text-anthracite/40',
          'transition-colors duration-300',
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}



























