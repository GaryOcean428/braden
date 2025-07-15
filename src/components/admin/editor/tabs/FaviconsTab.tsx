import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Image } from 'lucide-react';
import { LogoManager } from '../media/logo/LogoManager';

interface FaviconsTabProps {
  onChange: () => void;
}

export const FaviconsTab: React.FC<FaviconsTabProps> = ({ onChange }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-[#ab233a] text-white">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          <CardTitle>Favicon Management</CardTitle>
        </div>
        <CardDescription className="text-gray-100">
          Manage your site's favicon and browser tab icons
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 text-sm text-[#2c3e50]">
          <p>
            Upload favicon files that will appear in browser tabs. Recommended
            size is 32x32 pixels or larger.
          </p>
        </div>

        <LogoManager
          onLogoUpdate={onChange}
          bucketName="favicons"
          title="Favicon Manager"
          description="Update your site favicon which appears in browser tabs"
        />
      </CardContent>
    </Card>
  );
};
