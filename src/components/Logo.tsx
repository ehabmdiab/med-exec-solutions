import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import logoImg from "@/assets/auh-logo.png";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-2 group" aria-label={t.brand.name}>
      <img
        src={logoImg}
        alt="AUH Logo"
        className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
      />
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
