import { BrainCircuit, MailQuestion, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { QuestionMatcher } from '@/components/ask/QuestionMatcher';
import { SectionHeader } from '@/components/ui/SectionHeader';

const prompts = [
  {
    icon: BrainCircuit,
    title: 'Ask about purpose',
    description:
      '“How do I respond to burnout?” “Where is Jesus in this headline?”',
  },
  {
    icon: MailQuestion,
    title: 'Submit a crisis or lament',
    description:
      'Share a news story or personal burden. Our pastoral team pairs it with Scripture + action.',
  },
  {
    icon: Sparkles,
    title: 'Request prayer + accountability',
    description:
      'Opt in to weekly nudges after you commit to a volunteer opportunity.',
  },
];

export default function AskPage() {
  return (
    <div className='space-y-10 pb-16'>
      <PageViewTracker pageName='ask' />
      <section className='rounded-3xl border border-rose-200 bg-gradient-to-br from-[#fef6ff] via-white to-[#f2edff] p-8 shadow-lg shadow-rose-100/70'>
        <SectionHeader
          kicker='Ask & Receive'
          title='Bring your hardest questions'
          description='Submit your questions, headlines, or personal burdens and get matched to a word of Jesus plus a practical response.'
        />
      </section>

      <QuestionMatcher />

      <div className='grid gap-4 md:grid-cols-3'>
        {prompts.map((prompt) => (
          <article
            key={prompt.title}
            className='rounded-2xl border border-rose-100 bg-white/90 p-5 text-sm text-neutral-700'
          >
            <prompt.icon className='h-6 w-6 text-red-600' />
            <h3 className='mt-3 text-lg font-semibold text-neutral-900'>
              {prompt.title}
            </h3>
            <p className='mt-1 text-neutral-600'>{prompt.description}</p>
          </article>
        ))}
      </div>

      <div className='rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 text-sm text-neutral-700'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700'>
          Want early access?
        </p>
        <p className='mt-2 text-lg font-semibold text-neutral-900'>
          Join the beta list for conversational “Ask” experiences.
        </p>
        <Link
          href='https://theredstuff.org/beta'
          className='mt-3 inline-flex items-center rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/40'
        >
          Reserve my spot
        </Link>
      </div>
    </div>
  );
}
