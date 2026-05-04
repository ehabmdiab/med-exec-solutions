import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function WhyAUH() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="container-wide relative">
        <div className="max-w-3xl">
          <Reveal>
            <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent-gold mb-6" />
            <span className="eyebrow">{t.why.eyebrow}</span>
            <h2 className="section-title mt-3">{t.why.title}</h2>
            <p className="section-sub italic">{t.why.sub}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5 lg:gap-6">
          {t.why.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="bg-card rounded-2xl border border-border p-7 lg:p-8 h-full hover-lift gradient-border-hover shadow-soft">
                <div className="flex gap-4">
                  <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: '#E8742B15', color: '#E8742B' }}>
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg" style={{ color: '#3E6A6A' }}>{item.title}</h3>
                    <p className="text-muted-foreground mt-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
