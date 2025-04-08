
import { ComponentCategory } from '../components/CategoryTabs';
import { 
  LayoutTemplate, 
  Type, 
  Image as ImageIcon, 
  MessageSquare, 
  FileText 
} from 'lucide-react';
import React from 'react';

export const getComponentCategories = (): ComponentCategory[] => [
  {
    id: 'layouts',
    name: 'Layouts',
    icon: React.createElement(LayoutTemplate, { className: "h-4 w-4" }),
    components: [
      {
        id: 'single-column',
        name: 'Single Column',
        description: 'Full width single column layout'
      },
      {
        id: 'two-column',
        name: 'Two Columns',
        description: 'Equal width two-column layout'
      },
      {
        id: 'three-column',
        name: 'Three Columns',
        description: 'Equal width three-column layout',
        isNew: true
      },
      {
        id: 'sidebar-left',
        name: 'Sidebar Left',
        description: 'Layout with left sidebar and main content',
        usageCount: 3
      },
      {
        id: 'sidebar-right',
        name: 'Sidebar Right',
        description: 'Layout with right sidebar and main content'
      }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    icon: React.createElement(Type, { className: "h-4 w-4" }),
    components: [
      {
        id: 'heading',
        name: 'Heading',
        description: 'Section heading with multiple levels',
        usageCount: 12
      },
      {
        id: 'paragraph',
        name: 'Paragraph',
        description: 'Text paragraph with formatting options',
        usageCount: 8
      },
      {
        id: 'list',
        name: 'List',
        description: 'Ordered or unordered list'
      },
      {
        id: 'quote',
        name: 'Quote',
        description: 'Formatted blockquote with attribution'
      },
      {
        id: 'callout',
        name: 'Callout',
        description: 'Highlighted box with important information',
        isNew: true
      }
    ]
  },
  {
    id: 'media',
    name: 'Media',
    icon: React.createElement(ImageIcon, { className: "h-4 w-4" }),
    components: [
      {
        id: 'image',
        name: 'Image',
        description: 'Single image with caption',
        usageCount: 5
      },
      {
        id: 'gallery',
        name: 'Gallery',
        description: 'Image gallery with multiple layouts'
      },
      {
        id: 'video',
        name: 'Video',
        description: 'Embedded video player'
      },
      {
        id: 'carousel',
        name: 'Carousel',
        description: 'Scrolling image or content carousel',
        isNew: true
      }
    ]
  },
  {
    id: 'interactive',
    name: 'Interactive',
    icon: React.createElement(MessageSquare, { className: "h-4 w-4" }),
    components: [
      {
        id: 'form',
        name: 'Form',
        description: 'Customizable form with various field types',
        usageCount: 2
      },
      {
        id: 'cta',
        name: 'Call to Action',
        description: 'Highlighted call-to-action button or section'
      },
      {
        id: 'accordion',
        name: 'Accordion',
        description: 'Collapsible content sections'
      },
      {
        id: 'tabs',
        name: 'Tabs',
        description: 'Tabbed content interface'
      },
      {
        id: 'testimonial',
        name: 'Testimonial',
        description: 'Customer testimonial with image and attribution',
        isNew: true
      }
    ]
  },
  {
    id: 'braden',
    name: 'Braden',
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
    components: [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Full width hero section with background image',
        usageCount: 1
      },
      {
        id: 'services',
        name: 'Services Grid',
        description: 'Display services in a responsive grid'
      },
      {
        id: 'about',
        name: 'About Section',
        description: 'Company profile section with image and text'
      },
      {
        id: 'contact',
        name: 'Contact Form',
        description: 'Styled contact form with validation'
      }
    ]
  }
];
