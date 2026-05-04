import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-24 bg-secondary relative overflow-hidden noise-overlay">
      <div className="absolute -top-32 start-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 end-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="container-tight relative text-center z-10">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-secondary-foreground text-balance leading-tight">
            {t.cta.title}
          </h2>
          <p className="mt-5 text-lg text-secondary-foreground/80 max-w-2xl mx-auto">{t.cta.sub}</p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-glow hover-lift shadow-elevate font-semibold rounded-xl">
              <Link to="/contact">
                {t.cta.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground bg-secondary-foreground/5 font-semibold rounded-xl">
              <Link to="/contact">{t.cta.secondary}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
