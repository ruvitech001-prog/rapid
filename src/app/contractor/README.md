# Contractor Dashboard Routes

## Overview
Protected routes for contractor users.

## Access Control
- Requires authentication
- User type: `contractor`

## Main Routes
- `/dashboard` - Contractor dashboard
- `/timesheets` - Time sheet management
- `/invoices` - Invoice generation and tracking

## Features
### Dashboard
- Active contracts
- Pending timesheets
- Invoice status
- Payment tracking

### Timesheets
- **Hourly Timesheets**: Log hours per day/week
- **Milestone Timesheets**: Mark milestone completion
- Submit for approval
- Edit before approval

### Invoices
- Auto-generated from approved timesheets
- Invoice number (sequential)
- Billing period
- Rate card display
- GST calculation (if applicable)
- Payment tracking (due date, paid date)
- Download invoice PDF

## Related Components
- `src/components/contractor/`

