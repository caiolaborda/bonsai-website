import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Aperture, Play, Radio, Users, Camera, Mic, Code, Database, Layout, Compass, Lightbulb } from 'lucide-react';
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

export default function MediaSection({ onNavigate, direction }) {
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
      title: "Promo Videos",
      description: "Punchy product demos and compelling brand anthems.",
      extendedText: "We produce high-impact promotional videos that instantly capture attention and communicate your value proposition. From scripting and storyboarding to cinema-grade production and finishing.",
      icon: <Film size={32} />,
      color: "#eab308",
      tagMatch: ['Promotional', 'Commercial'],
      previewVideoUrl: '/assets/previews/abe89643-d3b2-4cca-8433-5571dfd8524c_preview.mp4',
      crossSell: { title: "UI / UX Design", nav: "design", icon: <Code size={18} /> },
      valueProps: [
        { title: "Engagement", desc: "Hooks viewers in the first 3 seconds to maximize retention." },
        { title: "Conversion", desc: "Clear, irresistible calls to action that drive measurable sales." },
        { title: "Brand Equity", desc: "Premium cinema-quality visuals that instantly elevate your brand perception." }
      ]
    },
    {
      title: "Drone & 360° Videos",
      description: "Breathtaking aerials and immersive virtual reality.",
      extendedText: "Break the boundaries of traditional media with interactive 360° video and cinematic drone operations that allow your audience to step inside your world from any angle.",
      icon: <Aperture size={32} />,
      color: "#ec4899",
      tagMatch: ['Virtual Reality', 'Events'],
      previewVideoUrl: '/assets/previews/drone_preview.mp4',
      crossSell: { title: "Growth Strategy", nav: "growth", icon: <Users size={18} /> },
      valueProps: [
        { title: "Scale", desc: "Showcase the true scale of your operations, facilities, or events." },
        { title: "Immersion", desc: "Put prospects directly inside your space with 360° VR experiences." },
        { title: "Innovation", desc: "Position your brand at the cutting edge of visual technology." }
      ]
    },
    {
      title: "Social Media",
      description: "Viral short-form content optimized for modern platforms.",
      extendedText: "We create native, highly engaging short-form content optimized for TikTok, Reels, and YouTube Shorts, engineered to maximize organic reach and conversion.",
      icon: <Play size={32} />,
      color: "#ff0050",
      tagMatch: ['Social', 'Social Media'],
      previewVideoUrl: '/assets/previews/ba4ec20e-167f-4a53-a2f2-96b7f1bcaa59_preview.mp4',
      crossSell: { title: "Data & Automation", nav: "growth", icon: <Database size={18} /> },
      valueProps: [
        { title: "Algorithm Ready", desc: "Paced and formatted perfectly to exploit current algorithm trends." },
        { title: "Volume", desc: "Batch-produced content systems to keep your feed active for months." },
        { title: "Authenticity", desc: "Strikes the perfect balance between polished and raw, native feeling content." }
      ]
    },
    {
      title: "Live Streaming",
      description: "Professional multi-camera broadcast solutions.",
      extendedText: "Engage global audiences in real-time with flawless, high-definition live streaming for webinars, product launches, and virtual events.",
      icon: <Radio size={32} />,
      color: "#8b5cf6",
      tagMatch: ['Events', 'Conferences'],
      previewVideoUrl: '/assets/previews/livestream_preview.mp4',
      crossSell: { title: "Events", nav: "media", icon: <Users size={18} /> },
      valueProps: [
        { title: "Global Reach", desc: "Break geographical limits and broadcast your event to the world." },
        { title: "Reliability", desc: "Redundant internet setups and hardware encoders guarantee zero downtime." },
        { title: "Interactivity", desc: "Real-time graphics, lower thirds, and Q&A integrations." }
      ]
    },
    {
      title: "Events",
      description: "Dynamic coverage of corporate and public events.",
      extendedText: "We capture the energy and scale of your events, delivering high-energy highlight reels and full-length documentation.",
      icon: <Users size={32} />,
      color: "#0ea5e9",
      tagMatch: ['Events'],
      previewVideoUrl: '/assets/previews/d8840065-e640-41e2-8aea-0d60b0286ceb_preview.mp4',
      crossSell: { title: "Live Streaming", nav: "media", icon: <Radio size={18} /> },
      valueProps: [
        { title: "Hype Generation", desc: "Fast-turnaround reels to market your next event immediately." },
        { title: "Unobtrusive", desc: "We capture raw, candid moments without disrupting the guest experience." },
        { title: "Comprehensive", desc: "Coverage of everything from the main stage to the afterparty." }
      ]
    },
    {
      title: "Conferences",
      description: "End-to-end keynote recording and panel coverage.",
      extendedText: "Professional, multi-angle coverage of your conferences, ensuring every keynote and panel is captured with pristine audio and visual clarity.",
      icon: <Camera size={32} />,
      color: "#10b981",
      tagMatch: ['Conferences', 'Corporate'],
      previewVideoUrl: '/assets/previews/9a3e3964-e827-4d7f-a65f-2c4052c1444d_preview.mp4',
      crossSell: { title: "Promo Videos", nav: "media", icon: <Film size={18} /> },
      valueProps: [
        { title: "Crystal Audio", desc: "Direct feeds from the sound desk for perfect, broadcast-quality voices." },
        { title: "Multi-cam", desc: "Dynamic switching between the speaker, the presentation, and the crowd." },
        { title: "Evergreen", desc: "Turn a 3-day event into years of high-value VOD content." }
      ]
    },
    {
      title: "Interviews",
      description: "Intimate, high-end interviews and testimonials.",
      extendedText: "Build trust with your audience through beautifully lit, cinematic interviews and case studies that humanize your brand.",
      icon: <Mic size={32} />,
      color: "#f59e0b",
      tagMatch: ['Interviews'],
      previewVideoUrl: '/assets/previews/e22451f6-80d5-4c32-8093-4dbf4da6b731_preview.mp4',
      crossSell: { title: "Bespoke Web Platforms", nav: "design", icon: <Layout size={18} /> },
      valueProps: [
        { title: "Social Proof", desc: "Nothing sells like a genuine, high-quality customer testimonial." },
        { title: "Cinematic Lighting", desc: "Sculpted lighting that makes your subjects look authoritative and trustworthy." },
        { title: "Narrative Arc", desc: "Expert interviewers who pull the most compelling stories out of the subject." }
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
    // Remove the event listener on cleanup. To avoid stale closures, we don't put services in dependency array 
    // since it's re-created every render, but since it's just a static array, it's fine.
    return () => window.removeEventListener('openService', handleOpenService);
  }, [services]);

  const { items, loading } = usePortfolio();
  const recents = items.filter(item => item.category === 'media');

  const processSteps = [
    { title: "Discovery & Strategy", description: "We dive deep into your brand's DNA, understanding your goals, audience, and the unique narrative that needs to be told.", bgIcon: <Compass size={300} strokeWidth={0.5} /> },
    { title: "Creative Concepting", description: "Our team develops bold, immersive concepts, storyboards, and visual directions tailored specifically to maximize emotional resonance.", bgIcon: <Lightbulb size={300} strokeWidth={0.5} /> },
    { title: "Production & Capture", description: "Using cinema-grade equipment and cutting-edge techniques, we capture breathtaking visuals, whether on location or in a virtual environment.", bgIcon: <Camera size={300} strokeWidth={0.5} /> },
    { title: "Post & Delivery", description: "Meticulous editing, color grading, and sound design bring the final asset to life, ready to deploy across your digital ecosystem.", bgIcon: <Film size={300} strokeWidth={0.5} /> }
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
            <h2 className="section-title">Media Production</h2>
            <p className="section-subtitle sleek-text">High-impact visual assets tailored to reinforce your brand identity.</p>
            
            <BranchNav navId="media" branches={branches} activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
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
        onOpenLightbox={setSelectedProject}
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
