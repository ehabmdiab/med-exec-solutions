import { supabase } from "@/integrations/supabase/client";

const BUCKET = "blog-images";

// Accepts either a storage path ("uuid.jpg") or a full http(s) URL (legacy).
// Returns a public URL for public bucket files.
export function useSignedImageUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(value);
  return data?.publicUrl ?? null;
}

