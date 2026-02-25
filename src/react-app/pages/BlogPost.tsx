import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import { apiGet } from "@/react-app/lib/api";
import { ApiError } from "@/react-app/lib/api";
import type { BlogPost as BlogPostType } from "@/react-app/types";
import Breadcrumbs from "@/react-app/components/Breadcrumbs";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    const fetchPost = async () => {
      try {
        const data = await apiGet<BlogPostType>(`/api/blog/${slug}`);
        setPost(data);
        setNotFound(false);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          setNotFound(true);
          setPost(null);
        } else {
          toast.error(
            language === "az"
              ? "Məqalə yüklənə bilmədi"
              : language === "ru"
                ? "Не удалось загрузить статью"
                : "Failed to load article"
          );
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, language]);

  const title = post
    ? (post[`title_${language}` as keyof BlogPostType] as string)
    : "";
  useMetaTags({
    title: title
      ? `${title} - B2Brand`
      : language === "az"
        ? "Məqalə - B2Brand"
        : language === "ru"
          ? "Статья - B2Brand"
          : "Article - B2Brand",
    description: post
      ? (post[`excerpt_${language}` as keyof BlogPostType] as string)
      : "",
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (notFound || !post) {
    const blogLabel = language === "az" ? "Bloq" : language === "ru" ? "Блог" : "Blog";
    return (
      <div className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">
            {language === "az" && "Məqalə tapılmadı"}
            {language === "ru" && "Статья не найдена"}
            {language === "en" && "Article not found"}
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#FF4D00] hover:text-[#FF6B00] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] rounded px-3 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {blogLabel}
          </Link>
        </div>
      </div>
    );
  }

  const content = post[`content_${language}` as keyof BlogPostType] as string;
  const category = post[`category_${language}` as keyof BlogPostType] as string;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (language === "az") return date.toLocaleDateString("az-AZ", options);
    if (language === "ru") return date.toLocaleDateString("ru-RU", options);
    return date.toLocaleDateString("en-US", options);
  };

  const breadcrumbLabel = {
    az: "Bloq",
    ru: "Блог",
    en: "Blog",
  }[language];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <article className="max-w-4xl mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: breadcrumbLabel, href: "/blog" },
            { label: title },
          ]}
        />
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#FF4D00]/10 text-[#FF4D00] text-xs font-semibold rounded-full mb-4">
            {category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_date)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author_name}
            </span>
          </div>
        </header>
        {post.cover_image && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img
              src={post.cover_image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
        <footer className="mt-12 pt-8 border-t border-white/10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#FF4D00] hover:text-[#FF6B00] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] rounded px-3 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {breadcrumbLabel}
          </Link>
        </footer>
      </article>
    </div>
  );
}
