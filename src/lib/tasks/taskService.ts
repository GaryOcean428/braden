import { supabase } from "@/integrations/supabase/client";

// Get staff details from the database
export const getStaffDetails = async (staffId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', staffId)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      email: data.email,
      name: `${data.first_name} ${data.last_name}`,
      role: data.role
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
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name')
      .eq('id', leadId)
      .single();
    
    if (leadError) {
      console.error("Error fetching lead:", leadError);
      throw new Error("Lead not found");
    }
    
    // Create the task
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        lead_id: leadId,
        service_type: serviceType,
        status: 'pending',
        title: `Follow up with ${leadData.first_name} ${leadData.last_name}`,
        description: `Follow up on ${serviceType} inquiry`,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
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
    // Check if the tasks table exists
    const { error: tasksExistError } = await supabase
      .from('tasks')
      .select('count(*)', { count: 'exact', head: true });
    
    // If there's an error, the table might not exist
    if (tasksExistError && tasksExistError.code === '42P01') {
      console.log("Tasks table doesn't exist, creating it");
      
      // Create the tasks table
      const { error: createTasksError } = await supabase.rpc('create_tasks_table');
      
      if (createTasksError) {
        console.error("Error creating tasks table:", createTasksError);
        throw createTasksError;
      }
    }
    
    // Check if the leads table exists
    const { error: leadsExistError } = await supabase
      .from('leads')
      .select('count(*)', { count: 'exact', head: true });
    
    // If there's an error, the table might not exist
    if (leadsExistError && leadsExistError.code === '42P01') {
      console.log("Leads table doesn't exist, creating it");
      
      // Create the leads table
      const { error: createLeadsError } = await supabase.rpc('create_leads_table');
      
      if (createLeadsError) {
        console.error("Error creating leads table:", createLeadsError);
        throw createLeadsError;
      }
    }
    
    // Check if the users table exists
    const { error: usersExistError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact', head: true });
    
    // If there's an error, the table might not exist
    if (usersExistError && usersExistError.code === '42P01') {
      console.log("Users table doesn't exist, creating it");
      
      // Create the users table
      const { error: createUsersError } = await supabase.rpc('create_users_table');
      
      if (createUsersError) {
        console.error("Error creating users table:", createUsersError);
        throw createUsersError;
      }
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
