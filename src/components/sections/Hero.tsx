import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo3DScene } from "@/components/Logo3DScene";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background noise-overlay">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 start-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[150px]" aria-hidden />
      <div className="absolute bottom-0 end-1/4 w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[120px]" aria-hidden />
      <Logo3DScene />

      <div className="container-wide relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl animate-fade-in-up">
          {/* Accent line above eyebrow */}
          <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent mb-6" />
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl text-foreground leading-[1.05] text-balance">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-glow hover-lift font-semibold rounded-xl shadow-glow">
              <Link to="/contact">
                {t.hero.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:border-primary hover:text-primary bg-transparent font-semibold rounded-xl"
            >
              <Link to="/services">{t.hero.secondary}</Link>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border rounded-2xl overflow-hidden max-w-4xl">
          {t.hero.stats.map((s, i) => (
            <div key={s.label} className="bg-card p-5 lg:p-7">
              <p className="counter-number text-2xl lg:text-4xl text-primary">{s.value}</p>
              <p className="mt-1 text-xs lg:text-sm text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
