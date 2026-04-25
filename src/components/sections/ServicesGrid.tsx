import { Link } from "react-router-dom";
import { ArrowRight, Factory, FileCheck2, Wind, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

const ICONS = {
  turnkey: Factory,
  regulatory: FileCheck2,
  cleanroom: Wind,
  sterilization: ShieldCheck,
} as const;

export function ServicesGrid() {
  const { t } = useI18n();
  return (
    <section id="services" className="py-20 lg:py-28 bg-surface">
      <div className="container-wide">
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow">{t.services.eyebrow}</span>
            <h2 className="section-title mt-3">{t.services.title}</h2>
            <p className="section-sub">{t.services.sub}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[s.slug as keyof typeof ICONS];
            return (
              <Reveal key={s.slug} delay={i * 80}>
                <Link
                  to="/services"
                  className="group block h-full bg-card rounded-2xl border border-border p-7 hover-lift relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-cta opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display font-bold text-lg text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary group-hover:gap-2.5 transition-all">
                    Learn more <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
