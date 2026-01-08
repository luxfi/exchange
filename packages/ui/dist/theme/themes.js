import { createTheme } from '@tamagui/core'
/**
 * Light theme
 */
export const lightTheme = createTheme({
  background: '#FFFFFF',
  backgroundHover: '#F4F4F5',
  backgroundPress: '#E4E4E7',
  backgroundFocus: '#F4F4F5',
  backgroundStrong: '#FAFAFA',
  backgroundTransparent: 'transparent',
  color: '#09090B',
  colorHover: '#18181B',
  colorPress: '#27272A',
  colorFocus: '#18181B',
  colorTransparent: 'transparent',
  borderColor: '#E4E4E7',
  borderColorHover: '#D4D4D8',
  borderColorPress: '#A1A1AA',
  borderColorFocus: '#FF6B00',
  placeholderColor: '#A1A1AA',
  // Semantic
  primary: '#FF6B00',
  primaryHover: '#FF8C00',
  secondary: '#F4F4F5',
  secondaryHover: '#E4E4E7',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Card
  card: '#FFFFFF',
  cardHover: '#FAFAFA',
  // Muted
  muted: '#F4F4F5',
  mutedForeground: '#71717A',
})
/**
 * Dark theme
 */
export const darkTheme = createTheme({
  background: '#09090B',
  backgroundHover: '#18181B',
  backgroundPress: '#27272A',
  backgroundFocus: '#18181B',
  backgroundStrong: '#0A0A0A',
  backgroundTransparent: 'transparent',
  color: '#FAFAFA',
  colorHover: '#FFFFFF',
  colorPress: '#E4E4E7',
  colorFocus: '#FFFFFF',
  colorTransparent: 'transparent',
  borderColor: '#27272A',
  borderColorHover: '#3F3F46',
  borderColorPress: '#52525B',
  borderColorFocus: '#FF6B00',
  placeholderColor: '#71717A',
  // Semantic
  primary: '#FF6B00',
  primaryHover: '#FF8C00',
  secondary: '#27272A',
  secondaryHover: '#3F3F46',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Card
  card: '#18181B',
  cardHover: '#27272A',
  // Muted
  muted: '#27272A',
  mutedForeground: '#A1A1AA',
})
