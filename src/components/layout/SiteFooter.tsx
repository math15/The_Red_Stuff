import { Facebook, Instagram, Mail, Share2 } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Explore',
    links: [
      { href: '/good-works', label: 'By Their Fruits' },
      { href: '/quotations', label: 'Quotations' },
      { href: '/ask', label: 'Ask a Question' },
      { href: '/store', label: 'Store' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about', label: 'Mission' },
      { href: '/about#team', label: 'Team' },
      { href: '/about#partners', label: 'Partners' },
      { href: '/about#contact', label: 'Contact' },
    ],
  },
];

const socialLinks = [
  { href: 'mailto:hello@theredstuff.org', icon: Mail, label: 'Email' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://share.theredstuff.org', icon: Share2, label: 'Share' },
];

export function SiteFooter() {
  return (
    <footer className='border-t border-rose-200 bg-[#f7ede0] text-sm text-neutral-700'>
      <div className='mx-auto grid w-11/12 max-w-6xl gap-8 py-12 md:grid-cols-3'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-red-600'>
            Wisdom → Action
          </p>
          <p className='mt-3 text-lg font-semibold text-neutral-900'>
            Turning the words of Jesus into measurable good works.
          </p>
          <p className='mt-3 text-sm text-neutral-600'>
            Daily wisdom matched with timely opportunities to feed, heal, and
            reconcile our communities.
          </p>
          <div className='mt-4 flex gap-3'>
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel='noreferrer'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-700 transition hover:-translate-y-0.5 hover:bg-white/70'
                aria-label={label}
              >
                <Icon className='h-4 w-4' />
              </Link>
            ))}
          </div>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title}>
            <p className='text-xs font-semibold uppercase tracking-widest text-red-600'>
              {column.title}
            </p>
            <ul className='mt-3 space-y-2'>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-neutral-700 transition hover:text-red-700'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='border-t border-rose-200 bg-[#f6e4d2] py-4 text-center text-xs text-neutral-600'>
        © {new Date().getFullYear()} The Red Stuff. Built with prayer and
        open-source code.
      </div>
    </footer>
  );
}
