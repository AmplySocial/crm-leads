import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { DEFAULT_CONTENT, LOGO_URL } from "@/lib/siteConfig";

let cache = null;

export function useSiteContent() {
  const [content, setContent] = useState(cache || DEFAULT_CONTENT);
  const [loading, setLoading] = useState(!cache);

  const load = useCallback(async () => {
    try {
      const items = await base44.entities.SiteContent.list("-updated_date", 1);
      if (items && items.length > 0) {
        const merged = { ...DEFAULT_CONTENT, ...items[0] };
        if (!merged.logo_url) merged.logo_url = LOGO_URL;
        cache = merged;
        setContent(merged);
      } else {
        cache = { ...DEFAULT_CONTENT, logo_url: LOGO_URL };
        setContent(cache);
      }
    } catch (e) {
      const fallback = { ...DEFAULT_CONTENT, logo_url: LOGO_URL };
      cache = fallback;
      setContent(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cache) load();
  }, [load]);

  return { content, loading, reload: load };
}
