import { MockedProvider } from '@apollo/client/testing'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queries } from '@testing-library/dom'
import { RenderHookOptions, RenderOptions, render, renderHook } from '@testing-library/react'
import { ComponentType, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async/lib/index'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { ReactRouterUrlProvider } from '@luxexchange/lx/src/contexts/UrlContext'
import { MismatchContextProvider } from '@luxexchange/lx/src/features/smartWallet/mismatch/MismatchContext'
import { AssetActivityProvider } from '~/appGraphql/data/apollo/AssetActivityProvider'
import { TokenBalancesProvider } from '~/appGraphql/data/apollo/TokenBalancesProvider'
import TestWeb3Provider from '~/components/Web3Provider/TestWeb3Provider'
import { WebLuxProvider } from '~/components/Web3Provider/WebLuxContext'
import { WebAccountsStoreProvider } from '~/features/accounts/store/provider'
import { WebAccountsStoreUpdater } from '~/features/accounts/store/updater'
import { ConnectWalletMutationProvider } from '~/features/wallet/connection/hooks/useConnectWalletMutation'
import { ExternalWalletProvider } from '~/features/wallet/providers/ExternalWalletProvider'
import { BlockNumberContext } from '~/lib/hooks/useBlockNumber'
import store from '~/state'
import { ThemeProvider } from '~/theme'
import { GuiProvider } from '~/theme/guiProvider'

const queryClient = new QueryClient()

const BLOCK_NUMBER_CONTEXT = { fastForward: () => {}, block: 1234, mainnetBlock: 1234 }
function MockedBlockNumberProvider({ children }: PropsWithChildren) {
  return <BlockNumberContext.Provider value={BLOCK_NUMBER_CONTEXT}>{children}</BlockNumberContext.Provider>
}

function MockedMismatchProvider({ children }: PropsWithChildren) {
  return (
    <MismatchContextProvider
      address={undefined}
      chainId={undefined}
      mismatchCallback={() => Promise.resolve({ [String(1)]: false })}
      onHasAnyMismatch={() => {}}
      chains={[1]}
      defaultChainId={1}
      isTestnetModeEnabled={false}
    >
      {children}
    </MismatchContextProvider>
  )
}

function CommonTestProviders({ children }: PropsWithChildren) {
  return (
    <MockedProvider showWarnings={false}>
      <AssetActivityProvider>
        <TokenBalancesProvider>
          <ReactRouterUrlProvider>
            <MockedBlockNumberProvider>
              <ThemeProvider>
                <GuiProvider>
                  <WebAccountsStoreUpdater />
                  <MockedMismatchProvider>{children}</MockedMismatchProvider>
                </GuiProvider>
              </ThemeProvider>
            </MockedBlockNumberProvider>
          </ReactRouterUrlProvider>
        </TokenBalancesProvider>
      </AssetActivityProvider>
    </MockedProvider>
  )
}

function BaseWrapper({
  children,
  includeLuxContext = false,
}: PropsWithChildren<{ includeLuxContext?: boolean }>) {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TestWeb3Provider>
              <ConnectWalletMutationProvider>
                <WebAccountsStoreProvider>
                  <ExternalWalletProvider>
                    {/* TODO: figure out how to properly mock `WebLuxProvider` so that we can include it in all tests */}
                    {includeLuxContext ? (
                      <WebLuxProvider>
                        <CommonTestProviders>{children}</CommonTestProviders>
                      </WebLuxProvider>
                    ) : (
                      <CommonTestProviders>{children}</CommonTestProviders>
                    )}
                  </ExternalWalletProvider>
                </WebAccountsStoreProvider>
              </ConnectWalletMutationProvider>
            </TestWeb3Provider>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  )
}

const WithProviders = ({ children }: { children?: ReactNode }) => <BaseWrapper>{children}</BaseWrapper>
const WithLuxProviders = ({ children }: { children?: ReactNode }) => (
  <BaseWrapper includeLuxContext>{children}</BaseWrapper>
)

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  return render<typeof queries>(ui, { ...options, wrapper: WithProviders })
}

const customRenderWithLuxContext = (ui: ReactElement, options?: CustomRenderOptions) => {
  return render<typeof queries>(ui, { ...options, wrapper: WithLuxProviders })
}

type CustomRenderHookOptions<Props> = Omit<RenderHookOptions<Props>, 'wrapper'>
const customRenderHook = <Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: CustomRenderHookOptions<Props>,
) => {
  return renderHook(hook, { ...options, wrapper: WithProviders as ComponentType<PropsWithChildren<unknown>> })
}

// Testing utils may export *.
// eslint-disable-next-line no-restricted-syntax
export * from '@testing-library/react'
export {
  customRender as render,
  customRenderWithLuxContext as renderWithLuxContext,
  customRenderHook as renderHook,
}
