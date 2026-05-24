import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";

export function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="py-20 lg:py-24 bg-card relative overflow-hidden">
      <div className="container-tight relative text-center z-10">
        <Reveal>
          <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent-gold mx-auto mb-8" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-balance !leading-[1.15] pb-2 overflow-visible" style={{ color: '#3E6A6A' }}>
            {t.cta.title}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">{t.cta.sub}</p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary-glow hover-lift shadow-glow font-semibold rounded-xl">
              <Link to="/contact">
                {t.cta.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border text-muted-foreground hover:border-primary hover:text-primary bg-transparent font-semibold rounded-xl">
              <Link to="/contact">{t.cta.secondary}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
