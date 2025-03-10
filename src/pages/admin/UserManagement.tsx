
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, AlertCircle, CheckCircle2, ShieldAlert, Info } from "lucide-react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error("Authentication Required", {
          description: "Please log in to access the admin dashboard"
        });
        navigate('/admin/auth');
        return;
      }

      // Check if user is admin using RPC function
      const { data: isAdminCheck, error: adminError } = await supabase.rpc('is_admin');
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        toast.error("Authentication Error", {
          description: "Failed to verify admin status"
        });
        navigate('/admin/auth');
        return;
      }
      
      if (!isAdminCheck) {
        toast.error("Access Denied", {
          description: "You do not have administrator privileges"
        });
        navigate('/admin/auth');
        return;
      }
      
      setIsAdmin(true);
      loadAdminUsers();
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Authentication Error", {
        description: "Failed to verify authentication"
      });
      navigate('/admin/auth');
    }
  };

  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First try to get users via the admin RPC
      const { data: adminData, error: rpcError } = await supabase.rpc('list_admin_users');
      
      if (!rpcError && adminData) {
        setAdminUsers(adminData);
      } else {
        console.warn("Could not fetch admin users via RPC:", rpcError);
        
        // Fallback: try to get the admin_users table directly
        try {
          const { data: tableData, error: tableError } = await supabase
            .from('admin_users')
            .select();
          
          if (tableError) {
            console.error("Error fetching admin users from table:", tableError);
            
            // If we can't access the table directly, display an informative message
            setError("The admin users list cannot be displayed due to permission restrictions, but your admin access is confirmed.");
            setAdminUsers([]);
          } else if (tableData) {
            // Attempt to enrich with user data
            const { data: userData, error: profilesError } = await supabase.auth.admin.listUsers();
            
            if (!profilesError && userData && userData.users) {
              const enrichedAdmins = tableData.map(admin => {
                const matchingUser = userData.users?.find((user: UserData) => user.id === admin.user_id);
                return {
                  ...admin,
                  email: matchingUser?.email || 'Unknown',
                  created_at_user: matchingUser?.created_at || null
                };
              });
              
              setAdminUsers(enrichedAdmins);
            } else {
              setAdminUsers(tableData);
            }
          }
        } catch (error) {
          console.error("Error in fallback admin users fetch:", error);
          setError("Cannot display admin users list due to database permission restrictions.");
          setAdminUsers([]);
        }
      }
    } catch (error: any) {
      console.error('Error loading admin users:', error);
      setError(error.message || "Failed to load admin users");
      toast.error("Error", {
        description: "Failed to load admin users"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button onClick={() => navigate("/admin")} className="bg-[#2c3e50] hover:bg-[#34495e]">Back to Dashboard</Button>
      </div>

      {error && (
        <Alert className="mb-6 border-[#cbb26a]">
          <Info className="h-4 w-4 text-[#ab233a]" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        {isAdmin && !error && (
          <div className="mb-4">
            <Alert className="bg-[#d8c690]/20 border-[#cbb26a]">
              <Info className="h-4 w-4 text-[#811a2c]" />
              <AlertDescription className="text-[#2c3e50]">
                You are confirmed as an admin. {adminUsers.length === 0 ? 
                "The admin users list may not be visible due to database permissions, but your access is verified." : 
                "You have access to manage admin users."}
              </AlertDescription>
            </Alert>
          </div>
        )}
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
                      {error ? 
                      "The admin users list cannot be displayed due to database permissions, but your admin access is confirmed." : 
                      "Admin users will appear here once they have been added to the system."}
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
      </Card>
    </div>
  );
}
