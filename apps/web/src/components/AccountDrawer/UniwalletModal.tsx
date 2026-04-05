import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Button, Flex, Image, QRCodeDisplay, Separator, Text, useSporeColors } from '@l.x/ui/src'
import { CloseIconWithHover } from '@l.x/ui/src/components/icons/CloseIconWithHover'
import { Modal } from '@l.x/lx/src/components/modals/Modal'
import { ElementName, InterfaceEventName, ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { isWebAndroid, isWebIOS } from '@l.x/utils/src/platform'
import { useEvent } from '@l.x/utils/src/react/hooks'
import MobileAppLogo from '~/assets/svg/lux_app_logo.svg'
=======
import { Button, Flex, Image, QRCodeDisplay, Separator, Text, useSporeColors } from 'ui/src'
import { CloseIconWithHover } from 'ui/src/components/icons/CloseIconWithHover'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { ElementName, InterfaceEventName, ModalName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { isWebAndroid, isWebIOS } from 'utilities/src/platform'
import { useEvent } from 'utilities/src/react/hooks'
import MobileAppLogo from '~/assets/svg/uniswap_app_logo.svg'
>>>>>>> upstream/main
import { useConnectWallet } from '~/features/wallet/connection/hooks/useConnectWallet'
import { openDownloadApp } from '~/utils/openDownloadApp'

export default function UniwalletModal() {
  const { t } = useTranslation()
  const [uri, setUri] = useState<string>()

  const { isConnecting, reset } = useConnectWallet()

<<<<<<< HEAD
  // Displays the modal if not on iOS/Android, a Lux Wallet Connection is pending, & qrcode URI is available
=======
  // Displays the modal if not on iOS/Android, a Uniswap Wallet Connection is pending, & qrcode URI is available
>>>>>>> upstream/main
  const onLaunchedMobilePlatform = isWebIOS || isWebAndroid
  const open = !onLaunchedMobilePlatform && !!uri && isConnecting

  useEffect(() => {
    function listener({ type, data }: { type: string; data?: unknown }) {
<<<<<<< HEAD
      if (type === 'display_lux_uri' && typeof data === 'string') {
=======
      if (type === 'display_uniswap_uri' && typeof data === 'string') {
>>>>>>> upstream/main
        setUri(data)
      }
    }

<<<<<<< HEAD
    window.addEventListener('display_lux_uri', listener)

    return () => {
      window.removeEventListener('display_lux_uri', listener)
=======
    window.addEventListener('display_uniswap_uri', listener)

    return () => {
      window.removeEventListener('display_uniswap_uri', listener)
>>>>>>> upstream/main
    }
  }, [])

  const close = useEvent(() => {
    reset()
    setUri(undefined)
  })

  useEffect(() => {
    if (open) {
<<<<<<< HEAD
      sendAnalyticsEvent(InterfaceEventName.LuxWalletConnectModalOpened)
=======
      sendAnalyticsEvent(InterfaceEventName.UniswapWalletConnectModalOpened)
>>>>>>> upstream/main
    } else {
      setUri(undefined)
    }
  }, [open])

  const colors = useSporeColors()
  return (
    <Modal name={ModalName.UniWalletConnect} isModalOpen={open} onClose={close} padding={0}>
      <Flex shrink grow p="$spacing20">
        <Flex row justifyContent="space-between">
          <Text variant="subheading1">{t('account.drawer.modal.scan')}</Text>
          <CloseIconWithHover onClose={close} />
        </Flex>

        <Flex row my="$spacing24" centered>
          {uri && (
            <QRCodeDisplay
              ecl="M"
              color={colors.accent1.val}
              containerBackgroundColor={colors.surface1.val}
              encodedValue={uri}
              size={370}
            >
              <Flex borderRadius="$rounded32" borderWidth="$spacing8" borderColor="$surface2">
                <Image src={MobileAppLogo} width={81} height={81} />
              </Flex>
            </QRCodeDisplay>
          )}
        </Flex>
        <Separator />
        <Flex centered row pt="$spacing20" justifyContent="space-between" gap="$spacing20">
          <Flex shrink>
            <Text variant="subheading2">{t('account.drawer.modal.dont')}</Text>
            <Text variant="body3" color="$neutral2">
              {t('account.drawer.modal.body')}
            </Text>
          </Flex>
          <Flex row>
            <Button
              size="small"
              emphasis="primary"
              variant="branded"
<<<<<<< HEAD
              onPress={() => openDownloadApp({ element: ElementName.LuxWalletModalDownloadButton })}
=======
              onPress={() => openDownloadApp({ element: ElementName.UniswapWalletModalDownloadButton })}
>>>>>>> upstream/main
            >
              {t('common.download')}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  )
}
