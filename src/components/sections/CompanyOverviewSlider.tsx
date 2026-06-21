import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Building2, BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import cleanroom from "@/assets/hero-cleanroom.jpg";
import manufacturing from "@/assets/medical-manufacturing.jpg";
import sterilization from "@/assets/sterilization.jpg";
import regulatory from "@/assets/regulatory.jpg";
import engineer from "@/assets/lab-engineer.jpg";
import suit from "@/assets/cleanroom-suit.jpg";

type Slide = {
  title: string;
  subtitle?: string;
  text: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Ask Us How (AUH)",
    subtitle: "Medical Engineering & Consulting",
    text: "A fast-growing medical engineering firm established in 2018, focused on turning ideas into reality in the medical device industry. We provide end-to-end solutions from concept to compliant operation.",
    image: manufacturing,
  },
  {
    title: "Our Mission & Vision",
    text: "We deliver innovative turnkey solutions that empower clients to build world-class medical products and facilities. Our vision is to become the partner of choice in the MENA region and beyond.",
    image: engineer,
  },
  {
    title: "Turnkey Project Solutions",
    text: "We handle full project execution — from facility design and utilities to equipment sourcing and operational startup — ensuring a seamless, ready-to-run production environment.",
    image: cleanroom,
  },
  {
    title: "Regulatory & Compliance Expertise",
    text: "We simplify complex regulatory processes including SFDA registration, ensuring full compliance with international standards such as ISO 13485 and CE marking.",
    image: regulatory,
  },
  {
    title: "Advanced Engineering Solutions",
    text: "From clean room design and construction to sterilization systems and process validation, we deliver high-performance environments for medical manufacturing.",
    image: sterilization,
  },
  {
    title: "Proven Projects Across Regions",
    text: "We have successfully delivered multiple medical manufacturing facilities across Egypt and Saudi Arabia, helping clients achieve operational excellence and market readiness.",
    image: suit,
  },
];

const stats = [
  { icon: Building2, value: "5+", label: "Medical Manufacturing Facilities" },
  { icon: BadgeCheck, value: "5+", label: "SFDA Registrations" },
  { icon: MapPin, value: "EG · KSA", label: "Projects in Egypt & Saudi Arabia" },
  { icon: ShieldCheck, value: "100%", label: "Commitment to Quality" },
];

export function CompanyOverviewSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), []);
  const next = useCallback(() => go(index + 1), [index, go]);
  const prev = useCallback(() => go(index - 1), [index, go]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide">
        <div className="max-w-2xl mb-10">
          <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent mb-5" />
          <span className="eyebrow">Company Overview</span>
          <h2 className="section-title mt-3">Who we are, what we deliver</h2>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden shadow-elevate bg-card border border-border"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`grid md:grid-cols-2 transition-opacity duration-700 ease-out ${
                  i === index ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
                aria-hidden={i !== index}
              >
                {/* Text */}
                <div
                  className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center min-h-[420px] lg:min-h-[480px]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(180 28% 33%) 0%, hsl(186 47% 40%) 100%)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display font-extrabold text-3xl lg:text-4xl !text-white leading-tight">
                    {s.title}
                  </h3>
                  {s.subtitle && (
                    <p className="mt-2 text-base lg:text-lg text-white/80 font-medium">{s.subtitle}</p>
                  )}
                  <p className="mt-5 text-white/75 leading-relaxed text-base lg:text-lg">{s.text}</p>
                </div>

                {/* Image */}
                <div className="relative min-h-[280px] md:min-h-full">
                  <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(180 28% 33% / 0.35), hsl(174 62% 47% / 0.25))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-secondary shadow-elevate flex items-center justify-center transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-secondary shadow-elevate flex items-center justify-center transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl bg-card border border-border p-5 lg:p-6 hover-lift shadow-soft flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="counter-number text-xl lg:text-2xl text-secondary">{s.value}</p>
                  <p className="mt-1 text-xs lg:text-sm text-muted-foreground font-medium leading-snug">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
