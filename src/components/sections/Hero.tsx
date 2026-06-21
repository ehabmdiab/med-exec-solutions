import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Building2,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo3DScene } from "@/components/Logo3DScene";
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

export function Hero() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const go = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    []
  );
  const next = useCallback(() => go(index + 1), [index, go]);
  const prev = useCallback(() => go(index - 1), [index, go]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      6000
    );
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
      {/* Smooth continuous gradient background (teal -> orange) */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(110deg, #02C8B3 0%, #02C8B3 35%, #6FA76A 55%, #D87C23 80%, #D87C23 100%)",
        }}
      />

      {/* Very subtle noise */}
      <div className="absolute inset-0 noise-overlay z-[1]" />

      {/* 3D Model — centered across the split */}
      <Logo3DScene />

      {/* Top hero content */}
      <div className="container-wide relative z-10 pt-24 lg:pt-32 pb-16 pointer-events-none">
        <div className="max-w-3xl animate-fade-in-up">
          {/* Accent line */}
          <div className="w-12 h-[2px] bg-gradient-to-r from-white/80 to-white/40 mb-6" />
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl !text-white !leading-[1.1] text-balance pb-2 overflow-visible">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4 pointer-events-auto">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#3E6A6A] hover:bg-white/90 hover-lift font-semibold rounded-xl shadow-elevate"
            >
              <Link to="/contact">
                {t.hero.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 !text-white hover:border-white/60 hover:bg-white/10 bg-transparent font-semibold rounded-xl"
            >
              <Link to="/services">{t.hero.secondary}</Link>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 rounded-2xl overflow-hidden max-w-4xl">
          {t.hero.stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm p-5 lg:p-7">
              <p className="counter-number text-2xl lg:text-4xl text-white">{s.value}</p>
              <p className="mt-1 text-xs lg:text-sm text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Infused Company Overview Slider */}
      <div className="container-wide relative z-10 pb-24 lg:pb-32">
        <div className="max-w-2xl mb-8">
          <div className="w-12 h-[2px] bg-gradient-to-r from-white/80 to-white/40 mb-5" />
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            <ShieldCheck className="h-3.5 w-3.5" />
            Company Overview
          </span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl !text-white leading-tight">
            Who we are, what we deliver
          </h2>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden shadow-elevate border border-white/20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`grid md:grid-cols-2 transition-opacity duration-700 ease-out ${
                  i === index
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
                aria-hidden={i !== index}
              >
                {/* Text */}
                <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center min-h-[340px] lg:min-h-[400px] bg-white/95 text-[#3E6A6A]">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E6A6A]/50">
                    {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display font-extrabold text-2xl lg:text-3xl text-[#3E6A6A] leading-tight">
                    {s.title}
                  </h3>
                  {s.subtitle && (
                    <p className="mt-2 text-base lg:text-lg text-[#3E6A6A]/80 font-medium">
                      {s.subtitle}
                    </p>
                  )}
                  <p className="mt-5 text-[#3E6A6A]/70 leading-relaxed text-base lg:text-lg">
                    {s.text}
                  </p>
                </div>

                {/* Image */}
                <div className="relative min-h-[260px] md:min-h-full">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(180 28% 33% / 0.25), hsl(174 62% 47% / 0.15))",
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-[#3E6A6A] shadow-elevate flex items-center justify-center transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-[#3E6A6A] shadow-elevate flex items-center justify-center transition"
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
                  i === index
                    ? "w-8 bg-[#3E6A6A]"
                    : "w-2 bg-[#3E6A6A]/40 hover:bg-[#3E6A6A]/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm p-5 lg:p-6 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-white/15 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="counter-number text-xl lg:text-2xl text-white">{s.value}</p>
                  <p className="mt-1 text-xs lg:text-sm text-white/70 font-medium leading-snug">
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
