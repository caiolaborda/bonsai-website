import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BookingLightbox({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 9999, padding: '2rem' }} // override safe zone since this is full screen
        >
          <motion.div
            className="lightbox-content glass-sleek"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1000px', width: '100%', height: '85vh', display: 'flex', flexDirection: 'column' }}
          >
            <button className="lightbox-close" onClick={onClose} style={{ zIndex: 10 }}>
              <X size={24} color="#111" />
            </button>
            
            <div style={{ padding: '3rem', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Book Your Discovery Call</h3>
               <p className="sleek-body" style={{ margin: 0 }}>Select a time below for a zero-pressure strategy session to discuss your vision.</p>
            </div>

            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
               <iframe 
                 src="https://tidycal.com/bonsai/15-minute-call-1y0wzoy"
                 style={{ width: '100%', height: '100%', border: 'none', flex: 1 }}
                 title="Book a Call"
               />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
