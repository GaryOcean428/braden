
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePagesData } from '@/components/admin/hooks/usePagesData';
import { supabase } from '@/integrations/supabase/client';
import { ContentPagesTable } from '@/components/content/ContentPagesTable';
import { toast } from 'sonner';

interface PagesTabProps {
  onChange?: () => void;
}

export const PagesTab: React.FC<PagesTabProps> = ({ onChange }) => {
  const { pages, loading, error, isAdmin, loadPages, addPage, editPage, deletePage } = usePagesData();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const handleAddPage = async () => {
    try {
      await addPage(title, slug, content);
      // reset fields
      setTitle('');
      setSlug('');
      setContent('');
      setEditingPageId(null);
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add page');
    }
  };

  const handleEditPage = async (id: string) => {
    try {
      await editPage(id, title, slug, content);
      setTitle('');
      setSlug('');
      setContent('');
      setEditingPageId(null);
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update page');
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage(id);
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete page');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .update({ is_published: !currentStatus })
        .eq('id', id);
      if (error) {
        throw error;
      }
      toast.success(`Page ${currentStatus ? 'unpublished' : 'published'} successfully`);
      loadPages();
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update page status');
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
        onTogglePublish={handleTogglePublish} 
        onDelete={handleDeletePage} 
      />
    </div>
  );
};
