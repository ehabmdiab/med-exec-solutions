import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { useI18n } from "@/i18n/I18nProvider";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft, Calendar } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useI18n();
  const { post, loading } = useBlogPost(slug);

  const title = post ? (locale === "ar" && post.title_ar ? post.title_ar : post.title_en) : "Blog";
  const excerpt = post
    ? locale === "ar" && post.excerpt_ar
      ? post.excerpt_ar
      : post.excerpt_en
    : "";

  useSEO({
    title: `${title} — AUH Blog`,
    description: excerpt || "AUH medical engineering blog post.",
    ogImage: post?.cover_image_url ?? undefined,
    ogType: "article",
  });

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container-wide">Loading…</div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="pt-32 pb-20 container-wide max-w-2xl">
          <h1 className="font-display font-bold text-2xl text-primary">Post not found</h1>
          <Link to="/blog" className="text-primary underline mt-4 inline-block">
            ← Back to blog
          </Link>
        </section>
      </Layout>
    );
  }

  const content = locale === "ar" && post.content_ar ? post.content_ar : post.content_en;
  const date = new Date(post.published_at).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <Layout>
      <article className="pt-32 pb-20">
        <div className="container-wide max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {locale === "ar" ? "كل المقالات" : "All posts"}
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
            {post.author && <span>· {post.author}</span>}
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl text-primary leading-[1.1] mb-6">
            {title}
          </h1>

          {excerpt && <p className="text-lg text-muted-foreground mb-8">{excerpt}</p>}

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={title}
              className="w-full rounded-2xl mb-10 shadow-soft"
            />
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </div>
      </article>
    </Layout>
  );
}
