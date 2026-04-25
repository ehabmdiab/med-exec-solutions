import { Layout } from "@/components/Layout";
import { Hero } from "@/components/sections/Hero";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { WhyAUH } from "@/components/sections/WhyAUH";
import { MissionVision } from "@/components/sections/MissionVision";
import { CtaBand } from "@/components/sections/CtaBand";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";

export default function Index() {
  const { t } = useI18n();
  useSEO({ title: t.meta.title, description: t.meta.description });
  return (
    <Layout>
      <h1 className="sr-only">{t.hero.title}</h1>
      <Hero />
      <AboutTeaser />
      <ServicesGrid />
      <ProjectsShowcase />
      <WhyAUH />
      <MissionVision />
      <CtaBand />
    </Layout>
  );
}
