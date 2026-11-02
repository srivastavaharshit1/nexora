import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../config/site';

function PricingCard({ plan, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleContact = () => {
    const projectType = plan.id === 'ecommerce' ? 'E-commerce Website' : 'Business Website';
    const budget = plan.id === 'starter' ? '$200 – $500' : plan.id === 'business' ? '$500 – $1,000' : '$500 – $1,000';
    const message = plan.id === 'starter'
      ? "Hi Nexora! I'd like to get started with the Starter package ($200) for my business website."
      : plan.id === 'ecommerce'
      ? "Hi Nexora! I'd like to get a quote for a full-featured E-commerce website."
      : "Hi Nexora! I'd like to discuss a custom quote for a Business website with advanced features.";

    window.dispatchEvent(
      new CustomEvent('select-project-type', {
        detail: { projectType, budget, message }
      })
    );

    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isHighlighted = plan.highlighted;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
        isHighlighted
          ? 'border-2 border-[#3563E9] bg-[#172B4D] shadow-xl text-white'
          : 'border border-[#E2E8F0] bg-white hover:border-[#3563E9]/50 hover:shadow-lg'
      }`}
      style={isHighlighted ? {} : { boxShadow: '0 2px 8px rgba(23,43,77,0.04)' }}
    >
      {/* Recommended badge */}
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#3563E9] text-white text-xs font-bold shadow-md">
            <Sparkles size={11} />
            Most Popular
          </div>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-6">
        <span className={`text-xs font-bold uppercase tracking-wider ${isHighlighted ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          {plan.name}
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-4xl font-black ${isHighlighted ? 'text-white' : 'text-[#172B4D]'}`}
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            {plan.price}
          </span>
          <span className={`text-xs font-medium ${isHighlighted ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
            {plan.priceNote}
          </span>
        </div>
        <p className={`mt-2.5 text-sm ${isHighlighted ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
          {plan.description}
        </p>
      </div>

      {/* Divider */}
      <div className={`h-px mb-6 ${isHighlighted ? 'bg-white/10' : 'bg-[#E2E8F0]'}`}></div>

      {/* Features */}
      <ul className="space-y-3.5 flex-1 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-2.5 text-sm ${isHighlighted ? 'text-[#E2E8F0]' : 'text-[#475569]'}`}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
              isHighlighted ? 'bg-[#3563E9]/30 text-[#38BDF8]' : 'bg-[#DCE6F8] text-[#3563E9]'
            }`}>
              <Check size={12} strokeWidth={2.5} />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Note */}
      <p className={`text-xs mb-6 flex items-center gap-1.5 ${isHighlighted ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHighlighted ? 'bg-[#3563E9]' : 'bg-[#3563E9]'}`}></span>
        <span>{plan.note}</span>
      </p>

      {/* CTA */}
      <button
        onClick={handleContact}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm ${
          isHighlighted
            ? 'bg-[#3563E9] text-white hover:bg-[#2752D8]'
            : 'bg-[#172B4D] text-white hover:bg-[#3563E9]'
        }`}
        id={`pricing-cta-${plan.id}`}
      >
        <span>{plan.cta}</span>
        <ChevronRight size={14} className="inline ml-1" />
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="relative py-28 overflow-hidden bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">Transparent Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            No hidden fees. No confusing tiers. Get the website your business deserves at an honest price that makes sense.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Custom Quote CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <div className="text-left">
              <p className="text-[#172B4D] font-bold">Need something bespoke?</p>
              <p className="text-sm text-[#475569]">Tell us about your project and we'll engineer a quote tailored precisely to your scope.</p>
            </div>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex-shrink-0 cursor-pointer"
              id="pricing-custom-quote"
            >
              <MessageSquare size={14} />
              <span>Get a Custom Quote</span>
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[#64748B] text-xs mt-8"
        >
          * Domain and hosting charges are separate from development fees. We guide you through the most cost-effective hosting options.
        </motion.p>
      </div>
    </section>
  );
}
