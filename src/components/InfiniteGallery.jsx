import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function GalleryCardItem({ item, onSelect }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const maskRef = useRef(null);
  const iconRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskTemplate = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    // Only apply intersection observer on mobile
    if (window.innerWidth > 768) return;
    
    // Observer for Opacity Fade (starts late, ends early)
    // At 0.75, it starts fading out. Because play() is maintained until 0.60, it actively moves while fading.
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (maskRef.current) maskRef.current.style.opacity = '1';
          if (iconRef.current && !item.previewVideoUrl) {
            iconRef.current.style.transform = 'scale(3.0)';
            iconRef.current.style.opacity = '0.9';
          }
        } else {
          if (maskRef.current) maskRef.current.style.opacity = '0';
          if (iconRef.current && !item.previewVideoUrl) {
            iconRef.current.style.transform = 'scale(2.5)';
            iconRef.current.style.opacity = '0.6';
          }
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.75 });
    
    // Observer for Video Playback
    // At 0.60, it triggers play() while completely invisible. It will pause while completely invisible.
    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            videoRef.current?.play().catch(() => {});
          }, 50);
        } else {
          videoRef.current?.pause();
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.60 });
    
    if (cardRef.current) {
      fadeObserver.observe(cardRef.current);
      playObserver.observe(cardRef.current);
    }
    return () => {
      fadeObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div 
      ref={cardRef}
      className="gallery-item glass-sleek" 
      onClick={() => onSelect(item)}
      onMouseEnter={() => { 
        if (window.innerWidth > 768) {
          if (maskRef.current) maskRef.current.style.opacity = '1';
          if (iconRef.current && !item.previewVideoUrl) {
            iconRef.current.style.transform = 'scale(3.0)';
            iconRef.current.style.opacity = '0.9';
          }
          videoRef.current?.play().catch(() => {});
        }
      }}
      onMouseLeave={() => { 
        if (window.innerWidth > 768) {
          if (maskRef.current) maskRef.current.style.opacity = '0';
          if (iconRef.current && !item.previewVideoUrl) {
            iconRef.current.style.transform = 'scale(2.5)';
            iconRef.current.style.opacity = '0.6';
          }
          videoRef.current?.pause();
        }
      }}
      onMouseMove={handleMouseMove}
      style={{ cursor: 'pointer', flex: '0 0 320px', maxWidth: '320px', position: 'relative', overflow: 'hidden' }} 
    >
      {/* STANDARD PROJECT RENDER (For recent works that have an image or standard videoUrl) */}
      {!item.previewVideoUrl && (item.videoUrl || item.image) ? (
        <>
          {item.videoUrl ? (
            <div className="video-container sleek" style={{ pointerEvents: 'none', flex: 1 }}>
              <iframe 
                src={item.videoUrl} 
                title={item.title}
                frameBorder="0" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              ></iframe>
            </div>
          ) : (
            <div className="image-container sleek" style={{ flex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
              <img 
                src={item.image} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          )}
          <div className="gallery-caption">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{item.description}</p>
          </div>
        </>
      ) : (
        /* SPOTLIGHT REVEAL RENDER (For Services) */
        <>
          {/* BASE LAYER: Solid Color + Icon */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', background: item.color ? `linear-gradient(135deg, ${item.color}20, ${item.color}05)` : '#f5f5f5' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon && (
                <div 
                  ref={iconRef}
                  style={{ 
                    color: item.color || '#111',
                    transform: 'scale(2.5)',
                    opacity: 0.6,
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease'
                  }}
                >
                  {item.icon}
                </div>
              )}
            </div>
            <div style={{ padding: '1rem', background: 'transparent', height: '100px' }} />
          </div>

          {/* MASK LAYER: Video Reveal */}
          {item.previewVideoUrl && (
            <motion.div
              ref={maskRef}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                WebkitMaskImage: !isMobile ? maskTemplate : 'none',
                maskImage: !isMobile ? maskTemplate : 'none',
                opacity: 0,
                transition: 'opacity 0.8s ease-in-out'
              }}
            >
              <video 
                ref={videoRef}
                src={item.previewVideoUrl} 
                preload="auto"
                loop 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1)', transform: 'translateZ(0)' }}
              />
            </motion.div>
          )}

          {/* CAPTION LAYER */}
          <div className="gallery-caption" style={{ position: 'relative', zIndex: 3, marginTop: 'auto', background: 'linear-gradient(to top, rgba(255,255,255,1) 30%, rgba(255,255,255,0.7) 80%, transparent)', padding: '2rem 1.5rem 1.5rem 1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#111', fontWeight: 600 }}>{item.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#555', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{item.description}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default function InfiniteGallery({ items, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef(null);
  const reqRef = useRef();
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Smooth scroll state
  const targetSpeed = useRef(1.0); // Default auto-scroll speed
  const currentSpeed = useRef(1.0);
  const fractionalScroll = useRef(0);

  const loop = () => {
    if (trackRef.current) {
      // Lerp (smooth ease) the current speed towards the target speed
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.05;

      // Only apply JS scroll if there's actual speed, allowing native momentum to coast freely
      if (Math.abs(currentSpeed.current) > 0.01) {
        fractionalScroll.current += currentSpeed.current;
        const intScroll = Math.trunc(fractionalScroll.current);
        
        if (intScroll !== 0) {
          trackRef.current.scrollLeft += intScroll;
          fractionalScroll.current -= intScroll;
        }
      }
      
      const { scrollLeft, scrollWidth } = trackRef.current;
      // Snap logic handles both positive (right) and negative (left) scrolling directions seamlessly
      if (scrollLeft >= scrollWidth / 2) {
         trackRef.current.scrollLeft -= (scrollWidth / 2);
      } else if (scrollLeft <= 1) {
         trackRef.current.scrollLeft += (scrollWidth / 2);
      }
    }
    reqRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current);
  }, []);

  const handleMouseMove = (e) => {
    if (!isHovered) setIsHovered(true);
    
    const { clientX } = e;
    const { innerWidth } = window;
    
    // Normalize mouse X position to a range of -1 (left edge) to 1 (right edge)
    const normalizedX = (clientX / innerWidth) * 2 - 1; 
    
    // Deadzone in the center (pauses the scroll)
    if (Math.abs(normalizedX) < 0.2) {
      targetSpeed.current = 0;
    } else {
      // Scale speed up to ~10px per frame based on proximity to edges
      // Math.sign handles direction, we subtract the 0.2 deadzone so it scales smoothly from 0
      targetSpeed.current = Math.sign(normalizedX) * (Math.abs(normalizedX) - 0.2) * 10;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to default auto-scroll speed
    targetSpeed.current = 1.0; 
  };

  // Duplicate items multiple times to ensure scrollWidth is massively larger than clientWidth on large screens.
  // This ensures the scrollWidth / 2 math never hits a physical boundary before snapping.
  const displayItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];

  const handleScrollLeft = (e) => {
    e.stopPropagation();
    if (trackRef.current) {
      currentSpeed.current = -25;
      targetSpeed.current = 1.0;
    }
  };

  const handleScrollRight = (e) => {
    e.stopPropagation();
    if (trackRef.current) {
      currentSpeed.current = 25;
      targetSpeed.current = 1.0;
    }
  };

  return (
    <div 
      className="infinite-gallery-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {(isHovered || isMobile) && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            <div className="infinite-gallery-nav-btn left" onClick={handleScrollLeft} style={{ pointerEvents: 'auto' }}>
              <ChevronLeft size={24} />
            </div>
            <div className="infinite-gallery-nav-btn right" onClick={handleScrollRight} style={{ pointerEvents: 'auto' }}>
              <ChevronRight size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="infinite-gallery-viewport" 
        ref={trackRef}
        style={{ 
          overflowX: isMobile ? 'auto' : 'hidden', 
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
        onTouchStart={() => { 
          targetSpeed.current = 0; 
          currentSpeed.current = 0; // Kill JS momentum instantly so native physics takes over
        }}
        onTouchEnd={() => { 
          // Wait 2.5s (longer delay) before setting target back to 1.0, then it will ease in slowly
          setTimeout(() => { targetSpeed.current = 1.0; }, 2500); 
        }}
      >
        <div className="infinite-gallery-track">
          {displayItems.map((item, idx) => (
            <GalleryCardItem key={idx} item={item} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
