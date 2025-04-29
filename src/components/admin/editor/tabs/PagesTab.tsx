
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePagesData } from '@/components/admin/hooks/usePagesData';
import { ContentPagesTable } from '@/components/content/ContentPagesTable';
import { toast } from 'sonner';

interface PagesTabProps {
  onChange?: () => void;
}

export const PagesTab: React.FC<PagesTabProps> = ({ onChange }) => {
  const { pages, loading, error, isAdmin, loadPages } = usePagesData();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const handleAddPage = async () => {
    try {
      // Add page logic here
      toast.success('Page added successfully');
      loadPages();
      if (onChange) onChange();
    } catch (error) {
      toast.error('Failed to add page');
    }
  };

  const handleEditPage = async (id: string) => {
    try {
      // Edit page logic here
      toast.success('Page updated successfully');
      loadPages();
      if (onChange) onChange();
    } catch (error) {
      toast.error('Failed to update page');
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      // Delete page logic here
      toast.success('Page deleted successfully');
      loadPages();
      if (onChange) onChange();
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleSave = () => {
    if (editingPageId) {
      handleEditPage(editingPageId);
    } else {
      handleAddPage();
    }
    setTitle('');
    setSlug('');
    setContent('');
    setEditingPageId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Input 
          placeholder="Page Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <Input 
          placeholder="Page Slug" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)} 
        />
        <Textarea 
          placeholder="Page Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <Button onClick={handleSave}>
          {editingPageId ? 'Update Page' : 'Add Page'}
        </Button>
      </div>
      <ContentPagesTable 
        pages={pages} 
        onTogglePublish={(id, currentStatus) => console.log('Toggle publish', id, currentStatus)} 
        onDelete={handleDeletePage} 
      />
    </div>
  );
};
