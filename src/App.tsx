
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Recruitment from './pages/recruitment';
import Traineeships from './pages/traineeships';
import Apprenticeships from './pages/apprenticeships';
import Dashboard from './pages/admin/Dashboard';
import ContentManager from './pages/admin/ContentManager';
import ContentEditor from './pages/admin/ContentEditor';
import SiteSettings from './pages/admin/SiteSettings';
import UserManagement from './pages/admin/UserManagement';
import AdminAuth from './pages/auth/AdminAuth';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route index element={<Index />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="traineeships" element={<Traineeships />} />
          <Route path="apprenticeships" element={<Apprenticeships />} />
          <Route path="admin/auth" element={<AdminAuth />} />
          <Route path="admin" element={<Dashboard />} />
          <Route path="admin/content" element={<ContentManager />} />
          <Route path="admin/content/edit" element={<ContentEditor />} />
          <Route path="admin/content/edit/:id" element={<ContentEditor />} />
          <Route path="admin/settings" element={<SiteSettings />} />
          <Route path="admin/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
