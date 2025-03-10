
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  error: string;
  onRetry: () => void;
}

export const PageError = ({ error, onRetry }: PageErrorProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit mt-2"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
