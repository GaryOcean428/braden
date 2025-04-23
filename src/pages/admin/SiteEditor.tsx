
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LeadsCard from '@/components/admin/SiteEditor/LeadsCard';
import ClientsCard from '@/components/admin/SiteEditor/ClientsCard';
import StaffCard from '@/components/admin/SiteEditor/StaffCard';
import TasksCard from '@/components/admin/SiteEditor/TasksCard';
import EmailsCard from '@/components/admin/SiteEditor/EmailsCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define interfaces for the data types
interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Email {
  id: string;
  subject: string;
  recipient: string;
  status: string;
}

const SiteEditor: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: leadsData } = await supabase.from('leads').select('*');
      const { data: clientsData } = await supabase.from('clients').select('*');

      // For tables that don't exist in the database, we'll use mock data
      // instead of querying non-existent tables
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

      setLeads(leadsData || []);
      setClients(clientsData || []);
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
      const { data, error } = await supabase.from('leads').insert([{ name: 'New Lead', email: 'new@lead.com', service: 'Service' }]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setLeads([...leads, data[0] as Lead]);
        toast.success('Lead added successfully');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  const handleAddClient = async () => {
    try {
      const { data, error } = await supabase.from('clients').insert([{ name: 'New Client', email: 'new@client.com', company: 'Company' }]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setClients([...clients, data[0] as Client]);
        toast.success('Client added successfully');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  // For the mock data, we'll just add to the state directly
  const handleAddStaff = () => {
    const newStaff = {
      id: `${staff.length + 1}`,
      name: 'New Staff',
      email: 'new@staff.com',
      position: 'Position'
    };
    setStaff([...staff, newStaff]);
    toast.success('Staff member added successfully');
  };

  const handleAddTask = () => {
    const newTask = {
      id: `${tasks.length + 1}`,
      title: 'New Task',
      description: 'Task Description',
      status: 'Pending'
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
  };

  const handleAddEmail = () => {
    const newEmail = {
      id: `${emails.length + 1}`,
      subject: 'New Email',
      recipient: 'recipient@domain.com',
      status: 'Draft'
    };
    setEmails([...emails, newEmail]);
    toast.success('Email added successfully');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Site Editor</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeadsCard leads={leads} onAddLead={handleAddLead} />
        <ClientsCard clients={clients} onAddClient={handleAddClient} />
        <StaffCard staff={staff} onAddStaff={handleAddStaff} />
        <TasksCard tasks={tasks} onAddTask={handleAddTask} />
        <EmailsCard emails={emails} onAddEmail={handleAddEmail} />
      </div>
    </div>
  );
};

export default SiteEditor;
