
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
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
              <TableCell>{client.company}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddClient}>Add Client</Button>
    </CardContent>
  </Card>
);

export default ClientsCard;
