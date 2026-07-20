export type Locale = "en" | "ar";

export const en = {
  meta: {
    title: "AUH — Turning Medical Ideas Into Reality",
    description:
      "Ask Us How Company (AUH) is a medical engineering and consulting firm delivering turnkey manufacturing facilities, regulatory approvals, and ISO-compliant cleanrooms across Egypt and the GCC.",
  },
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    projects: "Projects",
    gallery: "Gallery",
    blog: "Blog",
    contact: "Contact",
    cta: "Ask Us How",
  },
  brand: {
    name: "Ask Us How",
    short: "AUH",
    tagline: "Turn Ideas into Reality",
  },
  hero: {
    eyebrow: "Medical Engineering · Regulatory · Cleanroom",
    title: "Turning Medical Ideas Into Reality",
    subtitle:
      "End-to-end medical engineering solutions — from concept to fully operational, fully compliant facilities.",
    primary: "Start Your Project",
    secondary: "Ask Us How",
    stats: [
      { value: "2018", label: "Founded" },
      { value: "12+", label: "Facilities Delivered" },
      { value: "4", label: "Countries Served" },
      { value: "100%", label: "Compliance Track Record" },
    ],
  },
  about: {
    eyebrow: "About AUH",
    title: "One partner. Complete execution.",
    body: "Founded in 2018, AUH is a medical engineering and consulting firm built to solve a single problem: turning medical manufacturing ideas into approved, operational facilities. We design, build, and certify — so our clients can focus on what they make, not how to make it.",
    pillars: [
      { title: "Innovation", desc: "Engineering-led design rooted in real-world manufacturing." },
      { title: "Regulatory Expertise", desc: "SFDA, EDA, ISO and GMP — built into every decision." },
      { title: "End-to-End Delivery", desc: "Concept, design, construction, validation, handover." },
    ],
    cta: "Read our story",
  },
  services: {
    eyebrow: "Core Services",
    title: "Built to deliver compliant facilities — fast.",
    sub: "Four disciplines, one accountable team. We close the gap between design intent and a facility that passes inspection on day one.",
    items: [
      {
        slug: "turnkey",
        title: "Turnkey Projects",
        short: "From design to full operation.",
        long: "We take ownership of the entire build: concept, layout, MEP, fit-out, equipment integration, validation, and handover — under one contract, one timeline, one accountable team.",
      },
      {
        slug: "regulatory",
        title: "SFDA & Regulatory Approval",
        short: "We handle compliance and approvals.",
        long: "Dossier preparation, technical files, GMP readiness, SFDA, EDA, ISO 13485, and CE pathways. Compliance is engineered into the facility, not bolted on after.",
      },
      {
        slug: "cleanroom",
        title: "Cleanroom Design & Construction",
        short: "ISO-compliant controlled environments.",
        long: "ISO 14644 cleanrooms designed for medical devices, pharma, dental, and biotech. HVAC, pressure cascades, finishes, monitoring — all engineered and validated.",
      },
      {
        slug: "sterilization",
        title: "Sterilization Solutions",
        short: "Safe, validated sterilization processes.",
        long: "EO, gamma, and steam sterilization integration with full process validation, qualification protocols, and ongoing compliance documentation.",
      },
    ],
  },
  projects: {
    eyebrow: "Selected Projects",
    title: "Proven across Egypt & the GCC.",
    sub: "Each project is a facility that operates today — delivered, approved, and producing.",
    viewAll: "View all projects",
    items: [
      {
        slug: "dental-art",
        name: "Dental Art",
        location: "Egypt",
        sector: "Dental Manufacturing",
        problem: "A growing dental brand needed a compliant production facility to scale beyond contract manufacturing.",
        solution: "Turnkey design and build of a dedicated production line with integrated cleanroom and regulatory dossier.",
        outcome: "Facility operational and approved — production capacity tripled in the first year.",
      },
      {
        slug: "ideal-solution",
        name: "Ideal Solution",
        location: "Sohag, Egypt",
        sector: "Medical Disposables",
        problem: "Greenfield site with ambitious export targets and no in-house engineering team.",
        solution: "End-to-end facility design, cleanroom construction, equipment specification, and EDA approval.",
        outcome: "Plant commissioned on schedule and exporting within 9 months of handover.",
      },
      {
        slug: "sondos",
        name: "Sondos",
        location: "Saudi Arabia",
        sector: "Medical Manufacturing",
        problem: "Investor-backed venture needed an SFDA-ready facility with zero room for compliance risk.",
        solution: "Full SFDA pathway — facility design, validation, dossier, and submission support.",
        outcome: "SFDA approval secured on first submission. Facility operational and audited.",
      },
      {
        slug: "apex-lab",
        name: "Apex Lab",
        location: "Egypt",
        sector: "Cleanroom Project",
        problem: "Existing lab needed an ISO-classified cleanroom retrofit without halting operations.",
        solution: "Phased cleanroom design and construction with HVAC redesign and validation.",
        outcome: "Cleanroom delivered to ISO Class 7 with zero operational downtime.",
      },
    ],
    table: { problem: "Challenge", solution: "Solution", outcome: "Outcome" },
  },
  why: {
    eyebrow: "Why AUH",
    title: "Tailored, not generic. Built for compliance from day one.",
    sub: "We don’t just design. We deliver.",
    items: [
      { title: "One Partner. Complete Execution.", desc: "From whiteboard to validated facility — under one contract." },
      { title: "Built for Compliance from Day One.", desc: "Regulatory pathway engineered into every drawing." },
      { title: "Tailored, Not Generic Solutions.", desc: "Each facility is designed around the product, not the template." },
      { title: "Proven Across Egypt & GCC.", desc: "Operational facilities, approved dossiers, satisfied investors." },
    ],
  },
  mv: {
    mission: {
      label: "Mission",
      text: "Combine engineering precision, regulatory mastery, and execution power to bring medical manufacturing ideas to life — at global standards.",
    },
    vision: {
      label: "Vision",
      text: "Be the leading partner for medical manufacturing across the MENA region — known for facilities that are built right and approved on time.",
    },
  },
  cta: {
    title: "Ready to build your medical facility?",
    sub: "Tell us about your project. We’ll show you the path from idea to operation.",
    primary: "Book a Consultation",
    secondary: "Contact Us",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let’s talk about your facility.",
    sub: "Tell us where you are and where you want to be. We’ll respond within one business day.",
    offices: {
      egypt: {
        label: "Egypt — HQ",
        address: "Cairo, Egypt",
        phone: "+20 100 000 0000",
        email: "info@askushow.com",
      },
      saudi: {
        label: "Saudi Arabia — Branch",
        address: "Riyadh, Kingdom of Saudi Arabia",
        phone: "+966 50 000 0000",
        email: "ksa@askushow.com",
      },
    },
    form: {
      name: "Full name",
      company: "Company",
      email: "Work email",
      phone: "Phone",
      country: "Country",
      projectType: "Project type",
      projectTypes: ["Turnkey Project", "Regulatory / SFDA", "Cleanroom", "Sterilization", "Consultation"],
      message: "Tell us about your project",
      submit: "Send message",
      submitting: "Sending…",
      success: "Thanks — we’ll be in touch within one business day.",
      error: "Something went wrong. Please try again or email us directly.",
    },
  },
  footer: {
    rights: "All rights reserved.",
    quickLinks: "Quick Links",
    offices: "Offices",
    tagline: "Medical engineering that gets built and approved.",
  },
  about_page: {
    eyebrow: "About",
    title: "We turn medical ideas into operational, approved facilities.",
    intro: "Founded in 2018, AUH was built around a frustration we heard from manufacturers and investors alike: medical facility projects fragmented across too many vendors, with compliance treated as a final hurdle rather than a design input. We rebuilt the model.",
    sections: [
      {
        title: "What we do",
        body: "We design, build, and certify medical manufacturing facilities — across dental, pharma, disposables, biotech, and lab environments. Our scope spans concept architecture, MEP, cleanroom engineering, equipment integration, validation, and regulatory submission.",
      },
      {
        title: "How we work",
        body: "One contract. One accountable team. One timeline. The same engineers who draw the facility own its compliance, construction, and handover. That is how risk disappears from the project.",
      },
      {
        title: "Where we work",
        body: "Egypt, Saudi Arabia, and the wider GCC and MENA region. Headquartered in Cairo, with a Saudi branch supporting SFDA-regulated work.",
      },
    ],
    timeline: [
      { year: "2018", text: "AUH founded — focus on turnkey medical facilities." },
      { year: "2020", text: "First cleanroom projects delivered in Egypt." },
      { year: "2022", text: "Saudi branch opens; first SFDA approvals." },
      { year: "2024", text: "Portfolio expands across dental, disposables, and labs." },
    ],
  },
};

export type Dict = typeof en;
