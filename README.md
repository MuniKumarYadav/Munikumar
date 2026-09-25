# Muni Kumar Intelligence Lab

An interactive static learning OS for data-driven, AI-driven and decision-driven digital marketing.

## Architecture
The current deployment is intentionally dependency-light: one semantic HTML document contains the shell, visual system, deterministic marketing calculations, simulations, local progress persistence and accessible responsive layout.

## Persistence
Learning progress and the latest simulation run are stored in browser localStorage. A Supabase adapter can be added later without changing the calculation model.

## Safety of claims
Simulation values are synthetic and explicitly labeled. External research should be verified against primary sources before publication.

## Deployment
The site is compatible with Vercel static hosting and requires no build step.