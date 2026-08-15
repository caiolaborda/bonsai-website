import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink } from 'lucide-react';

export default function Lightbox({ isOpen, onClose, content, onNavigate }) {
  const handleCtaClick = () => {
    onClose();
    if(onNavigate) onNavigate('booking');
  };
  return (
    <AnimatePresence>
      {isOpen && content && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="lightbox-content glass-sleek"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={onClose}>
              <X size={24} color="#111" />
            </button>
            
            {content.videoUrl ? (
              <div className="lightbox-video-container">
                <iframe 
                  src={content.videoUrl} 
                  title={content.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : content.image ? (
              <div className="lightbox-image-container" style={{ margin: '1rem', borderRadius: '20px', overflow: 'hidden', maxHeight: '50vh', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={content.image} 
                  alt={content.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ) : (
              <div className="lightbox-graphic" style={content.color ? { background: `linear-gradient(135deg, ${content.color}20, transparent)` } : {}}>
                {content.icon}
              </div>
            )}
            
            <div className="lightbox-text">
              <h2>{content.title}</h2>
              <p>{content.description}</p>
              {content.extendedText && <p className="extended-text">{content.extendedText}</p>}
              
              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                <button className="btn-primary-sleek" onClick={handleCtaClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
                  Start Your Project <ArrowRight size={18} />
                </button>
                {content.url && (
                  <a 
                    href={content.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: '#f5f5f5', color: '#111', padding: '0.8rem 1.5rem', borderRadius: '100px', fontWeight: 600, transition: 'background 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  >
                    Visit Site <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
