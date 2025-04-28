
import { BrowserRouter, Routes as RouterRoutes, Route, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Service from '@/pages/Service';
import Apprenticeships from '@/pages/apprenticeships';
import Traineeships from '@/pages/traineeships';
import Recruitment from '@/pages/recruitment';

// Admin routes
import AdminAuth from '@/pages/auth/AdminAuth';
import Dashboard from '@/pages/admin/Dashboard';
import ContentManager from '@/pages/admin/ContentManager';
import SiteEditor from '@/pages/admin/SiteEditor';
import SiteSettings from '@/pages/admin/SiteSettings';
import UserManagement from '@/pages/admin/UserManagement';
import Clients from '@/pages/admin/Clients';
import Leads from '@/pages/admin/Leads';
import Emails from '@/pages/admin/Emails';
import Staff from '@/pages/admin/Staff';
import Tasks from '@/pages/admin/Tasks';

export function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Index />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services/:serviceId" element={<Service />} />
          <Route path="apprenticeships" element={<Apprenticeships />} />
          <Route path="traineeships" element={<Traineeships />} />
          <Route path="recruitment" element={<Recruitment />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="editor" element={<SiteEditor />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="clients" element={<Clients />} />
          <Route path="leads" element={<Leads />} />
          <Route path="emails" element={<Emails />} />
          <Route path="staff" element={<Staff />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}

export default Routes;
