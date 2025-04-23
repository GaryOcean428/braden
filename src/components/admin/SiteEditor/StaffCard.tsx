
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
}

interface StaffCardProps {
  staff: Staff[];
  onAddStaff: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onAddStaff }) => (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((staffMember) => (
            <TableRow key={staffMember.id}>
              <TableCell>{staffMember.name}</TableCell>
              <TableCell>{staffMember.email}</TableCell>
              <TableCell>{staffMember.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddStaff}>Add Staff</Button>
    </CardContent>
  </Card>
);

export default StaffCard;
