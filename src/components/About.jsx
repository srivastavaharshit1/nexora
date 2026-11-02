import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Lightbulb, Users, HeartHandshake } from 'lucide-react';

const values = [
  { icon: Code2, label: 'Modern Tech Stack' },
  { icon: Lightbulb, label: 'Creative Solutions' },
  { icon: Users, label: 'Direct Developer Chat' },
  { icon: HeartHandshake, label: 'Client-First Support' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-28 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual element */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            {/* Code window */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-white">
              {/* Header bar */}
              <div className="bg-[#F1F5F9] px-4 py-3 flex items-center justify-between border-b border-[#E2E8F0]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#10B981]/80"></div>
                </div>
                <span className="text-xs text-[#64748B] font-mono">nexora.dev — about.tsx</span>
                <span className="text-[10px] font-semibold text-[#3563E9] uppercase tracking-wider">TSX</span>
              </div>

              {/* Code display inside Deep Navy frame */}
              <div className="bg-[#172B4D] p-6 font-mono text-sm space-y-1.5 overflow-x-auto text-[#E2E8F0]">
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">01</span>
                  <span className="text-[#38BDF8]">const</span>
                  <span className="text-white"> NexoraAgency </span>
                  <span className="text-[#94A3B8]">= {'{'}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">02</span>
                  <span className="pl-4 text-[#93C5FD]">mission</span>
                  <span className="text-[#94A3B8]">:</span>
                  <span className="text-[#60A5FA]">'Affordable digital excellence'</span>
                  <span className="text-[#94A3B8]">,</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">03</span>
                  <span className="pl-4 text-[#93C5FD]">principles</span>
                  <span className="text-[#94A3B8]">: [</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">04</span>
                  <span className="pl-8 text-[#38BDF8]">'Clean Architecture'</span>
                  <span className="text-[#94A3B8]">,</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">05</span>
                  <span className="pl-8 text-[#38BDF8]">'Direct Communication'</span>
                  <span className="text-[#94A3B8]">,</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">06</span>
                  <span className="pl-8 text-[#38BDF8]">'Reliable Support'</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">07</span>
                  <span className="pl-4 text-[#94A3B8]">],</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">08</span>
                  <span className="pl-4 text-[#93C5FD]">trackRecord</span>
                  <span className="text-[#94A3B8]">:</span>
                  <span className="text-[#E2E8F0]">'Real projects for active businesses'</span>
                  <span className="text-[#94A3B8]">,</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">09</span>
                  <span className="pl-4 text-[#93C5FD]">maintenanceIncluded</span>
                  <span className="text-[#94A3B8]">:</span>
                  <span className="text-[#38BDF8]">true</span>
                  <span className="text-[#94A3B8]">,</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#64748B] select-none text-xs">10</span>
                  <span className="text-[#94A3B8]">{'}'}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#3563E9] animate-pulse rounded-xs"></div>
                </div>
              </div>
            </div>

            {/* Value chips */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {values.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs"
                >
                  <div className="p-1.5 rounded-lg bg-[#DCE6F8] text-[#3563E9]">
                    <Icon size={15} />
                  </div>
                  <span className="text-xs sm:text-sm text-[#172B4D] font-semibold">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="section-label mb-5 inline-flex">About Nexora</span>

            <h2 className="section-title mb-6">
              Young Developers.{' '}
              <span className="text-[#3563E9]">Real Experience.</span>{' '}
              Serious Commitment.
            </h2>

            <div className="space-y-4 text-[#475569] leading-relaxed">
              <p>
                Nexora is a team of passionate developers who believe every business deserves a strong digital presence — not just a placeholder page, but a professional website that genuinely drives customer inquiries.
              </p>
              <p>
                We bring together clean frontend engineering, modern design principles, and practical project experience to deliver digital experiences that work seamlessly on mobile and desktop.
              </p>
              <p>
                As an agile team, we focus on <span className="text-[#172B4D] font-semibold">direct developer communication</span>, <span className="text-[#172B4D] font-semibold">transparent pricing</span>, and dedicated post-launch support.
              </p>
              <p>
                We've built e-commerce platforms, web applications, and utility tools for real businesses — and we approach every new partnership with the same craftsmanship.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
                id="about-cta"
              >
                Work With Us
              </button>
              <button
                onClick={() => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                See Our Work
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
