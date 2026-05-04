import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo3DScene } from "@/components/Logo3DScene";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-secondary noise-overlay">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/95 to-secondary/90 z-0" />
      {/* Subtle teal glow */}
      <div className="absolute top-1/4 start-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" aria-hidden />
      {/* 3D Logo background */}
      <Logo3DScene />

      <div className="container-wide relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl text-primary-foreground leading-[1.05] text-balance">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-primary-foreground/80 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-glow hover-lift shadow-elevate font-semibold rounded-xl">
              <Link to="/contact">
                {t.hero.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground backdrop-blur bg-primary-foreground/5 font-semibold rounded-xl"
            >
              <Link to="/services">{t.hero.secondary}</Link>
            </Button>
          </div>
        </div>

        <div
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-primary-foreground/10 rounded-2xl overflow-hidden border border-primary-foreground/10 backdrop-blur-md max-w-4xl"
        >
          {t.hero.stats.map((s) => (
            <div key={s.label} className="bg-secondary/60 p-5 lg:p-7 backdrop-blur-md">
              <p className="font-display text-2xl lg:text-4xl font-bold text-primary-foreground">{s.value}</p>
              <p className="mt-1 text-xs lg:text-sm text-primary-foreground/70 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
