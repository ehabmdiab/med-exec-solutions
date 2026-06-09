
DROP POLICY IF EXISTS "Authenticated can read blog images" ON storage.objects;

CREATE POLICY "Anyone can read blog images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'blog-images');
