'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'new' | 'sale' | 'custom';
  className?: string;
}

export default function Badge({ children, variant = 'custom', className = '' }: BadgeProps) {
  const variants = {
    new: 'bg-emerald text-cream',
    sale: 'bg-gold text-emerald',
    custom: 'bg-anthracite text-cream',
  };
  
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        'font-body',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}




























