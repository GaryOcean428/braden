
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageManager from '@/components/admin/ImageManager'; // Changed from { ImageManager } to default import
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SiteSettings {
  id?: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  analytics_code?: string;
  updated_at?: string;
}

export const SiteSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Braden Group',
    site_description: 'People. Employment. Progress.',
    contact_email: 'info@bradengroup.com.au',
    contact_phone: '',
    address: '',
    logo_url: '',
    primary_color: '#ab233a',
    secondary_color: '#cbb26a',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    analytics_code: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Load settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to access site settings');
      }
      
      console.log('Fetching settings with auth token:', session.access_token.substring(0, 10) + '...');
      
      // Try to fetch settings using a type cast to avoid type errors
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1) as { data: SiteSettings[] | null, error: any };
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSettings(data[0]);
        setSettingsId(data[0].id);
        console.log('Loaded existing settings:', data[0]);
      } else {
        // No settings found, create default settings
        console.log('No settings found, creating default settings...');
        await createDefaultSettings();
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError('Failed to load site settings. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const defaultSettings = {
        site_name: 'Braden Group',
        site_description: 'Professional services and consulting',
        contact_email: 'info@bradengroup.com.au',
        contact_phone: '',
        address: '',
        logo_url: '',
        primary_color: '#ab233a',
        secondary_color: '#cbb26a',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        analytics_code: '',
        updated_at: new Date().toISOString(),
      };
      
      // Use a type cast to avoid type errors
      const { data, error } = await supabase
        .from('site_settings' as any)
        .insert(defaultSettings)
        .select() as { data: SiteSettings[] | null, error: any };
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSettings(data[0]);
        setSettingsId(data[0].id);
        console.log('Created default settings:', data[0]);
      }
    } catch (err: any) {
      console.error('Error creating default settings:', err);
      setError('Failed to create default settings. Please try refreshing the page.');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Get current user session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to update site settings');
      }
      
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString(),
      };
      
      if (settingsId) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings' as any)
          .update(updatedSettings)
          .eq('id', settingsId) as { error: any };
        
        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('site_settings' as any)
          .insert(updatedSettings)
          .select() as { data: SiteSettings[] | null, error: any };
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setSettingsId(data[0].id);
        }
      }
      
      toast("Settings saved", {
        description: "Your site settings have been updated successfully.",
      });
      
      console.log('Settings saved successfully');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
      
      toast("Error saving settings", {
        description: "There was a problem saving your settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (url: string) => {
    setSettings(prev => ({ ...prev, logo_url: url }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleRefresh = () => {
    fetchSettings();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Site Settings</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <CardDescription>
          Configure global settings for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 pt-4">
                <div>
                  <label htmlFor="site_name" className="block text-sm font-medium mb-1">
                    Site Name
                  </label>
                  <Input
                    id="site_name"
                    name="site_name"
                    value={settings.site_name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="site_description" className="block text-sm font-medium mb-1">
                    Site Description
                  </label>
                  <Textarea
                    id="site_description"
                    name="site_description"
                    value={settings.site_description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Logo
                  </label>
                  {settings.logo_url && (
                    <div className="mb-4 border rounded-lg overflow-hidden p-4 bg-gray-50">
                      <img 
                        src={settings.logo_url} 
                        alt="Logo" 
                        className="max-h-24 object-contain"
                      />
                    </div>
                  )}
                  
                  <ImageManager 
                    onImageSelect={handleLogoSelect}
                    title="Select Logo"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4 pt-4">
                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium mb-1">
                    Contact Email
                  </label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium mb-1">
                    Contact Phone
                  </label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={settings.contact_phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Social Media</h3>
                  
                  <div>
                    <label htmlFor="social_facebook" className="block text-sm font-medium mb-1">
                      Facebook URL
                    </label>
                    <Input
                      id="social_facebook"
                      name="social_facebook"
                      value={settings.social_facebook || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="social_twitter" className="block text-sm font-medium mb-1">
                      Twitter URL
                    </label>
                    <Input
                      id="social_twitter"
                      name="social_twitter"
                      value={settings.social_twitter || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="social_instagram" className="block text-sm font-medium mb-1">
                      Instagram URL
                    </label>
                    <Input
                      id="social_instagram"
                      name="social_instagram"
                      value={settings.social_instagram || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="social_linkedin" className="block text-sm font-medium mb-1">
                      LinkedIn URL
                    </label>
                    <Input
                      id="social_linkedin"
                      name="social_linkedin"
                      value={settings.social_linkedin || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4 pt-4">
                <div>
                  <label htmlFor="primary_color" className="block text-sm font-medium mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary_color"
                      name="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={handleInputChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      name="primary_color"
                      value={settings.primary_color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="secondary_color" className="block text-sm font-medium mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary_color"
                      name="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={handleInputChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      name="secondary_color"
                      value={settings.secondary_color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 pt-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium mb-1">
                    Meta Title
                  </label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={settings.meta_title}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium mb-1">
                    Meta Description
                  </label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={settings.meta_description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="meta_keywords" className="block text-sm font-medium mb-1">
                    Meta Keywords
                  </label>
                  <Input
                    id="meta_keywords"
                    name="meta_keywords"
                    value={settings.meta_keywords}
                    onChange={handleInputChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 pt-4">
                <div>
                  <label htmlFor="analytics_code" className="block text-sm font-medium mb-1">
                    Analytics Tracking Code
                  </label>
                  <Textarea
                    id="analytics_code"
                    name="analytics_code"
                    value={settings.analytics_code}
                    onChange={handleInputChange}
                    rows={6}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <p className="mt-4 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
