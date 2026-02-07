import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useActor } from './useActor';

export function usePageViewTracking() {
  const router = useRouterState();
  const { actor } = useActor();
  const currentPath = router.location.pathname;

  useEffect(() => {
    // Non-blocking analytics tracking
    if (actor) {
      // Fire and forget - don't await or block rendering
      Promise.resolve().then(() => {
        // Future: Call analytics tracking method when available
        // actor.trackPageView(currentPath);
      });
    }
  }, [currentPath, actor]);
}
