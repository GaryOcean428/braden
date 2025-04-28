import React from 'react';
import { 
  ComponentLibraryHeader, 
  SearchBar, 
  CategoryTabs,
  ComponentInstructions 
} from './components';
import { useComponentLibrary } from './hooks/useComponentLibrary';

interface ComponentLibraryProps {
  onChange: () => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onChange }) => {
  const { 
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    isDragging,
    categories,
    handleDragStart
  } = useComponentLibrary(onChange);

  return (
    <div className="space-y-6">
      <ComponentLibraryHeader />
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <CategoryTabs 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        isDragging={isDragging}
        onDragStart={handleDragStart}
        onChange={onChange}
      />

      <ComponentInstructions />
    </div>
  );
};
