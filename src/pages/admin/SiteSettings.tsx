
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SiteSettings() {
  const [siteTitle, setSiteTitle] = useState("Braden Group");
  const [siteDescription, setSiteDescription] = useState("People. Employment. Progress.");
  const [contactEmail, setContactEmail] = useState("info@bradengroup.com.au");
  const [featuresEnabled, setFeaturesEnabled] = useState({
    blog: true,
    contactForm: true,
    userRegistration: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real application, this would save to Supabase
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your site settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-title">Site Title</Label>
              <Input 
                id="site-title" 
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea 
                id="site-description" 
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input 
                id="contact-email" 
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="blog-feature">Enable Blog</Label>
              <Switch 
                id="blog-feature"
                checked={featuresEnabled.blog}
                onCheckedChange={(checked) => 
                  setFeaturesEnabled({...featuresEnabled, blog: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-feature">Enable Contact Form</Label>
              <Switch 
                id="contact-feature"
                checked={featuresEnabled.contactForm}
                onCheckedChange={(checked) => 
                  setFeaturesEnabled({...featuresEnabled, contactForm: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="registration-feature">Enable User Registration</Label>
              <Switch 
                id="registration-feature"
                checked={featuresEnabled.userRegistration}
                onCheckedChange={(checked) => 
                  setFeaturesEnabled({...featuresEnabled, userRegistration: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
