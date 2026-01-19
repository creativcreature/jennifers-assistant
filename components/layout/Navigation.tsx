'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'Chat',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    href: '/story',
    label: 'My Story',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    href: '/nfl',
    label: 'NFL',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        {/* Football shape */}
        <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)" />
        {/* Laces */}
        <line x1="12" y1="8" x2="12" y2="16" strokeLinecap="round" />
        <line x1="9" y1="10" x2="15" y2="10" strokeLinecap="round" />
        <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" />
        <line x1="9" y1="14" x2="15" y2="14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/actions',
    label: 'Actions',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: '/resources',
    label: 'Resources',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        {/* Shopping bag / groceries icon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    href: '/info',
    label: 'My Info',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t safe-bottom z-50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-screen-lg mx-auto flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200"
              style={{
                color: isActive ? 'white' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--falcons-red)' : 'transparent',
              }}
              title={item.label}
            >
              {item.icon(isActive)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
