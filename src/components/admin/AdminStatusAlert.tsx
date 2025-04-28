import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ShieldCheck, Database } from "lucide-react";

interface AdminStatusAlertProps {
  isAdmin: boolean;
  error: string | null;
  adminUsersCount: number;
}

export function AdminStatusAlert({ isAdmin, error, adminUsersCount }: AdminStatusAlertProps) {
  if (!isAdmin) return null;

  // If there's an error, but it's related to permissions, we still want to show the admin status alert
  const isPermissionError = error?.includes("permission") || 
                            error?.includes("restrictions") || 
                            error?.includes("role") || 
                            error?.includes("admin") ||
                            error?.includes("403");

  return (
    <div className="mb-4">
      <Alert className="bg-[#d8c690]/20 border-[#cbb26a]">
        {isPermissionError ? 
          <Database className="h-4 w-4 text-[#811a2c]" /> : 
          <ShieldCheck className="h-4 w-4 text-[#27ae60]" />
        }
        <AlertDescription className="text-[#2c3e50]">
          {isPermissionError ? 
            "You are confirmed as a developer with admin privileges by email verification. Database access is currently restricted due to Row Level Security policies. Admin functions that require database access may not work correctly." : 
            `You are confirmed as a developer. ${adminUsersCount === 0 ? 
              "The admin users list may not be visible due to database permissions, but your access is verified through email." : 
              "You have access to manage admin users."}`
          }
        </AlertDescription>
      </Alert>
    </div>
  );
}
