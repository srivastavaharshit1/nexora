import {
  Share2, Link2, Code2, Send, Mail, Phone, ArrowUpRight
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT_CONFIG, SOCIAL_LINKS, SERVICES } from '../config/site';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Our Work' },
  { href: '#about', label: 'About Us' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

const socialIcons = {
  instagram: Share2,
  linkedin: Link2,
  github: Code2,
  twitter: Send,
};

export default function Footer() {
  const handleNavClick = (href) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#172B4D] text-white border-t border-[#1F3A60] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="pt-16 pb-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => handleNavClick('#home')}
              className="flex items-center gap-2 mb-4 group text-left cursor-pointer"
              aria-label="Nexora - Return to top"
            >
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                Nexora
              </span>
              <span className="w-2 h-2 rounded-full bg-[#3563E9]"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#94A3B8] pl-1">
                Agency
              </span>
            </button>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-xs">
              A modern web development agency engineering bespoke, high-performance websites for ambitious businesses.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Nexora on ${platform}`}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#3563E9] hover:bg-white/10 transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Navigation</h3>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 font-medium cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-3">
              {SERVICES.map(service => (
                <li key={service.id}>
                  <button
                    onClick={() => handleNavClick('#services')}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 font-medium text-left cursor-pointer"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Get In Touch</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="flex items-center gap-2.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 group font-medium"
                title="Send official email"
              >
                <Mail size={14} className="text-[#3563E9] group-hover:text-white transition-colors flex-shrink-0" />
                <span className="truncate">{CONTACT_CONFIG.email}</span>
              </a>
              <a
                href={`https://wa.me/${CONTACT_CONFIG.whatsappRaw}?text=${encodeURIComponent(CONTACT_CONFIG.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 group font-medium"
                title="Chat directly on WhatsApp"
              >
                <WhatsAppIcon size={14} className="text-[#25D366] group-hover:text-white transition-colors flex-shrink-0 fill-current" />
                <span>{CONTACT_CONFIG.whatsapp} (WhatsApp)</span>
              </a>
              <a
                href={`tel:${CONTACT_CONFIG.phoneRaw}`}
                className="flex items-center gap-2.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 group font-medium"
                title="Call our office"
              >
                <Phone size={14} className="text-[#3563E9] group-hover:text-white transition-colors flex-shrink-0" />
                <span>{CONTACT_CONFIG.phone}</span>
              </a>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleNavClick('#contact')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3563E9] text-white hover:bg-[#2752D8] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                id="footer-lets-talk"
              >
                <span>Let's Talk</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <p>
            © {new Date().getFullYear()} Nexora Digital Agency. All rights reserved.
          </p>
          <p className="text-[#64748B]">
            Engineered with modern web standards. Built for business growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
