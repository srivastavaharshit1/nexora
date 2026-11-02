import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  DollarSign, Palette, Smartphone, Briefcase, MessageCircle, Shield
} from 'lucide-react';
import { WHY_CHOOSE_US } from '../config/site';

const iconMap = { DollarSign, Palette, Smartphone, Briefcase, MessageCircle, Shield };

function FeatureCard({ item, index }) {
  const Icon = iconMap[item.icon];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-2xl p-7 border border-[#E2E8F0] bg-white transition-all duration-300 hover:border-[#3563E9]/50 hover:-translate-y-1 hover:shadow-md"
      style={{ boxShadow: '0 2px 6px rgba(23,43,77,0.03)' }}
    >
      <div className="w-12 h-12 rounded-xl bg-[#DCE6F8] flex items-center justify-center mb-5 border border-[#3563E9]/15 transition-transform duration-300 group-hover:scale-105">
        {Icon && <Icon size={22} className="text-[#3563E9]" />}
      </div>

      <h3 className="text-lg font-bold text-[#172B4D] mb-2.5" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
        {item.title}
      </h3>
      <p className="text-sm text-[#475569] leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}

export default function WhyUs() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-28 overflow-hidden bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">Why Choose Nexora</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title mb-4"
          >
            Great Websites Don't Have to Cost a Fortune
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            We focus on delivering high-caliber web development at accessible rates for ambitious businesses — with direct developer collaboration and zero compromise on code quality.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => (
            <FeatureCard
              key={item.icon}
              item={item}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
