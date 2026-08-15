import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

export default function WebSection() {
  return (
    <motion.div
      className="section-wrapper scrollable"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
    >
      <div className="content-container slim">
        <div className="section-header-sleek">
          <h2 className="section-title">Digital Design</h2>
          <p className="section-subtitle sleek-text">Captivating, conversion-optimized web experiences.</p>
        </div>
        
        <div className="text-block glass-sleek" style={{ marginTop: '2rem', padding: '3.5rem', borderRadius: '30px', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '2rem', letterSpacing: '-0.5px' }}>Digital Services for Changemakers</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.8, fontSize: '1.1rem', color: '#444' }}>
            You're a visionary - a bold innovator using business to spark positive change and manifest your ambitious dreams into reality. But to truly maximize your impact, you need a digital presence that crystalizes your vision and resonates with your audience on a profound level.
          </p>
          
          <p style={{ marginBottom: '2.5rem', lineHeight: 1.8, fontSize: '1.1rem', color: '#444' }}>
            We're digital storytellers and growth catalysts who combine imaginative talent with bleeding-edge tech to amplify your brand and accelerate meaningful connections. Our full suite of specialized services are carefully tailored to capture the soul of your organization.
          </p>
          
          <a href="#booking" className="btn-primary-sleek" style={{ textDecoration: 'none' }}>
            Elevate your digital impact
          </a>
        </div>
      </div>
    </motion.div>
  );
}
