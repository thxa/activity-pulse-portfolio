import { useState, useEffect } from "react";

export interface BlogNode {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  children?: BlogNode[];
}

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/blog/posts.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // For nested structure, getRecentPosts is not trivial; you may want to flatten the tree if needed
  const flattenPosts = (nodes: BlogNode[]): BlogNode[] => {
    let result: BlogNode[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children) {
        result = result.concat(flattenPosts(node.children));
      }
    }
    return result;
  };

  const getRecentPosts = (count: number = 3) => {
    return flattenPosts(posts)
      .filter(post => post.slug !== "" && !post.children) // Exclude the home page and directories
      .slice(0, count);
  };

  return { posts, loading, error, getRecentPosts };
}; 