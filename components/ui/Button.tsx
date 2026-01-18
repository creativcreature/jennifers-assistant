'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'call' | 'quick';
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  icon,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    call: 'btn-call',
    quick: 'quick-action',
  };

  return (
    <button
      className={cn(baseStyles[variant], className)}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// Specialized Call Button
interface CallButtonProps {
  phone: string;
  label?: string;
  className?: string;
}

export function CallButton({ phone, label, className }: CallButtonProps) {
  const formattedPhone = phone.replace(/\D/g, '');
  const displayPhone = phone === '211' ? '211' : phone;

  return (
    <a
      href={`tel:${formattedPhone === '211' ? '211' : `+1${formattedPhone}`}`}
      className={cn('btn-call', className)}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
      {label || `Call ${displayPhone}`}
    </a>
  );
}

// Directions Button
interface DirectionsButtonProps {
  address: string;
  className?: string;
}

export function DirectionsButton({ address, className }: DirectionsButtonProps) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('btn-secondary', className)}
    >
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Get Directions
    </a>
  );
}
