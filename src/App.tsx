import { useSupabaseInitialization } from '@/hooks/useSupabaseInitialization';

function App() {
  // Initialize Supabase tables when the app starts
  useSupabaseInitialization();
  
  // Rest of your App component...
  return (
    // Your existing App component JSX
  );
}

export default App;
