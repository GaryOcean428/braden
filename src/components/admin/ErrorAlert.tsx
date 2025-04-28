import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: string | Error | null;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;
  
  const errorMessage = error instanceof Error ? error.message : error;

  // Determine if this is a permission error
  const isPermissionError = errorMessage.toLowerCase().includes("permission") || 
                           errorMessage.toLowerCase().includes("restrictions") || 
                           errorMessage.toLowerCase().includes("role") || 
                           errorMessage.toLowerCase().includes("admin");
  
  return (
    <Alert className={`mb-6 border-${isPermissionError ? '[#cbb26a]' : '[#ab233a]'} ${isPermissionError ? 'bg-amber-50' : 'bg-red-50'}`}>
      {isPermissionError ? 
        <Info className="h-4 w-4 text-[#811a2c]" /> : 
        <AlertTriangle className="h-4 w-4 text-[#ab233a]" />
      }
      <AlertTitle className="text-[#811a2c]">{isPermissionError ? 'Database Access' : 'Error'}</AlertTitle>
      <AlertDescription className="text-[#811a2c]">{errorMessage}</AlertDescription>
    </Alert>
  );
}
