import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
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
  const items = t.projects.items;

  return (
    <section className="bg-background relative overflow-hidden">
      <div className="container-wide relative z-10 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="w-12 h-[2px] bg-gradient-to-r from-accent to-accent-gold mb-6" />
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title mt-3">{t.projects.title}</h2>
            <p className="section-sub">{t.projects.sub}</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-border text-primary hover:bg-primary hover:text-white rounded-xl shrink-0"
          >
            <Link to="/projects">
              {t.projects.viewAll}
              <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.map((p) => (
            <article
              key={p.slug}
              className="group rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover-lift gradient-border-hover flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={IMAGES[p.slug]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E6A6A]/85 via-[#3E6A6A]/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1">
                    <MapPin className="h-3 w-3" /> {p.location} · {p.sector}
                  </p>
                  <h3 className="font-display font-bold text-xl !text-white">{p.name}</h3>
                </div>
              </div>
              <div className="p-5 lg:p-6 grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#E8742B" }}>
                    {t.projects.table.problem}
                  </p>
                  <p className="mt-1 text-muted-foreground">{p.problem}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {t.projects.table.outcome}
                  </p>
                  <p className="mt-1 font-medium" style={{ color: "#3E6A6A" }}>
                    {p.outcome}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
