import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";
import { useRef, useEffect } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    
    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      if (!sectionRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const cards = track.querySelectorAll('.project-card');
      const scrollWidth = track.scrollWidth - track.offsetWidth;

      ctx = gsap.context(() => {
        // Pin section and scroll horizontally
        gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Animate each card
        cards.forEach((card) => {
          gsap.fromTo(card, 
            { scale: 0.92, opacity: 0.5 },
            {
              scale: 1,
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: gsap.getById?.("horizontal") || undefined,
                start: "left 80%",
                end: "left 40%",
                scrub: true,
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
    <section ref={sectionRef} className="bg-background overflow-hidden">
      <div className="container-wide pt-20 lg:pt-28 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">{t.projects.eyebrow}</span>
              <h2 className="section-title mt-3">{t.projects.title}</h2>
              <p className="section-sub">{t.projects.sub}</p>
            </Reveal>
          </div>
          <Reveal>
            <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl">
              <Link to="/projects">
                {t.projects.viewAll}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div ref={trackRef} className="flex gap-6 lg:gap-8 px-6 pb-20" style={{ width: 'max-content' }}>
        {t.projects.items.map((p) => (
          <article
            key={p.slug}
            className="project-card group rounded-2xl overflow-hidden border border-border bg-card hover-lift gradient-border-hover flex flex-col"
            style={{ width: '400px', minWidth: '340px' }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={IMAGES[p.slug]}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary-foreground/80 mb-1.5">
                  <MapPin className="h-3 w-3" /> {p.location} · {p.sector}
                </p>
                <h3 className="font-display font-bold text-2xl text-secondary-foreground">{p.name}</h3>
              </div>
            </div>
            <div className="p-6 lg:p-7 flex-1 grid gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.projects.table.problem}</p>
                <p className="mt-1 text-muted-foreground">{p.problem}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.projects.table.outcome}</p>
                <p className="mt-1 text-foreground font-medium">{p.outcome}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
