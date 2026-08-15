import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Play } from 'lucide-react';

const APPROVED_TAGS = [
  'Conferences', 'Interviews', 'Showreel', 'Education', 
  'Branding', 'Web Design', 'E-Commerce', 'Corporate', 
  'Promotional', 'Events', 'Social Media', 'SaaS',
  'Healthcare', 'Sports & Fitness', 'Arts & Culture', 'Entertainment', 'Pharmaceuticals',
  'Travel & Tourism', 'Coaching', 'Games'
];

// Helper to normalize tags (lowercase and remove trailing 's' for basic plural matching)
const normalizeTag = (tag) => tag.toLowerCase().trim().replace(/s$/, '');
const APPROVED_NORMALIZED = APPROVED_TAGS.map(normalizeTag);

export default function ProjectGrid({ items, loading, onSelect }) {
  const [activeTag, setActiveTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 2 : 4);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Remove placeholders and sanitize tags to only match APPROVED_TAGS (case/plural insensitive)
  const validItems = useMemo(() => {
    return items
      .map(item => {
        const approvedItemTags = [];
        if (item.tags) {
          item.tags.forEach(t => {
            if (!t) return;
            const index = APPROVED_NORMALIZED.indexOf(normalizeTag(t));
            if (index !== -1) {
              const matchedTag = APPROVED_TAGS[index];
              if (!approvedItemTags.includes(matchedTag)) {
                approvedItemTags.push(matchedTag);
              }
            }
          });
        }
        return { ...item, tags: approvedItemTags };
      });
  }, [items]);

  // Extract all unique tags from items
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    validItems.forEach(item => {
      if (item.tags) {
        item.tags.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [validItems]);

  // Filter items based on activeTag
  const filteredItems = useMemo(() => {
    if (activeTag === 'All') return validItems;
    return validItems.filter(item => item.tags && item.tags.includes(activeTag));
  }, [validItems, activeTag]);

  // Paginate filtered items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const visibleItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setCurrentPage(0); // Reset pagination when filter changes
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="project-grid-wrapper" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Grid Layout */}
      <motion.div 
        layout
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: '0 1rem',
          flex: 1,
          minHeight: 0
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px', width: '100%', gridColumn: '1 / -1' }}
            >
              <Loader2 className="spinner" size={32} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </motion.div>
          ) : visibleItems.length === 0 ? (
             <motion.div 
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px', width: '100%', gridColumn: '1 / -1', color: '#888', fontWeight: 500 }}
             >
               No projects found for this category.
             </motion.div>
          ) : (
            visibleItems.map((item, idx) => (
              <ProjectCardItem key={item.title + idx} item={item} onSelect={onSelect} />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filter Bar */}
      {allTags.length > 1 && (
        <div className="filter-bar" style={{ display: 'flex', gap: '0.5rem', marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                border: 'none',
                background: activeTag === tag ? '#111' : 'rgba(0,0,0,0.05)',
                color: activeTag === tag ? '#fff' : '#666',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '40px', marginBottom: 0 }}>
          <motion.button
            whileHover={currentPage > 0 ? { scale: 1.05 } : {}}
            whileTap={currentPage > 0 ? { scale: 0.95 } : {}}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.1)',
              background: '#fff',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 0 ? 0.5 : 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronLeft size={20} color="#111" />
          </motion.button>
          
          <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
            {currentPage + 1} / {totalPages}
          </span>
          
          <motion.button
            whileHover={currentPage < totalPages - 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage < totalPages - 1 ? { scale: 0.95 } : {}}
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.1)',
              background: '#fff',
              cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronRight size={20} color="#111" />
          </motion.button>
        </div>
      )}
    </div>
  );
}

function ProjectCardItem({ item, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const videoRef = useRef(null);

  // Play video on hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(e => console.log('Video play prevented:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  // Auto-scroll logic for carousel
  useEffect(() => {
    let timeout;
    let interval;
    if (isHovered && item.images && item.images.length > 1) {
      // Trigger the very first transition almost immediately on hover
      timeout = setTimeout(() => {
        setImgIndex(prev => (prev + 1) % item.images.length);
        // Then hold each subsequent image longer
        interval = setInterval(() => {
          setImgIndex(prev => (prev + 1) % item.images.length);
        }, 2500); // 2.5 seconds per image
      }, 150);
    } else {
      setImgIndex(0);
    }
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isHovered, item.images]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="glass-sleek project-grid-card"
      onClick={() => onSelect(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {item.videoUrl && item.videoUrl.includes('youtube.com/embed') ? (
        <div className="video-container sleek" style={{ pointerEvents: 'none', flex: 1, minHeight: 0 }}>
          <iframe 
            src={item.videoUrl} 
            title={item.title}
            frameBorder="0" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          ></iframe>
        </div>
      ) : item.videoUrl ? (
        <div className="video-container sleek skeleton-bg" style={{ pointerEvents: 'none', flex: 1, minHeight: 0, background: '#f5f5f5', position: 'relative' }}>
          
          {/* BASE LAYER: Cached Image for instant loading */}
          {item.image && (
            <img 
              src={item.image} 
              alt={item.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} 
            />
          )}

          {/* VIDEO LAYER: Only mount if it's a lightweight preview OR if the user is actively hovering */}
          {(item.previewVideoUrl || isHovered) && (
            <video 
              ref={videoRef}
              src={item.previewVideoUrl || item.videoUrl}
              poster={item.image || undefined}
              loop 
              muted 
              playsInline 
              preload={item.previewVideoUrl ? "metadata" : "none"}
              onLoadedData={(e) => { e.target.style.opacity = 1; e.target.parentElement.classList.remove('skeleton-bg'); }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: item.image && !item.previewVideoUrl ? 0 : 1, transition: 'opacity 0.5s ease-in-out', position: 'absolute', inset: 0, zIndex: 2 }}
            />
          )}

          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.15)', opacity: isHovered ? 0 : 1, transition: 'opacity 0.3s ease', zIndex: 5
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Play size={20} color="#fff" fill="#fff" style={{ transform: 'translateX(2px)' }} />
            </div>
          </div>
        </div>
      ) : item.images && item.images.length > 0 ? (
        <div className="image-container sleek" style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', pointerEvents: 'none', background: '#f5f5f5' }}>
          <AnimatePresence initial={false}>
            <motion.img 
              key={imgIndex}
              src={item.images[imgIndex]} 
              alt={item.title} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </AnimatePresence>
          {/* Pagination Dots Overlay */}
          {item.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: '12px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10, opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}>
               {item.images.map((_, i) => (
                 <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'background 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
               ))}
            </div>
          )}
        </div>
      ) : item.image ? (
        <div className="image-container sleek" style={{ flex: 1, minHeight: 0, overflow: 'hidden', pointerEvents: 'none', background: '#f5f5f5' }}>
          <img 
            src={item.image} 
            alt={item.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      ) : (
        <div className="placeholder-graphic" style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(item.color ? { background: `linear-gradient(135deg, ${item.color}20, transparent)` } : {})}}>
          {item.icon}
        </div>
      )}
      
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }} />
      
      <motion.div 
        className="gallery-caption" 
        animate={{ y: isHovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ 
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          padding: '0.8rem 1rem', 
          background: 'rgba(255,255,255,0.85)', 
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          zIndex: 20,
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.15rem', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#111' }}>{item.title}</h3>
        
        {(item.extendedText || item.description) && (
          <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.4rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
            {item.extendedText || item.description}
          </p>
        )}
        
        {item.tags && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', overflow: 'hidden', maxHeight: '24px', marginTop: '0.1rem' }}>
              {item.tags.map(t => (
                <span key={t} style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#444', background: 'rgba(0,0,0,0.06)', padding: '0.2rem 0.5rem', borderRadius: '100px', fontWeight: 600 }}>{t}</span>
              ))}
           </div>
        )}
      </motion.div>
    </motion.div>
  );
}
