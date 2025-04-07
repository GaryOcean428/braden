import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to send lead data to CRM - adapted for existing schema
export async function sendLeadToCRM(leadData) {
  try {
    // First, store the lead in Supabase
    const { data: leadRecord, error: leadError } = await supabase
      .from('leads')
      .insert([{
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone || null,
        message: leadData.message || null,
        service_interest: leadData.services || [],
        source: 'website',
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (leadError) {
      console.error('Error storing lead in Supabase:', leadError);
      throw new Error('Failed to store lead data');
    }

    // Then, send the lead to the CRM API
    const crmApiUrl = 'https://crm7.vercel.app/api/leads';
    const response = await fetch(crmApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message,
        service_interest: leadData.services || [],
        source: 'website',
        metadata: {
          website_lead_id: leadRecord[0].id,
          submission_page: 'contact',
          utm_source: getUtmParameter('utm_source'),
          utm_medium: getUtmParameter('utm_medium'),
          utm_campaign: getUtmParameter('utm_campaign')
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error sending lead to CRM:', errorData);
      throw new Error('Failed to send lead to CRM');
    }

    const result = await response.json();
    
    // Update the lead record with the CRM lead ID for future reference
    if (result.lead_id) {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          metadata: { crm_lead_id: result.lead_id },
          updated_at: new Date().toISOString()
        })
        .eq('id', leadRecord[0].id);
        
      if (updateError) {
        console.error('Error updating lead with CRM ID:', updateError);
      }
    }

    return result;
  } catch (error) {
    console.error('Lead integration error:', error);
    throw error;
  }
}

// Helper function to get UTM parameters from URL
function getUtmParameter(param) {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || null;
  }
  return null;
}
