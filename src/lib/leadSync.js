import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to synchronize lead data between website and CRM
export async function syncLeadsWithCRM() {
  try {
    // Get all leads that don't have a CRM lead ID yet
    const { data: unsyncedLeads, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .is('crm_lead_id', null);

    if (fetchError) {
      console.error('Error fetching unsynced leads:', fetchError);
      return { success: false, error: fetchError };
    }

    if (!unsyncedLeads || unsyncedLeads.length === 0) {
      return { success: true, message: 'No leads to sync' };
    }

    // Process each unsynced lead
    const results = await Promise.all(
      unsyncedLeads.map(async (lead) => {
        try {
          // Send lead to CRM API
          const crmApiUrl = 'https://crm7.vercel.app/api/leads';
          const response = await fetch(crmApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: lead.first_name,
              last_name: lead.last_name,
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              job_title: lead.job_title,
              message: lead.message,
              service_interest: lead.service_interest,
              source: 'website',
              tags: lead.tags || [],
              metadata: {
                website_lead_id: lead.id,
                submission_page: lead.submission_page || 'contact',
                utm_source: lead.utm_source,
                utm_medium: lead.utm_medium,
                utm_campaign: lead.utm_campaign
              }
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to sync lead: ${JSON.stringify(errorData)}`);
          }

          const result = await response.json();
          
          // Update the lead record with the CRM lead ID
          if (result.lead_id) {
            const { error: updateError } = await supabase
              .from('leads')
              .update({ crm_lead_id: result.lead_id })
              .eq('id', lead.id);
              
            if (updateError) {
              console.error('Error updating lead with CRM ID:', updateError);
              return { id: lead.id, success: false, error: updateError };
            }
          }

          return { id: lead.id, success: true, crm_lead_id: result.lead_id };
        } catch (error) {
          console.error(`Error syncing lead ${lead.id}:`, error);
          return { id: lead.id, success: false, error };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    return { 
      success: true, 
      message: `Synced ${successCount} of ${unsyncedLeads.length} leads`,
      results
    };
  } catch (error) {
    console.error('Lead synchronization error:', error);
    return { success: false, error };
  }
}

// Hook to periodically sync leads
export function useSyncLeads(interval = 300000) { // Default: 5 minutes
  useEffect(() => {
    // Initial sync
    syncLeadsWithCRM();
    
    // Set up interval for periodic syncing
    const syncInterval = setInterval(() => {
      syncLeadsWithCRM();
    }, interval);
    
    // Clean up interval on unmount
    return () => clearInterval(syncInterval);
  }, [interval]);
}
