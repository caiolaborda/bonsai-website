import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, BarChart, Settings, Search, Rocket, Users, Database, Cpu, TrendingUp, Target, BarChart2, Layout, Palette, Film, Compass, BarChart3, ShoppingCart, Play, MonitorSmartphone, Sparkles } from 'lucide-react';
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
      title: "Brand & Digital Strategy",
      description: "Elite strategic roadmapping for your business.",
      extendedText: "We partner deeply with your leadership team to define market positioning, architectural consulting, and long-term digital growth roadmaps.",
      icon: <Compass />,
      color: "#f59e0b",
      crossSell: { title: "Bespoke Web Platforms", nav: "design", icon: <Layout size={18} /> },
      valueProps: [
        { title: "Clarity", desc: "A unified direction for your entire digital ecosystem." },
        { title: "Positioning", desc: "Identifying and exploiting gaps in your competitors' strategies." },
        { title: "Architecture", desc: "Planning the right tech stack before writing a single line of code." }
      ]
    },
    {
      title: "Dashboards & Analytics",
      description: "Live reporting and custom data visualization.",
      extendedText: "We transform complex data sets into clear, actionable, and visually stunning dashboards that make managing your business effortless.",
      icon: <BarChart3 />,
      color: "#3b82f6",
      crossSell: { title: "E-Commerce Storefronts", nav: "design", icon: <ShoppingCart size={18} /> },
      valueProps: [
        { title: "Clarity", desc: "Clean UI that highlights the metrics that actually matter." },
        { title: "Real-Time", desc: "Live data integrations for up-to-the-second insights." },
        { title: "User-Centric", desc: "Workflows designed for how your team actually works." }
      ]
    },
    {
      title: "Custom AI Agents",
      description: "Intelligent, brand-trained digital assistants.",
      extendedText: "We train and deploy bespoke AI agents that automate your internal workflows and provide hyper-personalized experiences for your users.",
      icon: <Bot />,
      color: "#8b5cf6",
      crossSell: { title: "Interactive Experiences", nav: "design", icon: <Sparkles size={18} /> },
      valueProps: [
        { title: "Brand Aligned", desc: "AI that actually sounds and acts exactly like your brand." },
        { title: "24/7 Automation", desc: "Qualify leads and handle inquiries around the clock." },
        { title: "Secure", desc: "Private implementations that protect your proprietary data." }
      ]
    },
    {
      title: "Workflow Automation",
      description: "Eliminating manual labor through API syncing.",
      extendedText: "We build bespoke automation pipelines that handle heavy processing, syncing completely disconnected software so your team can focus on strategy.",
      icon: <Settings />,
      color: "#10b981",
      crossSell: { title: "Campaign Microsites", nav: "design", icon: <MonitorSmartphone size={18} /> },
      valueProps: [
        { title: "Efficiency", desc: "Reclaim hundreds of hours of manual administrative labor." },
        { title: "Accuracy", desc: "Eliminate human error from repetitive data entry tasks." },
        { title: "Scalability", desc: "Systems that handle 10x volume without hiring more staff." }
      ]
    },
    {
      title: "Data Pipelines & Scraping",
      description: "Automated data extraction and processing.",
      extendedText: "Custom Python automation pipelines that extract live market data, supplier information, or competitor pricing into unified databases.",
      icon: <Database />,
      color: "#ef4444",
      crossSell: { title: "Social Media", nav: "media", icon: <Play size={18} /> },
      valueProps: [
        { title: "Market Intel", desc: "Always-on monitoring of your competitors and suppliers." },
        { title: "Aggregation", desc: "Pulling from dozens of sources into one clean feed." },
        { title: "API Creation", desc: "Turning unstructured web data into clean REST APIs." }
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
