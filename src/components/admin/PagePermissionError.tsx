
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const PagePermissionError = () => {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
          <p className="text-[#ab233a] font-medium">Permission Denied</p>
          <p className="text-sm text-[#2c3e50] max-w-md mb-4">
            You don't have permission to access content pages. Try logging in with an admin account.
          </p>
          <Button className="bg-[#2c3e50] hover:bg-[#34495e]" asChild>
            <Link to="/admin/auth">Go to Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
