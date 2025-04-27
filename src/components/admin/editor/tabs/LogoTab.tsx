
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { LogoManager } from '@/components/admin/editor/media/LogoManager';

interface LogoTabProps {
  onChange: () => void;
}

export const LogoTab: React.FC<LogoTabProps> = ({ onChange }) => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-[#ab233a] text-white">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            <CardTitle>Site Branding</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Manage your site's logo, favicon and other branding elements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 text-sm text-[#2c3e50]">
            <p>Upload and manage your website branding elements. Logos should be high resolution images with a transparent background.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogoManager 
              onLogoUpdate={onChange}
              bucketName="logos"
              title="Logo Manager"
              description="Update your site logo which appears in the header"
            />
            
            <LogoManager 
              onLogoUpdate={onChange}
              bucketName="favicons"
              title="Favicon Manager"
              description="Update your site favicon which appears in browser tabs"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
