
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
          <p className="text-[#ab233a] font-medium">Database Access Restricted</p>
          <p className="text-sm text-[#2c3e50] max-w-md mb-2">
            You are verified as a developer by email, but the database's Row Level Security policies are preventing access to content pages.
          </p>
          <p className="text-sm text-[#2c3e50] max-w-md mb-4 font-medium">
            This is a configuration issue in the Supabase project that needs to be fixed.
          </p>
          <div className="flex gap-3">
            <Button className="bg-[#2c3e50] hover:bg-[#34495e]" asChild>
              <Link to="/admin/auth">Go to Login</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
