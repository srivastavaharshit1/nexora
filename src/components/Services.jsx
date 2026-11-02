import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Globe, ShoppingCart, Zap, RefreshCcw, Wrench, ChevronRight,
} from 'lucide-react';
import { SERVICES } from '../config/site';

const iconMap = { Globe, ShoppingCart, Zap, RefreshCcw, Wrench };

function ServiceCard({ service, index }) {
  const Icon = iconMap[service.icon];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleClick = () => {
    const typeMapping = {
      'business-websites': 'Business Website',
      'ecommerce': 'E-commerce Website',
      'landing-pages': 'Landing Page',
      'website-redesign': 'Website Redesign',
      'maintenance': 'Website Maintenance',
    };
    const projectType = typeMapping[service.id] || 'Business Website';
    window.dispatchEvent(
      new CustomEvent('select-project-type', {
        detail: {
          projectType,
          message: `Hi Nexora! I'm interested in your "${service.title}" service for my business.`
        }
      })
    );
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={handleClick}
      className="group relative rounded-2xl p-7 cursor-pointer transition-all duration-300 overflow-hidden border border-[#E2E8F0] bg-white hover:border-[#3563E9]/50 hover:-translate-y-1 hover:shadow-md"
      style={{ boxShadow: '0 2px 6px rgba(23,43,77,0.03)' }}
    >
      {/* Consistent blue icon badge */}
      <div className="w-12 h-12 rounded-xl bg-[#DCE6F8] flex items-center justify-center mb-5 border border-[#3563E9]/15 transition-transform duration-300 group-hover:scale-105">
        {Icon && <Icon size={22} className="text-[#3563E9]" />}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-[#172B4D] mb-2" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
        {service.title}
      </h3>
      <p className="text-[#475569] text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2.5 mb-6">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-[#475569]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3563E9] flex-shrink-0"></div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3563E9] group-hover:text-[#2752D8] transition-colors duration-200 pt-3 border-t border-[#E2E8F0]">
        <span>Explore service</span>
        <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  const handleScroll = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="relative py-28 overflow-hidden bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">What We Offer</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title mb-4"
          >
            Services Tailored to Your Business
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            From bespoke business websites to full e-commerce platforms — we deliver modern, performant web solutions engineered for business growth.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-[#64748B] text-sm mb-4 font-medium">
            Not sure what you need? Let's discuss your project goals.
          </p>
          <button onClick={handleScroll} className="btn-primary" id="services-cta">
            <span>Get a Free Consultation</span>
            <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
