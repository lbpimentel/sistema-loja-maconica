import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global SaaS fetch interceptor to inject tenant subdomain automatically
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    options.headers = options.headers || {};
    
    // Extract subdomain (e.g., "major4424" from "major4424.sisoriente.com.br")
    const hostname = window.location.hostname;
    let subdomain = 'major4424'; // Fallback default for local testing
    
    const parts = hostname.split('.');
    if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost' && parts[0] !== '127') {
      subdomain = parts[0];
    }
    
    options.headers['x-tenant-subdomain'] = subdomain;
  }
  return originalFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
