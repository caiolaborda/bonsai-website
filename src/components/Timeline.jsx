import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function Timeline({ steps }) {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <div className="hover-timeline-container">
      {steps.map((step, index) => {
        const isActive = hoveredIndex === index;
        return (
          <motion.div 
            key={index}
            className={`hover-timeline-panel glass-sleek ${isActive ? 'active' : ''}`}
            onHoverStart={() => setHoveredIndex(index)}
            onClick={() => setHoveredIndex(index)}
            initial={false}
            animate={{ 
              flex: (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'none' : (isActive ? 4 : 1),
              height: (typeof window !== 'undefined' && window.innerWidth <= 768) ? (isActive ? 'auto' : '80px') : '100%',
              opacity: 1,
              background: isActive 
                ? 'radial-gradient(circle at center, rgba(99, 102, 241, 0.12) 0%, rgba(255, 255, 255, 0.45) 80%)'
                : 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0.25) 100%)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="hover-timeline-inner" style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
              <div className="hover-timeline-number">
                0{index + 1}
              </div>
              
              {isActive ? (
                <motion.div 
                  className="hover-timeline-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ marginTop: 'auto', zIndex: 2, position: 'relative' }}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="hover-timeline-vertical-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', zIndex: 2, position: 'relative' }}>
                    {step.title}
                    <ChevronRight size={18} />
                  </div>
                </>
              )}

              {/* Render the large SVG icon as a watermark, shifting position based on active state */}
              {step.bgIcon && (
                <motion.div
                  style={{
                    position: 'absolute',
                    zIndex: 0,
                    color: '#6366f1',
                    pointerEvents: 'none'
                  }}
                  initial={false}
                  animate={{
                    opacity: isActive ? 0.08 : 0.03,
                    right: isActive ? '-50px' : '-100px',
                    bottom: isActive ? '20px' : '-100px',
                    scale: isActive ? 1.2 : 0.8,
                    rotate: isActive ? -15 : 0
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  {step.bgIcon}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
