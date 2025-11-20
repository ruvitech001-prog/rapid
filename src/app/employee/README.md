# Employee Dashboard Routes

## Overview
Protected routes for employee users.

## Access Control
- Requires authentication
- User type: `employee`

## Main Routes
- `/dashboard` - Employee dashboard and onboarding checklist
- `/profile` - Personal profile management
- `/tax` - Tax declaration and submission
- `/requests` - Leave, expense, and referral requests

## Features
### Dashboard
- Onboarding checklist (7 steps)
- eKYC verification status
- Offer letter view
- E-signature for employment agreement

### Profile
- Personal details (name, DOB, contact)
- Family details (spouse, children, parents)
- Bank account information
- Document uploads (Aadhaar, PAN, etc.)
- Nominee management (insurance, gratuity)

### Tax Management
- Tax regime selection (Old vs New)
- Investment declaration (80C, 80D, etc.)
- HRA exemption calculation
- Previous employer income
- Property income declaration
- LTA travel claims
- Proof submission (end of year)

### Requests
- Leave requests (casual, sick, earned)
- Expense claims with receipts
- Referral bonus requests
- Request history and status

## Related Components
- `src/components/employee/`

