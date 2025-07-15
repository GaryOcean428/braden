import { useEffect } from 'react';
import { setupLeadWebhooks } from './webhooks';
import { useSyncLeads } from './leadSync';

// Hook to initialize all lead synchronization mechanisms
export function useLeadSynchronization() {
  // Set up periodic sync for leads
  useSyncLeads(300000); // Sync every 5 minutes

  // Set up real-time webhooks
  useEffect(() => {
    // Initialize webhook listeners
    const cleanupWebhooks = setupLeadWebhooks();

    // Clean up webhook listeners on unmount
    return () => {
      cleanupWebhooks();
    };
  }, []);
}
