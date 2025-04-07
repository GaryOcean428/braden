import { useSupabaseInitialization } from '@/hooks/useSupabaseInitialization';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  // Initialize Supabase tables when the app starts
  useSupabaseInitialization();
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
