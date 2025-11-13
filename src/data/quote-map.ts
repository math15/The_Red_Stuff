import { QuoteToActionMap } from '@/types';

export const quoteToActionMap: QuoteToActionMap = {
  hunger: ['hunger', 'homelessness'],
  peace: ['peace', 'justice', 'community'],
  children: ['children', 'education', 'youth'],
  education: ['education', 'youth', 'children'],
  healthcare: ['healthcare', 'family'],
  homelessness: ['homelessness', 'hunger'],
  community: ['community', 'family'],
  family: ['family', 'community', 'healthcare'],
  healing: ['healthcare', 'family'],
  mercy: ['prison', 'justice', 'community'],
  environment: ['environment', 'community'],
  justice: ['justice', 'peace'],
  hope: ['healthcare', 'family', 'community'],
  faith: ['community', 'family', 'education'],
};
