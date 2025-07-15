import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  position: string;
}

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    position: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  // Since there's no staff table in the database, we'll use mock data
  const fetchStaff = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Manager',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          position: 'Developer',
        },
      ];
      setStaff(mockStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    try {
      const newStaffMember: StaffMember = {
        id: `${staff.length + 1}`,
        ...newStaff,
      };
      setStaff([...staff, newStaffMember]);
      setNewStaff({ name: '', email: '', position: '' });
      toast.success('Staff member added successfully');
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Failed to add staff member');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      setStaff(staff.filter((staffMember) => staffMember.id !== id));
      toast.success('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Failed to delete staff member');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Manage Staff</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
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
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.position}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteStaff(staffMember.id)}
                    >
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
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              className="mb-2"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
              className="mb-2"
            />
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={newStaff.position}
              onChange={(e) =>
                setNewStaff({ ...newStaff, position: e.target.value })
              }
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
