import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoIcon, MonitorIcon, CalendarIcon, UserIcon } from '@animateicons/react/lucide';
import { Cog, Phone } from 'lucide-react';
import HomeSection from './components/HomeSection';
import MediaSection from './components/MediaSection';
import DesignSection from './components/DesignSection';
import GrowthSection from './components/GrowthSection';
import AboutSection from './components/AboutSection';
import BookingLightbox from './components/BookingLightbox';
import './index.css';

export const Dot = ({ color, top, left }) => (
  <motion.div
    style={{ position: 'absolute', top, left, width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 6px ${color}cc`, pointerEvents: 'none' }}
    variants={{
      rest: { opacity: 0, scale: 0 },
      hover: { opacity: [0, 1, 0], scale: 1, transition: { duration: 1.2, repeat: Infinity, ease: 'linear' } }
    }}
  />
);

const NavItem = ({ item, activeSection, handleNavigate }) => {
  const iconRef = useRef(null);
  const isCog = item.id === 'growth';
  const isMedia = item.id === 'media';

  return (
    <motion.button
      className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
      onClick={() => handleNavigate(item.id)}
      variants={{
        rest: { backgroundColor: 'transparent' },
        hover: { backgroundColor: activeSection === item.id ? 'transparent' : 'rgba(0,0,0,0.03)' }
      }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      style={{ color: activeSection === item.id ? '#fff' : '#333' }}
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
    >
      <div className="nav-icon-wrapper" style={{ filter: activeSection === item.id && item.id === 'home' ? 'invert(1) brightness(2)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.id === 'home' ? (
          item.icon
        ) : (
          <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  variants={{ 
                    rest: { scale: 1, y: item.id === 'media' ? 2 : (item.id === 'design' || item.id === 'about' ? 1 : 0) }, 
                    hover: { scale: 1.15, y: item.id === 'media' ? 2 : (item.id === 'design' || item.id === 'about' ? 1 : 0), transition: { type: "spring", stiffness: 400, damping: 17 } } 
                  }}
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
        )}
      </div>
      {item.label && <span className="nav-label">{item.label}</span>}
      {activeSection === item.id && (
        <motion.div className="nav-indicator" layoutId="pill-indicator" style={{ background: '#111' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      )}
    </motion.button>
  );
};

const BookButton = ({ handleNavigate }) => {
  const iconRef = useRef(null);
  return (
    <motion.button
      className="nav-btn"
      onClick={() => handleNavigate('booking')}
      variants={{
        rest: { scale: 1, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' },
        hover: { scale: 1.05, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)' }
      }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      style={{ 
        color: '#fff', 
        background: 'linear-gradient(135deg, #059669, #10b981)', 
        borderRadius: '100px', 
        marginLeft: '0.5rem', 
        padding: '12px 20px',
        border: 'none',
        cursor: 'pointer'
      }}
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
    >
      <div className="nav-icon-wrapper" style={{ position: 'relative', width: '20px', height: '20px' }}>
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          variants={{ rest: { scale: 1 }, hover: { scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 17 } } }}
        >
          <div className="desktop-only" style={{ display: 'flex' }}><CalendarIcon size={20} ref={iconRef} /></div>
          <div className="mobile-only" style={{ display: 'none' }}><Phone size={18} /></div>
        </motion.div>
      </div>
      <span className="nav-label">Book</span>
    </motion.button>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [direction, setDirection] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: <img src="/assets/bonsai_logo.png" alt="Home" style={{ height: '22px', width: 'auto', display: 'block', transform: 'scale(1.6)' }} className="home-nav-icon" /> },
    { id: 'about', label: 'About', icon: <UserIcon size={20} /> },
    { id: 'media', label: 'Media', icon: <VideoIcon size={20} /> },
    { id: 'design', label: 'Design', icon: <MonitorIcon size={20} /> },
    { id: 'growth', label: 'Growth', icon: <Cog size={20} /> }
  ];

  const handleNavigate = (newSection) => {
    if (newSection === 'booking') {
      setIsBookingOpen(true);
      return;
    }
    if (newSection === activeSection) return;
    const currentIndex = navItems.findIndex(item => item.id === activeSection);
    const newIndex = navItems.findIndex(item => item.id === newSection);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveSection(newSection);
  };



  return (
    <div className={`app-container style-hub`}>
      {/* Universal Dynamic Backgrounds for subpages */}
      <AnimatePresence>
        {activeSection !== 'home' && (
          <motion.div 
            className="universal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Video Background (Only on Home) */}
      <AnimatePresence>
        {activeSection === 'home' && (
          <motion.div 
            className="video-bg-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="video-bg"
              src="https://bonsaimedia.co.uk/assets/videos/container08.mp4"
            />
            <div className="video-overlay-light" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Style 2: Hub / Pill --- */}
      <AnimatePresence>
        {activeSection !== 'home' && (
          <motion.nav 
            className="main-nav glass"
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 100, opacity: 0, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ background: 'rgba(255,255,255,0.8)' }}
          >
            <div className="nav-items-container">
              {navItems.map((item) => (
                <NavItem key={item.id} item={item} activeSection={activeSection} handleNavigate={handleNavigate} />
              ))}
              <BookButton handleNavigate={handleNavigate} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`content-area`}>
        <AnimatePresence mode="wait" custom={direction}>
          {activeSection === 'home' && <HomeSection key="home" onNavigate={handleNavigate} navItems={navItems} direction={direction} />}
          {activeSection === 'media' && <MediaSection key="media" onNavigate={handleNavigate} direction={direction} />}
          {activeSection === 'design' && <DesignSection key="design" onNavigate={handleNavigate} direction={direction} />}
          {activeSection === 'growth' && <GrowthSection key="growth" onNavigate={handleNavigate} direction={direction} />}
          {activeSection === 'about' && <AboutSection key="about" onNavigate={handleNavigate} direction={direction} />}
        </AnimatePresence>
      </main>

      <BookingLightbox isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}

export default App;
