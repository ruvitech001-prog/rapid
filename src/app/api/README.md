# API Routes

## Overview
Next.js API routes for backend functionality.

## Structure
```
api/
├── auth/           # Authentication endpoints
├── employees/      # Employee CRUD operations
├── webhooks/       # External service webhooks
└── cron/           # Scheduled tasks (Vercel Cron)
```

## Route Handlers
Each `route.ts` file exports HTTP method handlers:

```typescript
export async function GET(request: Request) {
  // Handle GET request
}

export async function POST(request: Request) {
  // Handle POST request
}
```

## Authentication
Most API routes require authentication:

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ... route logic
}
```

## Webhooks
External services send events to these endpoints:
- `/api/webhooks/springscan` - eKYC verification results
- `/api/webhooks/signeasy` - E-signature status updates

**Security**: Verify webhook signatures to prevent unauthorized access.

## Cron Jobs
Vercel Cron jobs for scheduled tasks:
- `/api/cron/reminders` - Send agreement reminders (daily)

Configure in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

## Error Handling
Always return proper HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

