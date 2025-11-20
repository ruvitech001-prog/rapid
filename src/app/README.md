# App Router Structure

## Overview
Next.js 14 App Router with file-based routing and route groups.

## Route Groups (Parentheses)
- `(auth)/` - Public authentication routes (no sidebar)
- `(employer)/` - Employer dashboard (with sidebar)
- `(employee)/` - Employee dashboard (with sidebar)
- `(contractor)/` - Contractor dashboard (with sidebar)

Route groups don't affect URLs - they're for layout organization.

## Key Files
- `layout.tsx` - Root layout (wraps entire app)
- `page.tsx` - Home page (`/`)
- `globals.css` - Global styles
- `providers.tsx` - Client component wrappers

## Dynamic Routes
Use square brackets for dynamic segments:
- `[id]/` - Dynamic employee ID
- `[slug]/` - Dynamic content slug

## API Routes
- Located in `api/` directory
- Use `route.ts` files
- Support HTTP methods (GET, POST, PATCH, DELETE)

Learn more: https://nextjs.org/docs/app/building-your-application/routing

