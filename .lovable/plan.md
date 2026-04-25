## AUH Corporate Website — Build Plan

A premium, multi-page B2B website for Ask Us How Company that positions AUH as the authority for turnkey medical manufacturing, regulatory approval, and cleanroom engineering across Egypt and the GCC.

### Brand system

- **Palette** (HSL tokens in `index.css`):
  - Primary Deep Blue `#0A2540`
  - Secondary Medical Teal `#00A8A8`
  - Accent Cyan `#4CC9F0`
  - Neutrals: white, light gray surfaces, near-black text
- **Gradients**: subtle blue → teal for hero overlays, CTA blocks, and section accents
- **Typography**: large, confident headlines (Inter / Manrope), generous line-height for body
- **Style**: industrial + medical authority — clean grid, white space, soft shadows, hover/fade-in micro-animations, smooth scroll
- **Iconography**: Lucide medical/engineering icons (Stethoscope, ShieldCheck, Wind, Factory, Microscope, etc.)

### Site structure (multi-page)

```text
/               Home (hero + condensed sections + CTAs)
/about          Company story, mission, vision, timeline
/services       Full service catalogue with detail blocks
/projects       Case studies grid → /projects/:slug detail pages
/contact        Working form + offices + map
```

Persistent **Header** (logo, nav, language toggle, "Ask Us How" CTA) and **Footer** (offices, quick links, contacts, social).

### Page-by-page

**Home**
- Hero: full-bleed cleanroom photo with blue/teal gradient overlay, headline *"Turning Medical Ideas Into Reality"*, subtext, dual CTAs ("Start Your Project", "Ask Us How")
- Trust strip: years founded (2018), facilities delivered, countries served, compliance badges
- About teaser → links to /about
- Core Services grid (4 cards: Turnkey Projects, SFDA & Regulatory, Cleanroom Design, Sterilization)
- Featured Projects carousel (Dental Art, Ideal Solution, Sondos, Apex Lab)
- Why AUH value-prop block (4 pillars)
- Mission & Vision split panel
- Conversion CTA band: *"Ready to Build Your Medical Facility?"* → Book Consultation / Contact

**About** — story, founding, leadership intent, mission, vision, capability pillars, timeline.

**Services** — long-form per service with: what it includes, deliverables, compliance standards, related projects.

**Projects** — filterable grid; each detail page shows Problem → Solution → Outcome with imagery and metrics.

**Contact** — working form (name, company, email, phone, country, project type, message), office cards (Egypt HQ + Saudi branch) with phones/emails, embedded map.

### Bilingual (EN + AR with RTL)

- Language toggle in header; persists in localStorage
- All copy stored in translation dictionaries (EN + AR)
- `<html dir="rtl">` switching with mirrored layouts (logical Tailwind utilities, flipped icons where needed)
- Arabic typography pairing (e.g., IBM Plex Sans Arabic / Tajawal) for headings and body

### Working contact form (Lovable Cloud)

- Lovable Cloud enabled to provision backend
- `contact_submissions` table (name, company, email, phone, country, project_type, message, locale, created_at) with RLS — **public insert allowed, read restricted**
- Client-side **Zod validation** (length limits, email format, required fields), inline error states, success toast
- Submissions queryable later from the backend; email notification can be added in a follow-up

### Visuals

- Hero and project imagery sourced from free libraries (Unsplash) — cleanroom, manufacturing, lab, medical-tech scenes
- Each image paired with a blue/teal gradient overlay for brand consistency and text contrast
- SVG iconography for service cards and value-prop blocks

### UX details

- Sticky transparent → solid header on scroll
- Section reveal-on-scroll (fade/slide), button hover lifts, card hover elevation
- Anchor scrolling for in-page CTAs, fully responsive (desktop-first, mobile polished)
- Accessible: semantic landmarks, keyboard nav, focus rings, alt text, ARIA on language toggle

### Technical notes

- React + Vite + TypeScript + Tailwind, shadcn/ui (Button, Card, Carousel, Input, Textarea, Select, Toast)
- Routes added to `App.tsx`; shared `Layout` with Header/Footer
- Design tokens defined in `index.css` (HSL) and mapped through `tailwind.config.ts`
- i18n via a lightweight context (no heavy library) — dictionary files `src/i18n/en.ts`, `src/i18n/ar.ts`
- Lovable Cloud for `contact_submissions`; submissions visible in the Cloud dashboard

### Out of scope (can be added later)

- CMS for editing case studies in-app
- Email notifications on form submit (needs email domain setup)
- Blog / insights section
- Analytics integration
