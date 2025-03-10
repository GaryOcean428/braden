
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AdminStatusAlertProps {
  isAdmin: boolean;
  error: string | null;
  adminUsersCount: number;
}

export function AdminStatusAlert({ isAdmin, error, adminUsersCount }: AdminStatusAlertProps) {
  if (!isAdmin || error) return null;

  return (
    <div className="mb-4">
      <Alert className="bg-[#d8c690]/20 border-[#cbb26a]">
        <Info className="h-4 w-4 text-[#811a2c]" />
        <AlertDescription className="text-[#2c3e50]">
          You are confirmed as an admin. {adminUsersCount === 0 ? 
          "The admin users list may not be visible due to database permissions, but your access is verified." : 
          "You have access to manage admin users."}
        </AlertDescription>
      </Alert>
    </div>
  );
}
