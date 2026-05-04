import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";
import { useParallax } from "@/hooks/useParallax";
import labImg from "@/assets/lab-engineer.jpg";

const ICONS = [Lightbulb, ShieldCheck, Workflow];

export function AboutTeaser() {
  const { t } = useI18n();
  const parallaxY = useParallax(0.08);
  return (
    <section className="py-20 lg:py-28 bg-background overflow-hidden">
      <div className="container-wide grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <Reveal className="lg:col-span-6 order-2 lg:order-1">
          <div className="relative" style={{ transform: `translateY(${parallaxY}px)`, willChange: "transform" }}>
            <img
              src={labImg}
              alt="Medical engineering lab"
              className="rounded-2xl shadow-elevate w-full aspect-[4/5] object-cover border border-border"
              loading="lazy"
            />
            <div className="absolute -bottom-5 -end-5 hidden md:block bg-card border border-border rounded-2xl px-5 py-4 shadow-elevate">
              <p className="text-3xl font-display font-bold text-primary">2018</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Founded</p>
            </div>
            <div className="absolute -top-3 -start-3 w-6 h-6 rounded-full border-2" style={{ borderColor: '#DD9B1F', background: '#DD9B1F20' }} aria-hidden />
          </div>
        </Reveal>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="section-title mt-3">{t.about.title}</h2>
            <p className="section-sub">{t.about.body}</p>
          </Reveal>

          <div className="mt-8 space-y-5">
            {t.about.pillars.map((p, i) => {
              const Icon = ICONS[i] ?? Lightbulb;
              return (
                <Reveal key={p.title} delay={i * 100}>
                  <div className="flex gap-4 items-start group">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-lg" style={{ color: '#3E6A6A' }}>{p.title}</h3>
                      <p className="text-muted-foreground mt-1">{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={300}>
            <Button asChild variant="link" className="mt-6 px-0 text-primary font-semibold">
              <Link to="/about">
                {t.about.cta}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
