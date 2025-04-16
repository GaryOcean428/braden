
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  // Determine if this is a permission error
  const isPermissionError = error.toLowerCase().includes("permission") || 
                           error.toLowerCase().includes("restrictions") || 
                           error.toLowerCase().includes("role") || 
                           error.toLowerCase().includes("admin");
  
  return (
    <Alert className={`mb-6 border-${isPermissionError ? '[#cbb26a]' : '[#ab233a]'} ${isPermissionError ? 'bg-amber-50' : 'bg-red-50'}`}>
      {isPermissionError ? 
        <Info className="h-4 w-4 text-[#811a2c]" /> : 
        <AlertTriangle className="h-4 w-4 text-[#ab233a]" />
      }
      <AlertTitle className="text-[#811a2c]">{isPermissionError ? 'Database Access' : 'Error'}</AlertTitle>
      <AlertDescription className="text-[#811a2c]">{error}</AlertDescription>
    </Alert>
  );
}
