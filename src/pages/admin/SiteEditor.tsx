
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      
      // Mock data for staff
      const staffData = [
        { id: '1', name: 'John Doe', email: 'john@example.com', position: 'Manager' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', position: 'Developer' }
      ];
      
      // Mock data for tasks
      const tasksData = [
        { id: '1', title: 'Complete Project', description: 'Finish the project by Friday', status: 'In Progress' },
        { id: '2', title: 'Client Meeting', description: 'Meet with client to discuss requirements', status: 'Completed' }
      ];
      
      // Mock data for emails
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

  const handleAddLead = async (lead: Omit<Lead, 'id'>) => {
    try {
      const { data, error } = await supabase.from('leads').insert([lead]).select();
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

  const handleAddClient = async (client: Omit<Client, 'id'>) => {
    try {
      const { data, error } = await supabase.from('clients').insert([client]).select();
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
  const handleAddStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newStaff = {
      id: `${staff.length + 1}`,
      ...staffMember
    };
    setStaff([...staff, newStaff]);
    toast.success('Staff member added successfully');
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      id: `${tasks.length + 1}`,
      ...task
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
  };

  const handleAddEmail = (email: Omit<Email, 'id'>) => {
    const newEmail = {
      id: `${emails.length + 1}`,
      ...email
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
        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.service}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={() => handleAddLead({ name: 'New Lead', email: 'new@lead.com', service: 'Service' })}>
              Add Lead
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.company}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={() => handleAddClient({ name: 'New Client', email: 'new@client.com', company: 'Company' })}>
              Add Client
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={() => handleAddStaff({ name: 'New Staff', email: 'new@staff.com', position: 'Position' })}>
              Add Staff
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={() => handleAddTask({ title: 'New Task', description: 'Task Description', status: 'Pending' })}>
              Add Task
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>{email.recipient}</TableCell>
                    <TableCell>{email.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={() => handleAddEmail({ subject: 'New Email', recipient: 'recipient@domain.com', status: 'Draft' })}>
              Add Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteEditor;
