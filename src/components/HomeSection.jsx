import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from '@animateicons/react/lucide';
import { Dot } from '../App';

export default function HomeSection({ onNavigate, navItems, direction }) {
  const hubItems = [
    ...navItems.filter(item => item.id !== 'home' && item.id !== 'about'),
    { id: 'booking', label: 'Book', icon: <CalendarIcon size={20} /> }
  ];
  const hasPlayedIntro = sessionStorage.getItem('bonsai_intro_played');
  const [showHub, setShowHub] = useState(!!hasPlayedIntro);

  // Trigger the hub to appear after the initial intro text
  useEffect(() => {
    if (!hasPlayedIntro) {
      const timer = setTimeout(() => {
        setShowHub(true);
        sessionStorage.setItem('bonsai_intro_played', 'true');
      }, 2800); // Intro text stays for 2.8s
      return () => clearTimeout(timer);
    }
  }, [hasPlayedIntro]);

  const pageVariants = {
    initial: (direction) => ({ opacity: 0, x: direction > 0 ? 40 : -40 }),
    in: { opacity: 1, x: 0 },
    out: (direction) => ({ opacity: 0, x: direction > 0 ? -40 : 40 })
  };

  const HubItem = ({ item, index, totalItems, onNavigate }) => {
    const iconRef = useRef(null);
    const isCog = item.id === 'growth';
    const isMedia = item.id === 'media';
    
    const angle = (index / totalItems) * (2 * Math.PI) - (Math.PI / 2);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const radius = isMobile ? 120 : 170; // Slightly larger for breathing room
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return (
      <motion.button
        key={item.id}
        className="hub-item glass"
        style={{ 
          position: 'absolute', 
          left: `calc(50% + ${x}px - 45px)`, 
          top: `calc(50% + ${y}px - 45px)`,
        }}
        variants={{
          rest: { scale: 1, backgroundColor: 'rgba(255,255,255,0.7)', color: '#333', zIndex: 1 },
          hover: { scale: 1.15, backgroundColor: 'rgba(255,255,255,1)', color: '#111', zIndex: 20 }
        }}
        initial="rest"
        animate="rest"
        whileHover="hover"
        onClick={() => onNavigate(item.id)}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => iconRef.current?.startAnimation?.()}
        onMouseLeave={() => iconRef.current?.stopAnimation?.()}
      >
        <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
          {isCog ? (
            <motion.div 
              style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: 'center center' }}
              variants={{ rest: { rotate: 0 }, hover: { rotate: 180, transition: { type: 'spring', stiffness: 200, damping: 15 } } }}
            >
              {item.icon}
              {item.id === 'growth' && (
                <motion.div 
                  style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '50%', filter: 'blur(6px)', zIndex: -1, pointerEvents: 'none' }}
                  variants={{ rest: { opacity: 0, scale: 0.8 }, hover: { opacity: 0.75, scale: 1.1, transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } } }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div 
              style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              variants={{ rest: { scale: 1 }, hover: { scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 17 } } }}
            >
              {React.cloneElement(item.icon, { ref: iconRef })}
              {item.id === 'media' && <Dot color="#ef4444" top="4px" left="6px" />}
              {item.id === 'design' && (
                <motion.div 
                  style={{ position: 'absolute', top: '1.5px', left: '2.5px', width: '15px', height: '12px', background: 'linear-gradient(135deg, #7dd3fc, #c4b5fd)', backgroundSize: '200% 200%', borderRadius: '1.5px', zIndex: -1, pointerEvents: 'none' }}
                  variants={{ 
                    rest: { opacity: 0, backgroundPosition: '0% 0%' }, 
                    hover: { opacity: 1, backgroundPosition: '100% 100%', transition: { duration: 0.4, ease: 'easeOut' } } 
                  }}
                />
              )}
            </motion.div>
          )}
        </div>
        <span className="hub-label">{item.label}</span>
      </motion.button>
    );
  };

  return (
    <motion.div
      className="section-wrapper"
      style={{ padding: 0 }} // Remove layout safe zones so it centers perfectly on screen
      custom={direction}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
    >
      <div className="home-content-immersive" style={{ color: '#111' }}>
        
        {/* Intro Text Sequence */}
        <AnimatePresence>
          {!showHub && (
            <motion.div 
              className="intro-sequence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', textAlign: 'center', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <img src="/assets/media_1786547873737.png" alt="Bonsai Iris Logo" style={{ width: '150px', height: 'auto', marginBottom: '1.5rem' }} />
              <p className="home-intro-text" style={{ fontWeight: 300, color: '#222', lineHeight: 1.4 }}>
                We're digital growers cultivating brands.<br/>
                <strong style={{ fontWeight: 600 }}>Your digital force multiplier.</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Hub Navigation */}
        <AnimatePresence>
          {showHub && (
            <motion.div 
              className="hub-nav"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            >
              {hubItems.map((item, index) => (
                <HubItem key={item.id} item={item} index={index} totalItems={hubItems.length} onNavigate={onNavigate} />
              ))}
              
              <motion.button 
                className="hub-center" 
                style={{ 
                  background: '#111', 
                  cursor: 'pointer', 
                  border: 'none',
                  width: '100px', // slightly larger
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
                onClick={() => onNavigate('about')}
                whileHover="hover"
                initial="rest"
              >
                 <motion.img 
                   src="/assets/media_1786547781952.png" 
                   alt="Bonsai Logo" 
                   style={{ height: '42px', filter: 'brightness(100)', position: 'absolute' }} 
                   variants={{
                     rest: { opacity: 1, scale: 1 },
                     hover: { opacity: 0, scale: 0.8 }
                   }}
                 />
                 <motion.span
                   style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', position: 'absolute' }}
                   variants={{
                     rest: { opacity: 0, scale: 0.8 },
                     hover: { opacity: 1, scale: 1 }
                   }}
                 >
                   About
                 </motion.span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
