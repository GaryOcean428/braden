
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeStorageBuckets } from './integrations/supabase/client.ts';

// Initialize storage buckets before rendering the app
initializeStorageBuckets().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch(error => {
  console.error('Failed to initialize storage buckets:', error);
  // Continue rendering the app even if bucket initialization fails
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
