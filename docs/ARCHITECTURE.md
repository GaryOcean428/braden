
# Visual Website Customization - Architecture

## Core Components

### Admin Dashboard
- Enhanced administration interface
- Role-based access control
- Navigation between editing modes

### Content Management System
- Page management with visual previews
- Rich text editing capabilities
- Structured content blocks
- Media integration

### Theme Customizer
- Color palette management based on brand guidelines
- Typography controls
- Spacing and layout adjustments
- Global style settings

### Visual Layout Editor
- Component positioning system
- Drag-and-drop interface
- Resizable panels
- Responsive design controls

### Media Manager
- Image upload and organization
- Logo management
- Basic image editing
- Asset categorization

## Data Architecture

### Content Storage
- Pages stored in content_pages table
- Content blocks in content_blocks table
- Theme settings in site_settings table
- Media assets managed through Supabase Storage

### Component Registry
- Dynamic component loading system
- Serialized layout configurations
- Component properties schema

## State Management
- Edit mode context
- Unsaved changes tracking
- Preview state management
- Published vs. draft versions
