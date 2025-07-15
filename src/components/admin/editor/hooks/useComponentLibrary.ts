import { useState } from 'react';
import { getComponentCategories } from '../data/componentLibraryData';

export const useComponentLibrary = (onChange: () => void) => {
  const [activeCategory, setActiveCategory] = useState('layouts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const categories = getComponentCategories();

  const handleDragStart = (componentId: string) => {
    setIsDragging(true);
    // In a full implementation, this would set data for the drag operation
    setTimeout(() => setIsDragging(false), 1000);
  };

  return {
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    isDragging,
    categories,
    handleDragStart,
    onChange,
  };
};
