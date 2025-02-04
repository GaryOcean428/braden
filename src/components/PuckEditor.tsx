import { Puck, type Config } from "@measured/puck";
import "@measured/puck/dist/index.css";
import { Button } from "./ui/button";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";

// Define the configuration for Puck
const config: Config = {
  components: {
    Hero: {
      render: Hero,
      defaultProps: {},
    },
    About: {
      render: About,
      defaultProps: {},
    },
    Services: {
      render: Services,
      defaultProps: {},
    },
    Contact: {
      render: Contact,
      defaultProps: {},
    },
  },
};

// Initial data structure
const initialData = {
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
  return (
    <div className="min-h-screen">
      <Puck config={config} data={initialData} />
    </div>
  );
}