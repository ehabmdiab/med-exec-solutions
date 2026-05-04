import { Target, Eye } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function MissionVision() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="container-wide grid md:grid-cols-2 gap-6 lg:gap-8">
        <Reveal>
          <div className="h-full rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 p-8 lg:p-10 shadow-elevate relative overflow-hidden noise-overlay">
            <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-primary/15 blur-2xl" aria-hidden />
            <Target className="h-8 w-8 text-accent relative z-10" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground/50 relative z-10">{t.mv.mission.label}</p>
            <p className="mt-3 font-display text-2xl lg:text-3xl font-bold leading-tight text-secondary-foreground relative z-10">{t.mv.mission.text}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="h-full rounded-2xl bg-card border border-border p-8 lg:p-10 hover-lift gradient-border-hover relative overflow-hidden">
            <Eye className="h-8 w-8 text-primary" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t.mv.vision.label}</p>
            <p className="mt-3 font-display text-2xl lg:text-3xl font-bold leading-tight text-foreground">{t.mv.vision.text}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
