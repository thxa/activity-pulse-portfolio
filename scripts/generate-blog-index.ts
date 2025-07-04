import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogRoot = path.join(__dirname, '../public/blog')

// Define the type for a blog node
interface BlogNode {
  slug: string;
  title: string;
  type: 'directory' | 'file';
  updated: string; // ISO string
  children?: BlogNode[];
}

function getTitleFromSlug(slug: string): string {
  // Convert slug or filename to readable title
  if (!slug || slug === '') return 'Home';
  return slug.split('/').pop()!.replace(/-/g, ' ');
}

function walk(dir: string, baseSlug = ''): BlogNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const children: BlogNode[] = [];

  // First, process directories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      const relativeSlug = baseSlug ? `${baseSlug}/${entry.name}` : entry.name;
      // Check if directory contains index.md or any .md files
      const dirChildren = walk(fullPath, relativeSlug);
      // Only include if it has markdown children
      if (dirChildren.length > 0) {
        // Directory updated time is the latest of its children
        const latest = dirChildren.reduce((max, c) => c.updated > max ? c.updated : max, dirChildren[0].updated);
        children.push({
          slug: relativeSlug,
          title: getTitleFromSlug(entry.name),
          type: 'directory',
          updated: latest,
          children: dirChildren
        });
      }
    }
  }

  // Then, process markdown files
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      // Exclude root-level index.md if already added as Home
      if (entry.name === 'index.md' && baseSlug === '') continue;
      const fileSlug = baseSlug ? `${baseSlug}/${entry.name.replace(/\.md$/, '')}` : entry.name.replace(/\.md$/, '');
      const filePath = path.join(dir, entry.name);
      const stat = fs.statSync(filePath);
      children.push({
        slug: fileSlug,
        title: getTitleFromSlug(entry.name.replace(/\.md$/, '')),
        type: 'file',
        updated: stat.mtime.toISOString()
      });
    }
  }

  // Special case: root-level index.md
  if (fs.existsSync(path.join(dir, 'index.md')) && baseSlug === '') {
    const stat = fs.statSync(path.join(dir, 'index.md'));
    children.unshift({
      slug: '',
      title: 'Home',
      type: 'file',
      updated: stat.mtime.toISOString()
    });
  }

  return children;
}

const tree: BlogNode[] = walk(blogRoot);

fs.writeFileSync(
  path.join(blogRoot, 'posts.json'),
  JSON.stringify(tree, null, 2),
  'utf-8'
);

console.log('[+] Nested posts.json generated.');

