
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagesTabContent } from "./PagesTabContent";
import { BlocksTabContent } from "./BlocksTabContent";

export const ContentTabs = () => {
  return (
    <Tabs defaultValue="pages" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pages">Recent Pages</TabsTrigger>
        <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
      </TabsList>

      <TabsContent value="pages">
        <PagesTabContent />
      </TabsContent>

      <TabsContent value="blocks">
        <BlocksTabContent />
      </TabsContent>
    </Tabs>
  );
};
