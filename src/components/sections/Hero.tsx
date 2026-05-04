import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo3DScene } from "@/components/Logo3DScene";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Hard split background */}
      <div className="absolute inset-0 flex" aria-hidden>
        <div className="w-1/2 bg-[#2EC0B1]" />
        <div className="w-1/2 bg-[#3E6A6A]" />
      </div>

      {/* Very subtle noise */}
      <div className="absolute inset-0 noise-overlay z-[1]" />

      {/* 3D Model — centered across the split */}
      <Logo3DScene />

      <div className="container-wide relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl animate-fade-in-up">
          {/* Accent line */}
          <div className="w-12 h-[2px] bg-gradient-to-r from-white/80 to-white/40 mb-6" />
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl !text-white leading-[1.05] text-balance">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-[#3E6A6A] hover:bg-white/90 hover-lift font-semibold rounded-xl shadow-elevate">
              <Link to="/contact">
                {t.hero.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 !text-white hover:border-white/60 hover:bg-white/10 bg-transparent font-semibold rounded-xl"
            >
              <Link to="/services">{t.hero.secondary}</Link>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 rounded-2xl overflow-hidden max-w-4xl">
          {t.hero.stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm p-5 lg:p-7">
              <p className="counter-number text-2xl lg:text-4xl text-white">{s.value}</p>
              <p className="mt-1 text-xs lg:text-sm text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
