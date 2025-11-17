'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/good-works', label: 'Heed the Call' },
  { href: '/quotations', label: 'Quotations' },
  { href: '/ask', label: 'Ask' },
  { href: '/store', label: 'Store' },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <nav className='fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-[0_-4px_10px_rgba(0,0,0,0.04)] md:hidden'>
      <div className='mx-auto flex max-w-6xl items-center justify-between'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-1 justify-center px-2 py-1 ${
              isActive(link.href)
                ? 'text-red-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
