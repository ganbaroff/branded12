import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { useScrollReveal } from "@/react-app/hooks/useScrollReveal";
import { Calendar, User, ArrowRight, FileText, Home } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import Breadcrumbs from "@/react-app/components/Breadcrumbs";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import { defaultBlogForFallback } from "@/react-app/data/defaultContent";
import type { BlogPost } from "@/react-app/types";

export default function BlogPage() {
  const { language } = useLanguage();
  const headerReveal = useScrollReveal({ initialVisible: true });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useMetaTags({
    title: language === 'az' 
      ? 'Bloq - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Блог - B2Brand Creative Agency'
      : 'Blog - B2Brand Creative Agency',
    description: language === 'az'
      ? 'Marketinq, SMM, brendinq və rəqəmsal strategiya haqqında faydalı məqalələr.'
      : language === 'ru'
      ? 'Полезные статьи о маркетинге, SMM, брендинге и цифровой стратегии.'
      : 'Useful articles about marketing, SMM, branding and digital strategy.'
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog");
        if (response.ok) {
          const data = await response.json();
          setPosts(Array.isArray(data) && data.length > 0 ? data : defaultBlogForFallback);
        } else {
          setPosts(defaultBlogForFallback);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts(defaultBlogForFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = Array.from(
    new Set(posts.map((post) => post[`category_${language}` as keyof BlogPost] as string))
  ).filter(Boolean);

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post[`category_${language}` as keyof BlogPost] === selectedCategory);

  const breadcrumbLabel = {
    az: 'Bloq',
    ru: 'Блог',
    en: 'Blog'
  }[language];

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Header */}
      <section
        className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]"
        ref={headerReveal.ref}
      >
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            headerReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {language === "az" && "Bloq"}
              {language === "ru" && "Блог"}
              {language === "en" && "Blog"}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {language === "az" &&
                "Marketinq, dizayn və brendinq haqqında faydalı məqalələr"}
              {language === "ru" &&
                "Полезные статьи о маркетинге, дизайне и брендинге"}
              {language === "en" &&
                "Helpful articles about marketing, design and branding"}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sticky top-20 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#FF4D00] text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {language === "az" && "Hamısı"}
              {language === "ru" && "Все"}
              {language === "en" && "All"}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-[#FF4D00] text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingSpinner fullScreen={false} />
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-white/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === "az" && "Məqalə tapılmadı"}
                  {language === "ru" && "Статьи не найдены"}
                  {language === "en" && "No articles found"}
                </h3>
                <p className="text-white/60 mb-8">
                  {language === "az" && "Bu kateqoriyada hələ məqalə yoxdur və ya tezliklə yenilənəcək. Əsas səhifəyə keçin və ya bizimlə əlaqə saxlayın."}
                  {language === "ru" && "В этой категории пока нет статей или они скоро появятся. Перейдите на главную или свяжитесь с нами."}
                  {language === "en" && "No articles in this category yet, or they're coming soon. Go to home or get in touch."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/">
                    <Button className="bg-[#FF4D00] hover:bg-[#FF6B00] text-white gap-2">
                      <Home className="w-4 h-4" />
                      {language === "az" && "Əsas səhifə"}
                      {language === "ru" && "На главную"}
                      {language === "en" && "Go to home"}
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                      <ArrowRight className="w-4 h-4" />
                      {language === "az" && "Əlaqə"}
                      {language === "ru" && "Контакты"}
                      {language === "en" && "Contact us"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} language={language} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogPostCard({
  post,
  language,
}: {
  post: BlogPost;
  language: "az" | "ru" | "en";
}) {
  const { ref, isVisible } = useScrollReveal();

  const title = post[`title_${language}` as keyof BlogPost] as string;
  const excerpt = post[`excerpt_${language}` as keyof BlogPost] as string;
  const category = post[`category_${language}` as keyof BlogPost] as string;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (language === "az") {
      return date.toLocaleDateString("az-AZ", options);
    } else if (language === "ru") {
      return date.toLocaleDateString("ru-RU", options);
    } else {
      return date.toLocaleDateString("en-US", options);
    }
  };

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <article className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 hover:border-[#FF4D00]/50 transition-all hover:shadow-lg hover:shadow-[#FF4D00]/10 focus-within:ring-2 focus-within:ring-[#FF4D00] focus-within:ring-offset-2 focus-within:ring-offset-[#0F0F0F]">
          {/* Cover Image */}
          <div className="aspect-video overflow-hidden">
            <img
              src={post.cover_image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-[#FF4D00]/10 text-[#FF4D00] text-xs font-semibold rounded-full mb-3">
              {category}
            </span>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#FF4D00] transition-colors">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{excerpt}</p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.published_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{post.author_name}</span>
              </div>
            </div>

            {/* Read More */}
            <span className="flex items-center w-full text-white group-hover:text-[#FF4D00] group-hover:translate-x-1 transition-all font-medium">
              {language === "az" && "Oxu"}
              {language === "ru" && "Читать"}
              {language === "en" && "Read more"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
