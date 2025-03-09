
import Layout from "@/components/Layout";
import { ContentList } from "@/components/content/ContentList";

export default function ContentManager() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <ContentList />
      </div>
    </Layout>
  );
}
