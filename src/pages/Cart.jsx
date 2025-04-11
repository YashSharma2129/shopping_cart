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

      setLoadingMessage('Validating your order...');
      await validateOrder(cartItems, total);
      setCheckoutStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLoadingMessage('Processing payment...');
      const transaction = await processPayment(total);
      setTransactionDetails(transaction);
      setCheckoutStep(3);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLoadingMessage('Finalizing your order...');
      await processCheckout({
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

  // Update the dialog styles and layout
  const renderCheckoutDialog = () => (
    <Dialog
      open={checkoutDialog}
      onClose={() => !processing && setCheckoutDialog(false)}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '95%',
          margin: { xs: '16px', sm: '32px' },
          maxHeight: { xs: '90vh', sm: '80vh' },
          borderRadius: { xs: '12px', sm: '16px' },
          overflowY: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Payment />
          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Secure Checkout
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Stepper 
          activeStep={checkoutStep} 
          orientation={window.innerWidth < 600 ? 'vertical' : 'horizontal'}
          sx={{ 
            mb: { xs: 2, sm: 4 },
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            },
            '& .MuiStepIcon-root': {
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }
          }}
        >
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
    </Dialog>
  );

  const renderAddressForm = () => (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Delivery Address
      </Typography>
      <Grid container spacing={2}>
        { [
          { field: 'fullName', label: 'Full Name', sm: 12 },
          { field: 'street', label: 'Street Address', sm: 12 },
          { field: 'city', label: 'City', sm: 6 },
          { field: 'state', label: 'State', sm: 6 },
          { field: 'pincode', label: 'Pincode', sm: 6, helper: '6 digit pincode' },
          { field: 'phone', label: 'Phone', sm: 6, helper: '10 digit mobile number' }
        ].map(({ field, label, sm, helper }) => (
          <Grid item xs={12} sm={sm} key={field}>
            <TextField
              fullWidth
              label={label}
              value={address[field]}
              onChange={(e) => setAddress(prev => ({ ...prev, [field]: e.target.value }))}
              required
              error={error?.includes(field)}
              helperText={helper || ' '}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }
              }}
            />
          </Grid>
        )) }
      </Grid>
    </Paper>
  );

  const renderOrderSummary = () => (
    <Paper 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3,
        background: theme => theme.palette.mode === 'dark' 
          ? 'linear-gradient(45deg, rgba(66,66,66,0.95), rgba(48,48,48,0.95))'
          : 'linear-gradient(45deg, rgba(255,255,255,0.95), rgba(250,250,250,0.95))',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Order Summary
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        { [
          { label: 'Subtotal', value: subtotal },
          { label: 'GST (18%)', value: tax },
          { label: 'Shipping', value: shippingCost },
        ].map(({ label, value }) => (
          <Box 
            key={label}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 0.5
            }}
          >
            <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {label}:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              ${value.toFixed(2)}
            </Typography>
          </Box>
        ))}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid',
            borderColor: 'divider',
            mt: 1,
            pt: 2
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Total:
          </Typography>
          <Typography 
            variant="h6" 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            ${total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  // Replace the fixed bottom box with a floating section
  const renderCheckoutSection = () => (
    <Paper 
      elevation={3}
      sx={{ 
        mt: 3,
        mb: { xs: 2, sm: 4 },
        p: { xs: 2, sm: 3 },
        background: theme => theme.palette.mode === 'dark' 
          ? 'linear-gradient(45deg, rgba(66,66,66,0.95), rgba(48,48,48,0.95))'
          : 'linear-gradient(45deg, rgba(255,255,255,0.95), rgba(250,250,250,0.95))',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 3 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Total Amount:
          </Typography>
          <Typography 
            variant="h6" 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.4rem' }
            }}
          >
            ${total.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
          flex: { sm: 1 },
          justifyContent: { sm: 'flex-end' }
        }}>
          <Chip
            icon={<AccountBalanceWallet />}
            label={`Balance: $${balance.toFixed(2)}`}
            color={balance >= total ? 'success' : 'error'}
            sx={{ 
              height: { xs: 40, sm: 32 },
              '& .MuiChip-label': {
                fontSize: { xs: '0.9rem', sm: '0.875rem' },
                px: { xs: 2, sm: 1 }
              }
            }}
          />
         <Button
  variant="contained"
  color="primary"
  onClick={handleCheckout}
  disabled={processing || cartItems.length === 0 || balance < total}
  startIcon={processing ? <CircularProgress size={20} /> : <Payment />}
  sx={{
    height: { xs: 'auto', sm: 40 },
    minWidth: 200,
    fontSize: { xs: '1rem', sm: '0.875rem' },
    px: { xs: 3, sm: 2 },
    whiteSpace: 'nowrap'
  }}
>
  {processing ? 'Processing...' : 'Proceed '}
</Button>

        </Box>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
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
          {renderCheckoutSection()}
        </>
      )}
      {renderCheckoutDialog()}
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
