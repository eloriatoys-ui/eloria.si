import fs from "node:fs";
import path from "node:path";

// Markdown-file blog for eloria.si. Each post is a versioned file in
// content/blog/<slug>.md: a small frontmatter block, then a clean HTML body that
// is rendered with Tailwind Typography (`prose`). Posts are committed here directly
// or published from Loop Social — no database, no extra dependencies.

export interface BlogPost {
  slug: string;
  title: string;
  date: string;      // ISO (YYYY-MM-DD)
  excerpt: string;
  cover: string;
  category: string;
  author: string;
  html: string;      // article body — clean semantic HTML, styled by `prose`
}

const DIR = path.join(process.cwd(), "content", "blog");

// Minimal frontmatter parser: a leading `--- … ---` block of `key: value` lines,
// then the body. Values may be single/double quoted. No YAML dependency needed.
function parse(raw: string): { data: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    data[key] = val;
  }
  return { data, body: m[2] };
}

function readPost(slug: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf-8");
    const { data, body } = parse(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      cover: data.cover || "",
      category: data.category || "Blog",
      author: data.author || "Eloria",
      html: body.trim(),
    };
  } catch {
    return null;
  }
}

export function getSlugs(): string[] {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

export function getAllPosts(): BlogPost[] {
  return getSlugs()
    .map(readPost)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readPost(slug);
}

const SL_MONTHS = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
export function formatSlDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}. ${SL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
