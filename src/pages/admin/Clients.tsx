import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string; // Mark as optional
}

// Define the actual data structure we get from the database
interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service_type?: string;
  created_at: string;
  updated_at: string;
  company?: string; // Added company as optional property
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) throw error;

      if (data) {
        // Transform the data to match the Client interface
        const transformedData: Client[] = data.map((client: ClientData) => ({
          id: client.id,
          name: client.name,
          email: client.email,
          // Only add company if it exists in the database record
          ...(client.company !== undefined && { company: client.company }),
        }));

        setClients(transformedData);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ name: 'New Client', email: 'new@client.com' }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const clientData = data[0] as ClientData;
        const newClient: Client = {
          id: clientData.id,
          name: clientData.name,
          email: clientData.email,
          // Only add company if it exists in the response
          ...(clientData.company !== undefined && {
            company: clientData.company,
          }),
        };

        setClients([...clients, newClient]);
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Clients</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.company || 'Unknown'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Button onClick={handleAddClient}>Add Client</Button>
      </Card>
    </div>
  );
};

export default Clients;
