import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'work', 'about', 'pricing', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#home')}
              className="flex items-center gap-2 group text-left cursor-pointer"
              aria-label="Nexora - Modern Digital Agency Homepage"
            >
              <span className="text-xl font-bold tracking-tight text-[#172B4D] font-display">
                Nexora
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3563E9]"></span>
              <span className="hidden sm:inline-block text-[11px] font-semibold tracking-widest uppercase text-[#64748B] pl-1">
                Agency
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(({ href, label }) => {
                const isActive = activeSection === href.slice(1);
                return (
                  <button
                    key={href}
                    onClick={() => handleNavClick(href)}
                    className={`relative py-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-[#172B4D]' : 'text-[#475569] hover:text-[#172B4D]'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3563E9] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contact Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('#contact')}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#3563E9] text-white hover:bg-[#2752D8] transition-colors duration-200 shadow-sm cursor-pointer"
              >
                <span>Let's Talk</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                id="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-[#172B4D] hover:text-[#3563E9] transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 z-40 pt-20 pb-8 md:hidden bg-white border-b border-[#E2E8F0] shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col divide-y divide-[#E2E8F0]">
                {navLinks.map(({ href, label }, i) => (
                  <motion.button
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleNavClick(href)}
                    className={`py-3.5 text-left text-base font-medium flex items-center justify-between cursor-pointer ${
                      activeSection === href.slice(1) ? 'text-[#3563E9] font-semibold' : 'text-[#172B4D]'
                    }`}
                  >
                    <span>{label}</span>
                    <ArrowUpRight size={14} className="text-[#64748B]" />
                  </motion.button>
                ))}
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="w-full py-3 text-center text-sm font-semibold rounded-xl bg-[#3563E9] text-white hover:bg-[#2752D8] transition-colors shadow-sm cursor-pointer"
                >
                  Let's Talk
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
