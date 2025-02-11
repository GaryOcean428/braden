
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Recruitment from './pages/recruitment';
import Traineeships from './pages/traineeships';
import Apprenticeships from './pages/apprenticeships';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';
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
          <Route path="admin/editor" element={<Editor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
