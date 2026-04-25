import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function WhyAUH() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-28 bg-gradient-soft relative overflow-hidden">
      <div className="absolute -top-24 -end-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -start-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" aria-hidden />
      <div className="container-wide relative">
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow">{t.why.eyebrow}</span>
            <h2 className="section-title mt-3">{t.why.title}</h2>
            <p className="section-sub italic">{t.why.sub}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5 lg:gap-6">
          {t.why.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="bg-card rounded-2xl border border-border p-7 lg:p-8 h-full hover-lift">
                <div className="flex gap-4">
                  <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-primary">{item.title}</h3>
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
