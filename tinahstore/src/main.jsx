import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/tokens.css';
import './styles/base.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ThemeProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <App />
                    <ToastContainer />
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </HelmetProvider>
  </React.StrictMode>
);
