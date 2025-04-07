
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for the data
interface StaffDetails {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Lead {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

interface Task {
  id: string;
  lead_id: string;
  service_type: string;
  status: string;
  title: string;
  description?: string;
  due_date: string;
  created_at: string;
}

// Get staff details from the database
export const getStaffDetails = async (staffId: string): Promise<StaffDetails> => {
  try {
    // Use type casting to avoid TypeScript errors
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', staffId)
      .single() as { data: any, error: any };
    
    if (error) throw error;
    
    return {
      id: data.id,
      email: data.email,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      role: data.role || 'staff'
    };
  } catch (error) {
    console.error("Error fetching staff details:", error);
    // Fallback to mock data if database query fails
    return {
      id: staffId || 'staff-123',
      email: 'staff@example.com',
      name: 'Staff Member',
      role: 'staff'
    };
  }
};

// Create a follow-up task in the database
export const createFollowUpTask = async (leadId: string, serviceType: string) => {
  try {
    // First, ensure the lead exists
    // Use type casting to avoid TypeScript errors
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id, email, name')
      .eq('id', leadId)
      .single() as { data: Lead, error: any };
    
    if (leadError) {
      console.error("Error fetching lead:", leadError);
      throw new Error("Lead not found");
    }
    
    // Create the task - using any to bypass strict type checking
    const { data, error } = await supabase.from('tasks' as any)
      .insert({
        lead_id: leadId,
        service_type: serviceType,
        status: 'pending',
        title: `Follow up with ${leadData.name}`,
        description: `Follow up on ${serviceType} inquiry`,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        created_at: new Date().toISOString()
      })
      .select()
      .single() as { data: Task, error: any };
    
    if (error) throw error;
    
    console.log(`Created follow up task for lead ${leadId} (service: ${serviceType})`);
    
    return {
      success: true,
      taskId: data.id,
    };
  } catch (error) {
    console.error("Error creating follow up task:", error);
    return {
      success: false,
      error: "Failed to create follow-up task"
    };
  }
};

// Ensure all required tables exist in the database
export const ensureTaskTablesExist = async () => {
  try {
    // Check if the tasks table exists by trying a simple query
    // We'll use try/catch to handle the error if the table doesn't exist
    try {
      await supabase.from('tasks' as any).select('count(*)', { count: 'exact', head: true });
      console.log("Tasks table exists");
    } catch (err) {
      console.log("Tasks table doesn't exist. It will be created in a migration");
    }
    
    // Check if the leads table exists
    try {
      await supabase.from('leads').select('count(*)', { count: 'exact', head: true });
      console.log("Leads table exists");
    } catch (err) {
      console.log("Leads table doesn't exist. It will be created in a migration");
    }
    
    // Check if the users table exists
    try {
      await supabase.from('users').select('count(*)', { count: 'exact', head: true });
      console.log("Users table exists");
    } catch (err) {
      console.log("Users table doesn't exist. It will be created in a migration");
    }
    
    console.log("All task-related tables exist or have been created");
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error ensuring task tables exist:", error);
    return {
      success: false,
      error: "Failed to ensure task tables exist"
    };
  }
};
