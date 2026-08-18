import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getSlugs, formatSlDate } from "@/lib/blog";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Blog · Eloria" };
  return {
    title: `${post.title} · Eloria`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.cover ? [post.cover] : [],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const more = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <article className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:px-8 md:pt-14">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-orange-dark transition-colors hover:text-orange">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          Nazaj na blog
        </Link>

        <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-orange-dark">
          {post.category} · {formatSlDate(post.date)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-[42px]">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-ink/70">{post.excerpt}</p>}

        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-[28px] object-cover shadow-2xl" />
        )}

        <div
          className="prose prose-lg mt-10 max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-ink prose-p:text-ink/80 prose-li:text-ink/80 prose-a:text-orange-dark prose-strong:text-ink prose-img:rounded-2xl prose-blockquote:border-l-orange prose-blockquote:text-ink/70"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      {more.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-ink">Več z bloga</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-pearl transition-all hover:-translate-y-1" style={{ border: "1px solid #F4DCB7" }}>
                <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-2xl text-orange-dark/40">🌿</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[11px] font-semibold text-orange-dark">{formatSlDate(p.date)}</span>
                  <h3 className="mt-1 text-[15px] font-extrabold leading-snug text-ink transition-colors group-hover:text-orange-dark">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
