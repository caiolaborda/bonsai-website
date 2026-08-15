import { motion } from 'framer-motion';

export default function BranchNav({ branches, activeBranch, setActiveBranch, navId = 'default' }) {
  return (
    <div className="branch-nav-wrapper">
      <div className="branch-nav-container">
        {branches.map(branch => (
          <motion.button
            key={branch.id}
            className={`branch-btn ${activeBranch === branch.id ? 'active' : ''}`}
            onClick={() => setActiveBranch(branch.id)}
            whileHover={{ scale: 1.02, backgroundColor: activeBranch === branch.id ? 'transparent' : 'rgba(0,0,0,0.03)' }}
            whileTap={{ scale: 0.98 }}
          >
            {activeBranch === branch.id && (
              <motion.div 
                layoutId={`activeBranchIndicator-${navId}`}
                className="branch-active-bg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="branch-label">{branch.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
