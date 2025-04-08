
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutEditor } from '@/components/admin/editor/LayoutEditor';

interface LayoutTabProps {
  onChange: () => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({ onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout Editor</CardTitle>
        <CardDescription>
          Arrange and organize page sections using drag and drop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LayoutEditor onChange={onChange} />
      </CardContent>
    </Card>
  );
};
