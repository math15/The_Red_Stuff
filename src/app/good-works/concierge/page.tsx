import { ArrowLeft, Calendar, Mail, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default function ConciergePage() {
  return (
    <div className='space-y-10 pb-16'>
      <PageViewTracker pageName='concierge' />

      <section className='rounded-3xl border border-rose-200 bg-gradient-to-br from-[#fff7ed] via-white to-[#f5efe7] p-8 shadow-lg shadow-rose-100/70'>
        <Link
          href='/good-works'
          className='mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Good Works
        </Link>

        <SectionHeader
          kicker='Pastoral Concierge'
          title='Book a 15-minute matching session'
          description="Let us help you find the perfect opportunity to serve. We'll pray with you, understand your heart and capacity, and recommend three aligned opportunities."
        />

        <div className='mt-6 grid gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-rose-100 bg-white/80 p-6'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
              What to expect
            </p>
            <ul className='mt-4 space-y-3 text-sm text-neutral-700'>
              <li className='flex items-start gap-3'>
                <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600'>
                  1
                </span>
                <div>
                  <p className='font-semibold text-neutral-900'>
                    Brief prayer together
                  </p>
                  <p className='text-xs text-neutral-600'>
                    We start by centering ourselves in Christ&apos;s call to
                    serve.
                  </p>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600'>
                  2
                </span>
                <div>
                  <p className='font-semibold text-neutral-900'>
                    Understand your context
                  </p>
                  <p className='text-xs text-neutral-600'>
                    Your location, schedule, skills, and what moves your heart.
                  </p>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600'>
                  3
                </span>
                <div>
                  <p className='font-semibold text-neutral-900'>
                    Curated recommendations
                  </p>
                  <p className='text-xs text-neutral-600'>
                    Three hand-picked opportunities matched to your gifts.
                  </p>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600'>
                  4
                </span>
                <div>
                  <p className='font-semibold text-neutral-900'>
                    Follow-up support
                  </p>
                  <p className='text-xs text-neutral-600'>
                    Text reminders before your first shift and prayer support.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <div className='rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6'>
              <p className='text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700'>
                Schedule a call
              </p>
              <p className='mt-2 text-sm text-neutral-700'>
                Choose your preferred contact method below. We&apos;ll respond
                within 24 hours to schedule your 15-minute session.
              </p>
            </div>

            <div className='space-y-3'>
              <a
                href='mailto:concierge@theredstuff.org?subject=Booking a Matching Session'
                className='flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50'
              >
                <Mail className='h-5 w-5 text-red-600' />
                <div className='text-left'>
                  <p className='text-neutral-900'>Email us</p>
                  <p className='text-xs font-normal text-neutral-600'>
                    concierge@theredstuff.org
                  </p>
                </div>
              </a>

              <a
                href='tel:+1-555-0123'
                className='flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50'
              >
                <Phone className='h-5 w-5 text-red-600' />
                <div className='text-left'>
                  <p className='text-neutral-900'>Call us</p>
                  <p className='text-xs font-normal text-neutral-600'>
                    (555) 123-4567
                  </p>
                </div>
              </a>

              <a
                href='sms:+1-555-0123?body=I%20would%20like%20to%20schedule%20a%20matching%20session'
                className='flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50'
              >
                <MessageCircle className='h-5 w-5 text-red-600' />
                <div className='text-left'>
                  <p className='text-neutral-900'>Text us</p>
                  <p className='text-xs font-normal text-neutral-600'>
                    (555) 123-4567
                  </p>
                </div>
              </a>

              <div className='rounded-xl border border-neutral-200 bg-white p-4'>
                <div className='flex items-start gap-3'>
                  <Calendar className='h-5 w-5 text-red-600' />
                  <div className='text-sm'>
                    <p className='font-semibold text-neutral-900'>
                      Online booking
                    </p>
                    <p className='mt-1 text-xs text-neutral-600'>
                      Coming soon: Book directly through our calendar system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='rounded-3xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-neutral-700'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-amber-700'>
          Prefer to browse on your own?
        </p>
        <p className='mt-2 text-base font-semibold text-neutral-900'>
          No problem! You can explore all opportunities using our live filters.
        </p>
        <Link
          href='/good-works'
          className='mt-4 inline-flex items-center gap-2 rounded-full border border-amber-600 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Good Works
        </Link>
      </div>
    </div>
  );
}
