import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, X } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT_CONFIG } from '../config/site';

export default function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show tooltip after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const whatsappLink = `https://wa.me/${CONTACT_CONFIG.whatsappRaw || CONTACT_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(CONTACT_CONFIG.whatsappMessage)}`;

  return (
    <div className="fixed bottom-20 md:bottom-7 right-5 md:right-7 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#172B4D] hover:bg-[#F1F5F9] shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer pointer-events-auto"
            aria-label="Scroll to top"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp tooltip */}
      <AnimatePresence>
        {showTooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 pr-2.5 pl-3.5 py-2 rounded-xl bg-[#172B4D] border border-[#3563E9]/30 shadow-xl text-white pointer-events-auto"
          >
            <p className="text-xs font-medium whitespace-nowrap">Chat directly on WhatsApp</p>
            <button
              onClick={() => { setShowTooltip(false); setDismissed(true); }}
              className="text-[#94A3B8] hover:text-white transition-colors p-0.5 ml-1 cursor-pointer"
              aria-label="Dismiss tooltip"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official WhatsApp Floating Action Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setShowTooltip(false)}
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-xl relative bg-[#25D366] text-white hover:bg-[#20BD5A] transition-all duration-200 border-2 border-white/30 shadow-[#25D366]/40 cursor-pointer pointer-events-auto"
      >
        <WhatsAppIcon size={26} className="text-white fill-current drop-shadow-xs" />
      </motion.a>
    </div>
  );
}
