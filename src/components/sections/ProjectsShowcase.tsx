import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";
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
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">{t.projects.eyebrow}</span>
              <h2 className="section-title mt-3">{t.projects.title}</h2>
              <p className="section-sub">{t.projects.sub}</p>
            </Reveal>
          </div>
          <Reveal>
            <Button asChild variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/projects">
                {t.projects.viewAll}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {t.projects.items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <article className="group rounded-2xl overflow-hidden border border-border bg-card hover-lift h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={IMAGES[p.slug]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1.5">
                      <MapPin className="h-3 w-3" /> {p.location} · {p.sector}
                    </p>
                    <h3 className="font-display font-bold text-2xl text-white">{p.name}</h3>
                  </div>
                </div>
                <div className="p-6 lg:p-7 flex-1 grid gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{t.projects.table.problem}</p>
                    <p className="mt-1 text-muted-foreground">{p.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{t.projects.table.outcome}</p>
                    <p className="mt-1 text-foreground font-medium">{p.outcome}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
