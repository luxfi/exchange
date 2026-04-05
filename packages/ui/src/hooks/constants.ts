import { spacing } from 'ui/src/theme'

export const DEFAULT_BOTTOM_INSET = spacing.spacing20

// Disabling eslint rules for PascalCase enum Member name as IPhoneSE feels wrong
export enum MobileDeviceHeight {
  // oxlint-disable-next-line typescript/naming-convention
  iPhoneSE = 667,
  // oxlint-disable-next-line typescript/naming-convention
  iPhone12 = 812,
}
