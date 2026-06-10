-- Create blog-images bucket if it doesn't exist and make it private
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', false)
ON CONFLICT (id) DO UPDATE SET public = false;
