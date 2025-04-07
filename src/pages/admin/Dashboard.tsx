import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeroImageManager } from '@/components/admin/HeroImageManager';
import { ContentManager } from '@/components/admin/ContentManager';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Image, FileText, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Admin Dashboard</h1>
        <Button 
          onClick={handleLogout} 
          variant="outline"
          className="border-[#ab233a] text-[#ab233a] hover:bg-[#ab233a] hover:text-white"
        >
          Logout
        </Button>
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
                <CardDescription>Manage website users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  User management functionality coming soon.
                </p>
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
                <p className="text-center py-8 text-gray-500">
                  Site settings functionality coming soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
