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
    href: '/nfl',
    label: 'NFL',
    icon: (active: boolean) => (
      <svg className="nav-icon" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
      <div className="max-w-screen-lg mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center min-h-[56px] min-w-[64px] px-2 transition-all duration-200"
              style={{
                color: isActive ? 'var(--falcons-red)' : 'var(--text-muted)',
              }}
            >
              {item.icon(isActive)}
              <span className="text-xs font-medium mt-1">{item.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--falcons-red)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
