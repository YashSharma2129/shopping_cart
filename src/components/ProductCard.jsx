import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AddShoppingCart } from '@mui/icons-material';
import { useContext, useRef, useState } from 'react';
import { CartContext } from "../context/CartContext";
import CartAnimation from './CartAnimation';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPositions, setAnimationPositions] = useState(null);
  const buttonRef = useRef(null);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const cartIcon = document.querySelector('.MuiSvgIcon-root[data-testid="ShoppingCartIcon"]');
    const button = buttonRef.current;
    
    if (button && cartIcon) {
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      
      setAnimationPositions({
        start: {
          x: buttonRect.left,
          y: buttonRect.top,
        },
        end: {
          x: cartRect.left,
          y: cartRect.top,
        }
      });
      
      setIsAnimating(true);
      addToCart(product);
      
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  return (
    <motion.div variants={item}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            boxShadow: 6,
          }
        }}
      >
        <Box 
          sx={{
            position: 'relative',
            pt: '100%',
            bgcolor: '#f5f5f5',
            overflow: 'hidden'
          }}
        >
          <motion.img
            src={product.image}
            alt={product.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '1rem'
            }}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.3 }
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Chip 
            label={product.category}
            size="small"
            sx={{ alignSelf: 'flex-start', mb: 1 }}
          />
          <Typography
            variant="h6"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
              lineHeight: 1.2,
              height: '2.4em'
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            ${product.price}
          </Typography>
          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to={`/product/${product.id}`}
              variant="outlined"
              fullWidth
            >
              Details
            </Button>
            <Button
              ref={buttonRef}
              variant="contained"
              onClick={handleAddToCart}
            >
              <AddShoppingCart />
            </Button>
          </Box>
        </CardContent>
        <CartAnimation 
          isAnimating={isAnimating}
          productImage={product.image}
          startPos={animationPositions?.start}
          endPos={animationPositions?.end}
          onComplete={() => setIsAnimating(false)}
        />
      </Card>
    </motion.div>
  );
}
