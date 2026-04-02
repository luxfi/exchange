import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LayerGroup } from '@luxfi/ui/src/components/icons/LayerGroup'
import { Unichain } from '@luxfi/ui/src/components/icons/Unichain'
import { LuxLogo } from '@luxfi/ui/src/components/icons/LuxLogo'
import { DEXGeneric } from '@luxfi/ui/src/components/icons/DEXGeneric'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'

export interface MenuItem {
  label: string
  href: string
  internal?: boolean
  overflow?: boolean
  closeMenu?: () => void
  icon?: React.ReactNode
  body?: string
  elementName: ElementName
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
  dex: <DEXGeneric size="$icon.20" color="$accent1" />,
  tradingApi: <LayerGroup size="$icon.20" color="$accent1" />,
  unichain: <Unichain size="$icon.20" color="$accent1" />,
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
            href: lxUrls.downloadWalletUrl,
            icon: MENU_ICONS.wallet,
            body: t('nav.products.wallet'),
            elementName: ElementName.NavbarCompanyMenuWallet,
          },
          {
            label: t('common.dex'),
            href: lxUrls.dexUrl,
            icon: MENU_ICONS.dex,
            body: t('nav.products.dex'),
            elementName: ElementName.NavbarCompanyMenuDEX,
          },
          {
            label: t('landing.api'),
            href: lxUrls.tradingApiDocsUrl,
            icon: MENU_ICONS.tradingApi,
            body: t('nav.products.tradingApi'),
            elementName: ElementName.NavbarCompanyMenuTradingApi,
          },
          {
            label: t('common.unichain'),
            href: lxUrls.unichainUrl,
            icon: MENU_ICONS.unichain,
            body: t('nav.products.unichain'),
            elementName: ElementName.NavbarCompanyMenuUnichain,
          },
        ],
      },
      [MenuSectionTitle.Protocol]: {
        title: t('common.protocol'),
        items: [
          { label: t('common.vote'), href: lxUrls.voteUrl, elementName: ElementName.NavbarCompanyMenuVote },
          {
            label: t('common.governance'),
            href: lxUrls.governanceUrl,
            elementName: ElementName.NavbarCompanyMenuGovernance,
          },
          {
            label: t('common.developers'),
            href: lxUrls.developersUrl,
            elementName: ElementName.NavbarCompanyMenuDevelopers,
          },
        ],
      },
      [MenuSectionTitle.Company]: {
        title: t('common.company'),
        items: [
          { label: t('common.about'), href: lxUrls.aboutUrl, elementName: ElementName.NavbarCompanyMenuAbout },
          {
            label: t('common.careers'),
            href: lxUrls.careersUrl,
            elementName: ElementName.NavbarCompanyMenuCareers,
          },
          { label: t('common.blog'), href: lxUrls.blogUrl, elementName: ElementName.NavbarCompanyMenuBlog },
        ],
      },
      [MenuSectionTitle.NeedHelp]: {
        title: t('common.needHelp'),
        items: [
          {
            label: t('common.helpCenter'),
            href: lxUrls.helpCenterUrl,
            elementName: ElementName.NavbarCompanyMenuHelpCenter,
          },
          {
            label: t('common.contactUs.button'),
            href: lxUrls.helpRequestUrl,
            elementName: ElementName.NavbarCompanyMenuContactUs,
          },
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
