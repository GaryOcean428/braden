
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service_type?: string;
  created_at: string;
  updated_at: string;
  company?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface Email {
  id: string;
  subject: string;
  recipient: string;
  status: string;
}

export const useSiteEditorData = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: leadsData } = await supabase.from('leads').select('*');
      const { data: clientsData } = await supabase.from('clients').select('*');

      // Mock data for entities without tables
      const staffData = [
        { id: '1', name: 'John Doe', email: 'john@example.com', position: 'Manager' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', position: 'Developer' }
      ];
      const tasksData = [
        { id: '1', title: 'Complete Project', description: 'Finish the project by Friday', status: 'In Progress' },
        { id: '2', title: 'Client Meeting', description: 'Meet with client to discuss requirements', status: 'Completed' }
      ];
      const emailsData = [
        { id: '1', subject: 'Welcome Email', recipient: 'customer@example.com', status: 'Sent' },
        { id: '2', subject: 'Follow-up', recipient: 'prospect@example.com', status: 'Draft' }
      ];

      setLeads(leadsData ? leadsData.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        service: lead.service_type || 'General'
      })) : []);
      
      setClients(clientsData ? clientsData.map((client: ClientData) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        ...(client.company !== undefined && { company: client.company })
      })) : []);
      
      setStaff(staffData);
      setTasks(tasksData);
      setEmails(emailsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    try {
      const { data, error } = await supabase.from('leads').insert([{ name: 'New Lead', email: 'new@lead.com', service_type: 'Service' }]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        const newLead: Lead = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          service: data[0].service_type || 'General'
        };
        setLeads((prev) => [...prev, newLead]);
        toast.success('Lead added successfully');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  const handleAddClient = async () => {
    try {
      const { data, error } = await supabase.from('clients').insert([{ name: 'New Client', email: 'new@client.com' }]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        const newClient: Client = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          ...(data[0].company && { company: data[0].company })
        };
        setClients((prev) => [...prev, newClient]);
        toast.success('Client added successfully');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const handleAddStaff = () => {
    const newStaff = {
      id: `${staff.length + 1}`,
      name: 'New Staff',
      email: 'new@staff.com',
      position: 'Position'
    };
    setStaff((prev) => [...prev, newStaff]);
    toast.success('Staff member added successfully');
  };

  const handleAddTask = () => {
    const newTask = {
      id: `${tasks.length + 1}`,
      title: 'New Task',
      description: 'Task Description',
      status: 'Pending'
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success('Task added successfully');
  };

  const handleAddEmail = () => {
    const newEmail = {
      id: `${emails.length + 1}`,
      subject: 'New Email',
      recipient: 'recipient@domain.com',
      status: 'Draft'
    };
    setEmails((prev) => [...prev, newEmail]);
    toast.success('Email added successfully');
  };

  return {
    loading,
    leads,
    clients,
    staff,
    tasks,
    emails,
    handleAddLead,
    handleAddClient,
    handleAddStaff,
    handleAddTask,
    handleAddEmail,
  };
};
