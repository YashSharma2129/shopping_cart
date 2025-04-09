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
  LinearProgress
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
    <Container maxWidth="sm">
      {loginSuccess && <Confetti recycle={false} numberOfPieces={200} />}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: darkMode ? '#121212' : '#f5f5f5',
          },
          particles: {
            number: { value: 50 },
            color: { value: darkMode ? '#ffffff' : '#000000' },
            opacity: { value: 0.3 },
            size: { value: 3 },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
            },
          },
        }}
        style={{ position: 'absolute' }}
      />
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3
        }}
      >
        <AnimatePresence>
          {loginSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", duration: 0.8 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: darkMode ? '#FF8E53' : '#2196F3',
                  textShadow: '0 0 10px rgba(255,255,255,0.5)',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Welcome Back! 🎉
              </Typography>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <ShoppingBag 
                  sx={{ 
                    fontSize: 80,
                    color: darkMode ? '#FF8E53' : '#2196F3'
                  }} 
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4,
                  background: darkMode 
                    ? 'linear-gradient(45deg, rgba(66,66,66,0.9), rgba(48,48,48,0.9))'
                    : 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ShoppingBag 
                      sx={{ 
                        fontSize: 50,
                        color: darkMode ? '#FF8E53' : '#1976d2',
                        mb: 2,
                        filter: 'drop-shadow(0 0 8px rgba(255,142,83,0.5))'
                      }} 
                    />
                  </motion.div>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: darkMode
                        ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to continue shopping
                  </Typography>
                </Box>

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

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Demo Credentials:
                  <br />
                  Username: johnd
                  <br />
                  Password: m38rmF$
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
}
