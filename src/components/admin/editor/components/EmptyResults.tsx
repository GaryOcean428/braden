import React from 'react';

interface EmptyResultsProps {
  searchTerm: string;
  categoryName: string;
}

export const EmptyResults: React.FC<EmptyResultsProps> = ({
  searchTerm,
  categoryName,
}) => {
  return (
    <div className="p-8 text-center bg-gray-50 rounded-md border">
      <p className="text-gray-500">
        No results found for "{searchTerm}" in {categoryName}
      </p>
    </div>
  );
};
