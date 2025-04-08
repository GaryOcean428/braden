
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ComponentLibrary } from '@/components/admin/editor/ComponentLibrary';

interface ComponentsTabProps {
  onChange: () => void;
}

export const ComponentsTab: React.FC<ComponentsTabProps> = ({ onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Library</CardTitle>
        <CardDescription>
          Add and configure components to use in your layout
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComponentLibrary onChange={onChange} />
      </CardContent>
    </Card>
  );
};
