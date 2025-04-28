import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings } from "lucide-react";

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">Content</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 mb-4">
            Manage your website content including pages and blocks.
          </CardDescription>
          <Link to="/admin/content">
            <Button variant="outline" className="w-full">Manage Content</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">Users</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 mb-4">
            Manage user accounts, permissions and roles.
          </CardDescription>
          <Link to="/admin/users">
            <Button variant="outline" className="w-full">Manage Users</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">Settings</CardTitle>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 mb-4">
            Configure website settings and preferences.
          </CardDescription>
          <Link to="/admin/settings">
            <Button variant="outline" className="w-full">Site Settings</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
