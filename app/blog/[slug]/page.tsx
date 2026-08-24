import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, featuredArticles, getArticle } from '@/lib/content';

export function generateStaticParams() {
  return [...featuredArticles, ...articles].map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? { title: `${article.title} — Muni Kumar`, description: article.excerpt } : { title: 'Article not found' };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = article.related.map(getArticle).filter(Boolean);

  return (
    <main className="shell article">
      <Link href="/blog" className="section-kicker">← ALL ARTICLES</Link>
      <p className="section-kicker" style={{marginTop:36}}>{article.category}</p>
      <h1>{article.title}</h1>
      <p className="lede">{article.excerpt}</p>
      <div className="prose">
        {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="research-list" style={{marginTop:56}}>
        <div className="research-item"><strong>Related reading</strong><span>Continue through the internal knowledge graph.</span>{related.map((item) => item && <p key={item.slug}><Link href={`/blog/${item.slug}`}>{item.title} →</Link></p>)}</div>
        {article.external && <div className="research-item"><strong>External reference</strong><span><a href={article.external.url} target="_blank" rel="noreferrer">{article.external.label} ↗</a></span></div>}
      </div>
    </main>
  );
}
