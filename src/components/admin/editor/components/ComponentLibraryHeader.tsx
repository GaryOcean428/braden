import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const ComponentLibraryHeader: React.FC = () => {
  const handleCreateCustomComponent = () => {
    toast.info('Creating custom component', {
      description: 'Custom component creation will be available in Phase 2',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h3 className="text-lg font-semibold">Component Library</h3>
      <Button
        variant="outline"
        onClick={handleCreateCustomComponent}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        Create Custom Component
      </Button>
    </div>
  );
};
