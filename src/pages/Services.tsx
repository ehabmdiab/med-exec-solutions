import { Factory, FileCheck2, Wind, ShieldCheck, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";
import cleanroomImg from "@/assets/cleanroom-suit.jpg";
import mfgImg from "@/assets/medical-manufacturing.jpg";
import sterImg from "@/assets/sterilization.jpg";
import regImg from "@/assets/regulatory.jpg";

const ICONS = {
  turnkey: Factory,
  regulatory: FileCheck2,
  cleanroom: Wind,
  sterilization: ShieldCheck,
} as const;

const IMAGES: Record<string, string> = {
  turnkey: mfgImg,
  regulatory: regImg,
  cleanroom: cleanroomImg,
  sterilization: sterImg,
};

const DELIVERABLES: Record<string, string[]> = {
  turnkey: ["Concept & feasibility", "Architectural & MEP design", "Construction & fit-out", "Equipment integration", "Validation & handover"],
  regulatory: ["Technical file & dossier", "GMP gap assessment", "SFDA / EDA submission", "ISO 13485 readiness", "Audit preparation"],
  cleanroom: ["ISO 14644 classification", "HVAC & pressure cascade", "Wall, floor, ceiling systems", "Particle & EM monitoring", "Validation protocols (IQ/OQ/PQ)"],
  sterilization: ["EO / Gamma / Steam", "Process validation", "Qualification protocols", "Routine release", "Compliance documentation"],
};

export default function Services() {
  const { t } = useI18n();
  useSEO({
    title: `${t.nav.services} — AUH`,
    description: t.services.sub,
  });

  return (
    <Layout>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-soft">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <span className="eyebrow">{t.services.eyebrow}</span>
            <h1 className="section-title mt-3 text-balance">{t.services.title}</h1>
            <p className="section-sub text-lg">{t.services.sub}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background">
        {t.services.items.map((s, i) => {
          const Icon = ICONS[s.slug as keyof typeof ICONS];
          const reverse = i % 2 === 1;
          return (
            <div
              key={s.slug}
              id={s.slug}
              className={`py-16 lg:py-24 ${i % 2 === 1 ? "bg-surface" : "bg-background"}`}
            >
              <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <Reveal className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-elevate">
                    <img
                      src={IMAGES[s.slug]}
                      alt={s.title}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
                  </div>
                </Reveal>

                <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 text-secondary">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">0{i + 1} · Service</span>
                    </span>
                    <h2 className="mt-4 font-display font-bold text-3xl lg:text-4xl text-primary !leading-[1.4] pb-2 overflow-visible">
                      {s.title}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{s.long}</p>
                    <ul className="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {DELIVERABLES[s.slug].map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                          <span className="text-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <CtaBand />
    </Layout>
  );
}
