
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ImageIcon } from 'lucide-react';

interface LogoManagerErrorProps {
  title?: string;
  error: string;
  onRetry: () => void;
}

export const LogoManagerError: React.FC<LogoManagerErrorProps> = ({ 
  title = "Logo Manager",
  error,
  onRetry
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#2c3e50] text-white">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </CardContent>
    </Card>
  );
};
