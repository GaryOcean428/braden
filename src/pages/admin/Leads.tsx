import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({ name: '', email: '', service: '' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data);
    }
  };

  const handleAddLead = async () => {
    const { data, error } = await supabase.from('leads').insert([newLead]);
    if (error) {
      console.error('Error adding lead:', error);
    } else {
      setLeads([...leads, data[0]]);
      setNewLead({ name: '', email: '', service: '' });
    }
  };

  const handleDeleteLead = async (id) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      console.error('Error deleting lead:', error);
    } else {
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.service}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteLead(lead.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              placeholder="Enter name"
            />
            <Label htmlFor="email" className="mt-2">Email</Label>
            <Input
              id="email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              placeholder="Enter email"
            />
            <Label htmlFor="service" className="mt-2">Service</Label>
            <Input
              id="service"
              value={newLead.service}
              onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
              placeholder="Enter service"
            />
            <Button className="mt-4" onClick={handleAddLead}>
              Add Lead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;
