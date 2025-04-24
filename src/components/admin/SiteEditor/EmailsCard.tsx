import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Email {
  id: string;
  subject: string;
  recipient: string;
  status: string;
}

interface EmailsCardProps {
  emails: Email[];
  onAddEmail: () => void;
}

const EmailsCard: React.FC<EmailsCardProps> = ({ emails, onAddEmail }) => (
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
      <Button onClick={onAddEmail}>Add Email</Button>
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

export default EmailsCard;
