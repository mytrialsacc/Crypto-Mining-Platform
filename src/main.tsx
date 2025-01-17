import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const setUser = useAuthStore.getState().setUser;
  setUser(session?.user ?? null);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);