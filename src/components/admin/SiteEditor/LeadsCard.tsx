import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
}

interface LeadsCardProps {
  leads: Lead[];
  onAddLead: () => void;
}

const LeadsCard: React.FC<LeadsCardProps> = ({ leads, onAddLead }) => (
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
      <Button onClick={onAddLead}>Add Lead</Button>
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

export default LeadsCard;
