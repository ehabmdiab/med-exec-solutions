CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ar text NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  excerpt_ar text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  content_ar text NOT NULL DEFAULT '',
  cover_image_url text,
  author text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx
ON public.blog_posts (published_at DESC);

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();