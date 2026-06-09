import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useBlogPosts, type BlogPost } from "@/hooks/useBlogPosts";
import { useSignedImageUrl } from "@/hooks/useSignedImageUrl";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";
import { Calendar, ArrowRight } from "lucide-react";

function BlogCard({ post: p, locale }: { post: BlogPost; locale: string }) {
  const title = locale === "ar" && p.title_ar ? p.title_ar : p.title_en;
  const excerpt = locale === "ar" && p.excerpt_ar ? p.excerpt_ar : p.excerpt_en;
  const date = new Date(p.published_at).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const imgUrl = useSignedImageUrl(p.cover_image_url);
  return (
    <Link
      to={`/blog/${p.slug}`}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover-lift transition-all"
    >
      {imgUrl && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={imgUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
          {p.author && <span>· {p.author}</span>}
        </div>
        <h2 className="font-display font-semibold text-xl text-primary leading-tight mb-2 group-hover:text-primary-glow">
          {title}
        </h2>
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        )}
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
          {locale === "ar" ? "اقرأ المزيد" : "Read more"}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const { locale } = useI18n();
  const { posts, loading } = useBlogPosts();
  useSEO({
    title: "Blog — AUH Medical Engineering Insights",
    description:
      "Insights, case studies, and updates on medical engineering, cleanroom design, regulatory approvals (SFDA, EDA), and ISO compliance.",
    keywords: "medical engineering blog, cleanroom insights, SFDA, EDA, ISO 13485, GMP",
  });

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-soft">
        <div className="container-wide max-w-5xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            {locale === "ar" ? "المدونة" : "Blog"}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-primary leading-[1.1]">
            {locale === "ar"
              ? "رؤى وقصص من عالم الهندسة الطبية"
              : "Insights & stories from medical engineering"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {locale === "ar"
              ? "تحديثات، دراسات حالة، ومعرفة تطبيقية من فريق AUH."
              : "Updates, case studies, and field knowledge from the AUH team."}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wide max-w-5xl">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">
              {locale === "ar" ? "لا توجد مقالات بعد." : "No posts yet."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((p) => (
                <BlogCard key={p.id} post={p} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
