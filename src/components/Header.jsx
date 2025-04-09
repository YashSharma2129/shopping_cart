import { AppBar, Toolbar, Button, Badge, IconButton, Typography, Tooltip, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ShoppingCart, Home, Logout, DarkMode, LightMode, Menu } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { logout } from "../utils/auth";
import { ThemeContext } from "../context/ThemeContext";
import { Box } from '@mui/material';

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={isScrolled ? 4 : 0}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.2)',
          color: darkMode ? '#fff' : '#1a1a1a',
          transition: 'all 0.3s ease-in-out',
          transform: `translateY(${isScrolled ? 0 : 0}px)`,
          height: isScrolled ? '60px' : '70px',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </IconButton>
            <Tooltip title="Home">
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/"
                sx={{
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <Home />
              </IconButton>
            </Tooltip>
            <Typography 
              variant="h6" 
              component="span" 
              sx={{ 
                ml: 1,
                display: { xs: 'none', sm: 'block' },
                background: darkMode 
                  ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                  : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}
            >
              Shop
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              '& .MuiIconButton-root': {
                color: darkMode ? '#fff' : '#1a1a1a',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: darkMode ? '#fff' : '#2196F3'
                }
              }
            }}
          >
            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
              <IconButton 
                color="inherit" 
                onClick={toggleTheme}
                sx={{
                  animation: darkMode ? 'spin 0.5s ease-in-out' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Cart">
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/cart"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Badge 
                  badgeContent={cartItems.length}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: cartItems.length ? 'cartBounce 0.5s ease' : 'none',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                      '&:hover': {
                        transform: 'scale(1.2)',
                      }
                    },
                    '@keyframes cartBounce': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.4)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>

            <Button 
              color="inherit" 
              onClick={handleLogout} 
              startIcon={<Logout />}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '20px',
                color: darkMode ? '#fff' : '#1a1a1a',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: darkMode 
                    ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: '#fff',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Logout
            </Button>
            
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{ 
                display: { xs: 'flex', sm: 'none' },
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            bgcolor: darkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            color: darkMode ? '#fff' : '#1a1a1a',
          }
        }}
      >
        <List>
          <ListItem button component={Link} to="/" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon><Home sx={{ color: darkMode ? '#fff' : '#1a1a1a' }} /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/cart" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCart sx={{ color: darkMode ? '#fff' : '#1a1a1a' }} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><Logout sx={{ color: darkMode ? '#fff' : '#1a1a1a' }} /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
