# Authentication Routes

## Overview
Public routes for user authentication and registration.

## Routes
- `/login` - User login page
- `/signup` - Company signup
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset confirmation
- `/company-onboarding` - New company onboarding flow
- `/verify-email` - Email verification page

## Layout
Uses a simplified layout without sidebar or navigation.
See `layout.tsx` in this directory.

## Features
- Email/password authentication
- Google OAuth integration
- Password strength validation
- Email verification required
- Rate limiting on login attempts

## Related
- Auth logic: `src/lib/supabase/`
- Auth hooks: `src/hooks/use-auth.ts`
- Auth store: `src/store/auth-store.ts`

