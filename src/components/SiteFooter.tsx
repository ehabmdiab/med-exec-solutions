import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  const { t } = useI18n();
  const offices = [t.contact.offices.egypt, t.contact.offices.saudi];

  return (
    <footer className="bg-secondary text-secondary-foreground noise-overlay relative">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <div className="space-y-4">
          <Logo inverted />
          <p className="text-sm text-secondary-foreground/60 max-w-xs">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/50 mb-4">
            {t.footer.quickLinks}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/about", label: t.nav.about },
              { to: "/services", label: t.nav.services },
              { to: "/projects", label: t.nav.projects },
              { to: "/contact", label: t.nav.contact },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/50 mb-4">
            {t.footer.offices}
          </h4>
          <div className="grid sm:grid-cols-2 gap-6">
            {offices.map((o) => (
              <div key={o.label} className="space-y-2 text-sm">
                <p className="font-semibold text-secondary-foreground">{o.label}</p>
                <p className="flex items-start gap-2 text-secondary-foreground/65">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {o.address}
                </p>
                <p className="flex items-center gap-2 text-secondary-foreground/65">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="hover:text-primary">{o.phone}</a>
                </p>
                <p className="flex items-center gap-2 text-secondary-foreground/65">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${o.email}`} className="hover:text-primary">{o.email}</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10 relative z-10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} Ask Us How Company. {t.footer.rights}</p>
          <p className="font-medium tracking-wide">{t.brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
