export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  readMinutes: number;
  tags: string[];
  related: string[];
  external?: { label: string; url: string };
};

const pillars = [
  'AI-powered digital marketing',
  'data-driven campaign measurement',
  'marketing analytics and attribution',
  'machine learning for audience segmentation',
  'SEO systems and content operations',
  'performance marketing experimentation',
  'conversion rate optimisation',
  'marketing automation',
  'first-party data strategy',
  'marketing interview preparation',
];

const generated: Article[] = Array.from({ length: 100 }, (_, index) => {
  const n = index + 1;
  const topic = pillars[index % pillars.length];
  const slug = `${topic.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${n}`;
  const next = ((index + 1) % 100) + 1;
  const related = [`${topic.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${next}`];

  return {
    slug,
    title: `${topic.replace(/\b\w/g, (m) => m.toUpperCase())}: Practical Playbook ${n}`,
    category: topic,
    excerpt: `A practical, original guide to ${topic}, focused on measurable outcomes, clean experimentation and responsible use of AI.`,
    body: [
      `The strongest ${topic} programs start with a clear business question rather than a collection of tools. Define the audience, objective, baseline metric and decision that the work should change. This turns marketing activity into a measurable operating system.`,
      `A useful workflow is to collect reliable first-party signals, create a simple measurement model, segment users by meaningful behaviour and run controlled experiments. Machine learning can support prioritisation and prediction, but the marketer still owns the hypotheses, trade-offs and interpretation.`,
      `For execution, keep every campaign tied to a small set of north-star and diagnostic metrics. Track acquisition, activation, conversion, retention and revenue separately so an impressive top-of-funnel number cannot hide weak downstream economics. Document assumptions and version the analysis so future decisions remain auditable.`,
      `The AI layer should be evaluated like any other marketing system: define the task, establish a baseline, measure lift, inspect failure cases and protect customer data. When a model is uncertain, route the decision to a human instead of pretending the prediction is fact.`,
      `Finally, connect this topic to the wider growth system. Internal links should move readers from strategy to implementation, then to measurement and interview-level reasoning. External references should point to authoritative documentation, standards or original research rather than low-quality aggregators.`,
    ],
    readMinutes: 5 + (index % 5),
    tags: ['digital marketing', 'AI marketing', 'analytics', 'growth', 'ML'],
    related,
    external: { label: 'Hugging Face', url: 'https://huggingface.co/' },
  };
});

export const articles = generated;

export const featuredArticles: Article[] = [
  {
    slug: 'ai-marketing-measurement-stack',
    title: 'Building an AI Marketing Measurement Stack',
    category: 'Research',
    excerpt: 'How to combine first-party data, experimentation and AI without turning dashboards into vanity metrics.',
    body: [
      'A modern marketing measurement stack is less about adding more software and more about making decisions traceable. Start with a measurement contract: each channel has a role, each conversion has a definition, and each report states what is known versus inferred.',
      'AI becomes useful when it reduces analysis time or improves prioritisation. Examples include clustering customers by behaviour, forecasting demand, classifying creative themes and finding anomalous campaign performance. These workflows are most valuable when the output changes an action that can later be measured.',
      'The implementation should separate raw events, transformed tables and decision-ready metrics. This makes experimentation cleaner, reduces duplicated calculations and prevents a dashboard from becoming the source of truth by accident.',
      'The final layer is governance. Record data provenance, model purpose, evaluation metrics, freshness and known limitations. That discipline lets marketing teams move faster without confusing automation with certainty.',
    ],
    readMinutes: 8,
    tags: ['AI', 'measurement', 'analytics'],
    related: ['marketing-analytics-and-attribution-13', 'machine-learning-for-audience-segmentation-24'],
    external: { label: 'Hugging Face', url: 'https://huggingface.co/' },
  },
  {
    slug: 'digital-marketing-interview-system',
    title: 'Digital Marketing Interview System: From Question to Business Answer',
    category: 'Interviews',
    excerpt: 'A framework for answering strategy, analytics, SEO, paid media and AI marketing interview questions with evidence.',
    body: [
      'Strong interview answers are structured like mini business cases. Clarify the objective, identify the relevant customer or funnel stage, choose metrics, explain your analysis and finish with a decision.',
      'For analytics questions, distinguish descriptive reporting from causal inference. A channel can be correlated with revenue without causing the revenue, so explain how you would validate incrementality through experiments, holdouts or triangulation.',
      'For AI marketing questions, explain the model as part of a workflow. State the input data, task, baseline, evaluation metric, monitoring plan and human-review threshold. This demonstrates practical judgement instead of tool memorisation.',
    ],
    readMinutes: 7,
    tags: ['interview', 'marketing', 'career'],
    related: ['ai-marketing-measurement-stack', 'data-driven-campaign-measurement-2'],
  },
];

export function getArticle(slug: string): Article | undefined {
  return [...featuredArticles, ...articles].find((article) => article.slug === slug);
}
