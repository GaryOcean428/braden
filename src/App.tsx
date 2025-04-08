
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import AdminDashboard from '@/pages/admin/Dashboard';
import SiteEditor from '@/pages/admin/SiteEditor';
import AdminAuth from '@/pages/admin/Auth';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Apprenticeships from '@/pages/apprenticeships';
import Traineeships from '@/pages/traineeships';
import Recruitment from '@/pages/recruitment';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin/auth" replace />;
  }
  
  return <>{children}</>;
};

// NotFound component
const NotFound = () => (
  <Layout showBreadcrumb={false}>
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="px-4 py-2 bg-[#811a2c] text-white rounded hover:bg-[#ab233a]"
      >
        Return Home
      </button>
    </div>
  </Layout>
);

// Page wrapper component to apply Layout to regular pages
const PageWithLayout = ({ component: Component }: { component: React.ComponentType }) => (
  <Layout>
    <Component />
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageWithLayout component={Index} />} />
        <Route path="/contact" element={<PageWithLayout component={Contact} />} />
        <Route path="/apprenticeships" element={<PageWithLayout component={Apprenticeships} />} />
        <Route path="/traineeships" element={<PageWithLayout component={Traineeships} />} />
        <Route path="/recruitment" element={<PageWithLayout component={Recruitment} />} />
        
        {/* Admin routes - no Layout for these */}
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/site-editor" 
          element={
            <ProtectedRoute>
              <SiteEditor />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
