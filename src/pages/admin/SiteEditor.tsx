import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const SiteEditor: React.FC = () => {
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: leadsData } = await supabase.from('leads').select('*');
      const { data: clientsData } = await supabase.from('clients').select('*');
      const { data: staffData } = await supabase.from('staff').select('*');
      const { data: tasksData } = await supabase.from('tasks').select('*');
      const { data: emailsData } = await supabase.from('emails').select('*');

      setLeads(leadsData);
      setClients(clientsData);
      setStaff(staffData);
      setTasks(tasksData);
      setEmails(emailsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (lead) => {
    try {
      const { data, error } = await supabase.from('leads').insert([lead]);
      if (error) throw error;
      setLeads([...leads, data[0]]);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleAddClient = async (client) => {
    try {
      const { data, error } = await supabase.from('clients').insert([client]);
      if (error) throw error;
      setClients([...clients, data[0]]);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleAddStaff = async (staffMember) => {
    try {
      const { data, error } = await supabase.from('staff').insert([staffMember]);
      if (error) throw error;
      setStaff([...staff, data[0]]);
    } catch (error) {
      console.error('Error adding staff member:', error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const { data, error } = await supabase.from('tasks').insert([task]);
      if (error) throw error;
      setTasks([...tasks, data[0]]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddEmail = async (email) => {
    try {
      const { data, error } = await supabase.from('emails').insert([email]);
      if (error) throw error;
      setEmails([...emails, data[0]]);
    } catch (error) {
      console.error('Error adding email:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Site Editor</h1>
        <Button onClick={() => router.push('/admin/dashboard')}>Back to Dashboard</Button>
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
