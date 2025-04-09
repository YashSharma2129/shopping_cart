import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CssBaseline } from '@mui/material';
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import CartProvider from "./context/CartContext";
import { isAuthenticated } from "./utils/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect, useState } from 'react';
import ThemeProvider from "./context/ThemeContext";
import Footer from "./components/Footer";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const location = useLocation();
  return (
    <div className="app-container">
      {location.pathname !== '/login' && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        </Routes>
      </main>
      {location.pathname !== '/login' && <Footer />}
    </div>
  );
};

function App() {
  const [devMode, setDevMode] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDevMode(prev => !prev);
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <CssBaseline />
          <CartProvider>
            <div className={`app-container ${devMode ? 'dev-mode' : ''}`}>
              <AppLayout />
            </div>
          </CartProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
