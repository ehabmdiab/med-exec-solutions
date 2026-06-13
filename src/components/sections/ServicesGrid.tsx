import { Link } from "react-router-dom";
import { ArrowRight, Factory, FileCheck2, Wind, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const ICONS = {
  turnkey: Factory,
  regulatory: FileCheck2,
  cleanroom: Wind,
  sterilization: ShieldCheck,
} as const;

const ACCENT_COLORS = ["#2EC0B1", "#368A97", "#DD9B1F", "#E8742B"];

export function ServicesGrid() {
  const { t } = useI18n();
  const items = t.services.items;

  return (
    <section id="services" className="bg-background relative overflow-hidden">
      <div className="container-wide relative z-10 py-20">
        <div className="max-w-3xl mb-12">
          <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent-gold mb-6" />
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title mt-3">{t.services.title}</h2>
          <p className="section-sub">{t.services.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {items.map((s, i) => {
            const Icon = ICONS[s.slug as keyof typeof ICONS];
            const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];

            return (
              <Link
                key={s.slug}
                to={`/services#${s.slug}`}
                className="group relative block bg-card rounded-2xl border border-border p-6 lg:p-7 shadow-soft hover-lift gradient-border-hover overflow-hidden"
              >
                <span
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${accentColor}15`, color: accentColor }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-display font-bold text-lg" style={{ color: "#3E6A6A" }}>
                  {s.title}
                </h3>
                <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
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
