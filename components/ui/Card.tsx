'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export default function Card({ children, className, elevated = false }: CardProps) {
  return (
    <div className={cn(elevated ? 'card-elevated' : 'card', className)}>
      {children}
    </div>
  );
}

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ReactNode;
}

export function CardHeader({ title, subtitle, badge, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-full bg-falcons-red/20 flex items-center justify-center text-falcons-red flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && (
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
          )}
        </div>
      </div>
      {badge && <div>{badge}</div>}
    </div>
  );
}

// Card Content
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('text-base', className)} style={{ color: 'var(--text-secondary)' }}>{children}</div>;
}

// Card Footer
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t flex flex-col gap-3', className)} style={{ borderColor: 'var(--border-color)' }}>
      {children}
    </div>
  );
}
