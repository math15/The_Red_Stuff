import { CurrentEvent } from '@/types';

export const currentEvents: CurrentEvent[] = [
  {
    id: 'event-homelessness-urban',
    headline: 'Urban centers report record homelessness during winter storms',
    summary:
      'Shelters in the Midwest and Northeast are operating at 115% capacity amid sub-zero wind chills.',
    category: 'homelessness',
    region: 'United States',
    published_at: '2025-01-15T08:00:00.000Z',
    related_quote_ids: ['quote-matthew-25-40'],
    related_opportunity_ids: ['op-001', 'op-002', 'op-012'],
  },
  {
    id: 'event-education-gap',
    headline:
      'Reading scores lag two grade levels for low-income elementary students',
    summary:
      'Districts cite volunteer shortages, with 600+ virtual tutoring slots remaining empty nationwide.',
    category: 'education',
    region: 'United States',
    published_at: '2025-01-11T09:00:00.000Z',
    related_quote_ids: ['quote-matthew-19-14', 'quote-matthew-9-37'],
    related_opportunity_ids: ['op-003', 'op-009'],
  },
  {
    id: 'event-water-quality',
    headline:
      'Microplastics surge in coastal waterways following extreme rains',
    summary:
      'Environmental scientists urge rapid cleanup efforts before spring salmon migration in the Pacific Northwest.',
    category: 'environment',
    region: 'Pacific Northwest',
    published_at: '2025-01-09T12:00:00.000Z',
    related_quote_ids: ['quote-matthew-5-14'],
    related_opportunity_ids: ['op-007', 'op-010'],
  },
  {
    id: 'event-hospital-capacity',
    headline: 'Regional hospitals seek more family support volunteers',
    summary:
      'Nurses spend up to 30% of their shift coordinating family needs amid respiratory illness surge.',
    category: 'healthcare',
    region: 'Southeast',
    published_at: '2025-01-18T14:00:00.000Z',
    related_quote_ids: ['quote-luke-10-9', 'quote-matthew-5-4'],
    related_opportunity_ids: ['op-005', 'op-011'],
  },
];
