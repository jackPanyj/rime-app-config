

import { useEffect } from 'react';
import { useConfigStore } from '@/stores/config-store';

/**
 * Guard against losing unsaved changes.
 * Shows browser beforeunload dialog when there are unsaved changes.
 */
export function useDirtyGuard() {
  const isDirty = useConfigStore((s) => s.isDirty);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty()) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  return isDirty;
}
