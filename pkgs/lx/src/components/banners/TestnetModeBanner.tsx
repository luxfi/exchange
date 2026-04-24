import { useTranslation } from 'react-i18next'
import { Flex, FlexProps, Text, TouchableArea } from '@l.x/ui/src'
import { Wrench } from '@l.x/ui/src/components/icons/Wrench'
// biome-ignore lint/style/noRestrictedImports: legacy import will be migrated
import { useDeviceInsets } from '@l.x/ui/src/hooks/useDeviceInsets'
import { zIndexes } from '@l.x/ui/src/theme'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { TESTNET_MODE_BANNER_HEIGHT } from '@l.x/lx/src/features/settings/hooks'
import { isMobileApp, isWebApp, isWebPlatform } from '@l.x/utils/src/platform'

export function TestnetModeBanner(props: FlexProps): JSX.Element | null {
  const { isTestnetModeEnabled } = useEnabledChains()
  const { navigateToAdvancedSettings } = useLuxContext()
  const { t } = useTranslation()

  const { top } = useDeviceInsets()

  if (!isTestnetModeEnabled) {
    return null
  }

  return (
    <TouchableArea
      position={isMobileApp ? 'absolute' : 'relative'}
      top={top}
      zIndex={zIndexes.fixed}
      width={isWebApp ? 'auto' : '100%'}
      onPress={navigateToAdvancedSettings}
    >
      <Flex
        row
        centered
        p="$padding12"
        gap="$gap8"
        backgroundColor="$statusSuccess2"
        borderWidth={isWebPlatform ? '$none' : '$spacing1'}
        borderBottomWidth="$spacing1"
        height={TESTNET_MODE_BANNER_HEIGHT}
        borderStyle="dashed"
        borderColor="$surface3"
        cursor="pointer"
        {...props}
      >
        <Wrench color="$statusSuccess" size="$icon.20" />
        <Text color="$statusSuccess" variant="body3">
          {t('home.banner.testnetMode')}
        </Text>
      </Flex>
    </TouchableArea>
  )
}
