import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to send webhook events to CRM
export async function sendWebhookToCRM(eventType, leadData) {
  try {
    const webhookUrl = 'https://crm7.vercel.app/api/webhooks/leads';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret':
          import.meta.env.VITE_WEBHOOK_SECRET || 'default-webhook-secret',
      },
      body: JSON.stringify({
        event_type: eventType,
        lead_data: leadData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error sending webhook to CRM:', errorData);
      throw new Error('Failed to send webhook to CRM');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}

// Function to listen for lead changes in Supabase and send webhooks
export function setupLeadWebhooks() {
  // Listen for inserts
  const insertChannel = supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'leads',
      },
      (payload) => {
        console.log('New lead inserted:', payload);
        sendWebhookToCRM('lead_created', payload.new);
      }
    )
    .subscribe();

  // Listen for updates
  const updateChannel = supabase
    .channel('table-db-changes-update')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'leads',
      },
      (payload) => {
        console.log('Lead updated:', payload);
        sendWebhookToCRM('lead_updated', payload.new);
      }
    )
    .subscribe();

  // Listen for deletes
  const deleteChannel = supabase
    .channel('table-db-changes-delete')
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'leads',
      },
      (payload) => {
        console.log('Lead deleted:', payload);
        sendWebhookToCRM('lead_deleted', payload.old);
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(insertChannel);
    supabase.removeChannel(updateChannel);
    supabase.removeChannel(deleteChannel);
  };
}
