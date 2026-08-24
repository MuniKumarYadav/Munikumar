import Link from 'next/link';

export const metadata = { title: 'Research — Muni Kumar' };

const tracks = [
  ['M.D.A. / Marketing Data Archive', 'Your uploaded campaign reports, posters, experience notes and datasets become structured evidence for future research.'],
  ['AI Marketing Lab', 'A place for experiments involving segmentation, classification, prediction, creative analysis and marketing automation.'],
  ['Measurement Lab', 'Case-based work on attribution, incrementality, funnel metrics, experimentation and reporting quality.'],
];

export default function ResearchPage() {
  return (
    <main className="shell article">
      <p className="section-kicker">M.D.A. / RESEARCH HUB</p>
      <h1>Marketing data in. Better questions out.</h1>
      <p className="lede">This is the integration point for your future uploads. Connect a private storage layer or CMS, then enrich assets with embeddings, tags and source metadata before exposing selected evidence publicly.</p>
      <div className="grid" style={{marginTop:42}}>
        {tracks.map(([title, description]) => <article className="card" key={title}><div><span className="card-tag">Research track</span><h3>{title}</h3><p>{description}</p></div><div className="card-foot"><span>READY FOR DATA</span><span>→</span></div></article>)}
      </div>
      <div className="research-main" style={{marginTop:16}}>
        <span className="card-tag">Ingestion design</span>
        <h3>Recommended pipeline</h3>
        <p>Upload → validate → extract text/metadata → classify → embed → index → retrieve with citations → publish selected findings. Keep private source files separate from public article content and preserve provenance for every generated insight.</p>
        <Link href="/blog/ai-marketing-measurement-stack" className="button button-primary">Read the measurement playbook →</Link>
      </div>
    </main>
  );
}
