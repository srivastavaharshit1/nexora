import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail, Phone, Send, ChevronRight, Calendar,
  User, Building2, DollarSign, FileText, CheckCircle2, Clock,
  AlertCircle
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT_CONFIG } from '../config/site';

const projectTypes = [
  'Business Website',
  'E-commerce Website',
  'Landing Page',
  'Website Redesign',
  'Website Maintenance',
  'Other / Not Sure',
];

const budgetRanges = [
  'Under $200',
  '$200 – $500',
  '$500 – $1,000',
  '$1,000+',
  'Not Sure Yet',
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [needsActivation, setNeedsActivation] = useState(false);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const handleSelectPackage = (e) => {
      if (e.detail) {
        setFormData(prev => ({
          ...prev,
          projectType: e.detail.projectType || prev.projectType,
          budget: e.detail.budget || prev.budget,
          message: e.detail.message || prev.message,
        }));
        if (e.detail.projectType) {
          setErrors(prev => ({ ...prev, projectType: '' }));
        }
      }
    };
    window.addEventListener('select-project-type', handleSelectPackage);
    return () => window.removeEventListener('select-project-type', handleSelectPackage);
  }, []);

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone.trim() && !/^[+0-9\s\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a service or project type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your project';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters describing your project';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isSubmittingRef.current) return; // Prevent duplicate submissions

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);
    isSubmittingRef.current = true;

    const submissionDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const recipientEmail = import.meta.env.VITE_CONTACT_EMAIL || CONTACT_CONFIG.email;
    const formspreeId = import.meta.env.VITE_FORMSPREE_FORM_ID;
    const customEndpoint = import.meta.env.VITE_FORM_ENDPOINT;

    let endpoint = '';
    if (formspreeId) {
      endpoint = `https://formspree.io/f/${formspreeId}`;
    } else if (customEndpoint) {
      endpoint = customEndpoint;
    } else {
      endpoint = `https://formsubmit.co/ajax/${recipientEmail}`;
    }

    const payload = {
      "Customer Name": formData.name.trim(),
      "Email Address": formData.email.trim(),
      "Phone Number": formData.phone.trim() || 'Not provided',
      "Service Interested In": formData.projectType,
      "Business Name": formData.business.trim() || 'Not provided',
      "Budget Range": formData.budget || 'Not specified',
      "Project Details / Message": formData.message.trim(),
      "Submission Date & Time": submissionDate,
      _subject: `New Website Inquiry from ${formData.name.trim()} - ${formData.projectType}`,
      _template: 'table',
      _captcha: 'false',
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && (result?.success === true || result?.success === 'true' || result?.ok === true)) {
        setSubmitted(true);
        setSubmittedData({ ...formData, submissionDate });
      } else if (result?.message && result.message.toLowerCase().includes('activation')) {
        // FormSubmit first-time activation notification
        setSubmitted(true);
        setNeedsActivation(true);
        setSubmittedData({ ...formData, submissionDate });
      } else {
        const errorMsg = result?.message || (result?.errors && result.errors.map(err => err.message).join(', ')) || 'We were unable to deliver your message. Please try again or reach out directly on WhatsApp.';
        setSubmitError(errorMsg);
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setSubmitError('Network error connecting to the submission service. Please check your internet connection or reach out directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const whatsappLink = `https://wa.me/${CONTACT_CONFIG.whatsappRaw}?text=${encodeURIComponent(CONTACT_CONFIG.whatsappMessage)}`;
  const emailLink = `mailto:${CONTACT_CONFIG.email}`;
  const phoneLink = `tel:${CONTACT_CONFIG.phoneRaw}`;
  const consultationWhatsApp = `https://wa.me/${CONTACT_CONFIG.whatsappRaw}?text=${encodeURIComponent("Hi, I'm interested in your website development services and would like to schedule a free 30-minute consultation.")}`;

  return (
    <section id="contact" className="relative py-28 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">Get In Touch</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title mb-4"
          >
            Let's Build Something Great Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            Tell us about your business goals and we will respond within 24 hours with an actionable roadmap, timeline, and an honest quote.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Quick contact channels */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Direct Contact Channels</h3>

              {/* WhatsApp Card */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp"
                className="flex items-center gap-4 p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#25D366]/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors flex-shrink-0">
                  <WhatsAppIcon size={20} className="fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#172B4D]">WhatsApp Direct</p>
                  <p className="text-xs text-[#25D366] font-semibold">{CONTACT_CONFIG.whatsapp}</p>
                  <p className="text-[11px] text-[#64748B]">Instant chat with developers</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#94A3B8] group-hover:text-[#25D366] transition-colors flex-shrink-0" />
              </a>

              {/* Email Card */}
              <a
                href={emailLink}
                id="contact-email"
                className="flex items-center gap-4 p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#3563E9]/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DCE6F8] flex items-center justify-center text-[#3563E9] group-hover:bg-[#3563E9] group-hover:text-white transition-colors flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#172B4D]">Official Email</p>
                  <p className="text-xs text-[#3563E9] font-medium truncate">{CONTACT_CONFIG.email}</p>
                  <p className="text-[11px] text-[#64748B]">Click to write directly</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#94A3B8] group-hover:text-[#3563E9] transition-colors flex-shrink-0" />
              </a>

              {/* Phone Card */}
              <a
                href={phoneLink}
                id="contact-phone"
                className="flex items-center gap-4 p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#3563E9]/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DCE6F8] flex items-center justify-center text-[#3563E9] group-hover:bg-[#3563E9] group-hover:text-white transition-colors flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#172B4D]">Phone Call</p>
                  <p className="text-xs text-[#3563E9] font-medium">{CONTACT_CONFIG.phone}</p>
                  <p className="text-[11px] text-[#64748B]">Mon – Sat, 9:00 AM – 8:00 PM IST</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#94A3B8] group-hover:text-[#3563E9] transition-colors flex-shrink-0" />
              </a>
            </div>

            {/* Consultation Box */}
            <div className="rounded-2xl border border-[#3563E9]/20 bg-[#DCE6F8]/30 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#3563E9]" />
                <h4 className="text-sm font-bold text-[#172B4D]">Free 30-Minute Consultation</h4>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Prefer to talk it through? Message us on WhatsApp and we will evaluate your project requirements without any sales pressure.
              </p>
              <a
                href={consultationWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-book-consultation"
                className="btn-primary text-xs py-2.5 w-full justify-center shadow-xs"
              >
                <WhatsAppIcon size={14} className="fill-current" />
                <span>Schedule Free Consultation</span>
              </a>
            </div>

            {/* Response time note */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#DCE6F8] flex items-center justify-center text-[#3563E9] flex-shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#172B4D]">Fast Response Guarantee</p>
                <p className="text-[11px] text-[#64748B]">Inquiries received are reviewed within 24 hours.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-[#3563E9]/30 bg-white p-8 sm:p-10 text-center shadow-sm space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#DCE6F8] flex items-center justify-center mx-auto text-[#3563E9]">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#172B4D] mb-2" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    Inquiry Submitted Successfully!
                  </h3>
                  <p className="text-[#475569] text-sm max-w-lg mx-auto">
                    Thank you, <b>{submittedData?.name}</b>. Your project inquiry has been dispatched to{' '}
                    <span className="text-[#3563E9] font-medium">{CONTACT_CONFIG.email}</span>. We will review your requirements and respond within 24 hours.
                  </p>
                </div>

                {needsActivation && (
                  <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertCircle size={14} /> One-Time Activation Required
                    </p>
                    <p>
                      FormSubmit has sent a one-time activation link to <b>{CONTACT_CONFIG.email}</b>. Click the link in that email once to enable automatic forwarding.
                    </p>
                  </div>
                )}

                {/* Submitted Summary Card */}
                {submittedData && (
                  <div className="text-left bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 text-xs space-y-2">
                    <p className="font-bold text-[#172B4D] uppercase tracking-wider text-[11px] mb-2">Submission Summary</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#475569]">
                      <div><span className="font-semibold text-[#172B4D]">Client Name:</span> {submittedData.name}</div>
                      <div><span className="font-semibold text-[#172B4D]">Email Address:</span> {submittedData.email}</div>
                      <div><span className="font-semibold text-[#172B4D]">Phone Number:</span> {submittedData.phone || 'Not provided'}</div>
                      <div><span className="font-semibold text-[#172B4D]">Service:</span> {submittedData.projectType}</div>
                      {submittedData.business && (
                        <div><span className="font-semibold text-[#172B4D]">Business:</span> {submittedData.business}</div>
                      )}
                      <div><span className="font-semibold text-[#172B4D]">Budget Range:</span> {submittedData.budget || 'Not specified'}</div>
                    </div>
                    <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                      Submitted on: {submittedData.submissionDate}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${CONTACT_CONFIG.whatsappRaw}?text=${encodeURIComponent(`Hi Nexora, I just submitted a website inquiry on your site for "${submittedData?.projectType}". Looking forward to connecting!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2.5 px-5 shadow-xs"
                  >
                    <WhatsAppIcon size={14} className="fill-current" />
                    <span>Connect on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedData(null);
                      setNeedsActivation(false);
                      setFormData({
                        name: '',
                        business: '',
                        email: '',
                        phone: '',
                        projectType: '',
                        budget: '',
                        message: '',
                      });
                    }}
                    className="btn-secondary text-xs py-2.5 px-4 cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 space-y-5 shadow-sm"
                noValidate
              >
                {/* Submission Error Banner */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col gap-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Submission Notice</p>
                        <p className="text-red-600">{submitError}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`https://wa.me/${CONTACT_CONFIG.whatsappRaw}?text=${encodeURIComponent(`Hi Nexora! My name is ${formData.name || 'a client'}. I was inquiring about ${formData.projectType || 'a website project'}: ${formData.message || ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3563E9] hover:underline"
                      >
                        <WhatsAppIcon size={13} className="fill-current text-[#25D366]" />
                        <span>Send Details Directly via WhatsApp</span>
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                      <User size={11} className="inline mr-1 text-[#3563E9]" />Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-sm text-[#172B4D] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#3563E9] ${
                        errors.name ? 'border-red-500/70 focus:border-red-500' : 'border-[#E2E8F0]'
                      }`}
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                      <Building2 size={11} className="inline mr-1 text-[#3563E9]" />Business Name
                    </label>
                    <input
                      type="text"
                      name="business"
                      disabled={isSubmitting}
                      value={formData.business}
                      onChange={handleChange}
                      placeholder="e.g. Al Ahad Fragrances (optional)"
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#172B4D] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-[#3563E9] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                      <Mail size={11} className="inline mr-1 text-[#3563E9]" />Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-sm text-[#172B4D] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#3563E9] ${
                        errors.email ? 'border-red-500/70 focus:border-red-500' : 'border-[#E2E8F0]'
                      }`}
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                      <Phone size={11} className="inline mr-1 text-[#3563E9]" />Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      disabled={isSubmitting}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 95064 17397"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-sm text-[#172B4D] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-[#3563E9] focus:bg-white ${
                        errors.phone ? 'border-red-500/70 focus:border-red-500' : 'border-[#E2E8F0]'
                      }`}
                    />
                    {errors.phone && <p className="text-red-600 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                      <FileText size={11} className="inline mr-1 text-[#3563E9]" />Service / Project Type *
                    </label>
                    <select
                      name="projectType"
                      disabled={isSubmitting}
                      value={formData.projectType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-sm text-[#172B4D] outline-none transition-all duration-200 focus:border-[#3563E9] focus:bg-white cursor-pointer ${
                        errors.projectType ? 'border-red-500/70' : 'border-[#E2E8F0]'
                      } ${!formData.projectType ? 'text-[#94A3B8]' : 'text-[#172B4D]'}`}
                    >
                      <option value="" className="text-[#94A3B8]">Select project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type} className="text-[#172B4D] bg-white">{type}</option>
                      ))}
                    </select>
                    {errors.projectType && <p className="text-red-600 text-xs mt-1 font-medium">{errors.projectType}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                      <DollarSign size={11} className="inline mr-1 text-[#3563E9]" />Estimated Budget
                    </label>
                    <select
                      name="budget"
                      disabled={isSubmitting}
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#172B4D] outline-none transition-all duration-200 focus:border-[#3563E9] focus:bg-white cursor-pointer"
                    >
                      <option value="" className="text-[#94A3B8]">Select estimated budget</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range} className="text-[#172B4D] bg-white">{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] mb-2 uppercase tracking-wider">
                    Project Details & Goals *
                  </label>
                  <textarea
                    name="message"
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your business, timeline, preferred style, or specific technical requirements..."
                    className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-sm text-[#172B4D] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-[#3563E9] focus:bg-white resize-none ${
                      errors.message ? 'border-red-500/70 focus:border-red-500' : 'border-[#E2E8F0]'
                    }`}
                  />
                  {errors.message && <p className="text-red-600 text-xs mt-1 font-medium">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="contact-submit"
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Dispatching Project Details...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
