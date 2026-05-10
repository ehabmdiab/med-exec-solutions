import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/i18n/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <Layout>
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24 lg:py-32">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px]" />
        </div>

        <div className="container-tight text-center">
          {/* Large 404 */}
          <div className="mb-8 inline-block">
            <h1
              className="font-extrabold leading-none tracking-tight"
              style={{
                fontSize: "clamp(6rem, 15vw, 12rem)",
                color: "hsl(180 28% 33%)",
                opacity: 0.12,
                userSelect: "none",
              }}
            >
              404
            </h1>
          </div>

          {/* Content */}
          <div className="relative -mt-20 sm:-mt-24 lg:-mt-28">
            <span className="eyebrow mb-4 justify-center">{t.nav.home}</span>
            <h2
              className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight"
              style={{ color: "hsl(180 28% 33%)" }}
            >
              Page not found
            </h2>
            <p className="section-sub mx-auto mt-5 max-w-lg">
              Sorry, we couldn’t find the page you were looking for. It might
              have been moved, renamed, or never existed.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elevate hover:brightness-105 active:scale-[0.98]"
              >
                Return Home
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-3 text-sm font-semibold text-secondary-foreground shadow-soft transition-all hover:bg-surface hover:shadow-elevate active:scale-[0.98]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
