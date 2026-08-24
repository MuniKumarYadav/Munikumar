import Link from 'next/link';
import { articles, featuredArticles } from '@/lib/content';

export const metadata = { title: 'Blog — Muni Kumar' };

export default function BlogPage() {
  const all = [...featuredArticles, ...articles];
  return (
    <main className="shell article">
      <p className="section-kicker">MUNI KUMAR / BLOG</p>
      <h1>100 practical guides for modern digital marketers.</h1>
      <p className="lede">Original, structured reading on AI marketing, analytics, SEO, growth, experimentation and interviews. Each article carries related reading so the knowledge graph compounds over time.</p>
      <div className="grid" style={{marginTop: 42}}>
        {all.map((article) => (
          <Link href={`/blog/${article.slug}`} className="card" key={article.slug}>
            <div><span className="card-tag">{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p></div>
            <div className="card-foot"><span>{article.readMinutes} MIN</span><span>READ →</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
