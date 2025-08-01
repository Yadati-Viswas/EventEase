import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { EventsProvider } from './contexts/EventsContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
        <App />
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
