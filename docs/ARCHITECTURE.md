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
- Database persistence of theme settings

### Visual Layout Editor

- Component positioning system
- Template-based layout creation
- Basic drag-and-drop interface (Phase 2)
- Resizable panels and columns
- Responsive design controls
- Layout preview system

### Component Library

- Categorized component selection
- Component search functionality
- Component usage tracking
- Component preview
- Custom component creation (Phase 2)
- Branded component templates

### Media Manager

- Image upload and organization
- Logo management
- Basic image editing
- Asset categorization

## Data Architecture

### Content Storage

- Pages stored in content_pages table
- Layout data stored in page_layouts table
- Theme settings in site_settings table
- Media assets managed through Supabase Storage

### Component Registry

- Component definitions in custom_components table
- Serialized layout configurations
- Component properties schema
- Reusable component instances

## Layout System

- Template-based layout creation
- Section and column structure
- Responsive column sizing
- Drag-and-drop component placement
- Layout versioning and publishing

## State Management

- Edit mode context
- Unsaved changes tracking
- Preview state management
- Published vs. draft versions
- Component selection state

## Integration Points

- Theme settings applied to global CSS variables
- Layout data connected to page rendering
- Component library integrated with layout editor
- Media library integrated with content components

### CMS Module

- Admin interface for managing content
- Visual layout editor with drag-and-drop functionality
- Theme customizer for adjusting colors, typography, and layout settings
- Database schema for content storage
