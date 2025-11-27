# Employer Settings Page - Complete Flow Documentation

## Overview

The Employer Settings page provides a comprehensive configuration center for company policies, compensation structures, and operational settings. The page uses a **left sidebar navigation** pattern with multiple sections.

---

## Page Structure

### Layout
- **Left Sidebar**: Vertical navigation menu with all settings sections
- **Main Content Area**: Displays the selected section's content
- **Header**: "Company settings" title

### Navigation Sections (Left Sidebar)
1. Profile
2. Salary
3. Stock options
4. Bonus
5. Expense
6. Probation & notice period
7. Holiday calendar
8. Leave policy
9. Portal management (Team management)
10. Background verification
11. Welcome kit

---

## Section Details

### 1. Profile

**Purpose**: Manage basic company information and branding.

#### Display View
| Field | Example Value | Notes |
|-------|---------------|-------|
| Legal entity name | Stripe, Inc. | Company's registered name |
| Entity type | Banking, Financial Services and Insurance | Business category |
| Country | India | Operating country |
| Address | UDB Landmark, Gopalpura, Tonk Road, Jaipur, Rajasthan - 302020 | Full address |
| Phone number | Not available | Can be empty |
| Email address | contactus@stripe.com | Contact email |
| Tax ID | 12345678909 | Tax identification |
| Logos | Upload area | Multiple logos can be added |

#### Edit Modal Fields
- Legal entity name (text, read-only display)
- Country (text, read-only display)
- Address line 1 (text input) - "Your house/apartment/block/building number"
- Address line 2 (text input) - "Your street name/landmark"
- PIN code (text input) - "Your zip or postal code"
- City (text input)
- State (text input)
- Phone number (phone input with country code)
- Email address (email input)
- Tax ID (text input)
- Upload logo (file upload)

**Actions**: "Edit details" button opens modal with "Cancel" and "Submit" buttons

---

### 2. Salary

**Purpose**: Configure salary ranges and structure templates.

#### Sub-sections

##### A. Salary Range
*All values in INR*

| Field | Example Value |
|-------|---------------|
| Minimum salary | 2,00,000 |
| Maximum salary | 10,00,000 |
| Average salary | 6,00,000 |

**Edit Modal**: Simple form with min, max, average salary fields

##### B. Salary Structure Templates

Templates are selectable tabs: `Template 1` | `Template 2` | `Rapid recommended`

Each template contains salary breakup components:

| Component | Value | Constraint |
|-----------|-------|------------|
| Basic salary | 50% | Max 50% of CTC |
| House rent allowance | 36% | Max 40% of CTC |
| Leave travel allowance | 8% | Max 8.33% of basic |
| Special allowance | 2000 | No cap |
| Food coupons | 2200 | Max 2200 per month |
| Health club facility | 4000 | Max 5000 per month |
| Mobile/Internet expenses | 2000 | Max 5000 per month |
| Gift card | 4500 | Max 5000 per month |
| Car & driver remuneration | 1200 | Max 2700 pm or 3300 pm (for 1.6L+ capacity vehicles) |
| Professional development allowance | 3000 | Max 10000 per month |

#### Edit Template Modal
- Template name dropdown
- Pre-filled components with editable values
- "Add salary breakup category" dropdown with available categories:
  - Mobile/internet expenses
  - Professional development allowance
  - Food coupons
  - Health club facility
  - Gift card
  - Car & driver remuneration
- "Add category" option for custom categories

**Actions**: "Edit salary" button, "Edit template" button, "+ Add new template" button

---

### 3. Stock Options

**Purpose**: Configure equity compensation settings.

#### Display View
| Field | Example Value | Options |
|-------|---------------|---------|
| Type of stocks | Incentive Stock Options (ISOx) | Dropdown selection |
| Currency | INR (India) | Currency selector |
| Strike price | 130 | Numeric input |
| Cliff period | 12 months | Duration selector |
| Vesting frequency | Monthly | Frequency selector |

**Actions**: "Edit plan" button opens edit modal

---

### 4. Bonus

**Purpose**: Configure bonus policies and recovery terms.

#### Display View

##### Bonus Types
| Bonus Type | Configuration |
|------------|---------------|
| Performance bonus | One liner description |
| Joining/Sign on bonus | Amount: ₹10,000 |
| Referral bonus | One liner description |
| Cash rewards/Spot bonus | One liner description |

##### Recovery of Joining Bonus Settings
| Field | Value |
|-------|-------|
| Duration | 6 months |
| Percentage | 50% |

*Note: "If the employee leaves before a certain time duration, they will return some percentage of the joining bonus."*

#### Edit Modal Fields
- Type of Bonus: Flat rate / Fixed (dropdown)
- Amount (numeric input)
- Performance bonus description
- Joining/Sign on bonus amount
- Recovery settings (Duration, Percentage)
- Referral bonus description
- Cash reward/Spot bonus description

**Actions**: "Edit policy" button

---

### 5. Expense

**Purpose**: Configure expense reimbursement policies.

#### Expense Categories
All categories show: "Standard expense by Rapid applied"

| Category | Status |
|----------|--------|
| Travel | Standard expense by Rapid applied |
| Work equipments | Standard expense by Rapid applied |
| Food | Standard expense by Rapid applied |
| Business meeting | Standard expense by Rapid applied |
| Phone & utilities | Standard expense by Rapid applied |
| Home office | Standard expense by Rapid applied |
| Education & training | Standard expense by Rapid applied |
| Others | Standard expense by Rapid applied |

#### Edit Modal
Each category can have custom amount configured (all values in INR)

**Actions**: "Edit policy" button

---

### 6. Probation & Notice Period

**Purpose**: Configure probation duration and notice period policies.

#### Display View
| Field | Value |
|-------|-------|
| Probation period | 15 days |

##### Notice Period for Resignations and Terminations

| Period Type | If Resigned | If Terminated |
|-------------|-------------|---------------|
| During probation | 60 days | 7 days |
| After probation | 60 days | 7 days |

##### Confirmation on Completion of Probation
Toggle: "Employee needs to be specifically confirmed at the end of the probation"

#### Edit Modal Fields
- Probation period (days)
- Notice period in probation:
  - If resigned (days)
  - If terminated (days)
- Notice period after probation:
  - If resigned (days)
  - If terminated (days)
- Confirmation toggle

**Actions**: "Edit policy" button

---

### 7. Holiday Calendar

**Purpose**: Configure company holidays (fixed and floating).

#### Display View
*All values in days*

| Field | Value | Notes |
|-------|-------|-------|
| Total holidays | 17 | Fixed + floating holidays (max 20) |
| Fixed holidays | 7 | List of holidays |
| Floating holidays | 10 | List of holidays |

#### Holiday Lists
Each holiday displays:
- Day of week (Mon, Tue, etc.)
- Date (26/Jan/2023)
- Holiday name (Republic day)

#### Edit Modal
- Total holidays counter
- Fixed holidays section with list
- Floating holidays section with list
- Each holiday can be edited/removed
- Pagination for long lists (1, 2, 3...)

**Actions**: "Edit holidays" button

---

### 8. Leave Policy

**Purpose**: Configure leave entitlements and carry-forward rules.

#### Display View (Simple)
*All values in days*

| Leave Type | Days | Notes |
|------------|------|-------|
| Paid time off (PTO) | 18 | Min 18 days |
| Sick leaves | 12 | Min 12 days |

#### Display View (Detailed)
| Leave Type | Days | Notes |
|------------|------|-------|
| Earned leaves | 15 | Carry forward allowed till 3 months upto 33% |
| Casual leaves | 7 | Carry forward allowed till 3 months upto 33% |
| Sick leaves | 7 | - |
| Loss of pay | Unlimited | - |
| Maternity leaves | 60 | - |
| Paternity leaves | 7 | - |
| Bereavement leaves | 0 | - |
| Marriage leaves | 0 | - |
| Compensatory leaves | - | - |
| Sabbatical leaves | 0 | - |
| Menstruation leaves | 0 | - |
| Target achievement leaves | 0 | - |
| Birthday and anniversary leaves | 0 | - |
| Family leaves | 0 | - |

#### Edit Modal Fields
For each leave type:
- Days (numeric input)
- For Earned/Casual leaves:
  - Allow carry forward toggle
  - Valid till (days)
  - Can carry (percentage)

**Add Leave Category Dropdown**:
- Bereavement leaves
- Marriage leaves
- Compensatory leaves
- Sabbatical leaves
- Menstruation leaves
- Target achievement holiday
- Birthday and anniversary leaves
- Family leaves

**Actions**: "Edit policy" button

---

### 9. Portal Management (Team Management)

**Purpose**: Manage admin users and team managers with portal access.

#### Display View
List of managers with:
- Avatar/profile picture
- Full name
- Role/title

Example:
- Prithviraj Singh Hada - UX Lead
- Raghav Sudarshan - VP Engineering
- Vidushi Maheshwari - Lead product designer

Pagination: 1, 2, 3...

#### Invite Modal Fields
| Field | Type |
|-------|------|
| Full name | Text input |
| Email address | Email input |
| Team | Dropdown selector |
| Privilege level | Dropdown selector |

**Actions**: "Invite managers" button, "Invite" action on each row

---

### 10. Background Verification

**Purpose**: Configure employee background verification plans.

#### Activation Toggle
"Activate background verification" - Toggle to enable/disable

#### Plan Tiers

| Feature | Pro ($29) | Power ($49) | Premium ($79) |
|---------|-----------|-------------|---------------|
| ID (PAN) | ✓ | ✓ | ✓ |
| Court record check | ✓ | ✓ | ✓ |
| Address (Digital verification) | ✓ | ✓ | ✓ |
| Education (Highest via reasonal partner) | - | ✓ | ✓ |
| Employment (Last 2 jobs) | - | ✓ | ✓ |
| Global database verification | - | ✓ | ✓ |
| Professional reference (1 person) | - | - | ✓ |
| Credit check | - | - | ✓ |
| Drug test | - | - | ✓ |
| **Cost per employee (excluding GST)** | **$29** | **$49** | **$79** |

#### Current Plan Badge
Shows which plan is currently active: "Current plan" | "Upgrade plan"

#### Plan Details (Expanded)
Each plan shows:
- Plan name (Pro/Power/Premium)
- Coverage amount (e.g., "Coverage upto 10 Lacs")
- Validity (e.g., "Validity upto 12 months")
- Family inclusions (e.g., "Employee + Spouse + 4 Kids")

**Actions**: "Edit plan" or "Upgrade plan" buttons per tier

---

### 11. Welcome Kit

**Purpose**: Configure onboarding welcome kits for new employees.

#### Activation Toggle
"Activate welcome kit" - Toggle to enable/disable

#### Plan Tiers

| Item | Pro ($59) | Power ($109) | Premium ($189) |
|------|-----------|--------------|----------------|
| Unisex Polo T-shirt | ✓ | ✓ | ✓ |
| Cap | ✓ | ✓ | ✓ |
| Stainless Steel Thermo Flask with Cup | ✓ | ✓ | ✓ |
| Laptop Bag | - | ✓ | ✓ |
| Hedge Sling Bag | - | ✓ | ✓ |
| Hooded Jacket | - | - | ✓ |
| Coffee Jar | - | - | ✓ |
| Coffee Mug | - | - | ✓ |

#### Cost Breakdown
| Cost Type | Pro | Power | Premium |
|-----------|-----|-------|---------|
| Merchandise cost | $44 | $89 | $159 |
| Rapid's Handling Fees | $15 | $20 | $30 |
| **Cost per employee (One time)** | **$59** | **$109** | **$189** |

**Actions**: "Current plan" badge, "Upgrade plan" buttons

---

## UI Components Required

### Common Components
1. **Settings Sidebar** - Left navigation with active state
2. **Section Header** - Title with "Edit" button
3. **Display Card** - Read-only data display
4. **Edit Modal** - Form modal with Cancel/Submit actions
5. **Toggle Switch** - For boolean settings
6. **Plan Comparison Table** - For tiered features
7. **Team Member Card** - Avatar + name + role
8. **Invite Modal** - Multi-field form
9. **Holiday List Item** - Date + name display
10. **Salary Component Row** - Label + value + constraint

### Design Tokens
- Primary button: Purple (#586AF5 or #642DFC)
- Border color: #DEE4EB
- Background gray: #F4F7FA
- Text primary: Gray 900
- Text secondary: #8593A3
- Card border radius: 2xl (rounded-2xl)

---

## State Management

### Data Structure

```typescript
interface CompanySettings {
  profile: ProfileSettings;
  salary: SalarySettings;
  stockOptions: StockOptionsSettings;
  bonus: BonusSettings;
  expense: ExpenseSettings;
  probationNoticePeriod: ProbationSettings;
  holidayCalendar: HolidaySettings;
  leavePolicy: LeaveSettings;
  portalManagement: PortalSettings;
  backgroundVerification: BGVSettings;
  welcomeKit: WelcomeKitSettings;
}

interface ProfileSettings {
  legalEntityName: string;
  entityType: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  pinCode: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
  taxId: string;
  logos: string[];
}

interface SalarySettings {
  range: {
    minimum: number;
    maximum: number;
    average: number;
  };
  templates: SalaryTemplate[];
  activeTemplateId: string;
}

interface SalaryTemplate {
  id: string;
  name: string;
  isRapidRecommended: boolean;
  components: SalaryComponent[];
}

interface SalaryComponent {
  name: string;
  value: number;
  type: 'percentage' | 'fixed';
  maxConstraint?: string;
}

interface StockOptionsSettings {
  stockType: string;
  currency: string;
  strikePrice: number;
  cliffPeriod: string;
  vestingFrequency: string;
}

interface BonusSettings {
  bonusType: 'flat_rate' | 'fixed';
  performanceBonus: { enabled: boolean; description: string };
  joiningBonus: { enabled: boolean; amount: number };
  referralBonus: { enabled: boolean; description: string };
  spotBonus: { enabled: boolean; description: string };
  recovery: {
    duration: number; // months
    percentage: number;
  };
}

interface ExpenseSettings {
  categories: ExpenseCategory[];
}

interface ExpenseCategory {
  name: string;
  type: 'travel' | 'equipment' | 'food' | 'meeting' | 'phone' | 'home_office' | 'education' | 'others';
  useRapidStandard: boolean;
  customAmount?: number;
}

interface ProbationSettings {
  probationPeriod: number; // days
  noticePeriod: {
    duringProbation: { resigned: number; terminated: number };
    afterProbation: { resigned: number; terminated: number };
  };
  requireConfirmation: boolean;
}

interface HolidaySettings {
  totalHolidays: number;
  maxHolidays: number; // 20
  fixedHolidays: Holiday[];
  floatingHolidays: Holiday[];
}

interface Holiday {
  date: string;
  name: string;
}

interface LeaveSettings {
  leaveTypes: LeaveType[];
}

interface LeaveType {
  name: string;
  days: number;
  carryForward?: {
    enabled: boolean;
    validTillDays: number;
    maxPercentage: number;
  };
}

interface PortalSettings {
  managers: Manager[];
}

interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  privilegeLevel: string;
  avatar?: string;
}

interface BGVSettings {
  enabled: boolean;
  currentPlan: 'pro' | 'power' | 'premium';
}

interface WelcomeKitSettings {
  enabled: boolean;
  currentPlan: 'pro' | 'power' | 'premium';
}
```

---

## Implementation Checklist

### Phase 1: Core Structure
- [ ] Create settings layout with sidebar navigation
- [ ] Implement section routing/state management
- [ ] Create base components (cards, modals, toggles)

### Phase 2: Individual Sections
- [ ] Profile section (display + edit modal)
- [ ] Salary section (range + templates + add template)
- [ ] Stock options section (display + edit)
- [ ] Bonus section (display + edit)
- [ ] Expense section (display + edit)
- [ ] Probation & notice period section (display + edit)
- [ ] Holiday calendar section (display + edit with lists)
- [ ] Leave policy section (display + edit with categories)
- [ ] Portal management section (list + invite modal)
- [ ] Background verification section (plans + toggle)
- [ ] Welcome kit section (plans + toggle)

### Phase 3: Polish
- [ ] Form validation
- [ ] Success/error states
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility

---

## File Structure

```
src/app/employer/settings/
├── page.tsx                    # Main settings page with sidebar
├── layout.tsx                  # Settings layout wrapper
├── components/
│   ├── settings-sidebar.tsx    # Left navigation
│   ├── profile-section.tsx     # Profile settings
│   ├── salary-section.tsx      # Salary settings
│   ├── stock-options-section.tsx
│   ├── bonus-section.tsx
│   ├── expense-section.tsx
│   ├── probation-section.tsx
│   ├── holiday-section.tsx
│   ├── leave-policy-section.tsx
│   ├── portal-management-section.tsx
│   ├── bgv-section.tsx         # Background verification
│   ├── welcome-kit-section.tsx
│   └── modals/
│       ├── edit-profile-modal.tsx
│       ├── edit-salary-modal.tsx
│       ├── edit-template-modal.tsx
│       ├── edit-stock-modal.tsx
│       ├── edit-bonus-modal.tsx
│       ├── edit-expense-modal.tsx
│       ├── edit-probation-modal.tsx
│       ├── edit-holiday-modal.tsx
│       ├── edit-leave-modal.tsx
│       └── invite-manager-modal.tsx
└── types.ts                    # TypeScript interfaces
```

---

## Notes

1. **Currency**: All salary/monetary values shown in INR for Indian operations
2. **Rapid Recommended**: Platform provides recommended templates/standards
3. **Max Constraints**: Many fields have maximum limits based on tax regulations
4. **Compliance**: Leave policies follow Indian labor law minimums
5. **Plans**: BGV and Welcome Kit are add-on services with tiered pricing
