# Braden Website

This repository contains the Braden website with enhanced functionality for lead management, email automation, and task assignment.

## Features

- **Contact Form**: Collects lead information and stores it in Supabase
- **Email Automation**: Sends confirmation emails to leads and notification emails to staff
- **Task Assignment**: Automatically assigns follow-up tasks to staff members based on service type
- **CMS Module**: Allows admin users to manage and update content seamlessly

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GaryOcean428/braden.git
cd braden
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=no-reply@braden.com.au
```

4. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses the following tables in Supabase:

- **leads**: Stores information about leads from the contact form
- **clients**: Stores client information
- **staff**: Stores information about staff members who can be assigned to leads
- **tasks**: Stores follow-up tasks assigned to staff members
- **content_pages**: Stores content pages for the CMS module

## Email Templates

The application includes the following email templates:

- **Lead Confirmation**: Sent to leads after form submission
- **Staff Notification**: Sent to staff members when assigned a new lead

## Deployment

The website is deployed on Vercel. Any changes pushed to the main branch will be automatically deployed.

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Admin Interface for Content Management

The admin interface allows users to manage and update content seamlessly through the CMS module. Admin users can add, edit, and delete content pages, as well as manage media assets and content blocks.

## Contact

For any questions or issues, please contact support@braden.com.au
