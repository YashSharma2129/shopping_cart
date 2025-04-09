import { createContext, useState } from "react";
import { Snackbar, Alert } from '@mui/material';
import MiniCartPopover from "../components/MiniCartPopover";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [addedProduct, setAddedProduct] = useState(null);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const addToCart = async (product) => {
    try {
      setIsLoading(true);
      setError(null);
      const exists = cartItems.find(item => item.id === product.id);
      if (exists) {
        setCartItems(cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
      
      // Add cart icon bounce
      const cartIcon = document.querySelector('[data-testid="ShoppingCartIcon"]');
      if (cartIcon) {
        cartIcon.classList.add('cart-icon-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-icon-bounce'), 1000);
      }
      
      setAddedProduct(product);
      // Delay showing mini cart until animation completes
      setTimeout(() => {
        setShowMiniCart(true);
        // Keep mini cart visible for 4 seconds
        setTimeout(() => setShowMiniCart(false), 4000);
      }, 1000);
      
      showToast('Item added to cart');
    } catch (err) {
      setError('Failed to add item to cart');
      showToast('Failed to add item to cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id, qty) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Cart cleared', 'info');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      addedProduct,
      showMiniCart,
      setShowMiniCart,
      isLoading,
      error
    }}>
      {children}
      <MiniCartPopover 
        open={showMiniCart} 
        product={addedProduct}
        onClose={() => setShowMiniCart(false)}
      />
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </CartContext.Provider>
  );
}
