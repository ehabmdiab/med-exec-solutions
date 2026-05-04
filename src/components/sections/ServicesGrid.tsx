import { Link } from "react-router-dom";
import { ArrowRight, Factory, FileCheck2, Wind, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useRef, useEffect, useState } from "react";

const ICONS = {
  turnkey: Factory,
  regulatory: FileCheck2,
  cleanroom: Wind,
  sterilization: ShieldCheck,
} as const;

const ACCENT_COLORS = [
  "#2EC0B1",
  "#368A97",
  "#DD9B1F",
  "#E8742B",
];

export function ServicesGrid() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = t.services.items;

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      if (!sectionRef.current || !orbitRef.current) return;

      const totalItems = items.length;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalItems * 100}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // Animate through each item
        for (let i = 0; i < totalItems - 1; i++) {
          tl.to({}, {
            duration: 1,
            onUpdate: function () {
              const progress = this.progress();
              if (progress > 0.5) {
                setActiveIndex(i + 1);
              } else {
                setActiveIndex(i);
              }
            },
          });
        }
      }, sectionRef);
    };

    init();
    return () => ctx?.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} id="services" className="min-h-screen bg-background relative overflow-hidden flex items-center">
      <div className="container-wide relative z-10 py-20">
        <div className="max-w-3xl mb-12">
          <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent-gold mb-6" />
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title mt-3">{t.services.title}</h2>
          <p className="section-sub">{t.services.sub}</p>
        </div>

        {/* 3D Orbit container */}
        <div ref={orbitRef} className="relative h-[420px] lg:h-[480px]" style={{ perspective: "1200px" }}>
          {items.map((s, i) => {
            const Icon = ICONS[s.slug as keyof typeof ICONS];
            const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
            const offset = i - activeIndex;

            // 3D orbit positioning
            const angle = offset * 55;
            const radians = (angle * Math.PI) / 180;
            const translateZ = -Math.abs(offset) * 200;
            const translateX = Math.sin(radians) * 350;
            const rotateY = angle * 0.4;
            const opacity = Math.abs(offset) > 1 ? 0.3 : Math.abs(offset) === 1 ? 0.5 : 1;
            const scale = Math.abs(offset) > 1 ? 0.7 : Math.abs(offset) === 1 ? 0.85 : 1;
            const blur = Math.abs(offset) > 1 ? 4 : Math.abs(offset) === 1 ? 2 : 0;
            const zIndex = 10 - Math.abs(offset);

            return (
              <div
                key={s.slug}
                className="absolute top-1/2 left-1/2 w-[320px] lg:w-[380px] transition-all duration-700 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  zIndex,
                  pointerEvents: offset === 0 ? 'auto' : 'none',
                }}
              >
                <Link
                  to="/services"
                  className="block bg-card rounded-2xl border border-border p-7 lg:p-8 shadow-soft hover-lift gradient-border-hover"
                >
                  <span className="absolute top-5 end-5 text-[4rem] font-display font-extrabold leading-none text-muted/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
                    style={{ background: `${accentColor}15`, color: accentColor }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display font-bold text-lg" style={{ color: '#3E6A6A' }}>{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                    Learn more <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </Link>
              </div>
            );
          })}

          {/* Orbit indicator dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  background: i === activeIndex ? '#2EC0B1' : '#D4D4D4',
                  transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
