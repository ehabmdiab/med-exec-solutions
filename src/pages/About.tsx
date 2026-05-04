import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { MissionVision } from "@/components/sections/MissionVision";
import { CtaBand } from "@/components/sections/CtaBand";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";
import labImg from "@/assets/lab-engineer.jpg";

export default function About() {
  const { t } = useI18n();
  useSEO({
    title: `${t.nav.about} — AUH`,
    description: t.about.body,
  });

  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-soft overflow-hidden">
        <div className="container-wide grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">{t.about_page.eyebrow}</span>
              <h1 className="section-title mt-3 text-balance">{t.about_page.title}</h1>
              <p className="section-sub text-lg">{t.about_page.intro}</p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5" delay={120}>
            <img
              src={labImg}
              alt="Engineering team in a medical facility"
              className="rounded-2xl shadow-elevate w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-background">
        <div className="container-wide grid md:grid-cols-3 gap-8">
          {t.about_page.sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="bg-card rounded-2xl border border-border p-7 h-full hover-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">0{i + 1}</p>
                <h2 className="mt-3 font-display font-bold text-xl text-primary">{s.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-surface">
        <div className="container-wide">
          <Reveal>
            <h2 className="section-title">Milestones</h2>
            <p className="section-sub">A short history of AUH.</p>
          </Reveal>
          <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about_page.timeline.map((m, i) => (
              <Reveal key={m.year} delay={i * 80}>
                <li className="relative bg-card border border-border rounded-2xl p-6 h-full">
                  <span className="absolute -top-3 start-6 inline-flex items-center justify-center px-3 py-1 rounded-full bg-gradient-cta text-white text-xs font-bold tracking-wider shadow-soft">
                    {m.year}
                  </span>
                  <p className="mt-4 text-foreground font-medium leading-relaxed">{m.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <MissionVision />
      <CtaBand />
    </Layout>
  );
}
