import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Palette, Code, TrendingUp, Film, Play, ShoppingCart, Sparkles, MonitorSmartphone, Presentation, Compass, BarChart3, Bot, Eye } from 'lucide-react';
import BranchNav from './BranchNav';
import Timeline from './Timeline';
import ServiceBento from './ServiceBento';
import Lightbox from './Lightbox';
import InfiniteGallery from './InfiniteGallery';
import ProjectGrid from './ProjectGrid';
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
      description: "High-performance, stunning web presences.",
      extendedText: "We build highly tailored, scalable web platforms that blend striking visual design with robust underlying architecture. From corporate sites to complex web applications.",
      icon: <Layout />,
      color: "#0ea5e9",
      tagMatch: ['Web Design', 'Websites'],
      crossSell: { title: "Brand & Digital Strategy", nav: "growth", icon: <Compass size={18} /> },
      valueProps: [
        { title: "Blazing Fast", desc: "Built on modern frameworks ensuring instant load times and perfect SEO." },
        { title: "Fully Custom", desc: "No templates. Every pixel is hand-crafted to fit your brand exactly." },
        { title: "Scalable", desc: "Architecture designed to handle massive traffic spikes as you grow." }
      ]
    },
    {
      title: "E-Commerce Storefronts",
      description: "Frictionless digital shopping experiences.",
      extendedText: "We design seamless shopping experiences that reduce friction, build brand loyalty, and maximize average order value from landing page to checkout.",
      icon: <ShoppingCart />,
      color: "#10b981",
      tagMatch: ['E-Commerce'],
      crossSell: { title: "Promo Videos", nav: "media", icon: <Film size={18} /> },
      valueProps: [
        { title: "Conversion Optimized", desc: "UX designed specifically to reduce cart abandonment." },
        { title: "Seamless Checkout", desc: "Frictionless payment gateways and smooth user flows." },
        { title: "Inventory Sync", desc: "Robust integrations with your back-office and fulfillment systems." }
      ]
    },
    {
      title: "Interactive Experiences",
      description: "Immersive, boundary-pushing web interactions.",
      extendedText: "Break the mold with highly interactive, visually stunning digital experiences that engage users through advanced animations, 3D elements, and gamification.",
      icon: <Sparkles />,
      color: "#8b5cf6",
      tagMatch: ['Interactive', 'Web Design'],
      crossSell: { title: "Custom AI Agents", nav: "growth", icon: <Bot size={18} /> },
      valueProps: [
        { title: "Memorable", desc: "Experiences that users actually want to share." },
        { title: "Engaging", desc: "Micro-interactions that make the site feel alive." },
        { title: "Performant", desc: "Smooth 60fps animations that don't drain batteries." }
      ]
    },
    {
      title: "Campaign Microsites",
      description: "High-impact, temporary digital experiences.",
      extendedText: "Perfect for product launches or marketing activations, we design highly memorable, interactive mini-sites that bridge the gap between media campaigns and digital touchpoints.",
      icon: <MonitorSmartphone />,
      color: "#f59e0b",
      tagMatch: ['Microsites', 'Promotional'],
      crossSell: { title: "Social Media", nav: "media", icon: <Play size={18} /> },
      valueProps: [
        { title: "High Impact", desc: "Bold, unconstrained design rules tailored for a single goal." },
        { title: "Rapid Deployment", desc: "Built and launched quickly to align with your marketing beats." },
        { title: "Highly Shareable", desc: "Designed from the ground up to go viral and capture leads." }
      ]
    },
    {
      title: "Brand Identity",
      description: "The overarching visual DNA of your enterprise.",
      extendedText: "We craft the core aesthetic of your brand. From logo design and typography to comprehensive digital asset libraries, ensuring absolute consistency.",
      icon: <Palette />,
      color: "#ec4899",
      tagMatch: ['Branding', 'Corporate'],
      crossSell: { title: "Brand & Digital Strategy", nav: "growth", icon: <Compass size={18} /> },
      valueProps: [
        { title: "Consistency", desc: "A unified look across your website, socials, and print materials." },
        { title: "Authority", desc: "Look like the market leader from day one with a premium identity." },
        { title: "Brand Bible", desc: "Comprehensive guidelines so your team never goes off-brand." }
      ]
    },
    {
      title: "Pitch Decks & Presentations",
      description: "High-stakes visual storytelling.",
      extendedText: "We design investor pitch decks and keynote presentations that command authority, utilizing gorgeous data visualization to help you win high-ticket deals.",
      icon: <Presentation />,
      color: "#ef4444",
      tagMatch: ['Pitch Decks', 'Presentations'],
      crossSell: { title: "Dashboards & Analytics", nav: "growth", icon: <BarChart3 size={18} /> },
      valueProps: [
        { title: "Persuasive", desc: "Information hierarchy designed to drive the narrative forward." },
        { title: "Data Visualization", desc: "Turning complex numbers into immediately understandable graphs." },
        { title: "Enterprise Grade", desc: "Slide decks that look like they belong in a Fortune 500 boardroom." }
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
