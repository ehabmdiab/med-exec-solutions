import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DBProject = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  location_en: string;
  location_ar: string;
  sector_en: string;
  sector_ar: string;
  problem_en: string;
  problem_ar: string;
  solution_en: string;
  solution_ar: string;
  outcome_en: string;
  outcome_ar: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

export type LocalizedProject = {
  id: string;
  slug: string;
  name: string;
  location: string;
  sector: string;
  problem: string;
  solution: string;
  outcome: string;
  image_url: string | null;
};

export function useProjects(locale: "en" | "ar") {
  const [projects, setProjects] = useState<LocalizedProject[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error || !data) {
        setProjects([]);
      } else {
        setProjects(
          data.map((p: DBProject) => ({
            id: p.id,
            slug: p.slug,
            name: locale === "ar" ? p.name_ar || p.name_en : p.name_en,
            location: locale === "ar" ? p.location_ar || p.location_en : p.location_en,
            sector: locale === "ar" ? p.sector_ar || p.sector_en : p.sector_en,
            problem: locale === "ar" ? p.problem_ar || p.problem_en : p.problem_en,
            solution: locale === "ar" ? p.solution_ar || p.solution_en : p.solution_en,
            outcome: locale === "ar" ? p.outcome_ar || p.outcome_en : p.outcome_en,
            image_url: p.image_url,
          }))
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  return { projects, loading };
}
