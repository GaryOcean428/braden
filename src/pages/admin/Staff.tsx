import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', position: '' });
  const router = useRouter();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) throw error;
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    try {
      const { data, error } = await supabase.from('staff').insert([newStaff]);
      if (error) throw error;
      setStaff([...staff, data[0]]);
      setNewStaff({ name: '', email: '', position: '' });
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
      setStaff(staff.filter(staffMember => staffMember.id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Manage Staff</h1>
        <Button onClick={() => router.push('/admin/dashboard')}>Back to Dashboard</Button>
      </div>

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map(staffMember => (
                <TableRow key={staffMember.id}>
                  <TableCell>{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.position}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteStaff(staffMember.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="mb-2"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              className="mb-2"
            />
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={newStaff.position}
              onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
              className="mb-2"
            />
            <Button onClick={handleAddStaff}>Add Staff</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
