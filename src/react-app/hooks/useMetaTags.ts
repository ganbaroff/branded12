import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function useMetaTags({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage
}: MetaTagsProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
      }
      if (element) {
        element.content = content;
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    if (description) {
      updateMetaTag('description', description);
    }

    if (ogTitle) {
      updateMetaTag('og:title', ogTitle);
      updateMetaTag('twitter:title', ogTitle);
    }

    if (ogDescription) {
      updateMetaTag('og:description', ogDescription);
      updateMetaTag('twitter:description', ogDescription);
    }

    if (ogImage) {
      updateMetaTag('og:image', ogImage);
      updateMetaTag('twitter:image', ogImage);
    }
  }, [title, description, ogTitle, ogDescription, ogImage]);
}
