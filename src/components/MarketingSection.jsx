import { motion } from 'framer-motion';
import ExpandableCard from './ExpandableCard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

export default function MarketingSection() {
  const marketingPillars = [
    {
      title: "Holistic Promotion Engine",
      accent: "orange",
      content: "From SEO and paid advertising to social media, email nurturing, influencer marketing and more - we design and execute unified promotional engines that increase your brand's visibility and resonance across all relevant channels."
    },
    {
      title: "Leveraging Emerging Channels",
      accent: "magenta",
      content: "While a strong foundation in proven channels is essential, we stay ahead of the curve by leveraging emerging platforms like AI content creation, Web3 communities, and the Metaverse to captivate early adopter audiences."
    },
    {
      title: "Optimized for Conversions",
      accent: "ocean",
      content: "Our growth strategies don't just drive traffic - they are engineered from the ground up for maximum conversions and customer lifetime value. Through continuous A/B testing, retargeting, and funnel optimization, we relentlessly improve ROI."
    },
    {
      title: "Data-Driven Iteration",
      accent: "emerald",
      content: "We treat marketing as a science, meticulously tracking KPIs across all channels and leveraging AI-driven insights to continuously optimize campaign performance. Our data-driven iteration ensures your promotions remain hyper-relevant."
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
          <h2 className="section-title">Marketing</h2>
          <p className="section-subtitle sleek-text">Precision digital marketing campaigns engineered to cut through the noise and cultivate meaningful connections with your ideal audience.</p>
        </div>

        <div className="expandable-list">
          {marketingPillars.map((pillar, idx) => (
            <ExpandableCard key={idx} title={pillar.title} accentColor={pillar.accent}>
              <p className="expandable-body">{pillar.content}</p>
            </ExpandableCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
