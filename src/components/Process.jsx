import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PROCESS_STEPS } from '../config/site';

function StepCard({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative"
    >
      {/* Connector dot */}
      <div className="flex justify-center lg:justify-start mb-6">
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 lg:ml-10 border-2 border-[#3563E9] bg-[#DCE6F8]">
          <div className="w-2 h-2 rounded-full bg-[#3563E9]"></div>
        </div>
      </div>

      {/* Card */}
      <div
        className="group rounded-2xl p-7 border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#3563E9]/50 hover:shadow-md"
        style={{ boxShadow: '0 2px 6px rgba(23,43,77,0.03)' }}
      >
        {/* Step number */}
        <div className="text-5xl font-black text-[#3563E9]/20 mb-4 leading-none"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
          {step.step}
        </div>
        <h3 className="text-lg font-bold text-[#172B4D] mb-2" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
          {step.title}
        </h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-28 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">How We Work</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title mb-4"
          >
            A Simple, Transparent Process
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            No surprises, no confusion. Here's exactly how we collaborate to take your web project from initial concept to a performant, live deployment.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-[#E2E8F0]"></div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <StepCard
                key={step.step}
                step={step}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 pr-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE6F8] flex items-center justify-center text-[#3563E9] flex-shrink-0">
                <span className="text-base font-bold">3–4</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#172B4D]">Average Project Turnaround</p>
                <p className="text-xs text-[#64748B]">From discovery kickoff to production launch</p>
              </div>
            </div>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap cursor-pointer"
            >
              Start Your Project
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
