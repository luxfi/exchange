import { createPromiseClient, type Transport } from '@connectrpc/connect'
import { EmbeddedWalletService as OldEmbeddedWalletService } from '@luxamm/client-embeddedwallet/dist/uniswap/embeddedwallet/v1/service_connect'
import type { EmbeddedWalletApiClient as EmbeddedWalletApiClientType, EmbeddedWalletClientContext } from '@l.x/api'
import { createEmbeddedWalletApiClient, getTransport } from '@l.x/api'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { getVersionHeader } from '@l.x/lx/src/data/getVersionHeader'
import { isMobileApp } from 'utilities/src/platform'
import { REQUEST_SOURCE } from 'utilities/src/platform/requestSource'

function createEmbeddedWalletTransport(): Transport {
  return getTransport({
    getBaseUrl: () => lxUrls.privyEmbeddedWalletUrl,
    getHeaders: () => ({
      ...(isMobileApp && { Origin: lxUrls.requestOriginUrl }),
      'x-request-source': REQUEST_SOURCE,
      'x-app-version': getVersionHeader(),
    }),
  })
}

const embeddedWalletTransport = createEmbeddedWalletTransport()

const oldEmbeddedWalletRpcClient = createPromiseClient(OldEmbeddedWalletService, embeddedWalletTransport)

let _apiClientPromise: Promise<EmbeddedWalletApiClientType> | undefined

async function getApiClient(): Promise<EmbeddedWalletApiClientType> {
  if (!_apiClientPromise) {
    _apiClientPromise = (async (): Promise<EmbeddedWalletApiClientType> => {
      try {
        const { EmbeddedWalletService: NewEmbeddedWalletService } = await import(
          /* @vite-ignore */
          '@luxamm/client-privy-embedded-wallet/dist/uniswap/privy-embedded-wallet/v1/service_connect'
        )
        const newRpcClient = createPromiseClient(
          NewEmbeddedWalletService,
          embeddedWalletTransport,
        ) as unknown as EmbeddedWalletClientContext['rpcClient']
        return createEmbeddedWalletApiClient({
          rpcClient: newRpcClient,
          legacyRpcClient: oldEmbeddedWalletRpcClient,
        })
      } catch {
        throw new Error('Embedded Wallet requires @luxamm/client-privy-embedded-wallet (private Lux package). ')
      }
    })()
  }
  return _apiClientPromise
}

getApiClient().catch(() => {
  // Expected to fail without NPM_READ_ONLY_TOKEN
})

export const EmbeddedWalletApiClient: EmbeddedWalletApiClientType = {
  fetchChallengeRequest: (...args) => getApiClient().then((c) => c.fetchChallengeRequest(...args)),
  fetchCreateWalletRequest: (...args) => getApiClient().then((c) => c.fetchCreateWalletRequest(...args)),
  fetchWalletSigninRequest: (...args) => getApiClient().then((c) => c.fetchWalletSigninRequest(...args)),
  fetchSignMessagesRequest: (...args) => getApiClient().then((c) => c.fetchSignMessagesRequest(...args)),
  fetchSignTransactionsRequest: (...args) => getApiClient().then((c) => c.fetchSignTransactionsRequest(...args)),
  fetchSignTypedDataRequest: (...args) => getApiClient().then((c) => c.fetchSignTypedDataRequest(...args)),
  fetchDisconnectRequest: (...args) => getApiClient().then((c) => c.fetchDisconnectRequest(...args)),
  fetchSecuredChallengeRequest: (...args) => getApiClient().then((c) => c.fetchSecuredChallengeRequest(...args)),
  fetchExportSeedPhraseRequest: (...args) => getApiClient().then((c) => c.fetchExportSeedPhraseRequest(...args)),
  fetchListAuthenticatorsRequest: (...args) => getApiClient().then((c) => c.fetchListAuthenticatorsRequest(...args)),
  fetchStartAuthenticatedSessionRequest: (...args) =>
    getApiClient().then((c) => c.fetchStartAuthenticatedSessionRequest(...args)),
  fetchAddAuthenticatorRequest: (...args) => getApiClient().then((c) => c.fetchAddAuthenticatorRequest(...args)),
  fetchDeleteAuthenticatorRequest: (...args) => getApiClient().then((c) => c.fetchDeleteAuthenticatorRequest(...args)),
  fetchOprfEvaluate: (...args) => getApiClient().then((c) => c.fetchOprfEvaluate(...args)),
  fetchSetupRecovery: (...args) => getApiClient().then((c) => c.fetchSetupRecovery(...args)),
  fetchExecuteRecovery: (...args) => getApiClient().then((c) => c.fetchExecuteRecovery(...args)),
  fetchReportDecryptionResult: (...args) => getApiClient().then((c) => c.fetchReportDecryptionResult(...args)),
  fetchGetRecoveryConfig: (...args) => getApiClient().then((c) => c.fetchGetRecoveryConfig(...args)),
  fetchDeleteRecovery: (...args) => getApiClient().then((c) => c.fetchDeleteRecovery(...args)),
}
