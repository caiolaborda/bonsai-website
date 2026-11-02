import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  User,
  Star,
  Award,
  Film,
  Layout,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import BranchNav from './BranchNav';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const pageVariants = {
  initial: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 32 : direction < 0 ? -32 : 0,
    filter: 'blur(8px)'
  }),
  in: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: EASE_OUT_EXPO }
  },
  out: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -32 : 32,
    filter: 'blur(6px)',
    transition: { duration: 0.38, ease: [0.4, 0, 1, 1] }
  })
};

const branchSlideVariants = {
  initial: { opacity: 0, y: 14, scale: 0.985, filter: 'blur(6px)' },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: EASE_OUT_EXPO }
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    filter: 'blur(4px)',
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] }
  }
};

const staggerContainer = {
  initial: {},
  in: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 22, scale: 0.975, filter: 'blur(10px)' },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: EASE_OUT_EXPO }
  }
};

function SpotlightPillarCard({ item, onNavigate, onTeleport }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const maskRef = useRef(null);
  const iconRef = useRef(null);
  const mouseX = useMotionValue(180);
  const mouseY = useMotionValue(150);
  const maskTemplate = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Mobile IntersectionObserver: gently reveals & plays video as card scrolls into view
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth > 768) return;

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (maskRef.current) maskRef.current.style.opacity = '0.85';
            if (iconRef.current) {
              iconRef.current.style.transform = 'scale(2.1)';
              iconRef.current.style.opacity = '0.15';
            }
          } else {
            if (maskRef.current) maskRef.current.style.opacity = '0';
            if (iconRef.current) {
              iconRef.current.style.transform = 'scale(2.5)';
              iconRef.current.style.opacity = '0.6';
            }
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.7 }
    );

    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              videoRef.current?.play().catch(() => {});
            }, 50);
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.55 }
    );

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
    <motion.div
      ref={cardRef}
      variants={staggerItem}
      className="gallery-item glass-sleek home-pillar-card"
      onClick={() => onNavigate(item.targetNav)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (window.innerWidth > 768) {
          if (maskRef.current) maskRef.current.style.opacity = '1';
          if (iconRef.current) {
            iconRef.current.style.transform = 'scale(2.1)';
            iconRef.current.style.opacity = '0.15';
          }
          videoRef.current?.play().catch(() => {});
        }
      }}
      onMouseLeave={() => {
        if (window.innerWidth > 768) {
          if (maskRef.current) maskRef.current.style.opacity = '0';
          if (iconRef.current) {
            iconRef.current.style.transform = 'scale(2.5)';
            iconRef.current.style.opacity = '0.6';
          }
          videoRef.current?.pause();
        }
      }}
    >
      {/* BASE LAYER: Soft Color Wash + Centered Icon */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            ref={iconRef}
            style={{
              color: item.color,
              transform: 'scale(2.5)',
              opacity: 0.6,
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease'
            }}
          >
            {item.icon}
          </div>
        </div>
        <div style={{ padding: '1rem', background: 'transparent', height: '130px' }} />
      </div>

      {/* MASK LAYER: Cursor Spotlight Video Reveal */}
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
            transition: 'opacity 0.6s ease-in-out'
          }}
        >
          <video
            ref={videoRef}
            src={item.previewVideoUrl}
            preload="metadata"
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.94) contrast(1.06)',
              transform: 'translateZ(0)'
            }}
          />
        </motion.div>
      )}

      {/* CAPTION LAYER */}
      <div
        className="gallery-caption"
        style={{
          position: 'relative',
          zIndex: 3,
          marginTop: 'auto',
          background:
            'linear-gradient(to top, rgba(255,255,255,0.98) 45%, rgba(255,255,255,0.82) 82%, transparent)',
          padding: '2.2rem 1.35rem 1.35rem 1.35rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <h3 style={{ fontSize: '1.28rem', margin: 0, color: '#111', fontWeight: 700, letterSpacing: '-0.4px' }}>
            {item.title}
          </h3>
          <ArrowUpRight size={17} style={{ color: '#888', flexShrink: 0 }} />
        </div>

        <p className="pillar-aligned-desc">
          {item.description}
        </p>

        {/* Single-Row 3-Chip Bar */}
        <div className="pillar-chips-single-row">
          {item.quickServices.map((srv) => (
            <button
              key={srv.serviceTitle}
              type="button"
              className="pillar-quick-chip"
              onClick={(e) => {
                e.stopPropagation();
                onTeleport(item.targetNav, srv.serviceTitle);
              }}
              title={`Open ${srv.serviceTitle}`}
            >
              {srv.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeSection({ onNavigate, direction = 0 }) {
  const [activeBranch, setActiveBranch] = useState('what-we-do');

  const branches = [
    { id: 'what-we-do', label: 'What We Do' },
    { id: 'founder', label: "Hi, I'm Caio" },
    { id: 'proof', label: 'Client Success' },
    { id: 'brands', label: 'Trusted Brands' }
  ];

  const handleTeleport = (section, serviceTitle) => {
    if (serviceTitle) {
      sessionStorage.setItem('pendingOpenService', serviceTitle);
    }
    onNavigate(section);
  };

  const threePillars = [
    {
      title: 'Media Production',
      description: 'Cinema-grade promo films, 360° drone aerials & live broadcast.',
      icon: <Film size={32} />,
      color: '#eab308',
      previewVideoUrl: '/assets/previews/9a3e3964-e827-4d7f-a65f-2c4052c1444d_preview.mp4',
      targetNav: 'media',
      quickServices: [
        { label: 'Promos', serviceTitle: 'Promo Videos' },
        { label: 'Drone & 360°', serviceTitle: 'Drone & 360° Videos' },
        { label: 'Live Events', serviceTitle: 'Events' }
      ]
    },
    {
      title: 'Web & Brand Design',
      description: 'High-converting web platforms, storefronts & brand systems.',
      icon: <Layout size={32} />,
      color: '#0ea5e9',
      previewVideoUrl: '/assets/videos/hero_showreel.mp4',
      targetNav: 'design',
      quickServices: [
        { label: 'Websites', serviceTitle: 'Bespoke Web Platforms' },
        { label: 'E-Commerce', serviceTitle: 'E-Commerce Storefronts' },
        { label: 'Branding', serviceTitle: 'Brand Identity' }
      ]
    },
    {
      title: 'AI & Growth Strategy',
      description: 'Custom AI agents, automated workflows & growth strategy.',
      icon: <TrendingUp size={32} />,
      color: '#10b981',
      previewVideoUrl: '/assets/previews/ba4ec20e-167f-4a53-a2f2-96b7f1bcaa59_preview.mp4',
      targetNav: 'growth',
      quickServices: [
        { label: 'Strategy', serviceTitle: 'Brand & Digital Strategy' },
        { label: 'AI Agents', serviceTitle: 'Custom AI Agents' },
        { label: 'Automation', serviceTitle: 'Workflow Automation' }
      ]
    }
  ];

  const trustedClients = [
    'AbsoluteAV',
    'AstraZeneca',
    'AV3 Media',
    'C.T.B.A.',
    'C-MET',
    'Cambridge Teacher Training',
    'Chat21',
    'Churchill College',
    'Cider Incider',
    'Ely Porta Language School',
    'Enrique Philip Art',
    'Fundicao Progresso',
    'Haras Uirapuru',
    'JHFitness Academy',
    'Mick Davies Education',
    'Momentm Health',
    'Soulvent Records',
    'TC Digital',
    'TCO International',
    'True Life Prod.',
    'University of Cambridge',
    'VenueAV',
    'Vinyl Frontier',
    'WKA World HQ'
  ];

  return (
    <motion.div
      className="section-wrapper scrollable home-section-wrapper"
      initial="initial"
      animate="in"
      exit="out"
      custom={direction}
      variants={pageVariants}
    >
      <div className="content-container wide home-content-container">
        {/* CHOREOGRAPHED HEADER + BRANCH NAV */}
        <motion.div
          className="section-header-sleek home-header-sleek"
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
        >
          <h2
            className="section-title"
            style={{
              background: 'var(--gradient-main)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Bonsai
          </h2>
          <p className="section-subtitle sleek-text">
            Creative media, bespoke web platforms &amp; AI growth — built for serious ROI.
          </p>

          <BranchNav
            navId="home"
            branches={branches}
            activeBranch={activeBranch}
            setActiveBranch={setActiveBranch}
          />
        </motion.div>

        {/* BRANCH CONTENT AREA */}
        <div className="branch-content-area home-branch-area">
          <AnimatePresence mode="wait">
            {/* TAB 1: WHAT WE DO */}
            {activeBranch === 'what-we-do' && (
              <motion.div
                key="what-we-do"
                variants={branchSlideVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="home-tab-stage home-tab-stage-column"
              >
                <motion.div
                  className="home-pillars-stage"
                  variants={staggerContainer}
                  initial="initial"
                  animate="in"
                >
                  {threePillars.map((item) => (
                    <SpotlightPillarCard
                      key={item.title}
                      item={item}
                      onNavigate={onNavigate}
                      onTeleport={handleTeleport}
                    />
                  ))}
                </motion.div>

                {/* Whisper-quiet trust anchor underneath the 3 pillar cards */}
                <motion.button
                  type="button"
                  className="home-trust-microline"
                  onClick={() => setActiveBranch('brands')}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  <span>Trusted by</span>
                  <strong>University of Cambridge</strong>
                  <span className="trust-dot">·</span>
                  <strong>AstraZeneca</strong>
                  <span className="trust-dot">·</span>
                  <strong>Churchill College</strong>
                  <span className="trust-dot">·</span>
                  <span className="trust-more">+20 more →</span>
                </motion.button>
              </motion.div>
            )}

            {/* TAB 2: HI, I'M CAIO (Founder) */}
            {activeBranch === 'founder' && (
              <motion.div
                key="founder"
                variants={branchSlideVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="home-tab-stage"
              >
                <div className="glass-sleek home-about-card">
                  <div className="home-about-watermark">
                    <User size={260} strokeWidth={0.5} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
                      <img
                        src="/assets/founder.jpg"
                        alt="Caio Laborda-Davies"
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      />
                      <div>
                        <h3
                          style={{
                            fontSize: 'clamp(1.65rem, 3.5vw, 2.2rem)',
                            letterSpacing: '-1px',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}
                        >
                          Hi, I&apos;m Caio.
                          <span style={{ fontSize: '0.95rem', color: '#999', fontWeight: 400, letterSpacing: '0' }}>
                            (pronounced &quot;Kaiyo&quot;)
                          </span>
                        </h3>
                        <h4
                          style={{
                            fontSize: '0.84rem',
                            color: '#888',
                            margin: '0.2rem 0 0 0',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >
                          Founder &amp; Creative Director
                        </h4>
                      </div>
                    </div>

                    <p className="sleek-body" style={{ marginBottom: '0.7rem', fontSize: '1.02rem', lineHeight: 1.55 }}>
                      I started Bonsai because I wanted to bridge the gap between stunning creative design and serious technical performance.
                    </p>
                    <p className="sleek-body" style={{ marginBottom: '0.7rem', fontSize: '1.02rem', lineHeight: 1.55 }}>
                      After spending over a decade building digital experiences for esteemed organizations like the University of Cambridge, I realized my true passion was helping ambitious brands and changemakers level up their digital game.
                    </p>
                    <p className="sleek-body" style={{ marginBottom: '1.15rem', fontSize: '1.02rem', lineHeight: 1.55 }}>
                      Whether we&apos;re designing a brand identity, shooting 360° drone footage, or coding a lightning-fast web app, my goal is to build something that looks beautiful and delivers serious ROI.
                    </p>

                    <div className="contact-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <a href="mailto:hello@bonsaimedia.co.uk" className="btn-secondary-sleek" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                        Email
                      </a>
                      <a href="tel:07903857815" className="btn-secondary-sleek" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                        Call Us: 07903857815
                      </a>
                      <button
                        onClick={() => onNavigate('booking')}
                        className="btn-primary-sleek"
                        style={{ padding: '0.6rem 1.35rem', fontSize: '0.9rem', cursor: 'pointer' }}
                      >
                        Book a Meeting
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: CLIENT SUCCESS (Real Testimonials) */}
            {activeBranch === 'proof' && (
              <motion.div
                key="proof"
                variants={branchSlideVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="home-tab-stage"
              >
                <div className="home-proof-grid">
                  <div className="glass-sleek home-testimonial-card">
                    <div className="home-about-watermark">
                      <Star size={220} strokeWidth={0.5} />
                    </div>
                    <p className="quote" style={{ fontSize: '1.1rem', marginBottom: '1.4rem', fontStyle: 'italic', color: '#222', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
                      &quot;Caio didn&apos;t just want to build a website; he wanted to capture the essence of my club... Since its launch, our client base has surged by 50%.&quot;
                    </p>
                    <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
                      <img src="/assets/junior_herbert.jpg" alt="Junior Herbert" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <strong style={{ fontSize: '1.02rem', color: '#111' }}>Junior Herbert</strong>
                        <br />
                        <span style={{ fontSize: '0.84rem', color: '#777' }}>Founder of C.T.B.A. | 3X Kickboxing Champion</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-sleek home-testimonial-card">
                    <div className="home-about-watermark">
                      <Star size={220} strokeWidth={0.5} />
                    </div>
                    <p className="quote" style={{ fontSize: '1.1rem', marginBottom: '1.4rem', fontStyle: 'italic', color: '#222', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
                      &quot;We grew our sales 10x in the space of 8 months! We simply couldn&apos;t have grown so rapidly without their brilliant strategy and execution.&quot;
                    </p>
                    <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
                      <img src="/assets/lee_barresi.jpg" alt="Lee Barresi" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <strong style={{ fontSize: '1.02rem', color: '#111' }}>Lee Barresi</strong>
                        <br />
                        <span style={{ fontSize: '0.84rem', color: '#777' }}>Founder of Cider Incider</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: TRUSTED BRANDS */}
            {activeBranch === 'brands' && (
              <motion.div
                key="brands"
                variants={branchSlideVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="home-tab-stage"
              >
                <div className="glass-sleek home-about-card">
                  <div className="home-about-watermark">
                    <Award size={260} strokeWidth={0.5} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3 style={{ fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '1.35rem' }}>
                      Proud to have worked alongside
                    </h3>
                    <div className="client-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem 1.5rem' }}>
                      {trustedClients.map((client) => (
                        <span key={client}>{client}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
