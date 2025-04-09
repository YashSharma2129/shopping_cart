import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { 
  Container, 
  TextField, 
  Box, 
  Chip, 
  Typography,
  InputAdornment,
  Paper,
  Skeleton
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("https://fakestoreapi.com/products"),
          axios.get("https://fakestoreapi.com/products/categories")
        ]);
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 3, md: 6 }, 
            mb: 4, 
            mt: 2, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.01)',
            }
          }}
        >
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Welcome to Our Shop
          </Typography>
          <Typography 
            variant="h5"
            sx={{
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' } 
            }}
          >
            Discover amazing products at great prices
          </Typography>
        </Paper>
      </motion.div>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '& fieldset': {
                    borderColor: 'primary.main',
                  }
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }}/>
                </InputAdornment>
              )
            }}
          />
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap', 
              '& .MuiChip-root': { 
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }
              }
            }}
          >
            <Chip
              label="All"
              onClick={() => setSelectedCategory("all")}
              color={selectedCategory === "all" ? "primary" : "default"}
              variant={selectedCategory === "all" ? "filled" : "outlined"}
            />
            {categories.map(category => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={400} />
          ))}
        </Box>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'  // Responsive grid
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No products found matching your criteria
        </Typography>
      )}
    </Container>
  );
}
