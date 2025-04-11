import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import Confetti from 'react-confetti';

import { 
  Alert, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper,
  IconButton,
  InputAdornment,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff, ShoppingBag } from '@mui/icons-material';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import zxcvbn from 'zxcvbn';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: darkMode ? '#ffffff' : '#000000' },
      shape: {
        type: "circle",
        stroke: { width: 0, color: "#000000" },
      },
      opacity: {
        value: 0.2,
        random: true,
        animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
      },
      size: {
        value: 3,
        random: true,
        animation: { enable: true, speed: 4, minimumValue: 0.3, sync: false }
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out",
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
          resize: true
        }
      }
    },
    background: {
      color: darkMode ? '#121212' : '#f5f5f5',
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (err) {
      setError(err.message);
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordScore(zxcvbn(newPassword).score);
  };

  return (
    <Container maxWidth="sm" sx={{ 
      position: 'relative',
      minHeight: '100vh',
      px: { xs: 2, sm: 3 }  // Responsive padding
    }}>
      {loginSuccess && <Confetti recycle={false} numberOfPieces={500} />}
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <AnimatePresence mode="wait">
          {loginSuccess ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: darkMode 
                  ? 'rgba(0,0,0,0.9)'
                  : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 360, 360]
                }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                  times: [0, 0.6, 1]
                }}
                style={{
                  textAlign: 'center',
                  padding: '2rem'
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <ShoppingBag 
                    sx={{ 
                      fontSize: 120,
                      color: darkMode ? '#FF8E53' : '#2196F3',
                      filter: `drop-shadow(0 0 30px ${darkMode ? '#FF8E53' : '#2196F3'})`,
                      mb: 3
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: darkMode
                        ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: `0 0 30px ${darkMode ? '#FF8E53' : '#2196F3'}50`,
                      mb: 2
                    }}
                  >
                    Welcome Back! 🎉
                  </Typography>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1.5 }}
                    style={{
                      height: '4px',
                      background: darkMode
                        ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      borderRadius: '2px',
                      marginTop: '1rem'
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', padding: '20px' }}
            >
              <Paper 
                elevation={8}
                sx={{ 
                  p: { xs: 2, sm: 4 },  // Responsive padding
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(66,66,66,0.9), rgba(48,48,48,0.95))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderRadius: { xs: '12px', sm: '16px' },  // Responsive border radius
                  boxShadow: darkMode 
                    ? '0 8px 32px rgba(255,142,83,0.2)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '200%',
                    height: '100%',
                    background: `linear-gradient(
                      to right,
                      transparent,
                      ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'},
                      transparent
                    )`,
                    animation: 'shine 3s infinite',
                  },
                  '@keyframes shine': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                  }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ textAlign: 'center' }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ShoppingBag 
                      sx={{ 
                        fontSize: 60,
                        color: darkMode ? '#FF8E53' : '#2196F3',
                        filter: 'drop-shadow(0 0 10px rgba(255,142,83,0.3))',
                        mb: 2
                      }} 
                    />
                  </motion.div>
                  
                  <Typography 
                    variant="h3" 
                    sx={{
                      fontWeight: 800,
                      background: darkMode
                        ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    Welcome Back
                  </Typography>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                  </motion.div>
                )}

                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: darkMode ? '#FF8E53' : '#1976d2',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    margin="normal"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isLoading}
                      sx={{ 
                        mt: 3,
                        mb: 2,
                        background: darkMode
                          ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                          : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: darkMode
                          ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
                          : '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(255,255,255,0.2)',
                          transform: isLoading ? 'translateX(0%)' : 'translateX(-100%)',
                          transition: 'transform 1s linear',
                        }
                      }}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    align="center"
                    sx={{ 
                      mt: 3,
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: darkMode 
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      Demo Credentials:
                      <br />
                      Username: johnd
                      <br />
                      Password: m38rmF$
                    </motion.div>
                  </Typography>
                </motion.div>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
}
