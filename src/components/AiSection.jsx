import { motion } from 'framer-motion';
import ExpandableCard from './ExpandableCard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

export default function AiSection() {
  const aiPillars = [
    {
      title: "Content Generation",
      accent: "emerald",
      content: "Unlock exponential content creation capabilities. We rapidly produce personalized assets at scale using generative AI for copy, design, and video."
    },
    {
      title: "AI Chatbots & Assistants",
      accent: "ocean",
      content: "Automate your customer service and sales pipeline with intelligent, context-aware conversational agents deployed directly to your site or social channels."
    },
    {
      title: "Data Processing & Insights",
      accent: "magenta",
      content: "Leverage machine learning algorithms to analyze customer data, revealing profitable insights and optimizing your ad spend in real-time."
    }
  ];

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
          <h2 className="section-title">AI for Business</h2>
          <p className="section-subtitle sleek-text">Harness the power of artificial intelligence to fuel your success online.</p>
        </div>

        <div className="stat-card glass-sleek highlight-ocean">
          <h4>50% Increase</h4>
          <p>in organic site traffic and 30% rise in sales within 4 months for a health supplement client using our AI-powered content strategy.</p>
        </div>

        <div className="expandable-list" style={{ marginTop: '3rem' }}>
          {aiPillars.map((pillar, idx) => (
            <ExpandableCard key={idx} title={pillar.title} accentColor={pillar.accent}>
              <p className="expandable-body">{pillar.content}</p>
            </ExpandableCard>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="https://neurify.carrd.co/" target="_blank" rel="noopener noreferrer" className="btn-primary-sleek">
            Explore AI Tools
          </a>
        </div>
      </div>
    </motion.div>
  );
}
