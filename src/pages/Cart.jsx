import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from "framer-motion";
import {ThemeContext} from "../context/ThemeContext";
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  TextField,
  Box,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
    const { darkMode } = useContext(ThemeContext);
  const [showConfetti, setShowConfetti] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setShowConfetti(true);
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleDragEnd = (event, info, itemId) => {
    if (Math.abs(info.offset.x) > 100) {
      removeFromCart(itemId);
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button 
            component={Link} 
            to="/"
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(event, info) => handleDragEnd(event, info, item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Paper sx={{ 
                  p: 2, 
                  mb: 2,
                  background: darkMode 
                    ? 'linear-gradient(45deg, rgba(66,66,66,0.9), rgba(48,48,48,0.9))'
                    : 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))',
                  cursor: 'grab'
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100px' }} />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography color="primary">${item.price}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton onClick={() => removeFromCart(item.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Typography variant="h5" gutterBottom>
              Total: ${total.toFixed(2)}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}

      <Snackbar 
        open={orderPlaced} 
        autoHideDuration={4000} 
        onClose={() => setOrderPlaced(false)}
      >
        <Alert severity="success">Order placed successfully!</Alert>
      </Snackbar>
    </Container>
  );
}
