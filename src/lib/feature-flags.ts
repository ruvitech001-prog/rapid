/**
 * Feature Flags Configuration
 *
 * Use environment variables to control feature rollout:
 * - Deploy with flags OFF in production
 * - Enable for internal testing/staging
 * - Gradual rollout: 10% → 50% → 100%
 * - Remove flag after 2 weeks of stable operation
 */

export const FEATURE_FLAGS = {
  // Authentication improvements (Phase 1)
  NEW_AUTH_FLOW: process.env.NEXT_PUBLIC_FF_NEW_AUTH_FLOW === 'true',

  // Multi-page offer creation workflow (Phase 2)
  MULTI_PAGE_OFFER: process.env.NEXT_PUBLIC_FF_MULTI_PAGE_OFFER === 'true',

  // Settings layout restructure (Phase 6)
  NEW_SETTINGS_LAYOUT: process.env.NEXT_PUBLIC_FF_NEW_SETTINGS === 'true',

  // Automated bonus payment requests (Phase 6)
  BONUS_AUTOMATION: process.env.NEXT_PUBLIC_FF_BONUS_AUTO === 'true',

  // Contracts to Offers rename (Phase 3)
  RENAME_CONTRACTS_TO_OFFERS: process.env.NEXT_PUBLIC_FF_RENAME_CONTRACTS === 'true',

  // Enhanced request filters (Phase 5)
  ENHANCED_REQUEST_FILTERS: process.env.NEXT_PUBLIC_FF_ENHANCED_REQUESTS === 'true',
} as const;

/**
 * Check if a feature is enabled
 * @param flag - Feature flag name
 * @returns boolean indicating if feature is enabled
 */
export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Get all enabled features (useful for debugging)
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([flag]) => flag);
}
