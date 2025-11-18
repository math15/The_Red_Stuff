import Link from 'next/link';
import { notFound } from 'next/navigation';

// Placeholder story data - to be replaced with actual stories from client
const stories = [
  {
    id: '1',
    title: 'Local Teacher Starts Free After-School Tutoring Program',
    description:
      'Sarah Martinez noticed struggling students in her neighborhood and started offering free tutoring in her garage. What began with 3 kids now serves 40 children weekly, helping them catch up and excel in school.',
    fullStory:
      "Sarah Martinez, a middle school teacher in her community, noticed that many students in her neighborhood were falling behind academically. Without access to tutoring services, these children were struggling to keep up with their peers.\n\nInspired by her faith and a desire to serve, Sarah began offering free after-school tutoring sessions in her garage. What started as a small effort with just 3 students has grown into a thriving program that now serves 40 children weekly.\n\nThrough her dedication and the support of volunteers, Sarah has helped countless students catch up and excel in school. Her story demonstrates how one person's commitment to serving others can create lasting impact in a community.",
    quote: {
      text: 'For I was hungry and you gave me something to eat, I was thirsty and you gave me something to drink, I was a stranger and you invited me in',
      reference: 'Matthew 25:35',
    },
  },
  {
    id: '2',
    title: 'Community Garden Feeds 200 Families Monthly',
    description:
      'When the local food bank faced shortages, retired nurse James Chen organized neighbors to transform an empty lot into a thriving community garden. Volunteers now harvest fresh produce that feeds over 200 families each month.',
    fullStory:
      "When the local food bank faced critical shortages during a difficult season, retired nurse James Chen saw an opportunity to make a difference. He organized his neighbors to transform an empty, neglected lot into a thriving community garden.\n\nThrough careful planning and the dedication of volunteers, the garden now produces fresh vegetables and fruits that feed over 200 families each month. The project has not only addressed food insecurity but has also brought the community together, creating a sense of shared purpose and connection.\n\nJames's story shows how practical action, combined with community organizing, can address real needs while building stronger neighborhoods.",
    quote: {
      text: 'Blessed are the peacemakers, for they will be called children of God',
      reference: 'Matthew 5:9',
    },
  },
  {
    id: '3',
    title: 'Teen Creates Care Packages for Homeless Neighbors',
    description:
      'Sixteen-year-old Maya Patel started collecting hygiene items and warm clothing after seeing people in need near her school. Her initiative has now distributed over 500 care packages and inspired a city-wide youth movement.',
    fullStory:
      "Sixteen-year-old Maya Patel noticed people experiencing homelessness near her school and felt called to help. She started by collecting hygiene items and warm clothing from friends and family, creating care packages to distribute.\n\nWhat began as a small personal project has grown into a city-wide youth movement. Maya has now distributed over 500 care packages, and her initiative has inspired other young people to get involved in serving their communities.\n\nMaya's story demonstrates that age is no barrier to making a difference and that compassion, when put into action, can inspire others to join in meaningful service.",
    quote: {
      text: 'Love your neighbor as yourself',
      reference: 'Luke 10:27',
    },
  },
];

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const story = stories.find((s) => s.id === resolvedParams.id);

  if (!story) {
    notFound();
  }

  return (
    <div className='mx-auto w-[92%] max-w-4xl space-y-8 pb-16 pt-8'>
      <Link
        href='/'
        className='inline-flex items-center text-sm font-medium text-neutral-600 transition hover:text-red-700'
      >
        ← Back to Home
      </Link>

      <article className='rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm'>
        <h1 className='text-3xl font-semibold text-neutral-900 md:text-4xl'>
          {story.title}
        </h1>

        <div className='mt-6 space-y-6'>
          <div className='prose prose-sm max-w-none text-neutral-700'>
            {story.fullStory.split('\n\n').map((paragraph, index) => (
              <p key={index} className='mb-4'>
                {paragraph}
              </p>
            ))}
          </div>

          {story.quote && (
            <div className='rounded-xl border-l-4 border-red-600 bg-red-50/50 p-6'>
              <p className='text-base font-medium !text-red-600'>
                &quot;{story.quote.text}&quot;
              </p>
              <p className='mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500'>
                — {story.quote.reference}
              </p>
            </div>
          )}
        </div>

        <div className='mt-8 border-t border-neutral-200 pt-6'>
          <Link
            href='/'
            className='inline-flex items-center rounded-full border border-neutral-300 bg-white px-6 py-2 text-sm font-semibold text-neutral-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700'
          >
            ← Back to Home
          </Link>
        </div>
      </article>
    </div>
  );
}
