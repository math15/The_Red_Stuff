'use client';

import { useEffect } from 'react';

import { UserActionsService } from '@/lib/user-actions.client';

interface PageViewTrackerProps {
  pageName: string;
  metadata?: Record<string, unknown>;
}

/**
 * Client component that tracks page views when mounted.
 * Should be added to pages to enable analytics.
 */
export function PageViewTracker({ pageName }: PageViewTrackerProps) {
  useEffect(() => {
    // Get current page URL
    const pageUrl =
      typeof window !== 'undefined' ? window.location.pathname : pageName;

    // Track page view with userId and sessionId undefined for now
    // In a real app, these would come from authentication context
    UserActionsService.trackPageView(pageUrl);
  }, [pageName]);

  return null;
}
