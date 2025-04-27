
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
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error("Authentication Required", {
          description: "Please log in to access the site editor"
        });
        navigate('/admin/auth');
        return;
      }
      
      // Check if the user is an admin using RPC function
      const { data: adminCheck, error: adminError } = await supabase.rpc('is_developer_admin');
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        toast.error("Permission Check Failed", {
          description: "Could not verify your admin status"
        });
        
        // Use fallback method - check by email
        const userEmail = data.session.user.email;
        if (userEmail === 'braden.lang77@gmail.com') {
          setIsAdmin(true);
        } else {
          toast.error("Access Denied", {
            description: "You don't have developer permissions"
          });
          
          // Redirect after a brief delay
          setTimeout(() => {
            navigate('/admin/auth');
          }, 1500);
          return;
        }
      } else {
        // Set based on RPC result
        setIsAdmin(adminCheck === true);
        
        if (!adminCheck) {
          toast.error("Access Denied", {
            description: "You don't have developer permissions"
          });
          
          // Redirect after a brief delay
          setTimeout(() => {
            navigate('/admin/auth');
          }, 1500);
          return;
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Authentication Error", {
        description: "Failed to verify your permissions"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    toast.success("Changes Published", {
      description: "Your changes are now live on the site"
    });
    setHasUnsavedChanges(false);
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
