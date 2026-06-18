import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  canonical?: string;
  lang?: 'en' | 'fr';
  jsonLd?: Record<string, unknown>;
}

/** Helper: update or create a <meta> tag */
function setMeta(nameAttr: string, nameValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${nameAttr}="${nameValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(nameAttr, nameValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Helper: update or create a <link> tag */
function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * useSEO — dynamically injects per-page SEO metadata.
 * Covers: title, description, keywords, Open Graph, Twitter Card,
 * canonical link, hreflang lang attribute, and JSON-LD structured data.
 */
export function useSEO({
  title,
  description,
  keywords = [],
  ogImage,
  ogUrl,
  ogType = 'website',
  canonical,
  lang = 'fr',
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;

    // 1. Document title & lang
    document.title = title;
    document.documentElement.lang = lang;

    // 2. Standard meta
    setMeta('name', 'description', description);
    if (keywords.length > 0) {
      setMeta('name', 'keywords', keywords.join(', '));
    }

    // 3. Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:locale', lang === 'fr' ? 'fr_FR' : 'en_GB');
    if (ogImage) setMeta('property', 'og:image', ogImage);
    if (ogUrl)   setMeta('property', 'og:url', ogUrl);

    // 4. Twitter Card
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (ogImage) setMeta('name', 'twitter:image', ogImage);

    // 5. Canonical URL
    if (canonical ?? ogUrl) {
      setLink('canonical', (canonical ?? ogUrl)!);
    }

    // 6. JSON-LD Structured Data — append fresh, remove on cleanup
    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-hook', 'true');
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [title, description, keywords, ogImage, ogUrl, ogType, canonical, lang, jsonLd]);
}
