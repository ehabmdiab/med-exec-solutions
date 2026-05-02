import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { MetaballHero } from "@/components/MetaballHero";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      {/* Parallax background image */}
      <div className="absolute inset-0" style={{ transform: `translateY(${parallaxY}px)`, willChange: "transform" }}>
        <img
          src={heroImg}
          alt="Engineers in a cleanroom medical manufacturing facility"
          className="h-[120%] w-full object-cover"
          loading="eager"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

      {/* Three.js particle + ring overlay */}
      <HeroScene />

      <div className="container-wide relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.05] text-balance">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95 hover-lift shadow-elevate font-semibold">
              <Link to="/contact">
                {t.hero.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white backdrop-blur bg-white/5 font-semibold"
            >
              <Link to="/services">{t.hero.secondary}</Link>
            </Button>
          </div>
        </div>

        <div
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/15 rounded-2xl overflow-hidden border border-white/15 backdrop-blur-md max-w-4xl"
          style={{ transform: `translateY(${-parallaxY * 0.3}px)`, willChange: "transform" }}
        >
          {t.hero.stats.map((s) => (
            <div key={s.label} className="bg-primary/30 p-5 lg:p-7 backdrop-blur-md">
              <p className="font-display text-2xl lg:text-4xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs lg:text-sm text-white/75 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
