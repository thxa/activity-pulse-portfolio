import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { useLocation, useNavigate } from "react-router-dom";
import BlogSidebar from "@/components/Blog/BlogSidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/locales/translations";
import { Menu, X, ArrowUp, Download } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism, okaidia, coy, solarizedlight, tomorrow, ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AsciinemaPlayer from "@/components/AsciinemaPlayer";
import qs from "query-string";


const BlogPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback((code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  const transformWikiLinks = (markdown: string): string => {
    return markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, linkText) => {
      const path = `/blog/${linkText.replace(/\s+/g, "-")}`;
      return `[${linkText}](${path})`;
    });
  };

  // Transform \begin{myanalysis}...\end{myanalysis} to <MyAnalysis>...</MyAnalysis>
  function transformMyAnalysis(md: string) {
    // Replace \texttt{...} with `...`
    let result = md.replace(/\\texttt\{([^}]+)\}/g, (_, code) => `\`${code}\``);
    // Replace \begin{myanalysis}...\end{myanalysis} with blockquote
    result = result.replace(
      /\\begin{myanalysis}([\s\S]*?)\\end{myanalysis}/g,
      (_, content) => {
        const lines = content.trim().split(/\r?\n/).map(line => line.trim());
        return [
          '> **💡Analysis**\n >',
          ...lines.map(line => `> ${line}`)
        ].join('\n');
      }
    );
    return result;
  }

  // Extract headings from markdown for TOC
  function extractHeadings(markdown: string) {
    const headingRegex = /^(#{1,4})\s+(.*)$/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().trim().replace(/[^\w]+/g, '-')
      });
    }
    return headings;
  }

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

  // Change this variable to use a different Prism style
  const codeStyle = vscDarkPlus;
  const transformedContent = transformMyAnalysis(content);
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
        />
      )}
      
      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${
        isRTL ? "rtl lg:mr-80" : "ltr lg:ml-80"
      }`}>
        {/* Mobile Header with Toggle */}
        <div className="lg:hidden sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            {/* Table of Contents */}
            {(() => {
              const headings = extractHeadings(content);
              return headings.length > 0 && (
                <nav id="toc-nav" className="mb-8 p-4 bg-muted/30 rounded">
                  <h2 className="font-bold mb-2">Table of Contents</h2>
                  <ul>
                    {headings.map(h => (
                      <li key={h.id} style={{ marginLeft: (h.level - 1) * 16 }}>
                        <a href={`#${h.id}`} className="hover:underline">{h.text}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            })()}
            <div className="markdown-body">
              <ReactMarkdown 
                children={transformedContent} 
                remarkPlugins={[remarkGfm]}  
                components={{
                  h1: ({node, ...props}) => <h1 id={String(props.children).toLowerCase().replace(/[^\w]+/g, '-')} {...props} />,
                  h2: ({node, ...props}) => <h2 id={String(props.children).toLowerCase().replace(/[^\w]+/g, '-')} {...props} />,
                  h3: ({node, ...props}) => <h3 id={String(props.children).toLowerCase().replace(/[^\w]+/g, '-')} {...props} />,
                  h4: ({node, ...props}) => <h4 id={String(props.children).toLowerCase().replace(/[^\w]+/g, '-')} {...props} />,
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    const codeBlockIdx = (node && node.position && node.position.start && node.position.start.line) || Math.random();
                    if (!inline && match) {
                      return (
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => handleCopy(codeString, codeBlockIdx)}
                            className="absolute top-2 right-2 z-10 bg-muted/80 hover:bg-primary text-xs px-2 py-1 rounded border border-border transition-all duration-150"
                            style={{ fontSize: '0.85em' }}
                          >
                            {copiedIndex === codeBlockIdx ? 'Copied!' : 'Copy'}
                          </button>
                          <SyntaxHighlighter
                            style={codeStyle}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      );
                    } else {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  },
                  img({ src = "", alt, ...props }) {
                    if (src.endsWith(".cast") || src.includes(".cast?")) {
                      // Parse query params, only allow safe options
                      const [file, query] = src.split("?");
                      const options = qs.parse(query || "");
                      // Whitelist allowed props
                      const safeProps: any = { src: file };
                      if (options.autoPlay === "true") safeProps.autoPlay = true;
                      if (options.loop === "true") safeProps.loop = true;
                      if (typeof options.theme === "string") safeProps.theme = options.theme;
                      if (typeof options.poster === "string") safeProps.poster = options.poster;
                      if (options.cols && !isNaN(Number(options.cols))) safeProps.cols = Number(options.cols);
                      if (options.rows && !isNaN(Number(options.rows))) safeProps.rows = Number(options.rows);
                      return <AsciinemaPlayer {...safeProps} />;
                    }
                    return <img src={src} alt={alt} {...props} />;
                  },
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Up Arrow to TOC */}
        <a
          href="#toc-nav"
          className={`fixed bottom-8 ${isRTL ? 'left-8' : 'right-8'} z-40 bg-primary text-primary-foreground rounded-full shadow-lg p-3 hover:bg-primary/90 border border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
          style={{ display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 24px 0 rgb(0 0 0 / 0.10)' }}
          aria-label="Back to Table of Contents"
        >
          <ArrowUp size={22} className="" />
        </a>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default BlogPage;
