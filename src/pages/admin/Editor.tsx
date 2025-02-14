
import { PuckEditor } from "@/components/PuckEditor";
import Layout from "@/components/Layout";
import type { Config } from "@measured/puck";

export default function Editor() {
  const customConfig: Partial<Config> = {
    components: {
      Hero: {
        fields: {
          title: { type: "text" },
          subtitle: { type: "text" },
          buttonText: { type: "text" },
        },
      },
      About: {
        fields: {
          title: { type: "text" },
          content: { type: "textarea" },
        },
      },
      Services: {
        fields: {
          title: { type: "text" },
          description: { type: "textarea" },
        },
      },
      Contact: {
        fields: {
          title: { type: "text" },
          address: { type: "text" },
          email: { type: "text" },
          phone: { type: "text" },
        },
      },
    },
    fields: {
      text: {
        render: (props) => <input type="text" {...props} />,
      },
      textarea: {
        render: (props) => <textarea {...props} />,
      },
    },
  };

  return (
    <Layout>
      <PuckEditor config={customConfig} />
    </Layout>
  );
}
