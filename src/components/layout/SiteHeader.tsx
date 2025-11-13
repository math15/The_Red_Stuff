'use client';

import { Flame, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/good-works', label: 'By Their Fruits' },
  { href: '/quotations', label: 'Quotations' },
  { href: '/ask', label: 'Ask' },
  { href: '/store', label: 'Store' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className='sticky top-0 z-40 border-b border-rose-200 bg-[#fffaf3]/90 backdrop-blur'>
      <div className='mx-auto flex w-11/12 max-w-6xl items-center justify-between py-4'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold text-red-700'
        >
          <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600'>
            <Flame className='h-5 w-5' strokeWidth={1.75} />
          </span>
          <div className='flex flex-col leading-tight'>
            <span>The Red Stuff</span>
            <span className='text-xs font-normal uppercase tracking-widest text-neutral-500'>
              Wisdom → Action
            </span>
          </div>
        </Link>

        <nav className='hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-red-700 ${
                isActive(link.href) ? 'text-red-700' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='hidden md:flex'>
          <Link
            href='/good-works'
            className='rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:bg-green-600'
          >
            Find Good Works
          </Link>
        </div>

        <button
          type='button'
          className='inline-flex items-center justify-center rounded-full border border-red-200 p-2 text-red-700 md:hidden'
          aria-label='Toggle navigation menu'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </button>
      </div>

      {isOpen ? (
        <div className='border-t border-rose-100 bg-[#fffdf7] px-6 py-4 md:hidden'>
          <nav className='flex flex-col gap-4 text-sm font-semibold text-neutral-700'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-full px-4 py-2 ${
                  isActive(link.href)
                    ? 'bg-red-100 text-red-700'
                    : 'hover:bg-rose-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href='/good-works'
              onClick={() => setIsOpen(false)}
              className='rounded-full bg-green-700 px-4 py-2 text-center font-semibold text-white'
            >
              Find Good Works
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
