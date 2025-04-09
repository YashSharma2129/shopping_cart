import React from 'react';
import { AppBar, Toolbar, Button, Badge, IconButton, Typography, Tooltip, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, useMediaQuery } from '@mui/material';
import { ShoppingCart, Home, Logout, DarkMode, LightMode, Menu } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { logout } from "../utils/auth";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: <Home />, text: 'Home', path: '/', badge: null },
    { icon: <ShoppingCart />, text: 'Cart', path: '/cart', badge: cartItems.length },
    { icon: <Logout />, text: 'Logout', onClick: handleLogout }
  ];

  const drawerVariants = {
    closed: {
      x: "-100%",
      boxShadow: "0px 0px 0px rgba(0,0,0,0)"
    },
    open: {
      x: 0,
      boxShadow: "10px 0px 50px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: i => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300
      }
    })
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          height: isMobile ? '56px' : (isScrolled ? '60px' : '70px'),
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <Drawer
            anchor="left"
            open={mobileMenuOpen}
            onClose={() => !isDragging && setMobileMenuOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 240,
                bgcolor: 'transparent',
                boxShadow: 'none',
                border: 'none'
              }
            }}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => {
                setIsDragging(false);
                if (info.offset.x < -50) {
                  setMobileMenuOpen(false);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(18,18,18,0.95), rgba(30,30,30,0.95))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,245,0.95))',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid',
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  fontSize: '12px',
                  color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                }}
              >
                Swipe to close →
              </motion.div>

              <List sx={{ mt: 4 }}>
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.text}
                    custom={i}
                    variants={itemVariants}
                    whileHover={{ x: 15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ListItem
                      button
                      component={item.path ? Link : 'button'}
                      to={item.path}
                      onClick={item.onClick || (() => setMobileMenuOpen(false))}
                      onMouseEnter={() => setHoveredItem(i)}
                      onMouseLeave={() => setHoveredItem(null)}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        my: 1,
                        borderRadius: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: darkMode 
                            ? 'linear-gradient(45deg, #FF8E53, #FE6B8B)'
                            : 'linear-gradient(45deg, #2196F3, #21CBF3)',
                          opacity: hoveredItem === i ? 1 : 0,
                          transition: 'opacity 0.3s'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.badge ? (
                            <Badge 
                              badgeContent={item.badge} 
                              color="error"
                              sx={{
                                '& .MuiBadge-badge': {
                                  transform: hoveredItem === i ? 'scale(1.2)' : 'scale(1)',
                                  transition: 'transform 0.3s'
                                }
                              }}
                            >
                              {item.icon}
                            </Badge>
                          ) : (
                            <Box sx={{ color: darkMode ? '#fff' : '#1a1a1a' }}>
                              {item.icon}
                            </Box>
                          )}
                        </motion.div>
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: hoveredItem === i ? 700 : 400,
                            transition: 'all 0.3s'
                          }
                        }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
}
