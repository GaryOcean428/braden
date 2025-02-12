import { Puck, type Config } from "@measured/puck";
import "@measured/puck/dist/index.css";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { useNavigate } from "react-router-dom";

// Define the configuration for Puck with more detailed props
const config: Config = {
  components: {
    Hero: {
      render: Hero,
      defaultProps: {},
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        buttonText: { type: "text" },
      },
    },
    About: {
      render: About,
      defaultProps: {},
      fields: {
        title: { type: "text" },
        content: { type: "textarea" },
      },
    },
    Services: {
      render: Services,
      defaultProps: {},
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
      },
    },
    Contact: {
      render: Contact,
      defaultProps: {},
      fields: {
        title: { type: "text" },
        address: { type: "text" },
        email: { type: "text" },
        phone: { type: "text" },
      },
    },
  },
  layout: {
    columns: 12,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  dynamicProps: {
    fetchData: async (url: string) => {
      const response = await fetch(url);
      return response.json();
    },
  },
  dynamicFields: {
    fetchData: async (url: string) => {
      const response = await fetch(url);
      return response.json();
    },
  },
  externalDataSources: {
    fetchData: async (url: string) => {
      const response = await fetch(url);
      return response.json();
    },
  },
  serverComponents: {
    fetchData: async (url: string) => {
      const response = await fetch(url);
      return response.json();
    },
  },
  dataMigration: {
    migrate: async (oldData: any) => {
      // Implement your data migration logic here
      return oldData;
    },
  },
};

// Initial data structure
const defaultData = {
  content: [
    {
      type: "Hero",
      props: {},
    },
    {
      type: "Services",
      props: {},
    },
    {
      type: "About",
      props: {},
    },
    {
      type: "Contact",
      props: {},
    },
  ],
  root: {},
};

type PuckData = typeof defaultData;

export function PuckEditor() {
  const [data, setData] = useState<PuckData>(defaultData);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    loadData();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin/auth');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access the editor",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setIsAdmin(true);
  };

  const loadData = async () => {
    try {
      const { data: pageData } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', 'home')
        .single();

      if (pageData?.content) {
        setData(pageData.content as PuckData);
      }
    } catch (error) {
      console.error('Error loading page data:', error);
      toast({
        title: "Error",
        description: "Failed to load page data",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (newData: PuckData) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .upsert({
          title: 'Home Page',
          slug: 'home',
          content: newData,
          is_published: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page content saved successfully",
      });
    } catch (error) {
      console.error('Error saving page data:', error);
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="bg-white p-4 border-b">
          <h1 className="text-2xl font-bold">Page Editor</h1>
          <p className="text-gray-600">Drag and drop components to build your page</p>
        </div>
        <Puck 
          config={config} 
          data={data} 
          onPublish={handleSave}
          renderHeader={({ dispatch, state }) => (
            <div className="flex items-center justify-between p-4 bg-white border-b">
              <Button 
                onClick={() => handleSave(state.data)}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                Save Changes
              </Button>
            </div>
          )}
        />
      </div>
    </ErrorBoundary>
  );
}
