import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { featuredArticles, articles } from '@/lib/content';

export default function HomePage() {
  const latest = [...featuredArticles, ...articles].slice(0, 6);

  return (
    <>
      <header className="topnav">
        <div className="shell nav-inner">
          <Link href="/" className="logo"><b>MK</b> / MUNI KUMAR</Link>
          <nav className="nav-links" aria-label="Primary navigation">
            <Link href="#work">Work</Link>
            <Link href="#research">Research</Link>
            <Link href="#reading">Reading</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>
      </header>

      <Marquee />
      <main>
        <Hero />

        <section id="work" className="section">
          <div className="shell">
            <div className="section-head">
              <div><p className="section-kicker">01 / work</p><h2>Strategy, creative and analytics in one growth loop.</h2></div>
              <p className="section-intro">A portfolio structure for your previous posters, campaigns, dashboards, experiments and professional experience. Uploads can later be mapped into these same content objects.</p>
            </div>
            <div className="grid">
              {[
                ['Performance', 'Paid media architecture, funnel diagnostics and experimentation systems.'],
                ['SEO + Content', 'Search strategy, editorial operations and content designed around intent.'],
                ['AI Marketing', 'Practical ML workflows for segmentation, prediction, research and creative operations.'],
              ].map(([title, text]) => (
                <article key={title} className="card"><div><span className="card-tag">Capability</span><h3>{title}</h3><p>{text}</p></div><div className="card-foot"><span>CASE STUDY READY</span><span>→</span></div></article>
              ))}
            </div>
          </div>
        </section>

        <section id="research" className="section">
          <div className="shell">
            <div className="section-head">
              <div><p className="section-kicker">02 / research</p><h2>M.D.A. — Marketing Data & AI Lab.</h2></div>
              <p className="section-intro">A research layer for your own marketing data, uploaded experience, campaign material and documented experiments.</p>
            </div>
            <div className="research">
              <article className="research-main">
                <span className="card-tag">Flagship research</span>
                <h3>Use machine learning to answer marketing questions, not to decorate dashboards.</h3>
                <p>Structure future uploads into datasets: campaign metadata, creative themes, audience signals, performance outcomes and qualitative notes. The site can then power search, summaries, topic clustering and evidence-linked research pages.</p>
                <Link href="/research" className="button button-primary">Open research hub →</Link>
              </article>
              <div className="research-list">
                <div className="research-item"><strong>Audience intelligence</strong><span>Segmentation, intent scoring and lifecycle analysis.</span></div>
                <div className="research-item"><strong>Creative intelligence</strong><span>Poster/campaign tagging, theme discovery and performance comparisons.</span></div>
                <div className="research-item"><strong>Measurement science</strong><span>Attribution, experimentation, incrementality and reporting quality.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="reading" className="section">
          <div className="shell">
            <div className="section-head">
              <div><p className="section-kicker">03 / reading</p><h2>Original guides built for practitioners.</h2></div>
              <p className="section-intro">The 100-article system is generated from structured source material so internal links, tags and related reading remain maintainable.</p>
            </div>
            <div className="grid">
              {latest.map((article) => (
                <Link href={`/blog/${article.slug}`} className="card" key={article.slug}>
                  <div><span className="card-tag">{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p></div>
                  <div className="card-foot"><span>{article.readMinutes} MIN READ</span><span>↗</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell about">
            <div><p className="section-kicker">04 / profile</p><h2>Build a body of evidence.</h2></div>
            <p className="about-copy">This site is designed around <span>proof over claims</span>: experience, campaign artefacts, research notes, measurable outcomes and original writing. Your uploads become a living knowledge base instead of a static gallery.</p>
          </div>
        </section>
      </main>
      <footer className="shell footer"><span>© {new Date().getFullYear()} MUNI KUMAR</span><span>DIGITAL MARKETING × AI × DATA</span></footer>
    </>
  );
}
