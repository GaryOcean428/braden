
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ShieldCheck, Database, CheckCircle2 } from "lucide-react";

interface AdminStatusAlertProps {
  isAdmin: boolean;
  isDeveloper?: boolean;
  error: string | null;
  adminUsersCount: number;
}

export function AdminStatusAlert({ isAdmin, isDeveloper = false, error, adminUsersCount }: AdminStatusAlertProps) {
  if (!isAdmin && !isDeveloper) return null;

  // If there's an error, but it's related to permissions, we still want to show the admin status alert
  const isPermissionError = error?.includes("permission") || 
                            error?.includes("restrictions") || 
                            error?.includes("role") || 
                            error?.includes("admin") ||
                            error?.includes("403") ||
                            error?.includes("access denied");

  // Special stylings and icons based on status
  let bgColor = "bg-[#d8c690]/20";
  let borderColor = "border-[#cbb26a]";
  let icon = <ShieldCheck className="h-4 w-4 text-[#27ae60]" />;
  let message = `You are confirmed as a ${isDeveloper ? 'developer' : 'admin'}.`;
  
  if (isDeveloper) {
    message = "You are confirmed as a developer with admin privileges by email verification.";
    
    if (isPermissionError) {
      icon = <Database className="h-4 w-4 text-[#811a2c]" />;
      message += " Some database permissions are still being applied and may take effect after refresh.";
    } else {
      icon = <CheckCircle2 className="h-4 w-4 text-[#27ae60]" />;
      message += " Full system access is available.";
    }
  } else if (isPermissionError) {
    icon = <Info className="h-4 w-4 text-[#3498db]" />;
    message += " Some database permissions are restricted.";
  }

  return (
    <div className="mb-4">
      <Alert className={`${bgColor} ${borderColor}`}>
        {icon}
        <AlertDescription className="text-[#2c3e50]">
          {message}
          {adminUsersCount === 0 && isDeveloper && 
            " The admin users list may not be visible due to database permissions, but your access is verified through email."}
          {adminUsersCount > 0 && isDeveloper && 
            " You have access to manage admin users."}
        </AlertDescription>
      </Alert>
    </div>
  );
}
