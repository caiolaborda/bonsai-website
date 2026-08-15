import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, BarChart, Settings, Search, Rocket, Users, Database, Cpu, TrendingUp, Target, BarChart2, Layout, Palette, Film } from 'lucide-react';
import BranchNav from './BranchNav';
import Timeline from './Timeline';
import Lightbox from './Lightbox';
import InfiniteGallery from './InfiniteGallery';
import ProjectGrid from './ProjectGrid';

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

export default function GrowthSection({ onNavigate, direction }) {
  const [activeBranch, setActiveBranch] = useState('services');
  const [lightboxItem, setLightboxItem] = useState(null);

  const branches = [
    { id: 'services', label: 'Services' },
    { id: 'recents', label: 'Cases' },
    { id: 'process', label: 'Process' }
  ];

  const services = [
    {
      title: "Strategic Partnership",
      description: "Deep integration into your daily processes.",
      extendedText: "We work super closely with your team to understand, refine, and integrate your daily tools, finding high-impact ways to make life better and easier.",
      icon: <Users />,
      color: "#10b981",
      crossSell: { title: "Bespoke Web Platforms", nav: "design", icon: <Layout size={18} /> }
    },
    {
      title: "Data & Automation",
      description: "Automated scraping and data processing.",
      extendedText: "We build bespoke automation pipelines that handle data analysis, web scraping, and heavy processing so your team can focus on strategy.",
      icon: <Database />,
      color: "#f59e0b",
      crossSell: { title: "Brand Identity", nav: "design", icon: <Palette size={18} /> }
    },
    {
      title: "AI & Systems Sync",
      description: "Unifying disparate digital tools.",
      extendedText: "From deploying intelligent AI chatbots to linking completely disconnected software, we unify your tech stack into a single, seamless ecosystem.",
      icon: <Cpu />,
      color: "#ef4444",
      crossSell: { title: "Promo Videos", nav: "media", icon: <Film size={18} /> }
    }
  ];

  useEffect(() => {
    // Check if we navigated here via cross-sell
    const pending = sessionStorage.getItem('pendingOpenService');
    if (pending) {
      const match = services.find(s => s.title === pending);
      if (match) {
        setActiveBranch('services');
        setLightboxItem(match); // Note: GrowthSection uses setLightboxItem for services
        sessionStorage.removeItem('pendingOpenService');
      }
    }

    const handleOpenService = (e) => {
      const match = services.find(s => s.title === e.detail);
      if (match) {
        setActiveBranch('services');
        setLightboxItem(match); // Note: GrowthSection uses setLightboxItem for services
      }
    };
    window.addEventListener('openService', handleOpenService);
    return () => window.removeEventListener('openService', handleOpenService);
  }, [services]);

  const recents = [
    {
      title: "FinTech SEO Domination",
      description: "200% increase in organic traffic in 6 months.",
      extendedText: "A comprehensive SEO and content strategy for a leading FinTech app, scaling their organic acquisition channel massively.",
      icon: <TrendingUp />,
      color: "#10b981",
      tags: ["SEO", "Content"]
    },
    {
      title: "E-Commerce Paid Scaling",
      description: "Scaled ad spend by 400% while reducing CAC.",
      extendedText: "Complex multi-channel paid acquisition strategy across Meta, TikTok, and Google Ads for a DTC apparel brand.",
      icon: <Target />,
      color: "#f59e0b",
      tags: ["Paid Ads"]
    },
    {
      title: "SaaS CRM Integration",
      description: "Automated onboarding reducing churn by 15%.",
      extendedText: "Built a fully automated email and in-app messaging flow synced perfectly with their custom backend CRM.",
      icon: <Settings />,
      color: "#ef4444",
      tags: ["Automation", "CRM"]
    },
    {
      title: "Global Supply Data Pipeline",
      description: "Automated supplier data scraping and dashboarding.",
      extendedText: "A custom Python automation pipeline that aggregates data from 40 global suppliers into a live reporting dashboard.",
      icon: <Database />,
      color: "#3b82f6",
      tags: ["Automation", "Data"]
    },
    {
      title: "Real Estate AI Assistant",
      description: "Intelligent chatbot handling 40% of preliminary inquiries.",
      extendedText: "Trained and deployed a custom AI agent that qualifies leads 24/7 on the client's website, syncing directly to Salesforce.",
      icon: <Cpu />,
      color: "#8b5cf6",
      tags: ["AI", "Automation"]
    }
  ];

  const processSteps = [
    { title: "Systems Audit", description: "We analyze your current operations, marketing channels, and data pipelines to identify bottlenecks and opportunities for AI integration.", bgIcon: <Search size={300} strokeWidth={0.5} /> },
    { title: "Growth Strategy", description: "We design a custom, holistic architecture detailing which automated tools and promotional channels will yield the highest ROI.", bgIcon: <TrendingUp size={300} strokeWidth={0.5} /> },
    { title: "Implementation & Build", description: "Our engineers and strategists build and deploy the AI agents, automated workflows, and ad campaigns seamlessly into your ecosystem.", bgIcon: <Settings size={300} strokeWidth={0.5} /> },
    { title: "Optimization", description: "We meticulously track KPIs, using machine learning insights to continuously iterate and improve campaign performance.", bgIcon: <BarChart2 size={300} strokeWidth={0.5} /> }
  ];

  // renderGallery removed in favor of InfiniteGallery

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
            <h2 className="section-title">Growth & Automation</h2>
            <p className="section-subtitle sleek-text">Partnering closely to refine your tools, automate your data, and unify your systems.</p>
            
            <BranchNav navId="growth" branches={branches} activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
          </div>

          <div className="branch-content-area">
            <AnimatePresence mode="wait">
              
              {activeBranch === 'services' && (
                <motion.div key="services" variants={slideVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.4 }}>
                  <InfiniteGallery items={services} onSelect={setLightboxItem} />
                </motion.div>
              )}

              {activeBranch === 'recents' && (
                <motion.div key="recents" variants={slideVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.4 }}>
                  <InfiniteGallery items={recents} onSelect={setLightboxItem} />
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

      <Lightbox 
        isOpen={!!lightboxItem} 
        onClose={() => setLightboxItem(null)} 
        content={lightboxItem}
        onNavigate={onNavigate}
      />
    </>
  );
}
