
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AdminUser = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  email?: string;
  created_at_user?: string;
};

// Define the shape of the user data from auth.admin.listUsers
interface UserData {
  id: string;
  email?: string;
  created_at?: string;
}

export default function UserManagement() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadAdminUsers();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the admin dashboard",
          variant: "destructive",
        });
        navigate('/admin/auth');
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to verify authentication",
        variant: "destructive",
      });
    }
  };

  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select(`
          id,
          user_id,
          created_at,
          updated_at
        `);

      if (error) throw error;
      
      // Get the user profiles for each admin
      if (adminData && adminData.length > 0) {
        const userIds = adminData.map(admin => admin.user_id);
        const { data: userData, error: profilesError } = await supabase.auth.admin.listUsers();
        
        if (profilesError) {
          console.warn("Could not fetch user profiles:", profilesError);
          setAdminUsers(adminData);
        } else if (userData) {
          // Merge the admin data with user profiles
          const enrichedAdmins = adminData.map(admin => {
            const matchingUser = userData.users?.find((user: UserData) => user.id === admin.user_id);
            return {
              ...admin,
              email: matchingUser?.email || 'Unknown',
              created_at_user: matchingUser?.created_at || null
            };
          });
          setAdminUsers(enrichedAdmins);
        }
      } else {
        setAdminUsers([]);
      }
    } catch (error: any) {
      console.error('Error loading admin users:', error);
      setError(error.message || "Failed to load admin users");
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Admin Users</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Admin
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-500">No admin users found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {adminUsers.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.id.substring(0, 8)}...</TableCell>
                <TableCell>{admin.user_id.substring(0, 8)}...</TableCell>
                <TableCell>{admin.email || 'N/A'}</TableCell>
                <TableCell>{new Date(admin.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
