
import { PuckEditor } from "@/components/PuckEditor";
import Layout from "@/components/Layout";
import type { Config } from "@measured/puck";
import { Hero, About, Services, Contact } from "@/components/PuckEditor";

export default function Editor() {
  const customConfig: Partial<Config> = {
    components: {
      Hero: {
        render: Hero,
        fields: {
          title: { type: "text" },
          subtitle: { type: "text" },
          buttonText: { type: "text" },
        },
      },
      About: {
        render: About,
        fields: {
          title: { type: "text" },
          content: { type: "textarea" },
        },
      },
      Services: {
        render: Services,
        fields: {
          title: { type: "text" },
          description: { type: "textarea" },
        },
      },
      Contact: {
        render: Contact,
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
