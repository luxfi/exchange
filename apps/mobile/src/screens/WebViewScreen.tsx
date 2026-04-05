import React, { useCallback, useRef } from 'react'
import WebView from 'react-native-webview'
import { AppStackScreenProp, SettingsStackScreenProp } from 'src/app/navigation/types'
import { BackHeader } from 'src/components/layout/BackHeader'
import { Screen } from 'src/components/layout/Screen'
<<<<<<< HEAD
import { Separator, Text } from '@l.x/ui/src'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { MobileScreens } from '@l.x/lx/src/types/screens/mobile'
import { useActiveAccountAddress } from '@luxfi/wallet/src/features/wallet/hooks'
=======
import { Separator, Text } from 'ui/src'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { MobileScreens } from 'uniswap/src/types/screens/mobile'
import { useActiveAccountAddress } from 'wallet/src/features/wallet/hooks'
>>>>>>> upstream/main

export function WebViewScreen({
  route,
}: SettingsStackScreenProp<MobileScreens.WebView> | AppStackScreenProp<MobileScreens.WebView>): JSX.Element {
  const { headerTitle, uriLink } = route.params

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <BackHeader alignment="center" mb="$spacing16" pt="$spacing4" px="$spacing12">
        <Text variant="body1">{headerTitle}</Text>
      </BackHeader>

      <Separator />

<<<<<<< HEAD
      {uriLink === lxUrls.helpUrl ? <ZendeskWebView uriLink={uriLink} /> : <WebView source={{ uri: uriLink }} />}
=======
      {uriLink === uniswapUrls.helpUrl ? <ZendeskWebView uriLink={uriLink} /> : <WebView source={{ uri: uriLink }} />}
>>>>>>> upstream/main
    </Screen>
  )
}

function ZendeskWebView({ uriLink }: { uriLink: string }): JSX.Element {
  const webviewRef = useRef<WebView>(null)

  const zendeskInjectJs = usePrefillAddressInZendeskTicketJs()

  const onNavigationStateChange = useCallback(
    ({ url }: { url: string }): void => {
<<<<<<< HEAD
      if (zendeskInjectJs && url.startsWith(`${lxUrls.helpUrl}/requests/new`)) {
=======
      if (zendeskInjectJs && url.startsWith(`${uniswapUrls.helpUrl}/requests/new`)) {
>>>>>>> upstream/main
        webviewRef.current?.injectJavaScript(zendeskInjectJs)
      }
    },
    [zendeskInjectJs],
  )

  return <WebView ref={webviewRef} source={{ uri: uriLink }} onNavigationStateChange={onNavigationStateChange} />
}

const WALLET_ADDRESS_QUERY_SELECTOR = '#request_custom_fields_11041337007757'

function usePrefillAddressInZendeskTicketJs(): string | null {
  const address = useActiveAccountAddress()

  if (!address) {
    return null
  }

  return `(function() {
    var input = document.querySelector('${WALLET_ADDRESS_QUERY_SELECTOR}');
    if (!input) { return; }
    input.value = "${address}";
  })();`
}
