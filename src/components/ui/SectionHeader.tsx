interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {kicker ? (
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-red-600'>
          {kicker}
        </p>
      ) : null}
      <h2 className='mt-2 text-2xl font-semibold text-neutral-900 md:text-3xl'>
        {title}
      </h2>
      {description ? (
        <p className='mt-3 text-sm text-neutral-600 md:text-base'>
          {description}
        </p>
      ) : null}
    </div>
  );
}
