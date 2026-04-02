import { DeepLinkAction, parseDeepLinkUrl } from 'src/features/deepLinking/deepLinkUtils'

// Mock the logger
jest.mock('utilities/src/logger/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('getDeepLinkAction', () => {
  it.each`
    url                                                                                                  | expected
    ${'https://app.lux.org/app?screen=transaction&fiatOnRamp=true&userAddress=0x123'}                | ${DeepLinkAction.LuxWebLink}
    ${'lux://wc?uri=wc:123@2?relay-protocol=irn&symKey=51e'}                                         | ${DeepLinkAction.WalletConnectAsParam}
    ${'lux://wc:123@2?relay-protocol=irn&symKey=51e'}                                                | ${DeepLinkAction.LuxWalletConnect}
    ${'lux://widget/#/tokens/ethereum/0x...'}                                                        | ${DeepLinkAction.LuxWidget}
    ${'lux://scantastic?param=value'}                                                                | ${DeepLinkAction.Scantastic}
    ${'lux://uwulink?param=value'}                                                                   | ${DeepLinkAction.UwuLink}
    ${'https://lux.org/app?screen=transaction&fiatOnRamp=true&userAddress=0x123'}                    | ${DeepLinkAction.ShowTransactionAfterFiatOnRamp}
    ${'https://lux.org/app?screen=transaction&fiatOffRamp=true&userAddress=0x123'}                   | ${DeepLinkAction.ShowTransactionAfterFiatOffRampScreen}
    ${'https://lux.org/app?screen=transaction&userAddress=0x123'}                                    | ${DeepLinkAction.TransactionScreen}
    ${'https://lux.org/app?screen=swap&userAddress=0x123'}                                           | ${DeepLinkAction.SwapScreen}
    ${'lux://unsupported'}                                                                           | ${DeepLinkAction.SkipNonWalletConnect}
    ${'https://lux.org/app/wc?uri=wc:123'}                                                           | ${DeepLinkAction.UniversalWalletConnectLink}
    ${'wc:123@2?relay-protocol=irn&symKey=51e'}                                                          | ${DeepLinkAction.WalletConnect}
    ${'https://lux.org/app?screen=unknown'}                                                          | ${DeepLinkAction.Unknown}
    ${'lux://app/fiatonramp?userAddress=0x123&source=push'}                                          | ${DeepLinkAction.FiatOnRampScreen}
    ${'lux://app/fiatonramp?source=push&moonpayOnly=true&moonpayCurrencyCode=usdc&amount=100'}       | ${DeepLinkAction.FiatOnRampScreen}
    ${'lux://app/tokendetails?currencyId=10-0x6fd9d7ad17242c41f7131d257212c54a0e816691&source=push'} | ${DeepLinkAction.TokenDetails}
    ${'https://cryptothegame.com/'}                                                                      | ${DeepLinkAction.LuxExternalBrowserLink}
    ${'https://support.lux.org/hc/en-us/articles/test-article-123'}                                  | ${DeepLinkAction.LuxExternalBrowserLink}
    ${'https://blog.lux.org/article'}                                                                | ${DeepLinkAction.LuxExternalBrowserLink}
    ${'https://dex.lux.org/'}                                                                   | ${DeepLinkAction.LuxExternalBrowserLink}
  `('url=$url should return expected=$expected', ({ url, expected }) => {
    expect(parseDeepLinkUrl(url).action).toEqual(expected)
  })
})
