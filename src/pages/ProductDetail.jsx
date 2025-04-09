import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import QRCode from "qrcode.react";
import { motion } from "framer-motion";
import { 
  Container, 
  Grid, 
  Box,
  Typography, 
  Button, 
  Paper,
  Rating,
  Skeleton,
  Tooltip,
  IconButton,
  Dialog,
  Alert
} from '@mui/material';
import { AddShoppingCart, Share } from '@mui/icons-material';

export default function ProductDetail() {
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch((error) => console.error("Error sharing", error));
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [showQR, setShowQR] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.height;
    setImageScale(1 + Math.min(x * y, 0.5));
  };

  useEffect(() => {
    setError(null);
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        setError("Failed to load product. Please try again later.");
      });
  }, [id]);

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.img 
                src={product.image} 
                alt={product.title}
                whileHover={{ scale: 1.1 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                style={{ 
                  width: '100%', 
                  maxHeight: '500px',
                  objectFit: 'contain',
                  cursor: 'grab',
                  scale: imageScale,
                  transition: 'scale 0.2s'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {product.title}
              </Typography>
              <Rating value={product.rating?.rate || 0} readOnly />
              <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                ${product.price}
              </Typography>
              <Typography variant="body1" sx={{ my: 3 }}>
                {product.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<AddShoppingCart />}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
                <Tooltip title="Share Product">
                  <IconButton onClick={shareProduct} color="primary">
                    <Share />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Dialog open={showQR} onClose={() => setShowQR(false)}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Share this product
          </Typography>
          <QRCode value={window.location.href} size={256} />
        </Paper>
      </Dialog>

      <Dialog open={imageZoom} onClose={() => setImageZoom(false)} maxWidth="lg">
        <img 
          src={product.image} 
          alt={product.title}
          style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }}
        />
      </Dialog>
    </Container>
  );
}
