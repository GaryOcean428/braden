
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert className="mb-6 border-[#ab233a] bg-red-50">
      <Info className="h-4 w-4 text-[#ab233a]" />
      <AlertTitle className="text-[#811a2c]">Error</AlertTitle>
      <AlertDescription className="text-[#811a2c]">{error}</AlertDescription>
    </Alert>
  );
}
