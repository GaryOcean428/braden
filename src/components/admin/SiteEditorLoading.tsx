import React from 'react';
import { Loader2 } from 'lucide-react';

const SiteEditorLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      <span className="ml-2 text-gray-500">Loading...</span>
    </div>
  );
};

export default SiteEditorLoading;
