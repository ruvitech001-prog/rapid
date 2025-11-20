# Testing

## Overview
Comprehensive test suite covering E2E, integration, and unit tests.

## Structure
```
tests/
├── e2e/              # End-to-end tests (Playwright)
├── integration/      # Integration tests
│   └── api/         # API endpoint tests
└── unit/            # Unit tests
    └── services/    # Service layer tests
```

## E2E Tests (Playwright)
Test user flows from browser perspective:

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
})
```

### Running E2E Tests
```bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific test
pnpm test:e2e auth.spec.ts
```

## Integration Tests
Test API endpoints and database operations:

```typescript
// tests/integration/api/employees.test.ts
import { createMocks } from 'node-mocks-http'

describe('GET /api/employees', () => {
  it('returns employee list', async () => {
    const { req, res } = createMocks({ method: 'GET' })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toHaveProperty('employees')
  })
})
```

## Unit Tests (Vitest)
Test individual functions:

```typescript
// tests/unit/services/salary-calculator.test.ts
import { describe, it, expect } from 'vitest'
import { calculateCTCBreakdown } from '@/lib/services/salary-calculator'

describe('calculateCTCBreakdown', () => {
  it('calculates HRA correctly', () => {
    const result = calculateCTCBreakdown(480000)
    expect(result.hra).toBe(240000) // 50% of basic
  })

  it('calculates EPF correctly', () => {
    const result = calculateCTCBreakdown(480000)
    expect(result.epf_employee).toBe(57600) // 12% of basic
  })
})
```

### Running Unit Tests
```bash
# Run all unit tests
pnpm test:unit

# Watch mode
pnpm test:unit --watch

# Coverage report
pnpm test:unit --coverage
```

## Test Coverage Goals
- E2E: Critical user flows (login, onboarding, requests)
- Integration: All API endpoints
- Unit: All services and utilities
- Target: >80% coverage

## Best Practices
- ✅ Write tests before fixing bugs
- ✅ Test edge cases
- ✅ Use meaningful test descriptions
- ✅ Mock external API calls
- ✅ Keep tests independent (no shared state)

