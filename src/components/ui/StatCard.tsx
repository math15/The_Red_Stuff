interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: 'red' | 'green' | 'amber';
}

const toneMap: Record<
  NonNullable<StatCardProps['tone']>,
  { bg: string; text: string; border: string }
> = {
  red: {
    bg: 'from-red-50 to-white',
    text: 'text-red-700',
    border: 'border-red-100',
  },
  green: {
    bg: 'from-green-50 to-white',
    text: 'text-green-700',
    border: 'border-green-100',
  },
  amber: {
    bg: 'from-amber-50 to-white',
    text: 'text-amber-700',
    border: 'border-amber-100',
  },
};

export function StatCard({
  label,
  value,
  helper,
  tone = 'red',
}: StatCardProps) {
  const toneClasses = toneMap[tone];

  return (
    <div
      className={`rounded-2xl border ${toneClasses.border} bg-gradient-to-br ${toneClasses.bg} p-5 shadow-sm`}
    >
      <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500'>
        {label}
      </p>
      <p className={`mt-2 text-3xl font-semibold ${toneClasses.text}`}>
        {value}
      </p>
      {helper ? (
        <p className='mt-1 text-sm text-neutral-600'>{helper}</p>
      ) : null}
    </div>
  );
}
