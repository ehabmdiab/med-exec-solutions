import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  BadgeCheck,
  Target,
  Cpu,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo3DScene } from "@/components/Logo3DScene";

type Slide = {
  id: string;
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  text: { en: string; ar: string };
  icon: React.ComponentType<{ className?: string }>;
  tabLabel: { en: string; ar: string };
  stats: {
    value: { en: string; ar: string };
    label: { en: string; ar: string };
  }[];
};

const slides: Slide[] = [
  {
    id: "overview",
    title: {
      en: "Turning Medical Ideas Into Reality",
      ar: "نحوّل الأفكار الطبية إلى واقع",
    },
    subtitle: {
      en: "Ask Us How (AUH)",
      ar: "اسألنا كيف (AUH)",
    },
    text: {
      en: "A fast-growing medical engineering firm established in 2018, focused on turning ideas into reality in the medical device industry. We provide end-to-end solutions from concept to compliant operation.",
      ar: "شركة هندسة طبية سريعة النمو تأسست عام 2018، تركز على تحويل الأفكار إلى واقع في قطاع الأجهزة الطبية. نقدم حلولاً متكاملة من الفكرة وحتى التشغيل المتوافق.",
    },
    icon: ShieldCheck,
    tabLabel: { en: "Overview", ar: "نبذة" },
    stats: [
      {
        value: { en: "2018", ar: "٢٠١٨" },
        label: { en: "Founded", ar: "سنة التأسيس" },
      },
      {
        value: { en: "12+", ar: "+١٢" },
        label: { en: "Facilities", ar: "منشأة مُسلّمة" },
      },
      {
        value: { en: "4", ar: "٤" },
        label: { en: "Countries", ar: "دول" },
      },
      {
        value: { en: "100%", ar: "١٠٠٪" },
        label: { en: "Compliance", ar: "سجل امتثال" },
      },
    ],
  },
  {
    id: "mission",
    title: {
      en: "Our Mission & Vision",
      ar: "رسالتنا ورؤيتنا",
    },
    subtitle: {
      en: "Pioneering Medical Engineering",
      ar: "ريادة الهندسة الطبية",
    },
    text: {
      en: "We deliver innovative turnkey solutions that empower clients to build world-class medical products and facilities. Our vision is to become the partner of choice in the MENA region and beyond.",
      ar: "نقدم حلولاً متكاملة مبتكرة تمكن عملائنا من بناء منشآت ومنتجات طبية ذات مستوى عالمي. رؤيتنا هي أن نكون الشريك المفضل في منطقة الشرق الأوسط وشمال أفريقيا وخارجها.",
    },
    icon: Target,
    tabLabel: { en: "Mission & Vision", ar: "الرسالة والرؤية" },
    stats: [
      {
        value: { en: "Precision", ar: "دقة" },
        label: { en: "Core Value", ar: "قيمة أساسية" },
      },
      {
        value: { en: "MENA", ar: "الشرق الأوسط" },
        label: { en: "Vision Focus", ar: "نطاق الرؤية" },
      },
      {
        value: { en: "Partner", ar: "شريك" },
        label: { en: "Of Choice", ar: "مفضل" },
      },
      {
        value: { en: "Quality", ar: "جودة" },
        label: { en: "Standard", ar: "معايير" },
      },
    ],
  },
  {
    id: "turnkey",
    title: {
      en: "Turnkey Project Solutions",
      ar: "حلول مشاريع تسليم المفتاح",
    },
    subtitle: {
      en: "Complete Execution, One Partner",
      ar: "تنفيذ كامل، شريك واحد",
    },
    text: {
      en: "We handle full project execution — from facility design and utilities to equipment sourcing and operational startup — ensuring a seamless, ready-to-run production environment.",
      ar: "نتولى تنفيذ المشروع بالكامل — من تصميم المنشأة والمرافق إلى توريد المعدات والتشغيل الفعلي — مما يضمن بيئة إنتاج سلسة وجاهزة للعمل فوراً.",
    },
    icon: Building2,
    tabLabel: { en: "Turnkey Projects", ar: "مشاريع تسليم المفتاح" },
    stats: [
      {
        value: { en: "5+", ar: "+٥" },
        label: { en: "Facilities Built", ar: "منشآت طبية" },
      },
      {
        value: { en: "Full MEP", ar: "كامل ميكانيكا/كهرباء" },
        label: { en: "In-house design", ar: "تصميم داخلي" },
      },
      {
        value: { en: "Concept", ar: "مفهوم" },
        label: { en: "To Handover", ar: "إلى التسليم" },
      },
      {
        value: { en: "Ready", ar: "جاهز" },
        label: { en: "Operation", ar: "التشغيل" },
      },
    ],
  },
  {
    id: "regulatory",
    title: {
      en: "Regulatory & Compliance Expertise",
      ar: "خبرة الاعتمادات والامتثال",
    },
    subtitle: {
      en: "Navigating Global Standards",
      ar: "التعامل مع المعايير العالمية",
    },
    text: {
      en: "We simplify complex regulatory processes including SFDA registration, ensuring full compliance with international standards such as ISO 13485 and CE marking.",
      ar: "نبسط العمليات التنظيمية المعقدة بما في ذلك التسجيل لدى الهيئة العامة للغذاء والدواء (SFDA)، مع ضمان الامتثال الكامل للمعايير الدولية مثل ISO 13485 وعلامة CE.",
    },
    icon: BadgeCheck,
    tabLabel: { en: "Regulatory & SFDA", ar: "الاعتمادات والتنظيم" },
    stats: [
      {
        value: { en: "5+", ar: "+٥" },
        label: { en: "SFDA Registrations", ar: "تسجيلات SFDA" },
      },
      {
        value: { en: "ISO", ar: "أيزو" },
        label: { en: "13485 Pathway", ar: "مسار 13485" },
      },
      {
        value: { en: "GMP", ar: "التصنيع الجيد" },
        label: { en: "Ready", ar: "جاهزية" },
      },
      {
        value: { en: "100%", ar: "١٠٠٪" },
        label: { en: "Approval Rate", ar: "معدل الموافقة" },
      },
    ],
  },
  {
    id: "engineering",
    title: {
      en: "Advanced Engineering Solutions",
      ar: "حلول هندسية متطورة",
    },
    subtitle: {
      en: "Controlled Environments & Systems",
      ar: "بيئات وأنظمة مُتحكَّم بها",
    },
    text: {
      en: "From clean room design and construction to sterilization systems and process validation, we deliver high-performance environments for medical manufacturing.",
      ar: "من تصميم وإنشاء الغرف النظيفة إلى أنظمة التعقيم والتحقق من العمليات، نقدم بيئات عالية الأداء للتصنيع الطبي.",
    },
    icon: Cpu,
    tabLabel: { en: "Engineering", ar: "الهندسة المتطورة" },
    stats: [
      {
        value: { en: "ISO 7/8", ar: "أيزو ٧/٨" },
        label: { en: "Cleanrooms", ar: "غرف نظيفة" },
      },
      {
        value: { en: "EO/Steam", ar: "أكسيد الإيثيلين/البخار" },
        label: { en: "Sterilization", ar: "التعقيم" },
      },
      {
        value: { en: "GMP", ar: "GMP" },
        label: { en: "Validated", ar: "عمليات مؤهلة" },
      },
      {
        value: { en: "High", ar: "عالية" },
        label: { en: "Performance", ar: "الأداء" },
      },
    ],
  },
  {
    id: "proven",
    title: {
      en: "Proven Projects Across Regions",
      ar: "مشاريع مُثبتة عبر المناطق",
    },
    subtitle: {
      en: "Operational Excellence in EG & KSA",
      ar: "تميز تشغيلي في مصر والسعودية",
    },
    text: {
      en: "We have successfully delivered multiple medical manufacturing facilities across Egypt and Saudi Arabia, helping clients achieve operational excellence and market readiness.",
      ar: "لقد سلمنا بنجاح العديد من منشآت التصنيع الطبي في جميع أنحاء مصر والمملكة العربية السعودية، مما ساعد عملائنا على تحقيق التميز التشغيلي والجاهزية للسوق.",
    },
    icon: Globe,
    tabLabel: { en: "Proven Projects", ar: "مشاريعنا الناجحة" },
    stats: [
      {
        value: { en: "EG", ar: "مصر" },
        label: { en: "HQ Cairo", ar: "المقر بالقاهرة" },
      },
      {
        value: { en: "KSA", ar: "السعودية" },
        label: { en: "Branch Riyadh", ar: "فرع الرياض" },
      },
      {
        value: { en: "12+", ar: "+١٢" },
        label: { en: "Facilities", ar: "منشآت" },
      },
      {
        value: { en: "Active", ar: "نشطة" },
        label: { en: "Operational status", ar: "حالة التشغيل" },
      },
    ],
  },
];

export function Hero() {
  const { t, locale } = useI18n();
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const go = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    timerRef.current = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      6000
    );
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index]);

  return (
    <section className="relative h-auto md:h-[92vh] min-h-[620px] md:min-h-[760px] lg:min-h-[820px] lg:max-h-[920px] flex flex-col justify-between overflow-hidden">
      {/* Base Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(110deg, #02C8B3 0%, #02C8B3 35%, #6FA76A 55%, #D87C23 80%, #D87C23 100%)",
        }}
      />

      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 noise-overlay z-0 pointer-events-none opacity-40" />

      {/* 3D Model Canvas — overlays the background */}
      <Logo3DScene />

      {/* Main Body Content */}
      <div className="container-wide relative z-10 flex-grow flex items-center pt-20 md:pt-24 pb-28 md:pb-20 pointer-events-none">
        <div key={index} className="max-w-3xl animate-fade-in-up w-full">
          {/* Accent line */}
          <div className="w-12 h-[2px] bg-gradient-to-r from-white/80 to-white/40 mb-5 sm:mb-6" />
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {slides[index].subtitle[locale]}
          </span>
          <h1 className="mt-4 sm:mt-6 font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl !text-white !leading-[1.1] text-balance pb-1 overflow-visible">
            {slides[index].title[locale]}
          </h1>
          <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl text-white/75 leading-relaxed">
            {slides[index].text[locale]}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 pointer-events-auto">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#3E6A6A] hover:bg-white/90 hover-lift font-semibold rounded-xl shadow-elevate text-sm sm:text-base"
            >
              <Link to="/contact">
                {t.hero.primary}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 !text-white hover:border-white/60 hover:bg-white/10 bg-transparent font-semibold rounded-xl text-sm sm:text-base"
            >
              <Link to="/services">{t.hero.secondary}</Link>
            </Button>
          </div>

          {/* Dynamic Stats bar */}
          <div className="mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 rounded-2xl overflow-hidden max-w-4xl backdrop-blur-sm pointer-events-auto">
            {slides[index].stats.map((s, sIdx) => (
              <div key={sIdx} className="bg-white/5 p-4 lg:p-5">
                <p className="counter-number text-lg sm:text-xl lg:text-2xl text-white font-bold">{s.value[locale]}</p>
                <p className="mt-1 text-[11px] sm:text-xs text-white/60 font-medium">{s.label[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Control Bar - Docked to bottom */}
      <div className="relative w-full z-20 pointer-events-auto border-t border-white/10 bg-black/35 backdrop-blur-md grid grid-cols-3 md:grid-cols-6">
        {slides.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === index;
          return (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={`relative flex flex-col items-center justify-center py-3.5 sm:py-4 px-2 text-center transition-all duration-300 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {/* Highlight bar on top */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#02C8B3]" />
              )}

              <Icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1.5 sm:mb-2 shrink-0" />
              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider block">
                {s.tabLabel[locale]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
