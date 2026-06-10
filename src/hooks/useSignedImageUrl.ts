import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "blog-images";
const EXPIRES_IN = 60 * 60; // 1 hour

function getStoragePath(value: string): string {
  const marker = "/blog-images/";
  const index = value.indexOf(marker);
  if (index !== -1) {
    const after = value.substring(index + marker.length);
    return after.split("?")[0];
  }
  return value;
}

// Accepts either a storage path ("uuid.jpg") or a full http(s) URL.
// Returns a time-limited signed URL for private bucket files.
export function useSignedImageUrl(value: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setUrl(null);
      return;
    }
    // If it's a full URL but not hosted in our bucket, return it directly.
    if (/^https?:\/\//i.test(value) && !value.includes("/blog-images/")) {
      setUrl(value);
      return;
    }

    const path = getStoragePath(value);
    let active = true;

    (async () => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, EXPIRES_IN);
      if (active) setUrl(data?.signedUrl ?? null);
    })();

    return () => {
      active = false;
    };
  }, [value]);

  return url;
}
