
import React from 'react';
import { Loader2 } from 'lucide-react';

const SiteEditorLoading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-[#ab233a]" />
      <span className="mt-4 text-[#2c3e50] text-lg">Loading Site Editor...</span>
      <p className="text-sm text-[#95a5a6] max-w-md text-center mt-2">
        Please wait while we prepare the editing environment for you.
      </p>
    </div>
  );
};

export default SiteEditorLoading;
