import { motion } from 'framer-motion';
import { Box, Typography, Paper } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector
} from '@mui/lab';
import { LocalShipping, Inventory, Check, Schedule } from '@mui/icons-material';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function OrderSuccess({ orderDetails }) {
  const { darkMode } = useContext(ThemeContext);
  
  const truck = {
    initial: { x: -200 },
    animate: { 
      x: 400,
      transition: { 
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear"
      }
    }
  };

  const deliverySteps = [
    { icon: <Check />, label: 'Order Confirmed', color: '#4caf50' },
    { icon: <Inventory />, label: 'Processing', color: '#2196f3' },
    { icon: <LocalShipping />, label: 'Shipping', color: '#ff9800' },
    { icon: <Schedule />, label: 'Estimated Delivery', color: '#9c27b0' }
  ];

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Thank You For Your Order! 🎉
        </Typography>
      </motion.div>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          my: 4, 
          position: 'relative',
          overflow: 'hidden',
          background: darkMode 
            ? 'linear-gradient(45deg, rgba(66,66,66,0.9), rgba(48,48,48,0.9))'
            : 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))'
        }}
      >
        <Box sx={{ position: 'relative', height: '100px', mb: 4 }}>
          <motion.div
            variants={truck}
            initial="initial"
            animate="animate"
            style={{
              position: 'absolute',
              width: '100px',
              height: '60px'
            }}
          >
            <LocalShipping 
              sx={{ 
                fontSize: '60px',
                color: darkMode ? '#FF8E53' : '#2196f3',
                filter: `drop-shadow(0 0 10px ${darkMode ? '#FF8E53' : '#2196f3'}50)`
              }} 
            />
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: darkMode 
                ? 'linear-gradient(90deg, #FF8E53, #FE6B8B)'
                : 'linear-gradient(90deg, #2196f3, #21CBF3)',
              transformOrigin: 'left'
            }}
          />
        </Box>

        <Timeline position="alternate">
          {deliverySteps.map((step, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <TimelineDot sx={{ bgcolor: step.color }}>
                    {step.icon}
                  </TimelineDot>
                </motion.div>
                {index < deliverySteps.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Typography variant="h6">{step.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {index === 0 && 'Just now'}
                    {index === 1 && 'Within 24 hours'}
                    {index === 2 && '2-3 business days'}
                    {index === 3 && orderDetails?.estimatedDelivery}
                  </Typography>
                </motion.div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </Box>
  );
}
