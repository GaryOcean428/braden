
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Create and manage website content pages
          </p>
          <Button asChild className="w-full">
            <Link to="/admin/content">Manage Content</Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Manage admins and user accounts
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Configure website settings and preferences
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/admin/settings">Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
