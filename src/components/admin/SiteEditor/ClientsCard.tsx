import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string; // Make company optional
}

interface ClientsCardProps {
  clients: Client[];
  onAddClient: () => void;
}

const ClientsCard: React.FC<ClientsCardProps> = ({ clients, onAddClient }) => (
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
              <TableCell>{client.company || 'Unknown'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddClient}>Add Client</Button>
    </CardContent>
    <CardContent>
      <h3 className="text-lg font-medium mb-2">Logo and Favicon</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <input type="file" accept="image/*" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Favicon</label>
          <input type="file" accept="image/*" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ClientsCard;
