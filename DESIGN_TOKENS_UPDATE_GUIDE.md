# Design Tokens Update Guide

## Files to Update (Second Batch)

1. `/src/app/employer/payroll/dashboard/page.tsx`
2. `/src/app/employer/payroll/run/page.tsx`
3. `/src/app/employer/payroll/salary-structure/page.tsx`
4. `/src/app/employer/perks/page.tsx`
5. `/src/app/employer/services/page.tsx`
6. `/src/app/employer/updates/page.tsx`
7. `/src/app/employer/notifications/page.tsx`
8. `/src/app/employer/profile/page.tsx`

## Required Changes

### 1. Add Import Statement
```typescript
import { colors } from '@/lib/design-tokens'
```

### 2. Color Mapping

| Hex Code | Design Token | Usage |
|----------|--------------|-------|
| `#642DFC` | `colors.primary500` | Primary buttons, accents |
| `#586AF5` | `colors.iconBlue` | Icons, links |
| `#353B41` | `colors.neutral800` | Dark text |
| `#8593A3` | `colors.neutral500` | Secondary text |
| `#DEE4EB` | `colors.border` | Borders |
| `#F4F7FA` | `colors.neutral50` | Light backgrounds |
| `#A8B5C2` | `colors.neutral400` | Disabled states |
| `#EFF2F5` | `colors.neutral100` | Table headers |
| `#22957F` | `colors.success600` | Success states |
| `#CC7A00` | `colors.warning600` | Warning states |
| `#FF7373` | `colors.error600` | Error states |
| `#EBF5FF` | `colors.secondaryBlue50` | Feature backgrounds |

### 3. Replacement Patterns

#### Pattern 1: Text Colors in className
**Before:**
```tsx
<p className="text-[#8593A3] mt-1">Description</p>
```

**After:**
```tsx
<p className="mt-1" style={{ color: colors.neutral500 }}>Description</p>
```

#### Pattern 2: Background Colors
**Before:**
```tsx
<Card className="bg-[#EBF5FF] border-[#DEE4EB]">
```

**After:**
```tsx
<Card className="border" style={{ backgroundColor: colors.secondaryBlue50, borderColor: colors.border }}>
```

#### Pattern 3: Button Colors
**Before:**
```tsx
<Button className="bg-[#642DFC] hover:bg-[#5020d9]">
```

**After:**
```tsx
<Button className="text-white" style={{ backgroundColor: colors.primary500 }}>
```

#### Pattern 4: Icon Colors
**Before:**
```tsx
<Icon className="h-6 w-6 text-[#586AF5]" />
```

**After:**
```tsx
<Icon className="h-6 w-6" style={{ color: colors.iconBlue }} />
```

### 4. Special Cases

#### Opacity/Alpha Values
**Before:**
```tsx
<div className="bg-[#CC7A00]/10">
```

**After:**
```tsx
<div style={{ backgroundColor: `${colors.warning600}1A` }}>
```
(Use hex alpha: 10% = 1A, 20% = 33, 5% = 0D)

#### Multiple Style Properties
**Before:**
```tsx
<div className="border-[#DEE4EB] text-[#8593A3]">
```

**After:**
```tsx
<div style={{ borderColor: colors.border, color: colors.neutral500 }}>
```

## Automated Script

A Python script has been created at `update_design_tokens.py` that can help with basic replacements, but manual review is required for complex cases.

## Verification

After updates, verify:
1. Import statement is present
2. No hardcoded hex colors remain (except #2DD4BF which isn't in design tokens yet)
3. Inline styles are properly formatted
4. className retains spacing/layout classes (gap-, p-, m-, flex-, grid-, etc.)
5. Buttons with primary500 background have `text-white` className
