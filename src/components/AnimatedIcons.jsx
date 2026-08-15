import { motion } from 'framer-motion';

const iconTransition = { duration: 0.6, ease: "easeOut" };

export const AnimatedVideo = ({ size = 20, color = "currentColor" }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path 
      d="m22 8-6 4 6 4V8Z"
      variants={{
        rest: { pathLength: 1, fill: 'transparent' },
        hover: { pathLength: [0, 1], fill: ['transparent', 'rgba(0,0,0,0.1)'], transition: iconTransition }
      }}
    />
    <motion.rect 
      width="14" height="12" x="2" y="6" rx="2" ry="2"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: { ...iconTransition, delay: 0.1 } }
      }}
    />
  </motion.svg>
);

export const AnimatedMonitor = ({ size = 20, color = "currentColor" }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.rect 
      width="20" height="14" x="2" y="3" rx="2"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: iconTransition }
      }}
    />
    <motion.line 
      x1="8" x2="16" y1="21" y2="21"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: { ...iconTransition, delay: 0.2 } }
      }}
    />
    <motion.line 
      x1="12" x2="12" y1="17" y2="21"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: { ...iconTransition, delay: 0.1 } }
      }}
    />
  </motion.svg>
);

export const AnimatedCog = ({ size = 20, color = "currentColor" }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    variants={{
      rest: { rotate: 0 },
      hover: { rotate: 180, transition: { duration: 0.8, ease: "anticipate" } }
    }}
  >
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    <path d="M12 2v2"/>
    <path d="M12 22v-2"/>
    <path d="m17 4-1.5 1.5"/>
    <path d="M22 12h-2"/>
    <path d="m17 20-1.5-1.5"/>
    <path d="M2 12h2"/>
    <path d="m7 4 1.5 1.5"/>
    <path d="m7 20 1.5-1.5"/>
  </motion.svg>
);

export const AnimatedCalendar = ({ size = 20, color = "currentColor" }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    variants={{
      rest: { y: 0, rotate: 0 },
      hover: { y: [0, -4, 0], rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }
    }}
  >
    <motion.rect 
      width="18" height="18" x="3" y="4" rx="2" ry="2"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: iconTransition }
      }}
    />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <motion.line 
      x1="3" x2="21" y1="10" y2="10"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: { ...iconTransition, delay: 0.2 } }
      }}
    />
  </motion.svg>
);

export const AnimatedUser = ({ size = 20, color = "currentColor" }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    variants={{
      rest: { y: 0 },
      hover: { y: [0, -3, 0], transition: { duration: 0.5 } }
    }}
  >
    <motion.path 
      d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      variants={{
        rest: { pathLength: 1 },
        hover: { pathLength: [0, 1], transition: iconTransition }
      }}
    />
    <motion.circle 
      cx="12" cy="7" r="4"
      variants={{
        rest: { scale: 1 },
        hover: { scale: [1, 1.1, 1], transition: { duration: 0.5 } }
      }}
    />
  </motion.svg>
);
