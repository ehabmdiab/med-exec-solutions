import { Target, Eye } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function MissionVision() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide grid md:grid-cols-2 gap-6 lg:gap-8">
        <Reveal>
          <div className="h-full rounded-2xl bg-gradient-cta text-primary-foreground p-8 lg:p-10 shadow-elevate relative overflow-hidden">
            <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <Target className="h-8 w-8 text-accent" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{t.mv.mission.label}</p>
            <p className="mt-3 font-display text-2xl lg:text-3xl font-bold leading-tight text-white">{t.mv.mission.text}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="h-full rounded-2xl bg-card border border-border p-8 lg:p-10 hover-lift relative overflow-hidden">
            <Eye className="h-8 w-8 text-secondary" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{t.mv.vision.label}</p>
            <p className="mt-3 font-display text-2xl lg:text-3xl font-bold leading-tight text-primary">{t.mv.vision.text}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
