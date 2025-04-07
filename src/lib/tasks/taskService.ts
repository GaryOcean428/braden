import { supabase } from '@/integrations/supabase/client';
import { ServiceType } from '@/components/contact/types';

// Staff assignment logic based on service type
const getAssignedStaffForService = async (serviceType: ServiceType): Promise<string | null> => {
  // Query staff members who handle this service type
  const { data, error } = await supabase
    .from('staff')
    .select('id, email, name, service_specialties')
    .contains('service_specialties', [serviceType])
    .eq('active', true)
    .order('last_assigned_at', { ascending: true })
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error finding staff for assignment:', error);
    // Fallback to admin if no specific staff found
    const { data: adminData } = await supabase
      .from('staff')
      .select('id, email')
      .eq('role', 'admin')
      .limit(1);
      
    return adminData && adminData.length > 0 ? adminData[0].id : null;
  }

  // Update the last_assigned_at timestamp for this staff member
  await supabase
    .from('staff')
    .update({ last_assigned_at: new Date().toISOString() })
    .eq('id', data[0].id);

  return data[0].id;
};

// Create a task for follow-up
export const createFollowUpTask = async (leadId: string, serviceType: ServiceType, dueDate?: Date) => {
  try {
    // Get the appropriate staff member to assign this task to
    const assignedStaffId = await getAssignedStaffForService(serviceType);
    
    if (!assignedStaffId) {
      throw new Error('No staff available for assignment');
    }
    
    // Set due date to 24 hours from now if not provided
    const taskDueDate = dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Create the task
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          lead_id: leadId,
          assigned_to: assignedStaffId,
          task_type: 'lead_follow_up',
          status: 'pending',
          priority: 'high',
          due_date: taskDueDate.toISOString(),
          description: `Follow up with lead regarding ${serviceType} services`,
        }
      ])
      .select();
      
    if (error) throw error;
    
    return { success: true, taskId: data?.[0]?.id };
  } catch (error) {
    console.error('Error creating follow-up task:', error);
    return { success: false, error };
  }
};

// Get staff details by ID
export const getStaffDetails = async (staffId: string) => {
  const { data, error } = await supabase
    .from('staff')
    .select('id, email, name, role')
    .eq('id', staffId)
    .single();
    
  if (error) {
    console.error('Error fetching staff details:', error);
    return null;
  }
  
  return data;
};

// Create necessary tables if they don't exist
export const ensureTaskTablesExist = async () => {
  // Check if staff table exists
  const { error: staffCheckError } = await supabase
    .from('staff')
    .select('id')
    .limit(1);
    
  if (staffCheckError && staffCheckError.code === '42P01') { // Table doesn't exist
    // Create staff table
    const createStaffTable = `
      CREATE TABLE IF NOT EXISTS staff (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'staff',
        service_specialties TEXT[] NOT NULL DEFAULT '{}',
        active BOOLEAN NOT NULL DEFAULT true,
        last_assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Execute via RPC (requires appropriate permissions)
    await supabase.rpc('execute_sql', { sql: createStaffTable });
    
    // Insert default admin
    await supabase
      .from('staff')
      .insert([
        {
          name: 'Admin User',
          email: 'admin@braden.com.au',
          role: 'admin',
          service_specialties: ['apprenticeship', 'traineeship', 'recruitment', 'technology', 'compliance', 'mentoring', 'future_services'],
        }
      ]);
  }
  
  // Check if tasks table exists
  const { error: tasksCheckError } = await supabase
    .from('tasks')
    .select('id')
    .limit(1);
    
  if (tasksCheckError && tasksCheckError.code === '42P01') { // Table doesn't exist
    // Create tasks table
    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lead_id UUID REFERENCES leads(id),
        assigned_to UUID REFERENCES staff(id),
        task_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        description TEXT,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Execute via RPC (requires appropriate permissions)
    await supabase.rpc('execute_sql', { sql: createTasksTable });
  }
  
  return { success: true };
};
