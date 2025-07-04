import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import BlogSidebar from "@/components/Blog/BlogSidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/locales/translations";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const BlogPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  const transformWikiLinks = (markdown: string): string => {
    return markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, linkText) => {
      const path = `/blog/${linkText.replace(/\s+/g, "-")}`;
      return `[${linkText}](${path})`;
    });
  };

  useEffect(() => {
    let relativePath = location.pathname.replace("/blog", "");

    if (relativePath === "" || relativePath === "/") {
      relativePath = "/index.md";
    } else {
      relativePath += ".md";
    }

    const mdPath = `/blog${relativePath}`;

      fetch(mdPath)
      .then(async (res) => {
        const text = await res.text()
        if (!res.ok || text.trim().startsWith('<!DOCTYPE html>')) {
          throw new Error('Not Found')
        }
        const transformed = transformWikiLinks(text);
        setContent(transformed)
      })
      .catch(() => setContent('Not Found'))


  }, [location.pathname]);

  // Dynamically load the correct GitHub markdown CSS for light/dark mode
  useEffect(() => {
    let styleTag: HTMLLinkElement | null = null;
    if (theme === 'dark') {
      styleTag = document.createElement('link');
      styleTag.rel = 'stylesheet';
      styleTag.href = '/node_modules/github-markdown-css/github-markdown-dark.css';
      styleTag.id = 'github-markdown-theme';
      document.head.appendChild(styleTag);
    } else {
      styleTag = document.createElement('link');
      styleTag.rel = 'stylesheet';
      styleTag.href = '/node_modules/github-markdown-css/github-markdown-light.css';
      styleTag.id = 'github-markdown-theme';
      document.head.appendChild(styleTag);
    }
    return () => {
      const existing = document.getElementById('github-markdown-theme');
      if (existing) existing.remove();
    };
  }, [theme]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <div className={`fixed top-0 w-80 h-screen bg-card border-r shadow-lg z-30 transition-transform duration-300 ease-in-out ${
        isRTL 
          ? `right-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`
          : `left-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
      }`}>
        <BlogSidebar lang={language} />
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={closeSidebar}
          aria-hidden="true"
          // style={{ zIndex: 1000 }}
        />
      )}
      
      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${
        isRTL ? "rtl lg:mr-80" : "ltr lg:ml-80"
      }`}>
        {/* Mobile Header with Toggle */}
        <div className="lg:hidden sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-semibold">{t.blog}</h1>
            <div className="flex items-center gap-2">
              {/* <LanguageSwitcher />
              <ThemeSwitcher /> */}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="markdown-body">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default BlogPage;
