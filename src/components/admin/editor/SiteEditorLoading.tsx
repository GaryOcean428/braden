
import React from 'react';

export const SiteEditorLoading: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ab233a]"></div>
      </div>
    </div>
  );
};
