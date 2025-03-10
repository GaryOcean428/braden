
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminStatusAlert } from "@/components/admin/AdminStatusAlert";
import { ErrorAlert } from "@/components/admin/ErrorAlert";

export default function UserManagement() {
  const { adminUsers, isLoading, error, isAdmin, checkAdminAndLoadUsers } = useAdminUsers();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const handleAddAdmin = () => {
    toast.info("Feature Coming Soon", {
      description: "Admin user creation will be available in a future update"
    });
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
          onClick={() => navigate("/admin")} 
          className="bg-[#2c3e50] hover:bg-[#34495e]"
        >
          Back to Dashboard
        </Button>
      </div>

      <ErrorAlert error={error} />

      <Card className="p-6 border-t-4 border-t-[#cbb26a]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#811a2c]">Admin Users</h2>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-[#cbb26a] text-[#2c3e50] hover:bg-[#d8c690] hover:text-[#2c3e50]"
            onClick={handleAddAdmin}
          >
            <UserPlus className="h-4 w-4" />
            Add New Admin
          </Button>
        </div>
        
        <AdminStatusAlert 
          isAdmin={isAdmin} 
          error={error} 
          adminUsersCount={adminUsers.length} 
        />
        
        <AdminUsersTable adminUsers={adminUsers} />
      </Card>
    </div>
  );
}
