
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { AdminUser } from "@/hooks/useAdminUsers";

interface AdminUsersTableProps {
  adminUsers: AdminUser[];
}

export function AdminUsersTable({ adminUsers }: AdminUsersTableProps) {
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="text-[#2c3e50]">Admin ID</TableHead>
          <TableHead className="text-[#2c3e50]">User ID</TableHead>
          <TableHead className="text-[#2c3e50]">Email</TableHead>
          <TableHead className="text-[#2c3e50]">Created At</TableHead>
          <TableHead className="text-[#2c3e50]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adminUsers.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              <div className="flex flex-col items-center gap-3">
                <ShieldAlert className="h-8 w-8 text-[#95a5a6]" />
                <p className="text-[#95a5a6] font-medium">No admin users found</p>
                <p className="text-sm text-gray-500 max-w-md">
                  Admin users will appear here once they have been added to the system.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
        {adminUsers.map((admin) => (
          <TableRow key={admin.id} className="hover:bg-gray-50">
            <TableCell className="font-medium text-[#2c3e50]">
              {typeof admin.id === 'string' && admin.id.length > 8 ? admin.id.substring(0, 8) + '...' : admin.id}
            </TableCell>
            <TableCell className="text-[#3498db]">
              {typeof admin.user_id === 'string' && admin.user_id.length > 8 ? admin.user_id.substring(0, 8) + '...' : admin.user_id}
            </TableCell>
            <TableCell>{admin.email || 'N/A'}</TableCell>
            <TableCell>
              {admin.created_at ? new Date(admin.created_at).toLocaleString() : 'N/A'}
            </TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 border-[#cbb26a] text-[#2c3e50] hover:bg-[#d8c690]"
              >
                <CheckCircle2 className="h-4 w-4" />
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
