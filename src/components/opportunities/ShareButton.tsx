'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

import { UserActionsService } from '@/lib/user-actions.client';

interface ShareOpportunityButtonProps {
  title: string;
  opportunityId?: string;
}

export function ShareOpportunityButton({
  title,
  opportunityId,
}: ShareOpportunityButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const hasNativeShare =
      typeof navigator !== 'undefined' && 'share' in navigator;

    // Track share action
    if (opportunityId) {
      UserActionsService.trackShare(
        'opportunity',
        opportunityId,
        hasNativeShare ? 'native' : 'clipboard'
      );
    }

    if (hasNativeShare) {
      try {
        await navigator.share({
          title,
          text: `Join me in responding to this opportunity: ${title}`,
          url,
        });
      } catch (error) {
        // no-op
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      // no-op
    }
  };

  return (
    <button
      type='button'
      onClick={handleShare}
      className='inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400'
    >
      {copied ? <Check className='h-4 w-4' /> : <Share2 className='h-4 w-4' />}
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
