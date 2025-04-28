
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Loader2 } from 'lucide-react';

interface LogoManagerLoadingProps {
  title?: string;
}

export const LogoManagerLoading: React.FC<LogoManagerLoadingProps> = ({ 
  title = "Logo Manager"
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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2 text-[#ab233a]" />
          <span>Loading {title.toLowerCase()}...</span>
        </div>
      </CardContent>
    </Card>
  );
};
