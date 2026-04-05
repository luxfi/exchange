import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
<<<<<<< HEAD
import { Flex, Text } from '@l.x/ui/src'
import { lxUrls } from '@l.x/lx/src/constants/urls'
=======
import { Flex, Text } from 'ui/src'
import { uniswapUrls } from 'uniswap/src/constants/urls'
>>>>>>> upstream/main

export function NoDappConnections(): JSX.Element {
  const { t } = useTranslation()
  return (
    <Flex centered pt="$spacing60" px="$padding12" flex={1} gap="$gap4">
      <Text color="$neutral1" variant="body2">
        {t('walletConnect.dapps.manage.empty.title')}
      </Text>
      <Text color="$neutral2" variant="body3" textAlign="center">
        {t('settings.setting.connections.noConnectionsDescription')}
      </Text>
      <Link
        style={{ textDecoration: 'none', marginTop: 8 }}
        target="_blank"
<<<<<<< HEAD
        to={lxUrls.helpArticleUrls.extensionDappTroubleshooting}
=======
        to={uniswapUrls.helpArticleUrls.extensionDappTroubleshooting}
>>>>>>> upstream/main
      >
        <Text color="$accent1" textAlign="center" variant="buttonLabel3">
          {t('extension.connection.popup.trouble')}
        </Text>
      </Link>
    </Flex>
  )
}
