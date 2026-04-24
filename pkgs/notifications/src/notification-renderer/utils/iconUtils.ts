import type { GeneratedIcon } from '@l.x/ui/src/components/factories/createIcon'
import { AlertTriangle } from '@l.x/ui/src/components/icons/AlertTriangle'
import { Bell } from '@l.x/ui/src/components/icons/Bell'
import { Chart } from '@l.x/ui/src/components/icons/Chart'
import { CheckCircleFilled } from '@l.x/ui/src/components/icons/CheckCircleFilled'
import { Coin } from '@l.x/ui/src/components/icons/Coin'
import { CoinConvert } from '@l.x/ui/src/components/icons/CoinConvert'
import { EthMini } from '@l.x/ui/src/components/icons/EthMini'
import { Gas } from '@l.x/ui/src/components/icons/Gas'
import { Gift } from '@l.x/ui/src/components/icons/Gift'
import { Globe } from '@l.x/ui/src/components/icons/Globe'
import { InfoCircleFilled } from '@l.x/ui/src/components/icons/InfoCircleFilled'
import { Lightning } from '@l.x/ui/src/components/icons/Lightning'
import { Rocket } from '@l.x/ui/src/components/icons/Rocket'
import { SendAction } from '@l.x/ui/src/components/icons/SendAction'
import { ShieldCheck } from '@l.x/ui/src/components/icons/ShieldCheck'
import { Star } from '@l.x/ui/src/components/icons/Star'
import { Wallet } from '@l.x/ui/src/components/icons/Wallet'

/**
 * Map of custom icon names to their corresponding icon components.
 * Used for parsing notification icon links in the format "custom:<iconName>" or "custom:<iconName>-$<colorToken>".
 */
export const CUSTOM_ICON_MAP: Record<string, GeneratedIcon> = {
  lightning: Lightning,
  wallet: Wallet,
  chart: Chart,
  gas: Gas,
  coin: Coin,
  'coin-convert': CoinConvert,
  ethereum: EthMini,
  rocket: Rocket,
  star: Star,
  gift: Gift,
  check: CheckCircleFilled,
  info: InfoCircleFilled,
  shield: ShieldCheck,
  bell: Bell,
  send: SendAction,
  globe: Globe,
  // Alert/warning icons
  'alert-triangle': AlertTriangle,
  'caution-triangle': AlertTriangle,
}

export interface ParsedCustomIcon {
  iconName: string
  colorToken: string | undefined
  IconComponent: GeneratedIcon | undefined
}

/**
 * Parses a custom icon link string and returns the icon component and color token.
 *
 * Supports two formats:
 * - "custom:<iconName>" - Returns icon with no color token (use default)
 * - "custom:<iconName>-$<colorToken>" - Returns icon with specified color token
 *
 * @example
 * parseCustomIconLink("custom:globe") // { iconName: "globe", colorToken: undefined, IconComponent: Globe }
 * parseCustomIconLink("custom:lightning-$accent1") // { iconName: "lightning", colorToken: "$accent1", IconComponent: Lightning }
 * parseCustomIconLink("https://example.com/icon.png") // { iconName: "", colorToken: undefined, IconComponent: undefined }
 */
export function parseCustomIconLink(iconLink: string | undefined): ParsedCustomIcon {
  if (!iconLink || typeof iconLink !== 'string' || !iconLink.startsWith('custom:')) {
    return { iconName: '', colorToken: undefined, IconComponent: undefined }
  }

  // Remove "custom:" prefix
  const customPart = iconLink.slice(7)

  // Check for color token format: "iconName-$colorToken"
  const colorTokenMatch = customPart.match(/^(.+)-(\$\w+)$/)
  if (colorTokenMatch && colorTokenMatch[1] && colorTokenMatch[2]) {
    const iconName = colorTokenMatch[1]
    const colorToken = colorTokenMatch[2]
    return {
      iconName,
      colorToken,
      IconComponent: CUSTOM_ICON_MAP[iconName],
    }
  }

  // Simple format: just "iconName"
  const iconName = customPart.toLowerCase()
  return {
    iconName,
    colorToken: undefined,
    IconComponent: CUSTOM_ICON_MAP[iconName],
  }
}

/**
 * Gets the icon component for a custom icon link, returning undefined if not found.
 *
 * @example
 * getCustomIconComponent("custom:globe") // Globe
 * getCustomIconComponent("custom:lightning-$accent1") // Lightning
 * getCustomIconComponent("https://example.com/icon.png") // undefined
 */
export function getCustomIconComponent(iconLink: string | undefined): GeneratedIcon | undefined {
  return parseCustomIconLink(iconLink).IconComponent
}
