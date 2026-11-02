import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ExternalLink, Code2, Globe, ShoppingCart, BarChart2, Image,
  MessageSquare, X, CheckCircle2, Layers, Sparkles, ArrowRight,
  Smartphone, Monitor, Eye, ChevronRight, Lock
} from 'lucide-react';
import { PROJECTS } from '../config/site';

const categoryIcons = {
  'E-commerce': ShoppingCart,
  'Web App': BarChart2,
  'Utility Tool': Image,
  'Communication': MessageSquare,
};

const categories = ['All', 'E-commerce', 'Web App', 'Utility Tool'];

// Clean browser window header for screenshots
function BrowserHeader({ domain, isLive = false, category = '' }) {
  return (
    <div className="bg-[#F1F5F9] px-3.5 py-2 flex items-center justify-between border-b border-[#E2E8F0] flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80"></div>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-[#475569] font-mono truncate max-w-[240px] bg-white px-2.5 py-0.5 rounded-md border border-[#E2E8F0] shadow-2xs">
        <Lock size={10} className={isLive ? 'text-[#10B981]' : 'text-[#64748B]'} />
        <span className="truncate">{domain}</span>
        {isLive && <ExternalLink size={9} className="text-[#3563E9] ml-0.5 opacity-80" />}
      </div>
      <div className="flex items-center gap-2">
        {isLive && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="hidden sm:inline">Live</span>
          </span>
        )}
        <span className="text-[10px] font-semibold text-[#3563E9] uppercase tracking-wider hidden sm:block">
          {category}
        </span>
      </div>
    </div>
  );
}

// Project Details Modal with Multi-Section Live Screenshot Gallery
function ProjectModal({ project, onClose }) {
  const isLive = Boolean(project.liveUrl && project.liveUrl !== '#' && !project.liveUrl.includes('localhost'));
  const domain = isLive
    ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : project.id === 'finora'
    ? 'finora.art'
    : project.id === 'omezi'
    ? 'omezi.app'
    : `${project.id}.nexora.dev`;

  const screenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [{ id: 'main', label: 'Primary View', url: project.image, caption: project.tagline || project.title }];

  const [activeShot, setActiveShot] = useState(screenshots[0]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleRequestSimilar = () => {
    onClose();
    const projectType = project.category === 'E-commerce'
      ? 'E-commerce Website'
      : project.category === 'Utility Tool'
      ? 'Landing Page'
      : 'Business Website';

    window.dispatchEvent(
      new CustomEvent('select-project-type', {
        detail: {
          projectType,
          budget: project.category === 'E-commerce' ? '$500 – $1,000' : '$200 – $500',
          message: `Hi Nexora! I saw your work on "${project.title}" and I'm interested in building a similar project for my business.`
        }
      })
    );

    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const isMobileShot = activeShot.id === 'mobile';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#172B4D]/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-white flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#DCE6F8] text-[#3563E9]">
              {project.category}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#172B4D]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                {project.title}
              </h2>
              {project.tagline && (
                <p className="text-xs text-[#64748B] hidden sm:block">
                  {project.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#3563E9] text-white hover:bg-[#2752D8] transition-colors shadow-2xs"
              >
                <span>Visit Live Site</span>
                <ExternalLink size={12} />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#172B4D] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">

          {/* Genuine Screenshot Gallery Section */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#10B981] animate-pulse' : 'bg-[#3563E9]'}`}></span>
                <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                  {isLive ? 'Live Project Screenshots' : 'Genuine Project Screenshots'}
                </h3>
              </div>
              {isLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#3563E9] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open {domain}</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>

            {/* View switcher tabs */}
            {screenshots.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mb-3.5 border-b border-[#E2E8F0] pb-3">
                {screenshots.map((shot) => {
                  const isActive = activeShot.id === shot.id;
                  const isMobile = shot.id === 'mobile';
                  return (
                    <button
                      key={shot.id}
                      onClick={() => setActiveShot(shot)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#3563E9] text-white shadow-xs'
                          : 'bg-white text-[#475569] hover:text-[#172B4D] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {isMobile ? <Smartphone size={12} /> : <Monitor size={12} />}
                      <span>{shot.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Screenshot Display Frame */}
            <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm">
              <BrowserHeader domain={domain} isLive={isLive} category={project.category} />

              <div className={`relative w-full overflow-hidden bg-[#F1F5F9] flex items-center justify-center ${
                isMobileShot ? 'py-6 px-4 min-h-[380px]' : 'aspect-[16/10] sm:aspect-[16/9]'
              }`}>
                {isMobileShot ? (
                  /* Sleek mobile device frame */
                  <div className="w-[280px] sm:w-[320px] rounded-[32px] overflow-hidden border-4 border-[#172B4D] shadow-2xl bg-black">
                    <div className="w-full bg-[#172B4D] py-1 flex justify-center">
                      <div className="w-20 h-3 rounded-full bg-black/60"></div>
                    </div>
                    <img
                      src={activeShot.url}
                      alt={`${project.title} - ${activeShot.label}`}
                      className="w-full h-auto object-contain block"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  /* Full desktop screenshot with uncropped natural view */
                  <img
                    src={activeShot.url}
                    alt={`${project.title} - ${activeShot.label}`}
                    className="w-full h-full object-cover object-top block transition-transform duration-500 hover:scale-[1.01]"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Caption bar */}
              <div className="p-3 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium text-[#172B4D]">
                  {activeShot.caption}
                </span>
                {isLive && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3563E9] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Inspect this page live</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div>
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-2">Project Overview</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Highlights & Features */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">Key Features & Architecture</h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {project.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                  >
                    <CheckCircle2 size={16} className="text-[#3563E9] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-[#475569] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">Delivered Scope</h3>
              <div className="flex flex-wrap gap-2">
                {project.deliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#DCE6F8] text-[#3563E9] border border-[#3563E9]/20"
                  >
                    <Layers size={12} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Highlights */}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-[#64748B]">
            {isLive ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active client deployment on <b>{domain}</b></span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Production client codebase</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs px-3.5 py-2 inline-flex items-center gap-1.5"
              >
                <ExternalLink size={13} />
                <span>Visit Live Store</span>
              </a>
            )}
            <button
              onClick={handleRequestSimilar}
              className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Inquire About Similar Project</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Project Card with clickable preview and real screenshots
function ProjectCard({ project, index, onOpenDetails }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const CategoryIcon = categoryIcons[project.category] || Globe;
  const isLive = Boolean(project.liveUrl && project.liveUrl !== '#' && !project.liveUrl.includes('localhost'));
  const domain = isLive
    ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : project.id === 'finora'
    ? 'finora.art'
    : project.id === 'omezi'
    ? 'omezi.app'
    : `${project.id}.nexora.dev`;


  // Handle preview click: if it's a live site, open it; otherwise open details modal
  const handlePreviewClick = () => {
    if (isLive) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpenDetails(project);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white transition-all duration-300 hover:border-[#3563E9]/50 hover:-translate-y-1 hover:shadow-lg flex flex-col"
      style={{ boxShadow: '0 2px 8px rgba(23,43,77,0.04)' }}
    >
      {/* Screenshot area with browser chrome */}
      <div
        className="relative h-60 sm:h-64 overflow-hidden cursor-pointer bg-[#F1F5F9] flex flex-col"
        onClick={handlePreviewClick}
        title={isLive ? `Click to open live ${project.title} website` : `Click to view ${project.title} details`}
      >
        <BrowserHeader domain={domain} isLive={isLive} category={project.category} />

        {/* Real Screenshot */}
        <div className="relative flex-1 w-full overflow-hidden bg-[#F8FAFC]">
          <img
            src={project.image}
            alt={`${project.title} - ${project.tagline || project.category}`}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />


          {/* Hover overlay with clear dual actions */}
          <div className="absolute inset-0 bg-[#172B4D]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3563E9] hover:bg-[#2752D8] transition-transform duration-200 hover:scale-105 shadow-md">
                <ExternalLink size={13} />
                <span>Open Live Website ({domain})</span>
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(project);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3563E9] hover:bg-[#2752D8] transition-transform duration-200 hover:scale-105 shadow-md cursor-pointer"
              >
                <Code2 size={13} />
                <span>View Project Specifications</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(project);
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-medium text-white/90 hover:text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <span>Inspect All Screenshots & Architecture</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#3563E9]">
              <CategoryIcon size={13} />
              <span className="text-xs font-semibold uppercase tracking-wider">{project.category}</span>
            </div>
            <h3 className="text-lg font-bold text-[#172B4D]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              {project.title}
            </h3>
          </div>
          {project.featured && (
            <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE6F8] text-[#3563E9] border border-[#3563E9]/20">
              Featured Client Work
            </span>
          )}
        </div>

        <p className="text-sm text-[#475569] leading-relaxed mb-5 flex-1">
          {project.description}
        </p>


        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
          {isLive ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#3563E9] text-white transition-all hover:bg-[#2752D8] shadow-2xs"
              title="Open actual deployed website"
            >
              <ExternalLink size={12} />
              <span>Live Website</span>
            </a>
          ) : (
            <button
              onClick={() => onOpenDetails(project)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] transition-all border border-[#E2E8F0] cursor-pointer"
            >
              <Code2 size={12} className="opacity-60" />
              <span>Staging Preview</span>
            </button>
          )}

          <button
            onClick={() => onOpenDetails(project)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#172B4D] hover:text-[#3563E9] px-3.5 py-2 rounded-xl border border-[#E2E8F0] hover:border-[#3563E9]/40 transition-all ml-auto hover:bg-[#F8FAFC] cursor-pointer"
          >
            <Eye size={12} />
            <span>Screenshots & Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  const filtered = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="relative py-28 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">Real Portfolio Work</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title mb-4"
          >
            Selected Client Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            Authentic, production websites built for growing businesses. Inspect real screenshots across e-commerce storefronts, web applications, and utility tools.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#3563E9] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#172B4D] bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className={`grid gap-6 sm:gap-8 ${
          filtered.length === 1
            ? 'max-w-xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
        }`}>
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[#64748B] text-sm mt-12 flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Have a unique idea? We build custom web applications tailored precisely to your requirements.</span>
        </motion.p>
      </div>

      {/* Details & Screenshot Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
