import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
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

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll('.project-card');

      ctx = gsap.context(() => {
        // Each project card appears one by one with alternating slide direction
        cards.forEach((card, i) => {
          const direction = i % 2 === 0 ? -60 : 60;
          gsap.fromTo(card,
            {
              x: direction,
              y: 40,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 50%",
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-surface relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 start-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]" aria-hidden />

      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="w-12 h-[2px] bg-gradient-to-r from-accent to-accent-gold mb-6" />
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title mt-3">{t.projects.title}</h2>
            <p className="section-sub">{t.projects.sub}</p>
          </div>
          <Button asChild variant="outline" className="border-border text-primary hover:bg-primary hover:text-primary-foreground rounded-xl shrink-0">
            <Link to="/projects">
              {t.projects.viewAll}
              <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {t.projects.items.map((p, i) => (
            <article
              key={p.slug}
              className="project-card group rounded-2xl overflow-hidden border border-border bg-card hover-lift gradient-border-hover h-full flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={IMAGES[p.slug]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <MapPin className="h-3 w-3" /> {p.location} · {p.sector}
                  </p>
                  <h3 className="font-display font-bold text-2xl text-foreground">{p.name}</h3>
                </div>
              </div>
              <div className="p-6 lg:p-7 flex-1 grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t.projects.table.problem}</p>
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
      </div>
    </section>
  );
}
