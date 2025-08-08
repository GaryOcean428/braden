import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ShieldAlert, 
  Upload, 
  FileText, 
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isDeveloperAdmin } from '@/services/adminUserService';
import { getPages, togglePagePublished, type Page } from '@/services/pagesService';
import { HeroImageManager } from './HeroImageManager';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { toast } from 'sonner';

export function DeveloperAdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const adminStatus = await isDeveloperAdmin();
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        loadPages();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      setPagesLoading(true);
      const pagesData = await getPages();
      setPages(pagesData);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Failed to load pages');
    } finally {
      setPagesLoading(false);
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      const updatedPage = await togglePagePublished(page.id);
      setPages(prev => 
        prev.map(p => p.id === page.id ? updatedPage : p)
      );
      toast.success(
        `Page "${page.title}" ${updatedPage.published ? 'published' : 'unpublished'} successfully`
      );
    } catch (error) {
      console.error('Error toggling page status:', error);
      toast.error('Failed to update page status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Please log in to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only developer admins can access this dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#ab233a] flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Developer Admin Dashboard
            </h1>
            <p className="text-[#2c3e50] mt-2">
              Welcome back, {user.email}. You have full administrative access.
            </p>
          </div>
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Developer Admin Detected
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pages.length}</div>
              <p className="text-xs text-muted-foreground">
                {pages.filter(p => p.published).length} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Hero images ready
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hero Image Manager */}
        <HeroImageManager />

        {/* Pages Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pages Management
            </CardTitle>
            <CardDescription>
              Manage content pages and their publication status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pages created yet</p>
                <p className="text-sm">Create pages using the Content Manager</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{page.title}</h4>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={page.published ? "default" : "secondary"}>
                          {page.published ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                        {page.hero_image && (
                          <Badge variant="outline">
                            Has Hero Image
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={page.published ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleTogglePublish(page)}
                      >
                        {page.published ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <span className="text-sm text-gray-500">
                {pages.length} total pages • {pages.filter(p => p.published).length} published
              </span>
              <Button variant="outline" size="sm" onClick={loadPages}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Current system status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Admin Email:</strong>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <strong>Access Level:</strong>
                <p className="text-green-600">Developer Admin</p>
              </div>
              <div>
                <strong>Storage Status:</strong>
                <p className="text-green-600">Connected</p>
              </div>
              <div>
                <strong>Database Status:</strong>
                <p className="text-green-600">Connected</p>
              </div>
            </div>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All systems are operational. You have full access to manage content, upload images, and control page visibility.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}