import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { WalletContext } from "../context/WalletContext";
import { processCheckout, validateOrder, calculateTax, calculateShipping, validateAddress } from "../services/checkout";
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import { 
  Container, Paper, Typography, Button, IconButton, TextField,
  Box, Grid, Snackbar, Alert, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel
} from '@mui/material';
import { Delete, AccountBalanceWallet, Payment, Done } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);
  const { balance, processPayment, loading: walletLoading } = useContext(WalletContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const [error, setError] = useState(null);  // Add error state
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + tax + shippingCost;

  useEffect(() => {
    if (address.pincode) {
      try {
        const shipping = calculateShipping(address.pincode);
        setShippingCost(shipping);
        setTax(calculateTax(subtotal));
      } catch (error) {
        console.error('Error calculating costs:', error);
      }
    }
  }, [address.pincode, subtotal]);

  const handleCheckout = async () => {
    setCheckoutDialog(true);
    setProcessing(true);
    setError(null);
    setTransactionDetails(null);
    
    try {
      // Step 1: Validate Address
      setLoadingMessage('Validating delivery address...');
      validateAddress(address);
      setCheckoutStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Validate Order
      setLoadingMessage('Validating your order...');
      await validateOrder(cartItems, total);
      setCheckoutStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Process Payment
      setLoadingMessage('Processing payment...');
      const transaction = await processPayment(total);
      setTransactionDetails(transaction);
      setCheckoutStep(3);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Complete Order
      setLoadingMessage('Finalizing your order...');
      const orderResult = await processCheckout({
        items: cartItems,
        totalAmount: total,
        address,
        timestamp: new Date(),
        transactionId: transaction.id
      });
      setCheckoutStep(4);
      setShowConfetti(true);
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      setError(error.message);
      setCheckoutStep(0);
    } finally {
      setProcessing(false);
      setLoadingMessage('');
    }
  };

  const handleDragEnd = (event, info, itemId) => {
    if (Math.abs(info.offset.x) > 100) {
      removeFromCart(itemId);
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };

  const steps = ['Address Validation', 'Order Validation', 'Payment', 'Confirmation'];

  const renderDialogContent = () => (
    <DialogContent>
      <Stepper activeStep={checkoutStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        {processing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>{loadingMessage}</Typography>
          </Box>
        ) : checkoutStep === 4 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Done color="success" sx={{ fontSize: 48 }} />
            <Typography color="success.main" variant="h6">
              Order Completed Successfully!
            </Typography>
            {transactionDetails && (
              <Paper sx={{ p: 2, width: '100%', bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>Transaction Details:</Typography>
                <Typography variant="body2">ID: {transactionDetails.id}</Typography>
                <Typography variant="body2">Amount: ${total.toFixed(2)}</Typography>
                <Typography variant="body2">
                  Time: {new Date().toLocaleTimeString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Status: Confirmed
                </Typography>
              </Paper>
            )}
          </Box>
        ) : null}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </DialogContent>
  );

  const renderCheckoutDialog = () => (
    <Dialog
      open={checkoutDialog}
      onClose={() => !processing && setCheckoutDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Payment />
          Secure Checkout
        </Box>
      </DialogTitle>
      {renderDialogContent()}
      <DialogActions>
        <Button
          onClick={() => setCheckoutDialog(false)}
          disabled={processing}
        >
          {checkoutStep === 4 ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderAddressForm = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Delivery Address</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            value={address.street}
            onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={address.city}
            onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            value={address.state}
            onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
            required
            helperText="Enter 6 digit pincode"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={address.phone}
            onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
            required
            helperText="10 digit mobile number"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderOrderSummary = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Subtotal:</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>GST (18%):</Typography>
          <Typography>${tax.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Shipping:</Typography>
          <Typography>${shippingCost.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', mt: 1 }}>
          <Typography>Total:</Typography>
          <Typography>${total.toFixed(2)}</Typography>
        </Box>
      </Box>
    </Paper>
  );

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
          {renderAddressForm()}
          {renderOrderSummary()}
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
                  p: { xs: 2, sm: 4 },  // Responsive padding
                  mb: 2,
                  background: darkMode 
                    ? 'linear-gradient(45deg, rgba(66,66,66,0.9), rgba(48,48,48,0.9))'
                    : 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))',
                  cursor: 'grab' 
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4} md={3}>
                      <img 
                        src={item.image}
                        alt={item.title}
                        style={{ 
                          width: '100%', 
                          maxWidth: '100px',
                          margin: '0 auto',
                          display: 'block'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={5}>
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '1.25rem' }  // Responsive font size
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography color="primary">${item.price}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={2}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={2} sx={{ textAlign: 'right' }}>
                      <IconButton onClick={() => removeFromCart(item.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Total: ${total.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={<AccountBalanceWallet />}
                label={`Balance: $${balance.toFixed(2)}`}
                color={balance >= total ? 'success' : 'error'}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={processing || cartItems.length === 0 || balance < total}
                startIcon={processing ? <CircularProgress size={20} /> : <Payment />}
              >
                {processing ? 'Processing...' : 'Checkout'}
              </Button>
            </Box>
          </Box>
          {renderCheckoutDialog()}
          <Snackbar
            open={orderPlaced}
            autoHideDuration={4000}
            onClose={() => setOrderPlaced(false)}
          >
            <Alert severity="success">Order placed successfully!</Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
}
