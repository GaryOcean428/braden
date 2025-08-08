import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { HeroImageManager } from '@/components/admin/HeroImageManager';
import { ContentManager } from '@/components/admin/ContentManager';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Image,
  FileText,
  Users,
  Settings,
  Palette,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminStatusAlert } from '@/components/admin/AdminStatusAlert';
import { toast } from 'sonner';
import { DashboardCards } from '@/components/admin/DashboardCards';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const navigate = useNavigate();
  const { adminUsers, isLoading, error, isAdmin, checkAdminAndLoadUsers } =
    useAdminUsers();

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAddAdmin = () => {
    toast.info('Feature Coming Soon', {
      description: 'Admin user creation will be available in a future update',
    });
  };

  const handleDBSettings = () => {
    toast.info('Database Configuration Required', {
      description:
        'Contact your database administrator to grant the necessary permissions',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/admin/site-editor')}
            variant="outline"
            className="border-[#ab233a] text-[#ab233a] hover:bg-[#ab233a] hover:text-white flex items-center gap-1"
          >
            <Palette className="h-4 w-4" />
            Site Editor
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#ab233a] text-[#ab233a] hover:bg-[#ab233a] hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'hero' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('hero')}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Hero Images
                </Button>
                <Button
                  variant={activeTab === 'content' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('content')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Content
                </Button>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/admin/site-editor')}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Visual Site Editor
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/admin/leads')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Leads
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/admin/clients')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Clients
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/admin/staff')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Staff
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/admin/tasks')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Tasks
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/admin/emails')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Emails
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'hero' && <HeroImageManager />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage website users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#811a2c]">
                    Admin Users
                  </h2>
                  <div className="flex gap-2">
                    {error && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-[#95a5a6] text-[#2c3e50] hover:bg-gray-100"
                        onClick={handleDBSettings}
                      >
                        <Settings className="h-4 w-4" />
                        Permissions
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-[#cbb26a] text-[#2c3e50] hover:bg-[#d8c690] hover:text-[#2c3e50]"
                      onClick={handleAddAdmin}
                    >
                      <Users className="h-4 w-4" />
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
              </CardContent>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure website settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-500 mb-4">
                    Basic site settings can be configured here. For advanced
                    visual customization, use the Site Editor.
                  </p>

                  <Button
                    onClick={() => navigate('/admin/site-editor')}
                    className="w-full bg-[#ab233a] hover:bg-[#811a2c]"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Open Visual Site Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DashboardCards />
    </div>
  );
};

export default AdminDashboard;
