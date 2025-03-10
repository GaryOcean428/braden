
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert className="mb-6 border-[#cbb26a]">
      <Info className="h-4 w-4 text-[#ab233a]" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
