import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import usePortfolio from '../hooks/usePortfolio';

function BentoExamplesCarousel({ tags }) {
  const { items } = usePortfolio();
  
  // Filter items matching the tag
  const filtered = items.filter(item => 
    item.tags && tags && tags.some(t => item.tags.map(it => it.toLowerCase()).includes(t.toLowerCase())) &&
    (item.image || (item.images && item.images.length > 0))
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (filtered.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filtered.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [filtered.length]);

  if (filtered.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999' }}>
        More examples coming soon.
      </div>
    );
  }

  const currentItem = filtered[currentIndex];
  // If item has images array, use first, else use image
  const displayImage = currentItem.images && currentItem.images.length > 0 ? currentItem.images[0] : currentItem.image;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={displayImage}
          alt={currentItem.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{currentItem.title}</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {currentItem.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: '100px' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BentoMediaBox({ content, onOpenLightbox }) {
  const { items } = usePortfolio();
  
  if (content.previewVideoUrl) {
    let fullVideoItem = null;
    
    // 1. Try to extract exact UUID from the preview URL
    const idMatch = content.previewVideoUrl.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (idMatch) {
      fullVideoItem = items.find(item => item.id === idMatch[1]);
    }
    
    // 2. Fallback to tag match for custom previews (e.g. livestream_preview.mp4)
    if (!fullVideoItem) {
      fullVideoItem = items.find(item => 
        item.tags && content.tagMatch && content.tagMatch.some(t => item.tags.map(it => it.toLowerCase()).includes(t.toLowerCase())) &&
        item.videoUrl
      );
    }

    return (
      <div 
        style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', cursor: fullVideoItem ? 'pointer' : 'default' }}
        onClick={() => {
          if (fullVideoItem && onOpenLightbox) {
            onOpenLightbox(fullVideoItem);
          }
        }}
      >
        <video 
          src={content.previewVideoUrl} 
          muted 
          loop 
          autoPlay
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div className="media-box-overlay" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{content.title}</h4>
          {fullVideoItem && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
              <Play size={16} fill="currentColor" /> Click to watch full video
            </div>
          )}
        </div>
      </div>
    );
  }

  if (content.tagMatch) {
    return <BentoExamplesCarousel tags={content.tagMatch} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
      Visual Examples
    </div>
  );
}

export default function ServiceBento({ isOpen, onClose, content, onNavigate, onOpenLightbox }) {
  if (!content) return null;

  const handleCtaClick = () => {
    onClose();
    if (onNavigate) onNavigate('booking');
  };

  const handleCrossSell = () => {
    if (onNavigate && content.crossSell?.nav) {
      // Store the target service so the new section opens it instantly on mount
      sessionStorage.setItem('pendingOpenService', content.crossSell.title);
      // Navigate to the target section (do NOT call onClose so the overlay stays up during transition)
      onNavigate(content.crossSell.nav);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bento-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }}
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(250, 250, 250, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', padding: '40px', paddingBottom: '144px' }}
        >
          <button 
            onClick={onClose} 
            className="glass-sleek bento-close-btn"
            style={{ position: 'absolute', top: '40px', right: '40px', width: '48px', height: '48px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 50, background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <X size={24} color="#111" />
          </button>

          <div 
            className="bento-grid" 
            style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              height: '100%', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(12, 1fr)', 
              gridTemplateRows: 'repeat(12, 1fr)', 
              gap: '1.5rem' 
            }}
          >
            {/* Box 1: Hero (Top Left) */}
            <motion.div 
              className="glass-sleek"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }} transition={{ delay: 0.1 }}
              style={{ gridColumn: 'span 8', gridRow: 'span 7', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', background: '#fff' }}
            >
              <div className="bento-hero-bg" style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: content.color ? `linear-gradient(135deg, ${content.color}, transparent)` : 'none' }}></div>
              <div className="bento-hero-content" style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="bento-hero-icon-container" style={{ width: '64px', height: '64px', borderRadius: '16px', background: content.color ? `${content.color}20` : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: content.color || '#111' }}>
                  {content.icon}
                </div>
                <h1 className="bento-hero-title" style={{ fontSize: '4rem', margin: '0 0 1rem 0', lineHeight: 1.1, letterSpacing: '-1.5px' }}>{content.title}</h1>
                <p className="bento-hero-desc" style={{ fontSize: '1.3rem', color: '#666', maxWidth: '600px', lineHeight: 1.6 }}>{content.extendedText || content.description}</p>
              </div>
            </motion.div>

            {/* Box 2: Media Box (Right Side Tall) */}
            <motion.div 
              className="glass-sleek"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }} transition={{ delay: 0.2 }}
              style={{ gridColumn: 'span 4', gridRow: 'span 8', borderRadius: '24px', overflow: 'hidden', background: '#111' }}
            >
              <BentoMediaBox content={content} onOpenLightbox={onOpenLightbox} />
            </motion.div>

            {/* Box 3: Value Props (Bottom Left Wide) */}
            <motion.div 
              className="glass-sleek bento-value-props-box"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }} transition={{ delay: 0.3 }}
              style={{ gridColumn: 'span 8', gridRow: 'span 5', borderRadius: '24px', background: '#fff', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}
            >
              <h3 style={{ fontSize: '1.1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', fontWeight: 600 }}>What this brings to the table</h3>
              <div className="value-props-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1, alignItems: 'center' }}>
                {content.valueProps ? content.valueProps.map((prop, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <CheckCircle2 size={28} color={content.color || "#10b981"} />
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{prop.title}</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>{prop.desc}</p>
                  </div>
                )) : (
                  <div style={{ gridColumn: 'span 3', color: '#999' }}>Value propositions coming soon.</div>
                )}
              </div>
            </motion.div>

            {/* Box 4: Cross-Sell (Bottom Middle) */}
            <motion.div 
              className="glass-sleek"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }} transition={{ delay: 0.4 }}
              onClick={handleCrossSell}
              style={{ position: 'relative', gridColumn: 'span 2', gridRow: 'span 4', borderRadius: '24px', background: '#f8fafc', padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'background 0.3s ease', overflow: 'hidden' }}
              whileHover={{ background: '#f1f5f9' }}
            >
              {content.crossSell?.icon && (
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', color: '#e2e8f0', zIndex: 0, pointerEvents: 'none', transform: 'scale(5)', transformOrigin: 'bottom right', opacity: 0.6 }}>
                  {content.crossSell.icon}
                </div>
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Pairs well with</span>
                <h4 style={{ margin: '0', fontSize: '1.1rem', color: '#0f172a', lineHeight: 1.2 }}>{content.crossSell?.title || "Growth Strategy"}</h4>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
                <ArrowRight size={20} color="#64748b" />
              </div>
            </motion.div>

            {/* Box 5: CTA (Bottom Right) */}
            <motion.div 
              className="glass-sleek"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }} transition={{ delay: 0.5 }}
              onClick={handleCtaClick}
              style={{ gridColumn: 'span 2', gridRow: 'span 4', borderRadius: '24px', background: content.color || '#111', color: '#fff', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Start Project</h3>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem' }}>Book a Discovery Call</p>
            </motion.div>

          </div>

          {/* Mobile Fallback Styles */}
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 1024px) {
              .bento-grid {
                display: grid !important;
                grid-template-columns: 1fr !important;
                grid-template-rows: auto auto auto auto !important;
                height: auto !important;
                max-width: 100% !important;
                padding-bottom: 2rem;
              }
              .bento-grid > div {
                flex: none !important;
              }
              .bento-overlay {
                overflow-y: auto !important;
                padding: 1rem !important;
                padding-bottom: 120px !important;
                align-items: flex-start !important;
              }
              /* Hero Adjustments */
              .bento-grid > div {
                grid-column: 1 / -1 !important;
                width: 100% !important;
                min-width: 100% !important;
              }
              
              /* Hero Box (Box 1) overlaps Media */
              .bento-grid > div:nth-child(1) {
                grid-column: 1 / -1 !important;
                grid-row: 1 !important;
                width: 100% !important;
                z-index: 2 !important;
                background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.85) 100%) !important;
                color: white !important;
                box-shadow: none !important;
                min-height: 500px !important;
              }
              /* Hide the solid color overlay on Hero */
              .bento-hero-bg {
                display: none !important;
              }
              /* Hero Content Container */
              .bento-hero-content {
                padding: 2rem !important;
                justify-content: flex-end !important; /* Push text to bottom */
                width: 100% !important;
              }
              /* Force text colors to white */
              .bento-hero-title, .bento-hero-desc {
                color: white !important;
              }
              .bento-hero-title {
                font-size: 2.5rem !important;
              }
              .bento-hero-desc {
                font-size: 1.1rem !important;
              }
              /* Style the icon for dark background */
              .bento-hero-icon-container {
                background: rgba(255,255,255,0.2) !important;
                color: white !important;
                margin-bottom: 1rem !important;
                backdrop-filter: blur(10px) !important;
              }
              /* Media Box (Box 2) overlaps Hero */
              .bento-grid > div:nth-child(2) {
                grid-column: 1 / -1 !important;
                grid-row: 1 !important;
                width: 100% !important;
                z-index: 1 !important;
                min-height: 500px !important;
                pointer-events: none !important; /* Disable lightbox clicks */
              }
              /* Hide the native media title overlay */
              .media-box-overlay {
                display: none !important;
              }
              /* Reposition Close Button */
              .bento-close-btn {
                top: 32px !important;
                right: 32px !important;
                background: rgba(255,255,255,0.2) !important;
                backdrop-filter: blur(10px) !important;
              }
              .bento-close-btn svg {
                stroke: white !important;
              }
              /* Map remaining boxes */
              .bento-grid > div:nth-child(3) { grid-row: 2 !important; }
              .bento-grid > div:nth-child(4) { grid-row: 3 !important; }
              .bento-grid > div:nth-child(5) { grid-row: 4 !important; }
              /* Value Props Adjustments */
              .bento-value-props-box {
                padding: 1.5rem !important;
              }
              .value-props-grid {
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
                padding-bottom: 0 !important;
                gap: 1.5rem !important;
              }
              .value-props-grid > div {
                flex: none !important;
                width: 100% !important;
              }
              /* Smaller Cross-Sell and CTA boxes */
              .bento-grid > div:nth-child(4), .bento-grid > div:nth-child(5) {
                min-height: 120px !important;
              }
            }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
