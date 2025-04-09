import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function MiniCartPopover({ open, product, onClose }) {
  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            type: "spring",
            duration: 0.4,
            bounce: 0.2,
            ease: "easeOut"
          }}
          style={{
            position: 'fixed',
            right: '20px',
            top: '70px',
            zIndex: 1000,
            transform: 'none',
            maxWidth: '100vw',
            margin: '0 auto'
          }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              p: 2, 
              width: { xs: 'calc(100vw - 40px)', sm: 300 },
              maxWidth: '100%',
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="subtitle1" color="success.main" gutterBottom>
              ✨ Added to cart!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <img 
                src={product.image} 
                alt={product.title}
                style={{ width: 50, height: 50, objectFit: 'contain' }}
              />
              <Box>
                <Typography variant="body2" noWrap>
                  {product.title}
                </Typography>
                <Typography variant="subtitle2" color="primary">
                  ${product.price}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                component={Link} 
                to="/cart"
                variant="contained" 
                size="small"
                fullWidth
              >
                View Cart
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
