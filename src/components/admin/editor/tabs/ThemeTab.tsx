import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ThemeEditor } from '@/components/admin/editor/ThemeEditor';

interface ThemeTabProps {
  onChange: () => void;
}

export const ThemeTab: React.FC<ThemeTabProps> = ({ onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customization</CardTitle>
        <CardDescription>
          Customize colors, typography, and spacing for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeEditor onChange={onChange} />
      </CardContent>
    </Card>
  );
};
