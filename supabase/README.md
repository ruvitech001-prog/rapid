# Supabase Configuration

## Overview
Database migrations and Edge Functions for Supabase.

## Structure
```
supabase/
├── migrations/       # Database migrations (SQL)
├── functions/        # Edge Functions (Deno)
└── seed.sql          # Development seed data
```

## Migrations
SQL files that modify database schema:

```sql
-- migrations/001_initial_schema.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

### Running Migrations
```bash
# Apply all migrations
pnpm supabase:migrate

# Create new migration
pnpm supabase migration new migration_name
```

## Edge Functions
Serverless functions running on Deno:

```typescript
// functions/face-verification/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const { employeeId, selfieUrl } = await req.json()

  // Call SpringScan API for face matching
  const result = await fetch('https://api.springverify.com/face-match', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SPRINGSCAN_API_KEY')}`
    },
    body: JSON.stringify({ selfie: selfieUrl })
  })

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Deploying Edge Functions
```bash
# Deploy function
supabase functions deploy face-verification

# Test locally
supabase functions serve face-verification
```

## Seed Data
Development data for local testing:

```sql
-- seed.sql
INSERT INTO companies (name, email) VALUES
  ('Acme Corp', 'admin@acme.com'),
  ('TechStart Inc', 'admin@techstart.com');
```

```bash
# Load seed data
psql -h localhost -U postgres -d postgres -f seed.sql
```

## Type Generation
Auto-generate TypeScript types from database:

```bash
# Generate types
pnpm supabase:generate-types

# Output: src/lib/supabase/types.ts
```

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Learn More
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)

