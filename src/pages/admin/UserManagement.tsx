import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, Settings } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { AdminStatusAlert } from '@/components/admin/AdminStatusAlert';
import { ErrorAlert } from '@/components/admin/ErrorAlert';
import { AddAdminDialog } from '@/components/admin/AddAdminDialog';
import { useState } from 'react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { supabase } from '@/integrations/supabase/client';

export default function UserManagement() {
  const {
    adminUsers,
    isLoading,
    error,
    checkAdminAndLoadUsers,
    addAdminUser,
    configurePermissions,
    isAdmin,
  } = useAdminUsers();
  const { isDeveloper } = useAdminPermissions();
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [checkAdminAndLoadUsers]);

  const handleAddAdmin = () => {
    console.log('Opening add admin dialog');
    setAddDialogOpen(true);
  };

  const handleDBSettings = async () => {
    const isLoading = toast.loading('Configuring database permissions...');

    try {
      const success = await configurePermissions();
      toast.dismiss(isLoading);

      if (success) {
        toast.success('Permissions Updated', {
          description: 'Database access has been properly configured',
        });
      }
    } catch (error) {
      toast.dismiss(isLoading);
      toast.error('Configuration Failed', {
        description: 'There was an error configuring database permissions',
      });
    }
  };

  // Simplified permission check for the current user
  const checkPermission = async (action) => {
    // Check if the user is a developer admin by email - most reliable method
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email === 'braden.lang77@gmail.com') {
      return true;
    }

    // Fall back to the user_has_permission function
    try {
      const { data: hasPermission, error: permissionError } =
        await supabase.rpc('user_has_permission', {
          user_id: user.id,
          required_permission: action,
        });

      if (permissionError || !hasPermission) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">User Management</h1>
        <Button
          onClick={() => navigate('/admin')}
          className="bg-[#2c3e50] hover:bg-[#34495e]"
        >
          Back to Dashboard
        </Button>
      </div>

      <ErrorAlert error={error} />

      <Card className="p-6 border-t-4 border-t-[#cbb26a]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#811a2c]">Admin Users</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#95a5a6] text-[#2c3e50] hover:bg-gray-100"
              onClick={handleDBSettings}
            >
              <Settings className="h-4 w-4" />
              Permissions
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#cbb26a] text-[#2c3e50] hover:bg-[#d8c690] hover:text-[#2c3e50]"
              onClick={handleAddAdmin}
            >
              <UserPlus className="h-4 w-4" />
              Add New Admin
            </Button>
          </div>
        </div>

        <AdminStatusAlert
          isAdmin={isAdmin}
          error={error}
          adminUsersCount={adminUsers.length}
        />

        <AdminUsersTable adminUsers={adminUsers} />
      </Card>

      <AddAdminDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddAdmin={addAdminUser}
        isLoading={isLoading}
      />
    </div>
  );
}
