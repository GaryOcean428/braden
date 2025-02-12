import { PuckEditor } from "@/components/PuckEditor";
import Layout from "@/components/Layout";

export default function Editor() {
  return (
    <Layout>
      <PuckEditor
        overrides={{
          components: {
            Hero: {
              render: (props) => <Hero {...props} />,
              fields: {
                title: { type: "text" },
                subtitle: { type: "text" },
                buttonText: { type: "text" },
              },
            },
            About: {
              render: (props) => <About {...props} />,
              fields: {
                title: { type: "text" },
                content: { type: "textarea" },
              },
            },
            Services: {
              render: (props) => <Services {...props} />,
              fields: {
                title: { type: "text" },
                description: { type: "textarea" },
              },
            },
            Contact: {
              render: (props) => <Contact {...props} />,
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
        }}
      />
    </Layout>
  );
}
