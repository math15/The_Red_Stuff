import { SectionHeader } from '@/components/ui/SectionHeader';

const pillars = [
  {
    title: 'Cope & Understand',
    description:
      'Daily Jesus quotes paired with curated news briefs so believers can lament, pray, and process.',
  },
  {
    title: 'Act & Transform',
    description:
      'Every insight is linked to a volunteer opportunity, micro-grant, or measurable good work.',
  },
  {
    title: 'Measure & Multiply',
    description:
      'Impact dashboards show conversions from quote reading to action-taking, guiding future improvements.',
  },
];

export default function AboutPage() {
  return (
    <div className='mx-auto w-[92%] max-w-6xl space-y-10 pb-16'>
      <section className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-8 shadow-lg'>
        <SectionHeader
          kicker='Mission'
          title='Wisdom to Action'
          description='The Red Stuff is a spiritual action platform. We exist to match the words of Jesus with tangible opportunities so people can be the light of the world.'
        />
        <p className='mt-4 text-sm text-neutral-700'>
          Founded by pastors, civic technologists, and community organizers, we
          help followers of Jesus move from overwhelmed to activated. The beta
          you are using demonstrates the new UI system, Supabase-powered
          backend, and By Their Fruits explorer.
        </p>
      </section>

      <div className='grid gap-4 md:grid-cols-3'>
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className='rounded-2xl border border-neutral-200 bg-[#ffffff] p-5 text-sm text-neutral-700'
          >
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-600'>
              Pillar
            </p>
            <h3 className='mt-2 text-lg font-semibold text-neutral-900'>
              {pillar.title}
            </h3>
            <p className='mt-1 text-neutral-600'>{pillar.description}</p>
          </article>
        ))}
      </div>

      <div className='rounded-3xl border border-neutral-200 bg-[#ffffff] p-6 text-sm text-neutral-700'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-700'>
          What’s next
        </p>
        <p className='mt-2 text-lg font-semibold text-neutral-900'>
          Integrations with NewsAPI, VolunteerMatch, and push notifications roll
          out over the next three sprints.
        </p>
        <p className='mt-1 text-neutral-600'>
          Until then, we’re curating opportunities manually and collecting
          feedback from early adopters like you. Email{' '}
          <a
            className='text-neutral-700 underline'
            href='mailto:hello@theredstuff.org'
          >
            hello@theredstuff.org
          </a>{' '}
          to partner.
        </p>
      </div>
    </div>
  );
}
