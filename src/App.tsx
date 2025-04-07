import { useSupabaseInitialization } from '@/hooks/useSupabaseInitialization';

function App() {
  // Initialize Supabase tables when the app starts
  useSupabaseInitialization();
  
  // Return the original App component without modifications
  // This will maintain the existing routing and component structure
  return null;
}

export default App;
