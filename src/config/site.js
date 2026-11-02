// ============================================================
// NEXORA SITE CONFIGURATION
// Edit this file to update contact info, projects, and more
// ============================================================

export const SITE_CONFIG = {
  name: "Nexora",
  tagline: "We Build Digital Experiences That Grow Businesses.",
  description:
    "Nexora is a team of passionate developers building modern, professional websites for businesses that want to grow online.",
  url: "https://nexora.dev", // Update with actual URL
};

// ============================================================
// CONTACT CONFIGURATION
// ============================================================
export const CONTACT_CONFIG = {
  email: "srivastavaharsh248@gmail.com",
  whatsapp: "+91 95064 17397",
  whatsappRaw: "919506417397",
  whatsappUrl: "https://wa.me/919506417397",
  whatsappMessage: "Hi, I'm interested in your website development services.",
  phone: "+91 95064 17397",
  phoneRaw: "+919506417397",
  location: "Available Worldwide",
};

// ============================================================
// SOCIAL LINKS
// ============================================================
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/nexora", // Replace with actual
  linkedin: "https://linkedin.com/company/nexora", // Replace with actual
  github: "https://github.com/nexora", // Replace with actual
  twitter: "https://twitter.com/nexora", // Replace with actual
};

// ============================================================
// SERVICES
// ============================================================
export const SERVICES = [
  {
    id: "business-websites",
    icon: "Globe",
    title: "Business Websites",
    description:
      "Professional websites that establish your online presence, build credibility, and help customers find you easily.",
    features: [
      "Custom multi-page design",
      "Contact & inquiry forms",
      "SEO-ready structure",
      "Mobile responsive",
    ],
  },
  {
    id: "ecommerce",
    icon: "ShoppingCart",
    title: "E-commerce Websites",
    description:
      "Online stores with product management, shopping carts, and secure payment integration that drive real sales.",
    features: [
      "Product catalog & variants",
      "Shopping cart & checkout",
      "Payment gateway integration",
      "Admin dashboard",
    ],
  },
  {
    id: "landing-pages",
    icon: "Zap",
    title: "Landing Pages",
    description:
      "High-converting landing pages designed to capture leads, promote products, and drive campaign results.",
    features: [
      "Conversion-focused design",
      "Lead capture forms",
      "A/B test ready",
      "Analytics integration",
    ],
  },
  {
    id: "website-redesign",
    icon: "RefreshCcw",
    title: "Website Redesign",
    description:
      "Transform your outdated website into a modern digital experience that impresses visitors and performs better.",
    features: [
      "Modern UI/UX overhaul",
      "Performance optimization",
      "Mobile responsiveness",
      "Content migration",
    ],
  },
  {
    id: "maintenance",
    icon: "Wrench",
    title: "Website Maintenance",
    description:
      "Keep your website running smoothly with regular updates, bug fixes, improvements, and technical support.",
    features: [
      "Regular updates & fixes",
      "Security monitoring",
      "Performance checks",
      "Content updates",
    ],
  },
];

// ============================================================
// PORTFOLIO PROJECTS
// ============================================================
export const PROJECTS = [
  {
    id: "al-ahad-attars",
    title: "Al Ahad Attars",
    category: "E-commerce",
    tagline: "Luxury Fragrance & Traditional Attar Store",
    image: "/projects/al-ahad-attars.jpg",
    description:
      "Premium attar and fragrance e-commerce platform with rich product presentation, variant selection, shopping cart, secure checkout, and an admin dashboard for full store management.",
    liveUrl: "https://alahadattars.com/",
    featured: true,
    screenshots: [
      { id: "hero", label: "Homepage Hero", url: "/projects/al-ahad-hero.jpg", caption: "Live Homepage Hero with Luxury Brand Distillation Story" },
      { id: "collection", label: "Catalog & Collections", url: "/projects/al-ahad-collection.jpg", caption: "Categorized Herbal Attars, Bakhoor & Perfume Catalog" },
      { id: "product", label: "Product Page", url: "/projects/al-ahad-product.jpg", caption: "Real Product Detail Page with Bottle Sizing & Variant Selection" },
      { id: "cart", label: "Cart & Bag", url: "/projects/al-ahad-cart.jpg", caption: "Dynamic Shopping Bag & Quick Checkout Drawer" },
      { id: "mobile", label: "Mobile Experience", url: "/projects/al-ahad-mobile.jpg", caption: "Fast Mobile-Optimized Buying Experience on iOS/Android" }
    ],
    highlights: [
      "Custom product catalog with bottle/ml variant selection",
      "Dynamic shopping cart with real-time total calculations",
      "Secure online payment gateway integration",
      "Administrative dashboard for products, inventory, and order fulfillment",
      "Fast, mobile-optimized buying journey"
    ],
    deliverables: [
      "Full Storefront UI/UX",
      "E-commerce Engine & Cart Flow",
      "Secure Payment Gateway",
      "Admin Control Panel"
    ]
  },
  {
    id: "finora",
    title: "Finora",
    category: "E-commerce",
    tagline: "Handcrafted Resin Home Décor Showcase",
    image: "/projects/finora.jpg",
    description:
      "Elegant e-commerce platform for handcrafted resin home décor. Features stunning product presentation, modern shopping experience, and a refined checkout flow.",
    liveUrl: "#",
    featured: true,
    screenshots: [
      { id: "hero", label: "Artisan Homepage", url: "/projects/finora-hero.jpg", caption: "Finora Editorial Homepage Hero — Where Art Meets Home" },
      { id: "collection", label: "Curated Collections", url: "/projects/finora-collection.jpg", caption: "Shop by Collection & The Finora Edit Showcase" },
      { id: "shop", label: "Handcrafted Catalog", url: "/projects/finora-shop.jpg", caption: "Full Catalog of Handcrafted Coasters, Wall Art & Home Décor" },
      { id: "custom", label: "Bespoke Commissions", url: "/projects/finora-custom.jpg", caption: "Custom Gift Sets & Personalized Resin Art Commission Orders" },
      { id: "mobile", label: "Mobile Experience", url: "/projects/finora-mobile.jpg", caption: "Touch-Optimized Mobile Storefront on iPhone / Android" }
    ],
    highlights: [
      "High-resolution product showcase with gallery zoom",
      "Curated home décor collections with category filtering",
      "Streamlined modern checkout flow",
      "Responsive layout optimized for visual storytelling",
      "Direct custom commission order requests"
    ],
    deliverables: [
      "Luxury Brand Identity Design",
      "Visual Product Showcase",
      "Seamless Checkout Experience",
      "Cross-device Optimization"
    ]
  },
  {
    id: "pixelshrink",
    title: "PixelShrink",
    category: "Utility Tool",
    tagline: "Client-Side In-Browser Image Compressor",
    image: "/projects/pixelshrink.jpg",
    description:
      "High-performance, privacy-first image compression web application. Optimizes JPG, PNG, WebP, and AVIF directly in the browser with custom quality controls, batch processing, and instant downloads without server uploads.",
    liveUrl: "https://pixelshrink-one.vercel.app",
    featured: true,
    screenshots: [
      { id: "hero", label: "Compressor Studio", url: "/projects/pixelshrink-hero.jpg", caption: "PixelShrink Drag & Drop In-Browser Optimizer with Format Selection" },
      { id: "studio", label: "Live Optimization", url: "/projects/pixelshrink-studio.jpg", caption: "Real-Time Compression Dashboard with Quality Sliders & File Size Savings" },
      { id: "resize", label: "Image Resizer", url: "/projects/pixelshrink-resize.jpg", caption: "Custom Dimensions & Aspect Ratio Optimization Workbench" },
      { id: "target", label: "Target KB Mode", url: "/projects/pixelshrink-target.jpg", caption: "Strict File Size Target Optimization (50KB, 100KB, 200KB)" },
      { id: "mobile", label: "Mobile Experience", url: "/projects/pixelshrink-mobile.jpg", caption: "Responsive Mobile Interface for On-the-Go Compression" }
    ],
    highlights: [
      "100% private in-browser compression via Canvas API & Web Workers",
      "Multi-format support for JPG, PNG, WebP, and AVIF",
      "Real-time quality slider, size target presets, and dimension resizer",
      "Instant single or batch ZIP download with zero server footprint",
      "Clipboard paste support (Ctrl+V) and drag-and-drop batch processing"
    ],
    deliverables: [
      "Client-Side Compression Engine",
      "Multi-Tool Navigation (Resize, Convert, Target Size)",
      "Batch Processing & ZIP Archiver",
      "Zero-Upload Privacy Architecture"
    ]
  },
  {
    id: "omezi",
    title: "Omezi",
    category: "Web App",
    tagline: "Anonymous Random Video & Text Chat Platform",
    image: "/projects/omezi.jpg",
    description:
      "Modern anonymous random chat web platform pairing visitors worldwide for instantaneous text and video conversations. Features ephemeral WebRTC streaming, topic/interest filtering, multilingual support, and proactive client-side safety guardrails.",
    liveUrl: "#",
    featured: false,
    screenshots: [
      { id: "hero", label: "Lobby & Discovery", url: "/projects/omezi-hero.jpg", caption: "Omezi Lobby Hero with Instant Pairing, Language Selector & Interest Tags" },
      { id: "chat", label: "Live Chat Workspace", url: "/projects/omezi-chat.jpg", caption: "Ephemeral Text & Video Chat Interface with Fast Pairing and Quick Skip" },
      { id: "interests", label: "Interests & Matching", url: "/projects/omezi-interests.jpg", caption: "Shared Interest Topic Filtering (Gaming, Tech, Music, Art) & Safety Guardrails" },
      { id: "safety", label: "Safety Guide", url: "/projects/omezi-safety.jpg", caption: "Community Safety, Moderation Guidelines & User Protection System" },
      { id: "mobile", label: "Mobile Experience", url: "/projects/omezi-mobile.jpg", caption: "Fast Mobile-Optimized Stranger Chat Experience on iOS & Android" }
    ],
    highlights: [
      "Instant millisecond pairing with zero registration or login required",
      "Ephemeral peer-to-peer WebRTC video and low-latency text channels",
      "Interest-based topic matching across global languages",
      "Integrated quick skip (Esc), user blocking, and abuse reporting",
      "100% private, ephemeral sessions with zero conversation logging"
    ],
    deliverables: [
      "Real-time WebRTC & Socket Pairing Engine",
      "Ephemeral Text & Video Messaging Room",
      "Topic & Language Discovery Architecture",
      "Community Safety & Abuse Prevention UI"
    ]
  },
];

// ============================================================
// PRICING PLANS
// ============================================================
export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$200",
    priceNote: "Fixed Price",
    description: "Perfect for small businesses needing a clean online presence.",
    highlighted: false,
    features: [
      "Up to 4–5 website pages",
      "Fully responsive design",
      "Contact & inquiry form",
      "Basic SEO setup",
      "6 months free maintenance",
      "Fast delivery (3–4 weeks)",
    ],
    note: "Domain & hosting purchased separately",
    cta: "Get Started",
  },
  {
    id: "business",
    name: "Business",
    price: "Custom",
    priceNote: "Based on requirements",
    description: "For businesses needing advanced features and more pages.",
    highlighted: true,
    features: [
      "Advanced functionality",
      "More pages & sections",
      "Custom integrations",
      "Database connectivity",
      "Admin dashboard (if needed)",
      "6 months free maintenance",
    ],
    note: "Domain & hosting purchased separately",
    cta: "Get a Custom Quote",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    price: "Custom",
    priceNote: "Based on requirements",
    description: "Full-featured online store ready to sell your products.",
    highlighted: false,
    features: [
      "Product catalog & management",
      "Shopping cart & checkout",
      "Payment gateway integration",
      "Admin dashboard",
      "Order management system",
      "6 months free maintenance",
    ],
    note: "Domain & hosting purchased separately",
    cta: "Get a Custom Quote",
  },
];

// ============================================================
// WHY CHOOSE US
// ============================================================
export const WHY_CHOOSE_US = [
  {
    icon: "DollarSign",
    title: "Affordable Pricing",
    description:
      "Professional quality websites at prices accessible to growing businesses. No hidden charges.",
  },
  {
    icon: "Palette",
    title: "Modern UI/UX",
    description:
      "Clean, modern designs built to make a lasting first impression and keep visitors engaged.",
  },
  {
    icon: "Smartphone",
    title: "Mobile-Friendly",
    description:
      "Every website we build is fully responsive and optimized for all screen sizes.",
  },
  {
    icon: "Briefcase",
    title: "Real Project Experience",
    description:
      "We've built real websites for real businesses — not just concept projects or tutorials.",
  },
  {
    icon: "MessageCircle",
    title: "Direct Communication",
    description:
      "Work directly with the developers building your site. No middlemen, no miscommunication.",
  },
  {
    icon: "Shield",
    title: "6 Months Free Maintenance",
    description:
      "We stand behind our work. Every project includes 6 months of free maintenance and support.",
  },
];

// ============================================================
// PROCESS STEPS
// ============================================================
export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start by understanding your business, goals, target audience, and requirements through a focused consultation.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "We create a modern, brand-aligned website design tailored specifically to your business and audience.",
  },
  {
    step: "03",
    title: "Development",
    description:
      "We build, test, and optimize your website ensuring it's fast, secure, and works flawlessly across all devices.",
  },
  {
    step: "04",
    title: "Launch",
    description:
      "We deploy your website, run final checks, and provide ongoing support to ensure a smooth go-live.",
  },
];

// ============================================================
// FAQ
// ============================================================
export const FAQ_ITEMS = [
  {
    question: "How much does a website cost?",
    answer:
      "A standard business website starts at $200 for up to 4–5 pages. E-commerce and custom web applications are priced based on your specific requirements. We provide transparent quotes with no hidden charges.",
  },
  {
    question: "How long does website development take?",
    answer:
      "A basic business website typically takes 3–4 weeks from project start to delivery. More complex websites like e-commerce platforms or custom web applications may take 4–6 weeks depending on the scope and requirements.",
  },
  {
    question: "Do you provide domain and hosting?",
    answer:
      "We guide you through choosing the right domain name and hosting plan for your needs. Domain and hosting costs are separate from our development fees, and we help you set everything up.",
  },
  {
    question: "Do you provide maintenance after launch?",
    answer:
      "Yes, every project includes 6 months of free maintenance and support after launch. This covers bug fixes, minor updates, and general technical support.",
  },
  {
    question: "Can I request changes after delivery?",
    answer:
      "Absolutely. Within the 6-month free maintenance period, we handle minor revisions and updates at no extra charge. For major feature additions or redesigns, we provide a separate quote.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Yes! Website redesign is one of our core services. We can transform your outdated website into a modern, performant digital experience while preserving your existing content and branding.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply fill out our contact form, send us a WhatsApp message, or book a free consultation. We'll get back to you within 24 hours to discuss your project and provide a custom quote.",
  },
];
