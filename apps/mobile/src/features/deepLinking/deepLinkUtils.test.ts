import { DeepLinkAction, parseDeepLinkUrl } from 'src/features/deepLinking/deepLinkUtils'

// Mock the logger
jest.mock('@l.x/utils/src/logger/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('getDeepLinkAction', () => {
  it.each`
    url                                                                                                  | expected
    ${'https://app.lux.network/app?screen=transaction&fiatOnRamp=true&userAddress=0x123'}                | ${DeepLinkAction.UniswapWebLink}
    ${'uniswap://wc?uri=wc:123@2?relay-protocol=irn&symKey=51e'}                                         | ${DeepLinkAction.WalletConnectAsParam}
    ${'uniswap://wc:123@2?relay-protocol=irn&symKey=51e'}                                                | ${DeepLinkAction.UniswapWalletConnect}
    ${'uniswap://widget/#/tokens/ethereum/0x...'}                                                        | ${DeepLinkAction.UniswapWidget}
    ${'uniswap://scantastic?param=value'}                                                                | ${DeepLinkAction.Scantastic}
    ${'uniswap://uwulink?param=value'}                                                                   | ${DeepLinkAction.UwuLink}
    ${'https://lux.network/app?screen=transaction&fiatOnRamp=true&userAddress=0x123'}                    | ${DeepLinkAction.ShowTransactionAfterFiatOnRamp}
    ${'https://lux.network/app?screen=transaction&fiatOffRamp=true&userAddress=0x123'}                   | ${DeepLinkAction.ShowTransactionAfterFiatOffRampScreen}
    ${'https://lux.network/app?screen=transaction&userAddress=0x123'}                                    | ${DeepLinkAction.TransactionScreen}
    ${'https://lux.network/app?screen=swap&userAddress=0x123'}                                           | ${DeepLinkAction.SwapScreen}
    ${'uniswap://unsupported'}                                                                           | ${DeepLinkAction.SkipNonWalletConnect}
    ${'https://lux.network/app/wc?uri=wc:123'}                                                           | ${DeepLinkAction.UniversalWalletConnectLink}
    ${'wc:123@2?relay-protocol=irn&symKey=51e'}                                                          | ${DeepLinkAction.WalletConnect}
    ${'https://lux.network/app?screen=unknown'}                                                          | ${DeepLinkAction.Unknown}
    ${'uniswap://app/fiatonramp?userAddress=0x123&source=push'}                                          | ${DeepLinkAction.FiatOnRampScreen}
    ${'uniswap://app/fiatonramp?source=push&moonpayOnly=true&moonpayCurrencyCode=usdc&amount=100'}       | ${DeepLinkAction.FiatOnRampScreen}
    ${'uniswap://app/tokendetails?currencyId=10-0x6fd9d7ad17242c41f7131d257212c54a0e816691&source=push'} | ${DeepLinkAction.TokenDetails}
    ${'https://cryptothegame.com/'}                                                                      | ${DeepLinkAction.UniswapExternalBrowserLink}
    ${'https://support.lux.network/hc/en-us/articles/test-article-123'}                                  | ${DeepLinkAction.UniswapExternalBrowserLink}
    ${'https://blog.lux.network/article'}                                                                | ${DeepLinkAction.UniswapExternalBrowserLink}
    ${'https://uniswapx.lux.network/'}                                                                   | ${DeepLinkAction.UniswapExternalBrowserLink}
  `('url=$url should return expected=$expected', ({ url, expected }) => {
    expect(parseDeepLinkUrl(url).action).toEqual(expected)
  })
})
