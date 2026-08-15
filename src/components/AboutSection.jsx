import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Award, ChevronRight } from 'lucide-react';

const pageVariants = {
  initial: (direction) => ({ opacity: 0, x: direction > 0 ? 40 : -40 }),
  in: { opacity: 1, x: 0 },
  out: (direction) => ({ opacity: 0, x: direction > 0 ? -40 : 40 })
};

const slideVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

function AboutAccordion({ onNavigate }) {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const panels = [
    {
      id: 'founder',
      title: "Hi, I'm Caio",
      icon: <User size={300} strokeWidth={0.5} />,
      content: (
        <div className="about-accordion-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <img src="/assets/founder.jpg" alt="Caio Laborda-Davies" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
            <div>
              <h3 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', letterSpacing: '-1px', margin: 0, display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                Hi, I'm Caio. 
                <span style={{ fontSize: '1rem', color: '#999', fontWeight: 400, letterSpacing: '0' }}>(pronounced "Kaiyo")</span>
              </h3>
              <h4 style={{ fontSize: '0.9rem', color: '#888', margin: '0.2rem 0 0 0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Founder & Creative Director</h4>
            </div>
          </div>
          
          <p className="sleek-body" style={{ marginBottom: '0.8rem', fontSize: '1.05rem', lineHeight: 1.5 }}>I started Bonsai because I wanted to bridge the gap between stunning creative design and serious technical performance.</p>
          <p className="sleek-body" style={{ marginBottom: '0.8rem', fontSize: '1.05rem', lineHeight: 1.5 }}>After spending over a decade building digital experiences for esteemed organizations like the University of Cambridge, I realized my true passion was helping ambitious brands and changemakers level up their digital game.</p>
          <p className="sleek-body" style={{ marginBottom: '1.2rem', fontSize: '1.05rem', lineHeight: 1.5 }}>Whether we're designing a brand identity, shooting 360° drone footage, or coding a lightning-fast web app, my goal is to build something that looks beautiful and delivers serious ROI.</p>
          
          <div className="contact-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <a href="tel:+440000000000" className="btn-secondary-sleek" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Call</a>
            <a href="mailto:hello@bonsaimedia.co.uk" className="btn-secondary-sleek" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Email</a>
            <button onClick={() => onNavigate && onNavigate('booking')} className="btn-secondary-sleek" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent' }}>Book a Meeting</button>
          </div>
        </div>
      )
    },
    {
      id: 'success',
      title: 'Client Success',
      icon: <Star size={300} strokeWidth={0.5} />,
      content: (
        <div className="about-accordion-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <p className="quote" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic', color: '#333', lineHeight: 1.5 }}>"Caio didn't just want to build a website; he wanted to capture the essence of my club... Since its launch, our client base has surged by 50%."</p>
            <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src="/assets/junior_herbert.jpg" alt="Junior Herbert" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <strong style={{ fontSize: '1rem' }}>Junior Herbert</strong>
                <br/><span style={{ fontSize: '0.85rem', color: '#888' }}>Founder of C.T.B.A. | 3X Kickboxing Champion</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="quote" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic', color: '#333', lineHeight: 1.5 }}>"We grew our sales 10x in the space of 8 months! We simply couldn't have grown so rapidly without their brilliant strategy and execution."</p>
            <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src="/assets/lee_barresi.jpg" alt="Lee Barresi" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <strong style={{ fontSize: '1rem' }}>Lee Barresi</strong>
                <br/><span style={{ fontSize: '0.85rem', color: '#888' }}>Founder of Cider Incider</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'brands',
      title: 'Trusted Brands',
      icon: <Award size={300} strokeWidth={0.5} />,
      content: (
        <div className="about-accordion-content">
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '1.5rem' }}>Proud to have worked alongside</h3>
          <div className="client-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 1.5rem', fontSize: '1.05rem', fontWeight: '500', color: '#444' }}>
            <span>AbsoluteAV</span>
            <span>AstraZeneca</span>
            <span>AV3 Media</span>
            <span>C.T.B.A.</span>
            <span>C-MET</span>
            <span>Cambridge Teacher Training</span>
            <span>Chat21</span>
            <span>Churchill College</span>
            <span>Cider Incider</span>
            <span>Ely Porta Language School</span>
            <span>Enrique Philip Art</span>
            <span>Fundicao Progresso</span>
            <span>Haras Uirapuru</span>
            <span>JHFitness Academy</span>
            <span>Mick Davies Education</span>
            <span>Momentm Health</span>
            <span>Soulvent Records</span>
            <span>TC Digital</span>
            <span>TCO International</span>
            <span>True Life Prod.</span>
            <span>University of Cambridge</span>
            <span>VenueAV</span>
            <span>Vinyl Frontier</span>
            <span>WKA World HQ</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="hover-timeline-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {panels.map((panel, index) => {
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
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="hover-timeline-inner" style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
              {isActive ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  style={{ marginTop: 'auto', marginBottom: '1rem', position: 'relative', zIndex: 2 }}
                >
                  {panel.content}
                </motion.div>
              ) : (
                <div className="hover-timeline-vertical-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', zIndex: 2, position: 'relative' }}>
                  {panel.title}
                  <ChevronRight size={18} />
                </div>
              )}

              {panel.icon && (
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
                  {panel.icon}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AboutSection({ onNavigate, direction }) {
  return (
    <motion.div
      className="section-wrapper scrollable"
      initial="initial"
      animate="in"
      exit="out"
      custom={direction}
      variants={pageVariants}
      transition={{ duration: 0.6 }}
    >
      <div className="content-container wide">
        <div className="section-header-sleek">
          <h2 className="section-title">About Bonsai</h2>
          <p className="section-subtitle sleek-text">The people, the passion, and the proof behind our work.</p>
        </div>
        
        <div className="branch-content-area" style={{ marginTop: '0' }}>
           <AboutAccordion onNavigate={onNavigate} />
        </div>
      </div>
    </motion.div>
  );
}
