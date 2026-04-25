import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Activity } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-2 group" aria-label={t.brand.name}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          inverted ? "bg-white/10 text-white" : "bg-gradient-brand text-white"
        } shadow-soft transition-transform group-hover:scale-105`}
      >
        <Activity className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-extrabold text-base tracking-tight ${inverted ? "text-white" : "text-primary"}`}>
          AUH
        </span>
        <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${inverted ? "text-white/70" : "text-muted-foreground"}`}>
          Ask Us How
        </span>
      </span>
    </Link>
  );
}
