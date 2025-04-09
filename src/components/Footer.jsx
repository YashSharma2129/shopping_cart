import { useState, useContext, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, IconButton, Tooltip, Collapse, Fab, TextField, Snackbar } from '@mui/material';
import { GitHub, Code, Coffee, Favorite, KeyboardArrowUp, Twitter, LinkedIn, Email } from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import Confetti from 'react-confetti';

export default function Footer() {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const [clickCount, setClickCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleEasterEgg = () => {
    setClickCount(prev => {
      if (prev + 1 === 5) {
        setShowConfetti(true);
        toggleTheme();
        setTimeout(() => setShowConfetti(false), 3000);
        return 0;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContact = (e) => {
    e.preventDefault();
    setSnackbarOpen(true);
    setShowContactForm(false);
  };

  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Rise and shine, shopper!";
    if (hour < 17) return "☀️ Happy shopping!";
    if (hour < 21) return "🌆 Evening retail therapy?";
    return "🌙 Late night shopping spree?";
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FF8E53, #FE6B8B, #2196F3, #21CBF3)',
          backgroundSize: '300% 100%',
          animation: 'gradient 15s ease infinite',
        },
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }}
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ cursor: 'default' }}
        >
          {getTimeBasedMessage()}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap',
          mb: 2
        }}
      >
        {['GitHub', 'Twitter', 'LinkedIn'].map((platform) => (
          <IconButton
            key={platform}
            href={`https://${platform.toLowerCase()}.com/YashSharma2129`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                color: {
                  GitHub: '#333',
                  Twitter: '#1DA1F2',
                  LinkedIn: '#0A66C2'
                }[platform]
              }
            }}
          >
            {platform === 'GitHub' ? <GitHub /> : platform === 'Twitter' ? <Twitter /> : <LinkedIn />}
          </IconButton>
        ))}
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Built with
        </Typography>
        <Tooltip title={`Click me ${5 - clickCount} more times!`}>
          <Coffee 
            sx={{ cursor: 'pointer' }} 
            onClick={handleEasterEgg}
            color={clickCount > 0 ? 'primary' : 'inherit'}
          />
        </Tooltip>
        <Code sx={{ mx: 1 }} />
        <Favorite color="error" />
      </Box>

      <Collapse in={showContactForm}>
        <Box
          component="form"
          onSubmit={handleContact}
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            fullWidth
            required
          />
          <TextField
            label="Message"
            multiline
            rows={3}
            variant="outlined"
            size="small"
            fullWidth
            required
          />
          <IconButton type="submit" color="primary">
            <Email />
          </IconButton>
        </Box>
      </Collapse>

      <Fab
        color="primary"
        size="small"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          opacity: showBackToTop ? 1 : 0,
          transition: 'opacity 0.3s, transform 0.3s',
          transform: showBackToTop ? 'scale(1)' : 'scale(0)',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        <KeyboardArrowUp />
      </Fab>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Message sent! (Demo only)"
      />
    </Box>
  );
}
