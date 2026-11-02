import { motion } from 'framer-motion';
import { ArrowRight, Lock, ExternalLink } from 'lucide-react';

function BrowserMockup() {
  return (
    <a
      href="https://alahadattars.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-2xl overflow-hidden shadow-xl border border-[#E2E8F0] bg-white transition-all duration-300 hover:border-[#3563E9]/50 hover:shadow-2xl"
      title="Visit live Al Ahad Attars website (opens in new tab)"
    >
      {/* Real browser window header */}
      <div className="bg-[#F1F5F9] px-4 py-3 flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></div>
          <div className="w-3 h-3 rounded-full bg-[#10B981]/80"></div>
        </div>

        {/* Clean URL bar with live indicator */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-3.5 py-1 text-xs text-[#64748B] font-mono border border-[#E2E8F0] max-w-xs w-full justify-center shadow-2xs group-hover:border-[#3563E9]/40 group-hover:text-[#172B4D] transition-colors">
          <Lock size={11} className="text-[#10B981]" />
          <span className="truncate font-medium">alahadattars.com</span>
          <ExternalLink size={10} className="text-[#3563E9] opacity-70 group-hover:opacity-100" />
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-[#10B981] hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Live Site</span>
        </div>
      </div>

      {/* Real website screenshot */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F8FAFC]">
        <img
          src="/projects/al-ahad-attars.jpg"
          alt="Al Ahad Attars - Featured E-commerce Website by Nexora"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          loading="eager"
        />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5"></div>
        {/* Subtle hover badge */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#172B4D]/90 backdrop-blur-xs text-white text-xs font-semibold shadow-lg">
            <span>Visit Live Website</span>
            <ExternalLink size={12} className="text-[#38BDF8]" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Hero() {
  const handleScroll = (href) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden bg-[#F8FAFC]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="section-label">
                Digital Agency & Web Development
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.12] tracking-tight mb-6 text-[#172B4D]"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Your Business Deserves More Than{' '}
              <span className="text-[#3563E9]">Just Social Media.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#475569] leading-relaxed mb-8 max-w-xl"
            >
              We build modern, high-performance websites that help businesses establish credibility, reach more customers, and grow online.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => handleScroll('#work')}
                className="btn-primary"
                id="hero-explore-work"
              >
                <span>Explore Our Work</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleScroll('#contact')}
                className="btn-secondary"
                id="hero-consultation"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Get a Free Consultation</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 text-xs text-[#64748B]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#3563E9]"></div>
              <span>Engineered with React & modern web standards. Free maintenance included.</span>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 xl:col-span-6 relative"
          >
            <div className="relative">
              <BrowserMockup />
              {/* Subtle backdrop accent shadow */}
              <div
                className="absolute inset-0 -z-10 rounded-2xl translate-x-2.5 translate-y-2.5 sm:translate-x-3.5 sm:translate-y-3.5 bg-[#E2E8F0]"
              ></div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Projects Delivered", value: "10+" },
            { label: "Months Free Maintenance", value: "6" },
            { label: "Services Offered", value: "5" },
            { label: "Turnaround (weeks)", value: "3–4" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-5 text-center shadow-2xs">
              <p className="text-3xl font-black text-[#172B4D]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#64748B] mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
