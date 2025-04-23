
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Email {
  id: string;
  subject: string;
  recipient: string;
  status: string;
}

const Emails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [newEmail, setNewEmail] = useState({ subject: '', recipient: '', status: '' });

  useEffect(() => {
    fetchEmails();
  }, []);

  // Since there's no emails table in the database, we'll use mock data
  const fetchEmails = async () => {
    try {
      // Mock data
      const mockEmails: Email[] = [
        { id: '1', subject: 'Welcome Email', recipient: 'customer@example.com', status: 'Sent' },
        { id: '2', subject: 'Follow-up', recipient: 'prospect@example.com', status: 'Draft' }
      ];
      setEmails(mockEmails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    }
  };

  const handleAddEmail = async () => {
    try {
      const newEmailItem: Email = {
        id: `${emails.length + 1}`,
        ...newEmail
      };
      setEmails([...emails, newEmailItem]);
      setNewEmail({ subject: '', recipient: '', status: '' });
      toast.success('Email added successfully');
    } catch (error) {
      console.error('Error adding email:', error);
      toast.error('Failed to add email');
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      setEmails(emails.filter((email) => email.id !== id));
      toast.success('Email deleted successfully');
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Failed to delete email');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{email.recipient}</TableCell>
                  <TableCell>{email.status}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteEmail(email.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
              placeholder="Enter subject"
            />
            <Label htmlFor="recipient" className="mt-2">Recipient</Label>
            <Input
              id="recipient"
              value={newEmail.recipient}
              onChange={(e) => setNewEmail({ ...newEmail, recipient: e.target.value })}
              placeholder="Enter recipient"
            />
            <Label htmlFor="status" className="mt-2">Status</Label>
            <Input
              id="status"
              value={newEmail.status}
              onChange={(e) => setNewEmail({ ...newEmail, status: e.target.value })}
              placeholder="Enter status"
            />
            <Button className="mt-4" onClick={handleAddEmail}>
              Add Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Emails;
