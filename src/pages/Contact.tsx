import { Mail, MapPin, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";

export default function Contact() {
  const { t } = useI18n();
  useSEO({
    title: `${t.nav.contact} — AUH`,
    description: t.contact.sub,
  });

  const offices = [t.contact.offices.egypt, t.contact.offices.saudi];

  return (
    <Layout>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-soft">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <h1 className="section-title mt-3 text-balance">{t.contact.title}</h1>
            <p className="section-sub text-lg">{t.contact.sub}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5 space-y-6">
            {offices.map((o) => (
              <div key={o.label} className="bg-card border border-border rounded-2xl p-7 hover-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{o.label}</p>
                <h3 className="mt-2 font-display font-bold text-xl text-primary">{o.address.split(",")[0]}</h3>
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                    {o.address}
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-secondary shrink-0" />
                    <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-secondary transition-colors">
                      {o.phone}
                    </a>
                  </li>
                  {o.emails.map((email) => (
                    <li key={email} className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-secondary shrink-0" />
                      <a href={`mailto:${email}`} className="text-foreground hover:text-secondary transition-colors">
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <div className="bg-card border border-border rounded-2xl p-7 lg:p-10 shadow-soft">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
