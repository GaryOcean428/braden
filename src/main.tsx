
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './integrations/supabase/client.ts';
import { initializeStorageBuckets } from './integrations/supabase/storage'; // Correct import path

// Initialize Supabase storage buckets on app start
initializeStorageBuckets()
  .then(result => {
    if (result.success) {
      console.log('Storage buckets initialized successfully');
    } else {
      console.warn('Storage buckets initialization had issues:', result.error);
    }
  })
  .catch(error => {
    console.error('Failed to initialize storage buckets:', error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
