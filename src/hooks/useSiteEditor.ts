
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { initializeStorageBuckets } from '@/integrations/supabase/storage';

export function useSiteEditor() {
  const [activeTab, setActiveTab] = useState('theme');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initBuckets();
    checkAdminStatus();
  }, []);

  const initBuckets = async () => {
    try {
      const result = await initializeStorageBuckets();
      console.log('Storage buckets initialized:', result);
    } catch (error) {
      console.error('Error initializing storage buckets:', error);
      toast.error("Storage configuration error", {
        description: "There was an issue setting up media storage."
      });
    }
  };

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        toast.error("Authentication Required", {
          description: "Please log in to access the site editor"
        });
        navigate('/admin/auth');
        return;
      }
      
      // Use the proper RPC function to check admin status
      const { data: isAdminUser, error: adminError } = await supabase.rpc('is_developer_admin');
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        toast.error("Permission Check Failed", {
          description: "Could not verify your admin status"
        });
        navigate('/admin/auth');
        return;
      }

      setIsAdmin(isAdminUser === true);
      
      if (!isAdminUser) {
        toast.error("Access Denied", {
          description: "You don't have permission to access the site editor"
        });
        navigate('/admin/dashboard');
      }
      
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Authentication Error", {
        description: "Failed to verify your permissions"
      });
      navigate('/admin/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      // Check admin status again before publishing
      const { data: isAdminUser, error: adminError } = await supabase.rpc('is_developer_admin');
      
      if (adminError || !isAdminUser) {
        throw new Error("Permission denied");
      }

      // Your existing publish logic here
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error("Publish error:", error);
      throw error;
    }
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  const handleChange = () => {
    setHasUnsavedChanges(true);
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    isAdmin,
    hasUnsavedChanges,
    handlePublish,
    handlePreview,
    handleChange
  };
}
