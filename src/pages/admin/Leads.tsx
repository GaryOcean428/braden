import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*');
      if (error) throw error;
      
      if (data) {
        // Transform the data to match the Lead interface
        const transformedData: Lead[] = data.map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          service: lead.service_type || 'General'
        }));
        
        setLeads(transformedData);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    try {
      const { data, error } = await supabase.from('leads').insert([
        { name: 'New Lead', email: 'new@lead.com', service_type: 'New Service' }
      ]).select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newLead: Lead = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          service: data[0].service_type || 'General'
        };
        
        setLeads([...leads, newLead]);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No leads found.</TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.service}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Button onClick={handleAddLead} className="mt-4 ml-4">Add Lead</Button>
      </Card>
    </div>
  );
};

export default Leads;
