import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ExpandableCard({ title, children, accentColor }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="expandable-card glass-sleek"
      layout
      onClick={() => setIsOpen(!isOpen)}
      style={{
        borderLeft: `6px solid var(--accent-${accentColor || 'ocean'})`,
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ layout: { duration: 0.4, type: "spring", bounce: 0.2 } }}
    >
      <motion.div layout className="expandable-header">
        <h3 className="expandable-title">{title}</h3>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3 }}
          className="expandable-icon"
        >
          <ChevronDown size={28} color="#444" />
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="expandable-content"
          >
            <div className="expandable-inner">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
