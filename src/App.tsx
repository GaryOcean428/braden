
import { useSupabaseInitialization } from '@/hooks/useSupabaseInitialization';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Index from './pages/Index';
// Import Contact page correctly
import Contact from './pages/Contact';
import Dashboard from './pages/admin/Dashboard';
import ContentEditor from './pages/admin/ContentEditor';
import ContentManager from './pages/admin/ContentManager';
import SiteSettings from './pages/admin/SiteSettings';
import UserManagement from './pages/admin/UserManagement';
import AdminAuth from './pages/auth/AdminAuth';
import { Debug } from './components/Debug';
import { useState, useEffect } from 'react';

function App() {
  // Initialize Supabase tables when the app starts
  useSupabaseInitialization();
  
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    // Check if debug mode is enabled via URL parameter
    const queryParams = new URLSearchParams(window.location.search);
    const debugMode = queryParams.get('debug') === 'true';
    setShowDebug(debugMode || process.env.NODE_ENV === 'development');
    
    // Output helpful diagnostics on startup
    if (debugMode || process.env.NODE_ENV === 'development') {
      console.info('App initialized in debug mode');
      console.info('Environment:', process.env.NODE_ENV);
      console.info('Supabase URL:', 'https://iykrauzuutvmnxpqppzk.supabase.co');
    }
  }, []);
  
  return (
    <Router>
      <Toaster position="top-center" richColors />
      {showDebug && <Debug />}
      <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/admin" element={<Layout><Dashboard /></Layout>} />
        <Route path="/admin/content-editor" element={<Layout><ContentEditor /></Layout>} />
        <Route path="/admin/content-manager" element={<Layout><ContentManager /></Layout>} />
        <Route path="/admin/settings" element={<Layout><SiteSettings /></Layout>} />
        <Route path="/admin/users" element={<Layout><UserManagement /></Layout>} />
        <Route path="/admin/auth" element={<AdminAuth />} />
      </Routes>
    </Router>
  );
}

export default App;
