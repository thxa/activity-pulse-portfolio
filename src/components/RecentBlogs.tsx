import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/locales/translations";

const RecentBlogs: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { getRecentPosts, loading } = useBlogPosts();
  const [search, setSearch] = useState("");

  const recentPosts = getRecentPosts(3);

  // Helper: highlight match
  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">{part}</mark> : part
    );
  };

  const filteredPosts = search
    ? recentPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()))
      )
    : recentPosts;

  return (
    <section className="my-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-heading">{t.recentBlogs}</h2>
          <p className="text-muted-foreground">{t.recentBlogsDescription}</p>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {t.viewAllPosts}
          {language === "ar" ? (
            <ArrowLeft size={16} className="ml-1" />
          ) : (
            <ArrowRight size={16} className="ml-1" />
          )}
        </Link>
      </div>
      
      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={language === "ar" ? "ابحث..." : "Search recent posts..."}
        className="w-full mb-8 px-3 py-2 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg border p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-card rounded-lg border p-6 hover:shadow-lg transition-all duration-300 block hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between mb-4">
                <BookOpen size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                {post.date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {highlight(post.title, search)}
              </h3>
              
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {highlight(post.excerpt || "Click to read more about this topic...", search)}
              </p>
              
              <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                {t.readMore}
                {language === "ar" ? (
            <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t.noBlogPosts}</h3>
            <p className="text-muted-foreground">{t.checkBackSoon}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentBlogs; 