/**
 * Figma Design Tokens
 *
 * Centralized design system tokens matching Figma specifications
 * for the Rapid.one EoR Platform
 */

export const colors = {
  // Primary Colors
  primary500: '#642DFC', // Primary/500 (base)
  primary400: '#8357FD', // Primary/400
  primary300: '#A281FD', // Primary/300
  primary200: '#C1ABFE', // Primary/200
  primary100: '#E0D5FE', // Primary/100
  primary50: '#F6F2FF',  // Primary/50

  // Icon Blue
  iconBlue: '#586AF5',

  // Neutral Colors
  neutral900: '#1B1D21',
  neutral800: '#353B41',
  neutral700: '#505862',
  neutral600: '#6A7682',
  neutral500: '#8593A3', // Neutral/500 (base)
  neutral400: '#A8B5C2',
  neutral300: '#C3CCD6',
  neutral200: '#DEE4EB',
  neutral100: '#EFF2F5',
  neutral50: '#F4F7FA',

  // Secondary Blue
  secondaryBlue600: '#026ACA',
  secondaryBlue200: '#9ACEFE',
  secondaryBlue50: '#EBF5FF',

  // Success Colors
  success600: '#22957F',
  success200: '#A7ECCA',
  success50: '#EDF9F7',

  // Warning Colors
  warning600: '#CC7A00',
  warning200: '#FFDD99',
  warning50: '#FFF8EB',

  // Error Colors
  error600: '#FF7373',
  error50: '#FFEBEB',

  // Additional Colors
  aqua400: '#4AD3E5',
  aqua300: '#77DEEC',
  aqua200: '#A5E9F2',
  aqua50: '#F0FBFC',
  green200: '#A7ECCA',
  rose200: '#FFB5C6',
  rose50: '#FFF5F7',
  amber400: '#FBBF24',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  border: '#DEE4EB',
} as const

/**
 * Typography tokens matching Figma specifications
 */
export const typography = {
  // Headings
  heading1: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: '100%',
    letterSpacing: '0px',
  },
  heading2: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '100%',
    letterSpacing: '0px',
  },
  heading3: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '100%',
    letterSpacing: '0px',
  },
  heading4: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '100%',
    letterSpacing: '0.15px',
  },
  heading5: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '0.15px',
  },

  // Body
  bodyLarge: {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '27px',
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '21px',
    letterSpacing: '0.25px',
  },
  bodySmallest: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0.25px',
  },

  // Actions
  actionLarge: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.75px',
  },
  actionSmall: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.75px',
  },

  // Overline
  overlineLarge: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '100%',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
  },
  overlineSmall: {
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: '100%',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
  },
} as const

/**
 * Spacing tokens
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const

/**
 * Border radius tokens
 */
export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const

/**
 * Shadow tokens
 */
export const shadows = {
  xsmall: '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
  small: '0px 1px 3px 0px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)',
  medium: '0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.08)',
  large: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const

/**
 * Chart colors for data visualization
 */
export const chartColors = [
  colors.aqua200,
  colors.secondaryBlue200,
  colors.green200,
  colors.warning200,
  colors.aqua400,
  colors.rose200,
] as const

// Export all tokens as a single object
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  chartColors,
} as const

// Type exports for TypeScript
export type ColorToken = keyof typeof colors
export type TypographyToken = keyof typeof typography
export type SpacingToken = keyof typeof spacing
export type BorderRadiusToken = keyof typeof borderRadius
export type ShadowToken = keyof typeof shadows
