import type { Action } from '@uniswap/client-privy-embedded-wallet/dist/uniswap/privy-embedded-wallet/v1/service_pb'
import type { SignAuth } from '@universe/api'
import { EmbeddedWalletApiClient } from 'uniswap/src/data/rest/embeddedWallet/requests'
import { getDeviceSession, signWithDeviceKey } from 'uniswap/src/features/passkey/deviceSession'
import { authenticateWithPasskey, loadPrivyPbModule } from 'uniswap/src/features/passkey/embeddedWallet'
import { logger } from 'utilities/src/logger/logger'

async function signWithDeviceSessionOrPasskey<T>({
  action,
  walletId,
  challengeParams,
  signRequest,
}: {
  action: Action
  walletId?: string
  challengeParams: Record<string, string>
  signRequest: (auth: SignAuth) => Promise<T>
}): Promise<T> {
  const { AuthenticationTypes } = await loadPrivyPbModule()
  const session = getDeviceSession()
  if (session) {
    const challenge = await EmbeddedWalletApiClient.fetchChallengeRequest({
      type: AuthenticationTypes.PASSKEY_AUTHENTICATION,
      action,
      walletId: walletId ?? session.walletId,
      ...challengeParams,
    })
    if (challenge.signingPayload) {
      const resolvedWalletId = walletId ?? session.walletId
      if (!resolvedWalletId) {
        throw new Error('No walletId available for device auth')
      }
      const deviceSignature = await signWithDeviceKey(session.privateKey, challenge.signingPayload)
      return signRequest({
        case: 'deviceAuth',
        value: { deviceSignature, walletId: resolvedWalletId },
      })
    }
  }
  const credential = await authenticateWithPasskey(action, { walletId, ...challengeParams })
  if (!credential) {
    throw new Error('Passkey authentication returned no credential')
  }
  return signRequest({ case: 'credential', value: credential })
}

export async function signMessageWithPasskey(message: string, walletId?: string): Promise<string | undefined> {
  const { Action } = await loadPrivyPbModule()
  try {
    const result = await signWithDeviceSessionOrPasskey({
      action: Action.SIGN_MESSAGE,
      walletId,
      challengeParams: { message },
      signRequest: (auth) => EmbeddedWalletApiClient.fetchSignMessagesRequest({ messages: [message], auth }),
    })
    return result.signatures[0]
  } catch (error) {
    logger.error(error, {
      tags: { file: 'signing.ts', function: 'signMessageWithPasskey' },
    })
    throw error
  }
}

export async function signTransactionWithPasskey(transaction: string, walletId?: string): Promise<string | undefined> {
  const { Action } = await loadPrivyPbModule()
  try {
    const result = await signWithDeviceSessionOrPasskey({
      action: Action.SIGN_TRANSACTION,
      walletId,
      challengeParams: { transaction },
      signRequest: (auth) =>
        EmbeddedWalletApiClient.fetchSignTransactionsRequest({ transactions: [transaction], auth }),
    })
    return result.signatures[0]
  } catch (error) {
    logger.error(error, {
      tags: { file: 'signing.ts', function: 'signTransactionWithPasskey' },
    })
    throw error
  }
}

export async function signTypedDataWithPasskey(typedData: string, walletId?: string): Promise<string | undefined> {
  const { Action } = await loadPrivyPbModule()
  try {
    const result = await signWithDeviceSessionOrPasskey({
      action: Action.SIGN_TYPED_DATA,
      walletId,
      challengeParams: { typedData },
      signRequest: (auth) => EmbeddedWalletApiClient.fetchSignTypedDataRequest({ typedDataBatch: [typedData], auth }),
    })
    return result.signatures[0]
  } catch (error) {
    logger.error(error, {
      tags: { file: 'signing.ts', function: 'signTypedDataWithPasskey' },
    })
    throw error
  }
}

export async function exportEncryptedSeedPhrase(encryptionKey: string, walletId?: string): Promise<string | undefined> {
  const { Action } = await loadPrivyPbModule()
  try {
    const credential = await authenticateWithPasskey(Action.EXPORT_SEED_PHRASE, { walletId, encryptionKey })
    if (!credential) {
      return undefined
    }
    const seedPhraseResp = await EmbeddedWalletApiClient.fetchExportSeedPhraseRequest({
      encryptionKey,
      credential,
    })
    return seedPhraseResp.encryptedSeedPhrase
  } catch (error) {
    logger.error(error, {
      tags: { file: 'signing.ts', function: 'exportEncryptedSeedPhrase' },
    })
    throw error
  }
}
