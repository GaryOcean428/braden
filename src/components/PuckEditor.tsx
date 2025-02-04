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

export function PuckEditor() {
  const [data, setData] = useState(defaultData);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: pageData } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', 'home')
        .single();

      if (pageData?.content) {
        setData(pageData.content);
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

  const handleSave = async (newData: any) => {
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

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 border-b">
        <h1 className="text-2xl font-bold">Page Editor</h1>
        <p className="text-gray-600">Drag and drop components to build your page</p>
      </div>
      <Puck 
        config={config} 
        data={data} 
        onPublish={handleSave}
        renderHeader={({ actions }) => (
          <div className="flex items-center justify-between p-4 bg-white border-b">
            <Button 
              onClick={actions.publish}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Save Changes
            </Button>
          </div>
        )}
      />
    </div>
  );
}