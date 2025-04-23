import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState({ subject: '', recipient: '', status: '' });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const { data, error } = await supabase.from('emails').select('*');
    if (error) {
      console.error('Error fetching emails:', error);
    } else {
      setEmails(data);
    }
  };

  const handleAddEmail = async () => {
    const { data, error } = await supabase.from('emails').insert([newEmail]);
    if (error) {
      console.error('Error adding email:', error);
    } else {
      setEmails([...emails, data[0]]);
      setNewEmail({ subject: '', recipient: '', status: '' });
    }
  };

  const handleDeleteEmail = async (id) => {
    const { error } = await supabase.from('emails').delete().eq('id', id);
    if (error) {
      console.error('Error deleting email:', error);
    } else {
      setEmails(emails.filter((email) => email.id !== id));
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
