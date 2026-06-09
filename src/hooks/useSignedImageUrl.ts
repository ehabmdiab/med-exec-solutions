import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "blog-images";
const EXPIRES_IN = 60 * 60; // 1 hour

// Accepts either a storage path ("uuid.jpg") or a full http(s) URL (legacy).
// Returns a time-limited signed URL for private bucket files.
export function useSignedImageUrl(value: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setUrl(null);
      return;
    }
    if (/^https?:\/\//i.test(value)) {
      setUrl(value);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(value, EXPIRES_IN);
      if (active) setUrl(data?.signedUrl ?? null);
    })();
    return () => {
      active = false;
    };
  }, [value]);

  return url;
}
