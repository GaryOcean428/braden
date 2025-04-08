
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { PanelLeft, PanelRight, MoveHorizontal, MousePointer, Grid3X3 } from 'lucide-react';

interface LayoutEditorProps {
  onChange: () => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({ onChange }) => {
  const [mode, setMode] = useState<'select' | 'move'>('select');

  // This is a placeholder component - we'll implement the full 
  // drag-and-drop functionality in Phase 2
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Layout Editor</h3>
        <div className="flex items-center gap-2">
          <div className="border rounded-md p-1 flex items-center">
            <Button
              variant={mode === 'select' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setMode('select')}
              className="flex items-center gap-1 h-8"
            >
              <MousePointer className="h-4 w-4" />
              Select
            </Button>
            <Button 
              variant={mode === 'move' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setMode('move')}
              className="flex items-center gap-1 h-8"
            >
              <MoveHorizontal className="h-4 w-4" />
              Move
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-2 border-dashed rounded-md bg-gray-50 p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Layout Editor Coming Soon</h3>
        <p className="text-gray-500 mb-6">
          The full drag-and-drop layout editor will be implemented in Phase 2. 
          This will allow you to visually rearrange page sections.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-center">
              <PanelLeft className="h-8 w-8 text-gray-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-center">
              <Grid3X3 className="h-8 w-8 text-gray-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-center">
              <PanelRight className="h-8 w-8 text-gray-400" />
            </CardContent>
          </Card>
        </div>
        
        <Button 
          className="mt-6"
          onClick={() => {
            onChange();
            toast.info("Layout Editor will be available in Phase 2");
          }}
        >
          Simulate Layout Change
        </Button>
      </div>
    </div>
  );
};
