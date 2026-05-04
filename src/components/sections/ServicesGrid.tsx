import { Link } from "react-router-dom";
import { ArrowRight, Factory, FileCheck2, Wind, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";
import { useRef, useEffect, useState } from "react";

const ICONS = {
  turnkey: Factory,
  regulatory: FileCheck2,
  cleanroom: Wind,
  sterilization: ShieldCheck,
} as const;

export function ServicesGrid() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [floatingOffset, setFloatingOffset] = useState(0);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll('.service-card');
      const bgShapes = sectionRef.current.querySelectorAll('.bg-shape');
      const floatingAccents = sectionRef.current.querySelectorAll('.floating-accent');

      ctx = gsap.context(() => {
        // Layer 1: Background shapes — very slow parallax
        bgShapes.forEach((shape) => {
          gsap.to(shape, {
            y: -60,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 5,
            },
          });
        });

        // Layer 2: Cards — normal scroll + subtle lift
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: i * 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Layer 3: Floating accents — faster parallax
        floatingAccents.forEach((el) => {
          gsap.to(el, {
            y: -120,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        });
      }, sectionRef);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-20 lg:py-28 bg-primary/[0.04] relative overflow-hidden">
      {/* Layer 1: Background shapes */}
      <div className="bg-shape absolute top-20 -start-20 w-72 h-72 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden />
      <div className="bg-shape absolute bottom-10 -end-20 w-96 h-96 rounded-full bg-primary/[0.04] blur-3xl" aria-hidden />
      <div className="bg-shape absolute top-1/2 start-1/3 w-64 h-64 rounded-full bg-primary/[0.03] blur-2xl" aria-hidden />

      {/* Layer 3: Floating accents (gold/orange) */}
      <div className="floating-accent absolute top-32 end-20 w-3 h-3 rounded-full bg-accent/40 animate-float" aria-hidden />
      <div className="floating-accent absolute top-60 start-16 w-2 h-2 rounded-full bg-accent-orange/30 animate-float" style={{ animationDelay: '1s' }} aria-hidden />
      <div className="floating-accent absolute bottom-40 end-1/3 w-4 h-4 rounded-full bg-accent/25 animate-float" style={{ animationDelay: '2s' }} aria-hidden />
      <div className="floating-accent absolute bottom-24 start-1/4 w-2.5 h-2.5 rounded-full bg-accent-orange/20 animate-float" style={{ animationDelay: '0.5s' }} aria-hidden />

      <div className="container-wide relative z-10">
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow">{t.services.eyebrow}</span>
            <h2 className="section-title mt-3">{t.services.title}</h2>
            <p className="section-sub">{t.services.sub}</p>
          </Reveal>
        </div>

        {/* Layer 2: Service cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[s.slug as keyof typeof ICONS];
            return (
              <Link
                key={s.slug}
                to="/services"
                className="service-card group block h-full bg-card rounded-2xl border border-border p-7 hover-lift gradient-border-hover relative overflow-hidden"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-soft transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display font-bold text-lg text-secondary">{s.title}</h3>
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
