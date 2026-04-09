/**
 * Plan tier utilities — single source of truth for feature gating.
 *
 * Tier hierarchy:
 *   free (null) < standard < premium
 *
 * Chain/agency plans are treated as premium-level until
 * individual restrictions are defined.
 */

const STANDARD_PLANS = ["standard"];
const PREMIUM_PLANS = [
  "premium",
  "chain3", "chain5",
  "agency5", "agency10", "agency30",
];

/** Plan has at least standard-level access (notifications, basic analytics) */
export function isStandardOrAbove(planType: string | null | undefined): boolean {
  if (!planType) return false;
  return STANDARD_PLANS.includes(planType) || PREMIUM_PLANS.includes(planType);
}

/** Plan has premium-level access (AI analysis, CSV export, prompt editing) */
export function isPremiumPlan(planType: string | null | undefined): boolean {
  if (!planType) return false;
  return PREMIUM_PLANS.includes(planType);
}

/** Plan is locked (free tier — no paid features) */
export function isFreePlan(planType: string | null | undefined): boolean {
  return !planType;
}
