import { QuoteToActionMap } from '@/types';

export const quoteToActionMap: QuoteToActionMap = {
  hunger: ['hunger', 'homelessness'],
  peace: ['peace', 'justice', 'community'],
  children: ['children', 'education', 'youth'],
  education: ['education', 'youth', 'children'],
  healthcare: ['healthcare', 'family'],
  homelessness: ['homelessness', 'hunger'],
  community: ['community', 'family'],
  family: ['family', 'community', 'hope'],
  healing: ['healthcare', 'family'],
  mercy: ['prison', 'mercy', 'justice'],
  environment: ['environment', 'community'],
  justice: ['justice', 'peace'],
  hope: ['hope', 'family', 'community'],
  faith: ['community', 'family', 'education'],
};
