# Muni Kumar — Digital Marketing + AI

A Next.js portfolio and research site for digital marketing, AI marketing, analytics, campaign work, interview preparation and long-form content.

## Stack

- Next.js App Router + TypeScript
- Framer Motion for restrained animation
- Vercel Analytics
- Structured TypeScript content model for 100 interlinked articles
- Hugging Face integration designed as a pluggable ingestion layer

## Run locally

```bash
npm install
npm run dev
```

## Test/build

```bash
npm run build
npm run test
```

## Content model

Replace or extend `lib/content.ts` with approved original source material. The starter article set is intentionally generated from templates; it should be editorially reviewed before publication so every long-form article is genuinely original and evidence-backed.

## Adding private experience/posters

Use a private object store or CMS for uploaded source assets. Do not commit confidential marketing reports or personal documents to the public Git repository. Add a server-side ingestion route that validates file types, extracts metadata/text, stores provenance, and only publishes approved derived content.

## Hugging Face

The connected Hugging Face tool was unavailable during implementation, so no dataset/model was claimed or hard-coded. Add the chosen dataset/model IDs only after verifying licensing, task suitability, freshness and privacy requirements.
