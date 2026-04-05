<<<<<<< HEAD
import { brand, getBrandUrl } from '@l.x/config'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LayerGroup } from '@l.x/ui/src/components/icons/LayerGroup'
import { LuxLogo } from '@l.x/ui/src/components/icons/LXLogo'
import { DEXGeneric } from '@l.x/ui/src/components/icons/DEXGeneric'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LayerGroup } from 'ui/src/components/icons/LayerGroup'
import { Unichain } from 'ui/src/components/icons/Unichain'
import { UniswapLogo } from 'ui/src/components/icons/UniswapLogo'
import { UniswapXGeneric } from 'ui/src/components/icons/UniswapXGeneric'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

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
<<<<<<< HEAD
  wallet: <LuxLogo size="$icon.20" color="$accent1" />,
  dex: <DEXGeneric size="$icon.20" color="$accent1" />,
  tradingApi: <LayerGroup size="$icon.20" color="$accent1" />,
  protocol: <LuxLogo size="$icon.20" color="$accent1" />,
=======
  wallet: <UniswapLogo size="$icon.20" color="$accent1" />,
  uniswapX: <UniswapXGeneric size="$icon.20" color="$accent1" />,
  tradingApi: <LayerGroup size="$icon.20" color="$accent1" />,
  unichain: <Unichain size="$icon.20" color="$accent1" />,
>>>>>>> upstream/main
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
<<<<<<< HEAD
            href: lxUrls.downloadWalletUrl,
=======
            href: uniswapUrls.downloadWalletUrl,
>>>>>>> upstream/main
            icon: MENU_ICONS.wallet,
            body: t('nav.products.wallet'),
            elementName: ElementName.NavbarCompanyMenuWallet,
          },
          {
<<<<<<< HEAD
            label: t('common.dex'),
            href: lxUrls.dexUrl,
            icon: MENU_ICONS.dex,
            body: t('nav.products.dex'),
            elementName: ElementName.NavbarCompanyMenuDEX,
          },
          {
            label: t('landing.api'),
            href: lxUrls.tradingApiDocsUrl,
=======
            label: t('common.uniswapX'),
            href: uniswapUrls.uniswapXUrl,
            icon: MENU_ICONS.uniswapX,
            body: t('nav.products.uniswapX'),
            elementName: ElementName.NavbarCompanyMenuUniswapX,
          },
          {
            label: t('landing.api'),
            href: uniswapUrls.tradingApiDocsUrl,
>>>>>>> upstream/main
            icon: MENU_ICONS.tradingApi,
            body: t('nav.products.tradingApi'),
            elementName: ElementName.NavbarCompanyMenuTradingApi,
          },
          {
<<<<<<< HEAD
            label: brand.name,
            href: getBrandUrl('/network'),
            icon: MENU_ICONS.protocol,
            body: t('landing.network.subtitle'),
=======
            label: t('common.unichain'),
            href: uniswapUrls.unichainUrl,
            icon: MENU_ICONS.unichain,
            body: t('nav.products.unichain'),
>>>>>>> upstream/main
            elementName: ElementName.NavbarCompanyMenuUnichain,
          },
        ],
      },
      [MenuSectionTitle.Protocol]: {
        title: t('common.protocol'),
        items: [
<<<<<<< HEAD
          { label: t('common.vote'), href: lxUrls.voteUrl, elementName: ElementName.NavbarCompanyMenuVote },
          {
            label: t('common.governance'),
            href: lxUrls.governanceUrl,
=======
          { label: t('common.vote'), href: uniswapUrls.voteUrl, elementName: ElementName.NavbarCompanyMenuVote },
          {
            label: t('common.governance'),
            href: uniswapUrls.governanceUrl,
>>>>>>> upstream/main
            elementName: ElementName.NavbarCompanyMenuGovernance,
          },
          {
            label: t('common.developers'),
<<<<<<< HEAD
            href: lxUrls.developersUrl,
=======
            href: uniswapUrls.developersUrl,
>>>>>>> upstream/main
            elementName: ElementName.NavbarCompanyMenuDevelopers,
          },
        ],
      },
      [MenuSectionTitle.Company]: {
        title: t('common.company'),
        items: [
<<<<<<< HEAD
          { label: t('common.about'), href: lxUrls.aboutUrl, elementName: ElementName.NavbarCompanyMenuAbout },
          {
            label: t('common.careers'),
            href: lxUrls.careersUrl,
            elementName: ElementName.NavbarCompanyMenuCareers,
          },
          { label: t('common.blog'), href: lxUrls.blogUrl, elementName: ElementName.NavbarCompanyMenuBlog },
=======
          { label: t('common.about'), href: uniswapUrls.aboutUrl, elementName: ElementName.NavbarCompanyMenuAbout },
          {
            label: t('common.careers'),
            href: uniswapUrls.careersUrl,
            elementName: ElementName.NavbarCompanyMenuCareers,
          },
          { label: t('common.blog'), href: uniswapUrls.blogUrl, elementName: ElementName.NavbarCompanyMenuBlog },
>>>>>>> upstream/main
        ],
      },
      [MenuSectionTitle.NeedHelp]: {
        title: t('common.needHelp'),
        items: [
          {
            label: t('common.helpCenter'),
<<<<<<< HEAD
            href: lxUrls.helpCenterUrl,
=======
            href: uniswapUrls.helpCenterUrl,
>>>>>>> upstream/main
            elementName: ElementName.NavbarCompanyMenuHelpCenter,
          },
          {
            label: t('common.contactUs.button'),
<<<<<<< HEAD
            href: lxUrls.helpRequestUrl,
            elementName: ElementName.NavbarCompanyMenuContactUs,
          },
=======
            href: uniswapUrls.helpRequestUrl,
            elementName: ElementName.NavbarCompanyMenuContactUs,
          },
          {
            label: t('common.bugBounty'),
            href: uniswapUrls.bugBountyUrl,
            elementName: ElementName.NavbarCompanyMenuBugBounty,
          },
>>>>>>> upstream/main
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
