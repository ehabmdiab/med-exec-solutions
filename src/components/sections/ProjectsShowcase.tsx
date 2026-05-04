import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { useRef, useEffect, useState } from "react";
import dental from "@/assets/project-dental.jpg";
import disposables from "@/assets/project-disposables.jpg";
import saudi from "@/assets/project-saudi.jpg";
import apex from "@/assets/project-apex.jpg";

const IMAGES: Record<string, string> = {
  "dental-art": dental,
  "ideal-solution": disposables,
  "sondos": saudi,
  "apex-lab": apex,
};

export function ProjectsShowcase() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = t.projects.items;

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      if (!sectionRef.current) return;

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
    <section ref={sectionRef} className="min-h-screen bg-background relative overflow-hidden flex items-center">
      <div className="container-wide relative z-10 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="w-12 h-[2px] bg-gradient-to-r from-accent to-accent-gold mb-6" />
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title mt-3">{t.projects.title}</h2>
            <p className="section-sub">{t.projects.sub}</p>
          </div>
          <Button asChild variant="outline" className="border-border text-primary hover:bg-primary hover:text-white rounded-xl shrink-0">
            <Link to="/projects">
              {t.projects.viewAll}
              <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        {/* 3D Orbit */}
        <div className="relative h-[480px] lg:h-[520px]" style={{ perspective: "1200px" }}>
          {items.map((p, i) => {
            const offset = i - activeIndex;
            const angle = offset * 50;
            const radians = (angle * Math.PI) / 180;
            const translateZ = -Math.abs(offset) * 220;
            const translateX = Math.sin(radians) * 380;
            const rotateY = angle * 0.35;
            const opacity = Math.abs(offset) > 1 ? 0.25 : Math.abs(offset) === 1 ? 0.5 : 1;
            const scale = Math.abs(offset) > 1 ? 0.7 : Math.abs(offset) === 1 ? 0.82 : 1;
            const blur = Math.abs(offset) > 1 ? 5 : Math.abs(offset) === 1 ? 2 : 0;
            const zIndex = 10 - Math.abs(offset);

            return (
              <article
                key={p.slug}
                className="absolute top-1/2 left-1/2 w-[340px] lg:w-[420px] transition-all duration-700 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  zIndex,
                }}
              >
                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover-lift gradient-border-hover flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={IMAGES[p.slug]}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E6A6A]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-5">
                      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 mb-1">
                        <MapPin className="h-3 w-3" /> {p.location} · {p.sector}
                      </p>
                      <h3 className="font-display font-bold text-xl !text-white">{p.name}</h3>
                    </div>
                  </div>
                  <div className="p-5 lg:p-6 grid gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#E8742B' }}>{t.projects.table.problem}</p>
                      <p className="mt-1 text-muted-foreground">{p.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.projects.table.outcome}</p>
                      <p className="mt-1 font-medium" style={{ color: '#3E6A6A' }}>{p.outcome}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Orbit indicator dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                style={{
                  background: i === activeIndex ? '#2EC0B1' : '#D4D4D4',
                  transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
