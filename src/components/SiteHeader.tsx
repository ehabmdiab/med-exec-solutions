import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  const { t, locale, toggle } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/projects", label: t.nav.projects },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "glass border-b border-border/40 shadow-elevate"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-6 lg:h-20">
        <Logo inverted={!scrolled} />

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  scrolled
                    ? isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                    : isActive ? "text-white" : "text-white/80 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
              scrolled ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"
            }`}
            aria-label={`Switch language to ${locale === "en" ? "Arabic" : "English"}`}
          >
            <Languages className="h-4 w-4" />
            {locale === "en" ? "العربية" : "EN"}
          </button>

          <Button asChild className="hidden sm:inline-flex bg-primary hover:bg-primary-glow text-white shadow-soft hover-lift rounded-xl">
            <Link to="/contact">{t.nav.cta}</Link>
          </Button>

          <button
            className={`lg:hidden p-2 ${scrolled ? "text-muted-foreground" : "text-white"}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="container-wide flex flex-col py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `py-3 text-base font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={toggle}
              className="py-3 text-start text-base font-medium text-muted-foreground inline-flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              {locale === "en" ? "العربية" : "English"}
            </button>
            <Button asChild className="mt-3 bg-primary text-white rounded-xl">
              <Link to="/contact">{t.nav.cta}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
