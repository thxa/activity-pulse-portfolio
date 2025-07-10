import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBlogPosts, BlogNode } from "@/hooks/useBlogPosts";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/locales/translations";
import { Home, ChevronDown, ChevronRight, FileText, ArrowRight, ArrowLeft, ChevronLeft } from "lucide-react";

const BlogSidebar: React.FC<{ lang: "en" | "ar" }> = ({ lang }) => {
  const { posts, loading } = useBlogPosts();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const direction = lang === "ar" ? "rtl" : "ltr";
  const isRTL = lang === "ar";

  // Track expanded directories by slug
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // Search state
  const [search, setSearch] = useState("");

  const toggleExpand = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Helper: highlight match
  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">{part}</mark> : part
    );
  };

  // Filter tree recursively
  const filterTree = (nodes: BlogNode[]): BlogNode[] => {
    if (!search) return nodes;
    const q = search.trim().toLowerCase();
    return nodes
      .map((node) => {
        if (node.children) {
          const filteredChildren = filterTree(node.children);
          if (
            node.title.toLowerCase().includes(q) ||
            filteredChildren.length > 0
          ) {
            return { ...node, children: filteredChildren };
          }
          return null;
        } else {
          return node.title.toLowerCase().includes(q) ? node : null;
        }
      })
      .filter(Boolean) as BlogNode[];
  };

  // Recursive render function
  const renderTree = (nodes: BlogNode[], level = 0) => {
    return nodes.map((node) => {
      // For file nodes, match the full path (including subpages)
      const isActive = location.pathname === `/blog/${node.slug}` ||
        (node.slug === '' && location.pathname === '/blog');
      const isDir = !!node.children && node.children.length > 0;
      const isExpanded = expanded[node.slug] || !!search;
      return (
        <div key={node.slug} style={{ marginLeft: level * 16 }}>
          {isDir ? (
            <div>
              <button
                className={`flex items-center w-full p-2 rounded-lg transition-all duration-200 font-medium text-left ${
                  isExpanded ? "bg-muted/30" : "hover:bg-muted/20"
                }`}
                onClick={() => toggleExpand(node.slug)}
                aria-expanded={isExpanded}
              >
                { isRTL ? 
                   (<><span className="ml-2">{highlight(node.title, search)}</span>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}</>)
                  :
                  (<>{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="ml-2">{highlight(node.title, search)}</span></>)  
                }
              </button>

                {isExpanded && (
                  isRTL ? (
                    <div className="mr-4 border-r border-muted/30 pr-2">
                      {renderTree(node.children!, level + 1)}
                    </div>
                  ) : (
                    <div className="ml-4 border-l border-muted/30 pl-2">
                      {renderTree(node.children!, level + 1)}
                    </div>
                  )
                )}
            </div>
          ) : (
            <Link
              to={`/blog/${node.slug}`}
              className={`flex items-center p-2 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted/50 text-foreground hover:shadow-sm"
              }`}
            >
              <FileText size={16} className="mr-2" />
              <span>{highlight(node.title, search)}</span> 
              {isActive && (
                <span className="ml-2 w-2 h-2 bg-primary-foreground rounded-full"></span>
              )}
              
            </Link>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <aside className="w-full h-full overflow-y-auto" dir={direction}>
        <div className="p-6 border-b bg-muted/30">
          <h2 className="text-xl font-bold mb-4">{t.blog || "Blog"}</h2>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
              aria-label={lang === "ar" ? "الرئيسية" : "Home"}
            >
              <Home size={18} className="mr-2" />
            </Link>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full h-full overflow-y-auto" dir={direction}>
      <div className="p-6 border-b bg-muted/30">
        <h2 className="text-xl font-bold mb-4">{t.blog || "Blog"}</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === "ar" ? "ابحث..." : "Search..."}
          className="w-full mb-4 px-3 py-2 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-sm text-muted-foreground mb-4">
          {lang === "ar" ? "تصفح المقالات" : "Browse articles"}
        </p>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
            aria-label={lang === "ar" ? "الرئيسية" : "Home"}
          >
              <Home size={16}/>
          </Link>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
      <nav className="p-4">
        <div className="space-y-2">
          {/* Blog Tree */}
          {renderTree(filterTree(posts))}
        </div>
      </nav>
    </aside>
  );
};

export default BlogSidebar;
