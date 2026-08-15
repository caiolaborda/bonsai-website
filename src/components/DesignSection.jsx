import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Palette, Code, TrendingUp, Film, Play } from 'lucide-react';
import BranchNav from './BranchNav';
import Timeline from './Timeline';
import ServiceBento from './ServiceBento';
import Lightbox from './Lightbox';
import InfiniteGallery from './InfiniteGallery';
import ProjectGrid from './ProjectGrid';
import { Eye } from 'lucide-react';
import usePortfolio from '../hooks/usePortfolio';

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

export default function DesignSection({ onNavigate, direction }) {
  const [activeBranch, setActiveBranch] = useState('services');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const branches = [
    { id: 'services', label: 'Services' },
    { id: 'recents', label: 'Recent' },
    { id: 'process', label: 'Process' }
  ];

  const services = [
    {
      title: "Bespoke Web Platforms",
      description: "Performance-driven web platforms for modern visionaries.",
      extendedText: "We build highly tailored, scalable web platforms that blend striking visual design with robust underlying architecture. From corporate sites to complex web applications.",
      icon: <Layout />,
      color: "#0ea5e9",
      tagMatch: ['Web Design', 'Websites', 'E-Commerce'],
      crossSell: { title: "Growth Strategy", nav: "growth", icon: <TrendingUp size={18} /> },
      valueProps: [
        { title: "Blazing Fast", desc: "Built on modern frameworks ensuring instant load times and perfect SEO." },
        { title: "Fully Custom", desc: "No templates. Every pixel is hand-crafted to fit your brand exactly." },
        { title: "Scalable", desc: "Architecture designed to handle massive traffic spikes as you grow." }
      ]
    },
    {
      title: "UI / UX Design",
      description: "Gorgeous interfaces and frictionless user journeys.",
      extendedText: "Our user-centric design process ensures that every interaction is intuitive and beautiful, maximizing engagement and converting visitors into loyal clients.",
      icon: <Code />,
      color: "#8b5cf6",
      tagMatch: ['SaaS', 'App Design'],
      crossSell: { title: "Promo Videos", nav: "media", icon: <Film size={18} /> },
      valueProps: [
        { title: "User Retention", desc: "Intuitive flows that keep users engaged and reduce churn." },
        { title: "Accessibility", desc: "Designs that look stunning while remaining fully accessible to all." },
        { title: "Prototyping", desc: "Interactive mockups you can test before writing a single line of code." }
      ]
    },
    {
      title: "Brand Identity",
      description: "Holistic digital identities and immersive style guides.",
      extendedText: "Beyond websites, we craft the core DNA of your brand. From logo design and typography to comprehensive digital asset libraries, ensuring consistency across every touchpoint.",
      icon: <Palette />,
      color: "#ec4899",
      tagMatch: ['Branding', 'Corporate'],
      crossSell: { title: "Social Media", nav: "media", icon: <Play size={18} /> },
      valueProps: [
        { title: "Consistency", desc: "A unified look across your website, socials, and print materials." },
        { title: "Authority", desc: "Look like the market leader from day one with a premium identity." },
        { title: "Brand Bible", desc: "Comprehensive guidelines so your team never goes off-brand." }
      ]
    }
  ];

  useEffect(() => {
    // Check if we navigated here via cross-sell
    const pending = sessionStorage.getItem('pendingOpenService');
    if (pending) {
      const match = services.find(s => s.title === pending);
      if (match) {
        setActiveBranch('services');
        setSelectedService(match);
        sessionStorage.removeItem('pendingOpenService');
      }
    }

    const handleOpenService = (e) => {
      const match = services.find(s => s.title === e.detail);
      if (match) {
        setActiveBranch('services');
        setSelectedService(match);
      }
    };
    window.addEventListener('openService', handleOpenService);
    return () => window.removeEventListener('openService', handleOpenService);
  }, [services]);

  const { items, loading } = usePortfolio();
  const recents = items.filter(item => item.category === 'design');

  const processSteps = [
    { title: "Discovery & Audit", description: "We analyze your current digital footprint, market positioning, and user behavior to identify core opportunities.", bgIcon: <Eye size={300} strokeWidth={0.5} /> },
    { title: "Wireframing & UX", description: "We map out the user journey and structural hierarchy, ensuring a frictionless and logical flow of information.", bgIcon: <Layout size={300} strokeWidth={0.5} /> },
    { title: "Visual Design (UI)", description: "We apply your brand's unique aesthetics, creating high-fidelity mockups with gorgeous typography and micro-interactions.", bgIcon: <Palette size={300} strokeWidth={0.5} /> },
    { title: "Development & Launch", description: "Our engineering team brings the designs to life using modern web frameworks, ensuring lightning-fast performance before final deployment.", bgIcon: <Code size={300} strokeWidth={0.5} /> }
  ];

  return (
    <>
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
            <h2 className="section-title">Digital Design</h2>
            <p className="section-subtitle sleek-text">Captivating, conversion-optimized web and brand experiences.</p>
            
            <BranchNav navId="design" branches={branches} activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
          </div>

          <div className="branch-content-area">
            <AnimatePresence mode="wait">
              
              {activeBranch === 'services' && (
                <motion.div key="services" variants={slideVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.4 }}>
                  <InfiniteGallery items={services} onSelect={setSelectedService} />
                </motion.div>
              )}

              {activeBranch === 'recents' && (
                <motion.div key="recents" variants={slideVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.4 }}>
                  <ProjectGrid items={recents} loading={loading} onSelect={setSelectedProject} />
                </motion.div>
              )}

              {activeBranch === 'process' && (
                <motion.div key="process" variants={slideVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.4 }}>
                  <Timeline steps={processSteps} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <ServiceBento 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        content={selectedService}
        onNavigate={onNavigate}
      />

      <Lightbox 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        content={selectedProject} 
        onNavigate={onNavigate}
      />
    </>
  );
}
