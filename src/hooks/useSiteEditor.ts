
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
    initStorage();
    checkAdminStatus();
  }, []);

  const initStorage = async () => {
    try {
      const result = await initializeStorageBuckets();
      console.log('Storage initialization result:', result);
      
      if (!result.success) {
        console.warn('Storage initialization had issues:', result.error);
        toast.warning("Storage Warning", {
          description: "Some storage features may not work properly."
        });
      } else if (result.warning) {
        console.warn('Storage warning:', result.warning);
        toast.info("Storage Info", {
          description: result.warning
        });
      }
    } catch (error) {
      console.error('Error during storage initialization:', error);
      // Don't show error toast for storage issues - they're not critical for basic functionality
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
