import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT_CONFIG } from '../config/site';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!closed) {
        setVisible(window.scrollY > window.innerHeight * 0.7);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [closed]);

  if (closed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-xl">
            <div>
              <p className="text-[#172B4D] text-xs font-bold">Have a project in mind?</p>
              <p className="text-[#64748B] text-[11px]">Free consultation, no obligation.</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${CONTACT_CONFIG.whatsappRaw || CONTACT_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(CONTACT_CONFIG.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3563E9] text-white text-xs font-semibold hover:bg-[#2752D8] transition-colors shadow-2xs"
                id="sticky-cta-whatsapp"
              >
                <WhatsAppIcon size={14} className="fill-current" />
                <span>Let's Talk</span>
              </a>
              <button
                onClick={() => { setClosed(true); setVisible(false); }}
                className="p-1.5 text-[#64748B] hover:text-[#172B4D] transition-colors cursor-pointer"
                aria-label="Dismiss sticky CTA"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
