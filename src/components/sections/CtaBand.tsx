import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand opacity-90" aria-hidden />
      <div className="absolute -top-32 start-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 end-1/4 w-96 h-96 rounded-full bg-secondary/30 blur-3xl" aria-hidden />
      <div className="container-tight relative text-center">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white text-balance leading-tight">
            {t.cta.title}
          </h2>
          <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto">{t.cta.sub}</p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95 hover-lift shadow-elevate font-semibold">
              <Link to="/contact">
                {t.cta.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white bg-white/5 font-semibold">
              <Link to="/contact">{t.cta.secondary}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
