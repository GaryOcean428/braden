import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageManager from '@/components/admin/ImageManager';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const ContentManager: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load content items when component mounts
  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the generic query method with type assertions to avoid type errors
      const { data, error } = await supabase
        .from('content' as any)
        .select('*')
        .order('created_at', { ascending: false }) as { data: ContentItem[] | null, error: any };
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (err: any) {
      console.error('Error fetching content:', err);
      setError('Failed to load content items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      content: '',
      image_url: '',
    });
    setIsEditing(true);
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;
    
    try {
      setError(null);
      
      const { error } = await supabase
        .from('content' as any)
        .delete()
        .eq('id', id) as { error: any };
      
      if (error) throw error;
      
      // Refresh the list
      fetchContentItems();
      
      // Clear selection if the deleted item was selected
      if (selectedItem?.id === id) {
        setSelectedItem(null);
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      if (selectedItem) {
        // Update existing item
        const { error } = await supabase
          .from('content' as any)
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedItem.id) as { error: any };
        
        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('content' as any)
          .insert({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }) as { error: any };
        
        if (error) throw error;
      }
      
      // Refresh the list
      fetchContentItems();
      
      // Reset form
      setIsEditing(false);
      setSelectedItem(null);
    } catch (err: any) {
      console.error('Error saving content:', err);
      setError('Failed to save content item');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    const confirmed = window.confirm(`Are you sure you want to ${action} selected items?`);
    if (!confirmed) return;

    try {
      setError(null);

      if (action === 'delete') {
        const { error } = await supabase
          .from('content' as any)
          .delete()
          .in('id', selectedItems) as { error: any };

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content' as any)
          .update({ is_published: action === 'publish' })
          .in('id', selectedItems) as { error: any };

        if (error) throw error;
      }

      // Refresh the list
      fetchContentItems();
      setSelectedItems([]);
    } catch (err: any) {
      console.error(`Error performing bulk action (${action}):`, err);
      setError(`Failed to ${action} selected items`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Manager</CardTitle>
        <CardDescription>
          Manage website content and images
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Featured Image
              </label>
              {formData.image_url && (
                <div className="mb-4 border rounded-lg overflow-hidden">
                  <img 
                    src={formData.image_url} 
                    alt="Featured" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <ImageManager 
                onImageSelect={handleImageSelect}
                title="Select Featured Image"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : selectedItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={handleSearch}
                className="max-w-xs"
              />
              <Button onClick={handleCreateNew} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Content
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No content items found. Create some content to get started.
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredItems.length}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => handleBulkAction('publish')}>
                  Publish
                </Button>
                <Button onClick={() => handleBulkAction('unpublish')}>
                  Unpublish
                </Button>
                <Button variant="destructive" onClick={() => handleBulkAction('delete')}>
                  Delete
                </Button>
              </div>
            )}
            
            {error && (
              <p className="mt-4 text-sm text-red-500">
                {error}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
