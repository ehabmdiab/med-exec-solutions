import { Link } from "react-router-dom";
import { ArrowRight, Factory, FileCheck2, Wind, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useRef, useEffect } from "react";

const ICONS = {
  turnkey: Factory,
  regulatory: FileCheck2,
  cleanroom: Wind,
  sterilization: ShieldCheck,
} as const;

const ACCENT_COLORS = [
  "hsl(174 62% 47%)",    // teal
  "hsl(20 79% 54%)",     // orange
  "hsl(39 83% 52%)",     // gold
  "hsl(174 62% 55%)",    // light teal
];

export function ServicesGrid() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll('.service-card');

      ctx = gsap.context(() => {
        // Each card appears one by one on scroll
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            {
              y: 80,
              opacity: 0,
              scale: 0.95,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                end: "top 55%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, sectionRef);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(174 62% 47% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(174 62% 47% / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} aria-hidden />

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mb-16">
          <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent mb-6" />
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title mt-3">{t.services.title}</h2>
          <p className="section-sub">{t.services.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[s.slug as keyof typeof ICONS];
            const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
            return (
              <Link
                key={s.slug}
                to="/services"
                className="service-card group block h-full bg-card rounded-2xl border border-border p-7 hover-lift gradient-border-hover relative overflow-hidden"
              >
                {/* Number index */}
                <span className="absolute top-5 end-5 text-[4rem] font-display font-extrabold leading-none text-foreground/[0.04]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
                  style={{ background: `${accentColor}15`, color: accentColor }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display font-bold text-lg text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Learn more <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
