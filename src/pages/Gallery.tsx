import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";
import { MeshGradient } from "@paper-design/shaders-react";

import g1 from "@/assets/gallery/g1.webp";
import g2 from "@/assets/gallery/g2.webp";
import g3 from "@/assets/gallery/g3.webp";
import g4 from "@/assets/gallery/g4.webp";
import g5 from "@/assets/gallery/g5.webp";
import poster1 from "@/assets/gallery/clip1-poster.webp";

type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  caption: string;
  // bento span classes
  span: string;
};

const ITEMS_EN: MediaItem[] = [
  { id: "v1", type: "video", src: "/gallery/clip1.mp4", poster: poster1, title: "Cleanroom Walkthrough", caption: "Inside an operational AUH facility", span: "md:col-span-8 md:row-span-2" },
  { id: "g1", type: "image", src: g1, title: "Production Line", caption: "Stainless-steel manufacturing equipment", span: "md:col-span-4 md:row-span-2" },
  { id: "g2", type: "image", src: g2, title: "Automated Packaging", caption: "Integrated medical disposables line", span: "md:col-span-7 md:row-span-2" },
  { id: "g3", type: "image", src: g3, title: "Cleanroom Suite", caption: "ISO-classified controlled environment", span: "md:col-span-5 md:row-span-2" },
  { id: "g4", type: "image", src: g4, title: "Site Inspection", caption: "Final walk-through before handover", span: "md:col-span-5 md:row-span-2" },
  { id: "g5", type: "image", src: g5, title: "Epoxy Floor Finish", caption: "Pharmaceutical-grade hygienic flooring", span: "md:col-span-7 md:row-span-2" },
];

const ITEMS_AR: MediaItem[] = [
  { id: "v1", type: "video", src: "/gallery/clip1.mp4", poster: poster1, title: "جولة داخل الغرفة النظيفة", caption: "داخل إحدى منشآت AUH التشغيلية", span: "md:col-span-8 md:row-span-2" },
  { id: "g1", type: "image", src: g1, title: "خط الإنتاج", caption: "معدات تصنيع من الفولاذ المقاوم للصدأ", span: "md:col-span-4 md:row-span-2" },
  { id: "g2", type: "image", src: g2, title: "التعبئة الآلية", caption: "خط مستلزمات طبية متكامل", span: "md:col-span-7 md:row-span-2" },
  { id: "g3", type: "image", src: g3, title: "جناح الغرفة النظيفة", caption: "بيئة محكومة مطابقة لمعايير ISO", span: "md:col-span-5 md:row-span-2" },
  { id: "g4", type: "image", src: g4, title: "تفتيش الموقع", caption: "الجولة النهائية قبل التسليم", span: "md:col-span-5 md:row-span-2" },
  { id: "g5", type: "image", src: g5, title: "أرضية إيبوكسي", caption: "أرضيات صحية بمواصفات صيدلانية", span: "md:col-span-7 md:row-span-2" },
];

const noContext = (e: React.MouseEvent | React.SyntheticEvent) => {
  e.preventDefault();
  return false;
};

export default function Gallery() {
  const { t, locale } = useI18n();
  const items = locale === "ar" ? ITEMS_AR : ITEMS_EN;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSEO({
    title: `${t.nav.gallery} — AUH`,
    description:
      locale === "ar"
        ? "معرض مرئي يضم منشآت AUH وغرف نظيفة وخطوط تصنيع طبية."
        : "A visual gallery of AUH facilities, cleanrooms, and medical manufacturing lines.",
  });

  // Global protection while on the page
  useEffect(() => {
    const prevent = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "IMG" || t.tagName === "VIDEO" || t.closest("[data-protect]"))) {
        e.preventDefault();
      }
    };
    const preventKeys = (e: KeyboardEvent) => {
      // block common save/print shortcuts on this page
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("keydown", preventKeys);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("keydown", preventKeys);
    };
  }, []);

  // Lightbox keyboard nav
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-black text-white">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
          speed={0.3}
          backgroundColor="#000000"
        />
        <MeshGradient
          className="absolute inset-0 w-full h-full opacity-60"
          colors={["#000000", "#ffffff", "#06b6d4", "#f97316"]}
          speed={0.2}
          wireframe="true"
          backgroundColor="transparent"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container-wide relative max-w-3xl z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
              {t.nav.gallery}
            </div>
            <h1 className="mt-5 font-display font-bold text-4xl lg:text-6xl leading-[1.05] text-balance">
              {locale === "ar" ? "لحظات من داخل منشآتنا" : "Inside the work."}
            </h1>
            <p className="mt-4 text-lg text-white/85 max-w-2xl">
              {locale === "ar"
                ? "صور وفيديوهات حقيقية من خطوط الإنتاج والغرف النظيفة التي قمنا بتصميمها وتسليمها."
                : "Real footage from the cleanrooms, production lines, and facilities we designed and delivered."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-wide">
          <div
            data-protect
            className="grid grid-cols-2 md:grid-cols-12 auto-rows-[110px] md:auto-rows-[140px] gap-3 md:gap-4 select-none"
            style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
          >
            {items.map((item, idx) => (
              <Reveal key={item.id} className={`col-span-2 ${item.span} group relative overflow-hidden rounded-2xl bg-card shadow-soft cursor-zoom-in`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(idx)}
                  onContextMenu={noContext}
                  className="absolute inset-0 w-full h-full text-start"
                  aria-label={item.title}
                >
                  {/* Media */}
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      draggable={false}
                      onContextMenu={noContext}
                      onDragStart={noContext}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 pointer-events-none"
                    />
                  ) : (
                    <>
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        draggable={false}
                        onContextMenu={noContext}
                        onDragStart={noContext}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 pointer-events-none"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-elevate transition-transform duration-500 group-hover:scale-110">
                          <Play className="h-7 w-7 ms-1" fill="currentColor" />
                        </span>
                      </div>
                    </>
                  )}

                  {/* Anti-download transparent overlay (catches right-click on mobile long-press) */}
                  <div className="absolute inset-0 z-10" onContextMenu={noContext} />

                  {/* Gradient + label */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 z-30 p-4 md:p-5 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-accent-cyan">
                      <span className="h-px w-6 bg-accent-cyan" />
                      {item.type === "video" ? (locale === "ar" ? "فيديو" : "Video") : (locale === "ar" ? "صورة" : "Photo")}
                    </div>
                    <h3 className="mt-1 font-display font-bold text-base md:text-lg leading-tight">{item.title}</h3>
                    <p className="hidden md:block mt-1 text-xs text-white/80 line-clamp-1">{item.caption}</p>
                  </div>

                  {/* Corner expand icon */}
                  <span className="absolute top-3 end-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </span>

                  {/* Watermark */}
                  <span className="absolute top-3 start-3 z-30 text-[10px] font-bold tracking-widest text-white/70 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    AUH ©
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setOpenIndex(null)}
          onContextMenu={noContext}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIndex(null); }}
            className="absolute top-5 end-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i === null ? 0 : (i - 1 + items.length) % items.length)); }}
            className="absolute start-3 md:start-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i === null ? 0 : (i + 1) % items.length)); }}
            className="absolute end-3 md:end-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={noContext}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-elevate bg-black">
              {active.type === "image" ? (
                <ProtectedImage src={active.src} alt={active.title} />
              ) : (
                <ProtectedVideo src={active.src} poster={active.poster} />
              )}
              {/* Diagonal watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-white/10 font-display font-extrabold text-5xl md:text-7xl tracking-widest -rotate-12 select-none">
                  AUH
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="font-display font-bold text-lg md:text-xl">{active.title}</h3>
              <p className="text-sm text-white/70">{active.caption}</p>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-white/40">
                {openIndex! + 1} / {items.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function ProtectedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="w-full max-h-[80vh] object-contain select-none pointer-events-none"
      style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    />
  );
}

function ProtectedVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="relative w-full" onContextMenu={(e) => e.preventDefault()}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={false}
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        onClick={toggle}
        className="w-full max-h-[80vh] object-contain bg-black cursor-pointer"
        style={{ WebkitUserSelect: "none", userSelect: "none" }}
      />
      {!playing && (
        <button
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
          aria-label="Play"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-elevate">
            <Play className="h-9 w-9 ms-1" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
