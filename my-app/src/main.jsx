import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App.jsx'
import './css/main.css'

/**
 * System-based dark mode initialization
 * This ensures we use the system preference for dark mode
 * and removes any previously saved preference
 */
(function() {
  // Remove any stored preference to use system setting only
  localStorage.removeItem('darkMode');
  
  // Apply dark mode based on system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ 
      v7_relativeSplatPath: true,
      v7_startTransition: true 
    }}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
