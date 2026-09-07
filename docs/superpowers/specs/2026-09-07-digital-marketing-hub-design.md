# Digital Marketing Hub Design

## Goal
Upgrade the existing static Digital Marketing Audit Tool into a production-ready Digital Marketing Hub, deploy it on Vercel, and connect selected business data to the existing Supabase project.

## Scope
- Preserve the existing MuniSoft website and homepage.
- Keep the existing audit scorecard as the core visitor-facing tool.
- Add ROI/ROAS calculator and UTM builder as client-side utilities.
- Add an authenticated operator dashboard for CRM campaign, lead, and task summaries.
- Reuse existing Supabase tables: public.crm_campaigns, public.crm_leads, and public.crm_tasks.
- Preserve existing row-level security and do not weaken or disable RLS.
- Deploy from the GitHub main branch to Vercel.
- Do not introduce paid external APIs.

## Architecture
The public audit remains a lightweight browser application. Pure calculations run client-side so visitors can use the scorecard without a server dependency.

The operator dashboard reads existing CRM data through Supabase using an authenticated session. No service-role key is exposed to the browser. The application uses the Supabase anonymous key only in client code and relies on existing RLS policies for access control.

Vercel serves the static site and provides the production deployment. The deployment must be configured from the existing GitHub repository rather than replacing the current site.

## Components
1. Public Audit
   - Website URL and marketing-goal inputs.
   - Five scored categories: SEO, Content, Social & Campaigns, Conversion, Analytics.
   - Score from 0 to 100 and prioritized recommendations.

2. Marketing Utilities
   - ROI/ROAS calculator using spend, revenue, and optional profit.
   - UTM builder producing a URL with source, medium, campaign, term, and content parameters.

3. Operator Dashboard
   - Supabase sign-in.
   - Campaign count and spend summary from crm_campaigns.
   - Lead count and pipeline value from crm_leads.
   - Open task count from crm_tasks.
   - Friendly empty and error states.

## Data Flow
Public visitor input -> client-side scoring/utilities -> rendered recommendations.

Authenticated operator -> Supabase auth session -> RLS-protected reads from crm_campaigns, crm_leads, crm_tasks -> dashboard summaries.

## Security
- Never expose a Supabase service-role key in frontend code.
- Do not disable RLS.
- Treat Supabase project URL and anonymous key as environment/configuration values.
- Escape or render user-entered values as text; do not inject unchecked HTML from inputs.

## Testing
- Unit-test pure score, ROI/ROAS, UTM, and aggregation functions.
- Test dashboard empty, success, and unauthenticated states.
- Verify responsive browser behavior.
- Verify the production Vercel URL returns the expected public tool.

## Success Criteria
- Existing homepage remains functional.
- Public tool works without login.
- Marketing score and recommendations are deterministic.
- UTM builder outputs correctly encoded parameters.
- Authenticated dashboard reads only through existing RLS-protected tables.
- Vercel production deployment is live from the GitHub repository.
