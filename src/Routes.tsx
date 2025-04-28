import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Service from '@/pages/Service';
import Apprenticeships from '@/pages/apprenticeships';
import Traineeships from '@/pages/traineeships';
import Recruitment from '@/pages/recruitment';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Permission } from '@/types/permissions';

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

function RequirePermission({ children, permission }: { children: React.ReactNode; permission: Permission }) {
  const { checkPermission, loading } = useAdminPermissions();
  
  if (loading) return null;
  if (!checkPermission(permission)) return <Navigate to="/admin/auth" replace />;
  return <>{children}</>;
}

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
          <Route index element={
            <RequirePermission permission="users.view">
              <Dashboard />
            </RequirePermission>
          } />
          <Route path="content" element={
            <RequirePermission permission="content.view">
              <ContentManager />
            </RequirePermission>
          } />
          <Route path="editor" element={
            <RequirePermission permission="site.edit">
              <SiteEditor />
            </RequirePermission>
          } />
          <Route path="settings" element={
            <RequirePermission permission="site.edit">
              <SiteSettings />
            </RequirePermission>
          } />
          <Route path="users" element={
            <RequirePermission permission="users.view">
              <UserManagement />
            </RequirePermission>
          } />
          <Route path="clients" element={
            <RequirePermission permission="clients.view">
              <Clients />
            </RequirePermission>
          } />
          <Route path="leads" element={
            <RequirePermission permission="leads.view">
              <Leads />
            </RequirePermission>
          } />
          <Route path="emails" element={
            <RequirePermission permission="leads.manage">
              <Emails />
            </RequirePermission>
          } />
          <Route path="staff" element={
            <RequirePermission permission="leads.manage">
              <Staff />
            </RequirePermission>
          } />
          <Route path="tasks" element={
            <RequirePermission permission="leads.manage">
              <Tasks />
            </RequirePermission>
          } />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}

export default Routes;
