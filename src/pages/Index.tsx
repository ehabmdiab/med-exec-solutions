import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/sections/Hero";
import { LogoLoader } from "@/components/LogoLoader";
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

  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("auh-home-loaded");
  });

  useEffect(() => {
    if (!loading) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <Layout>
      {loading && (
        <LogoLoader
          onComplete={() => {
            sessionStorage.setItem("auh-home-loaded", "1");
            setLoading(false);
          }}
        />
      )}
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
