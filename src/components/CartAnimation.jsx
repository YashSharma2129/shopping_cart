import { motion, AnimatePresence } from 'framer-motion';

export default function CartAnimation({ isAnimating, productImage, startPos, endPos, onComplete }) {
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ 
            position: 'fixed',
            top: startPos.y,
            left: startPos.x,
            opacity: 1,
            scale: 1,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
          animate={{
            top: endPos.y,
            left: endPos.x,
            opacity: 0,
            scale: 0.2,
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            type: "spring",
            duration: 1,
            bounce: 0.4,
            ease: "easeInOut"
          }}
          onAnimationComplete={onComplete}
        >
          <img
            src={productImage}
            alt="Flying product"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
              borderRadius: '50%',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
