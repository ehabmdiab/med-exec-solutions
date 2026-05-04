import { MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";
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

export default function Projects() {
  const { t } = useI18n();
  useSEO({
    title: `${t.nav.projects} — AUH`,
    description: t.projects.sub,
  });

  return (
    <Layout>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-soft">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h1 className="section-title mt-3 text-balance">{t.projects.title}</h1>
            <p className="section-sub text-lg">{t.projects.sub}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-background">
        <div className="container-wide space-y-12 lg:space-y-16">
          {t.projects.items.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <Reveal key={p.slug}>
                <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-card rounded-3xl border border-border p-6 lg:p-10 hover-lift">
                  <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
                    <div className="relative rounded-2xl overflow-hidden shadow-elevate">
                      <img
                        src={IMAGES[p.slug]}
                        alt={p.name}
                        className="w-full aspect-[4/3] object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                      <div className="absolute top-4 start-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-primary">
                        <MapPin className="h-3 w-3" /> {p.location}
                      </div>
                    </div>
                  </div>
                  <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{p.sector}</p>
                    <h2 className="mt-2 font-display font-bold text-3xl lg:text-4xl text-primary leading-tight">{p.name}</h2>
                    <dl className="mt-6 space-y-5">
                      {[
                        { k: t.projects.table.problem, v: p.problem },
                        { k: t.projects.table.solution, v: p.solution },
                        { k: t.projects.table.outcome, v: p.outcome, accent: true },
                      ].map((row) => (
                        <div key={row.k} className="border-s-2 border-secondary/40 ps-5">
                          <dt className="text-xs font-semibold uppercase tracking-wider text-secondary">{row.k}</dt>
                          <dd className={`mt-1.5 leading-relaxed ${row.accent ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                            {row.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </Layout>
  );
}
