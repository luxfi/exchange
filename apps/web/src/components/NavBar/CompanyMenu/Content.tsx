import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LayerGroup } from 'ui/src/components/icons/LayerGroup'
import { LuxLogo } from 'ui/src/components/icons/LuxLogo'
import { uniswapUrls } from 'uniswap/src/constants/urls'

export interface MenuItem {
  label: string
  href: string
  internal?: boolean
  overflow?: boolean
  closeMenu?: () => void
  icon?: React.ReactNode
  body?: string
}

export interface MenuSection {
  title: string
  items: MenuItem[]
  closeMenu?: () => void
}

export enum MenuSectionTitle {
  Products = 'Products',
  Protocol = 'Protocol',
  Company = 'Company',
  NeedHelp = 'NeedHelp',
}

const MENU_ICONS = {
  wallet: <LuxLogo size="$icon.20" color="$accent1" />,
  luxDex: <LuxLogo size="$icon.20" color="$accent1" />,
  tradingApi: <LayerGroup size="$icon.20" color="$accent1" />,
  luxNetwork: <LuxLogo size="$icon.20" color="$accent1" />,
} as const

export const useMenuContent = (args?: {
  keys?: MenuSectionTitle[]
}): Partial<{ [key in MenuSectionTitle]: MenuSection }> => {
  const { t } = useTranslation()
  const { keys } = args || {}

  return useMemo(() => {
    const menuContent = {
      [MenuSectionTitle.Products]: {
        title: t('common.products'),
        items: [
          {
            label: t('common.wallet.label'),
            href: uniswapUrls.downloadWalletUrl,
            icon: MENU_ICONS.wallet,
            body: t('nav.products.wallet'),
          },
          {
            label: 'Lux DEX',
            href: 'https://dex.lux.network',
            icon: MENU_ICONS.luxDex,
            body: 'High-performance native DEX',
          },
          {
            label: t('landing.api'),
            href: uniswapUrls.tradingApiDocsUrl,
            icon: MENU_ICONS.tradingApi,
            body: t('nav.products.tradingApi'),
          },
          {
            label: 'Lux Network',
            href: 'https://lux.network',
            icon: MENU_ICONS.luxNetwork,
            body: 'High-performance multi-chain blockchain',
          },
        ],
      },
      [MenuSectionTitle.Protocol]: {
        title: t('common.protocol'),
        items: [
          { label: t('common.vote'), href: uniswapUrls.voteUrl },
          { label: t('common.governance'), href: uniswapUrls.governanceUrl },
          { label: t('common.developers'), href: uniswapUrls.developersUrl },
        ],
      },
      [MenuSectionTitle.Company]: {
        title: t('common.company'),
        items: [
          { label: t('common.about'), href: uniswapUrls.aboutUrl },
          { label: t('common.careers'), href: uniswapUrls.careersUrl },
          { label: t('common.blog'), href: uniswapUrls.blogUrl },
        ],
      },
      [MenuSectionTitle.NeedHelp]: {
        title: t('common.needHelp'),
        items: [
          { label: t('common.helpCenter'), href: uniswapUrls.helpCenterUrl },
          { label: t('common.contactUs.button'), href: uniswapUrls.helpRequestUrl },
        ],
      },
    }

    if (keys) {
      const filteredEntries = Object.entries(menuContent).filter(([key]) => keys.includes(key as MenuSectionTitle))
      return Object.fromEntries(filteredEntries) as Partial<{ [key in MenuSectionTitle]: MenuSection }>
    }

    return menuContent
  }, [t, keys])
}
