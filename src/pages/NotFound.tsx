import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <section className="relative flex min-h-[calc(100vh-200px)] items-center justify-center overflow-hidden px-6 py-24">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/[0.05] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--secondary)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="container-tight relative">
          <div className="mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
              Error 404
            </div>

            {/* Hero numerals */}
            <div className="relative mb-8 flex items-center justify-center">
              <h1
                className="font-display font-extrabold leading-none tracking-tighter bg-clip-text text-transparent"
                style={{
                  fontSize: "clamp(7rem, 22vw, 16rem)",
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 60%, hsl(var(--accent)) 100%)",
                  letterSpacing: "-0.06em",
                }}
              >
                404
              </h1>
            </div>

            {/* Divider */}
            <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Headline */}
            <h2 className="font-display text-3xl font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl">
              This page wandered off
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            {/* Actions */}
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground shadow-soft transition-all hover:shadow-elevate hover:brightness-110 active:scale-[0.98] sm:w-auto"
              >
                <Home className="h-4 w-4" />
                Back to home
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold text-secondary backdrop-blur-sm transition-all hover:bg-card hover:shadow-soft active:scale-[0.98] sm:w-auto"
              >
                Contact support
              </Link>
            </div>

            {/* Quick links */}
            <div className="mt-16">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Or explore
              </p>
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                {[
                  { to: "/about", label: "About" },
                  { to: "/services", label: "Services" },
                  { to: "/projects", label: "Projects" },
                  { to: "/gallery", label: "Gallery" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="font-medium text-secondary/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
