import type {
  Authenticator,
  RegistrationOptions_AuthenticatorAttachment as AuthenticatorAttachment,
  RecoveryMethod,
  RegistrationOptions,
} from '@uniswap/client-privy-embedded-wallet/dist/uniswap/privy-embedded-wallet/v1/service_pb'
import { EmbeddedWalletApiClient } from 'uniswap/src/data/rest/embeddedWallet/requests'
import {
  base64ToBase64url,
  base64urlToBase64,
  canonicalizeJSON,
  generateDeviceKeyPair,
  getDeviceSession,
  setDeviceSession,
  signWithDeviceKey,
} from 'uniswap/src/features/passkey/deviceSession'
import { authenticateWithPasskey, loadPrivyPbModule } from 'uniswap/src/features/passkey/embeddedWallet'
import { authenticatePasskey, registerPasskey } from 'uniswap/src/features/passkey/passkey'
import { logger } from 'utilities/src/logger/logger'

export async function listAuthenticators(
  walletId?: string,
): Promise<{ authenticators: Authenticator[]; recoveryMethods: RecoveryMethod[] }> {
  try {
    const resp = await EmbeddedWalletApiClient.fetchListAuthenticatorsRequest({ walletId })
    return { authenticators: resp.authenticators, recoveryMethods: resp.recoveryMethods }
  } catch (error) {
    logger.error(error, {
      tags: {
        file: 'authenticatorManagement.ts',
        function: 'listAuthenticators',
      },
    })
    throw error
  }
}

export async function startAddAuthenticatorSession(walletId?: string): Promise<string> {
  const { AuthenticationTypes, Action } = await loadPrivyPbModule()
  const { privateKey, publicKeyBase64: devicePublicKey } = await generateDeviceKeyPair()

  const challenge = await EmbeddedWalletApiClient.fetchChallengeRequest({
    type: AuthenticationTypes.PASSKEY_AUTHENTICATION,
    action: Action.REGISTER_NEW_AUTHENTICATION_TYPES,
    walletId,
    devicePublicKey,
  })
  if (!challenge.challengeOptions) {
    throw new Error('No challenge options returned — cannot start authenticated session')
  }

  const existingCredential = await authenticatePasskey(challenge.challengeOptions)

  const sessionResp = await EmbeddedWalletApiClient.fetchStartAuthenticatedSessionRequest({
    existingCredential,
    devicePublicKey,
  })

  if (!sessionResp.policyId || sessionResp.policyExpiresAt == null) {
    throw new Error('StartAuthenticatedSession did not return policy details')
  }

  setDeviceSession({
    privateKey,
    policyId: sessionResp.policyId,
    policyExpiresAt: Number(sessionResp.policyExpiresAt),
    walletId: walletId ?? undefined,
  })

  return existingCredential
}

export async function registerNewAuthenticator({
  authenticatorAttachment,
  username,
  walletId,
}: {
  authenticatorAttachment: AuthenticatorAttachment
  username?: string
  walletId?: string
}): Promise<void> {
  const { Action, AuthenticationTypes } = await loadPrivyPbModule()
  const session = getDeviceSession()
  if (!session) {
    throw new Error('No active device session — call startAddAuthenticatorSession first')
  }

  try {
    // Challenge for registration — returns keyQuorumId + existingPublicKeys
    const options = { authenticatorAttachment, username } as unknown as RegistrationOptions
    const challenge = await EmbeddedWalletApiClient.fetchChallengeRequest({
      type: AuthenticationTypes.PASSKEY_REGISTRATION,
      action: Action.REGISTER_NEW_AUTHENTICATION_TYPES,
      options,
      walletId,
    })

    if (!challenge.challengeOptions) {
      throw new Error('No challenge options returned for passkey registration')
    }

    // Register new passkey in browser
    const newCredential = await registerPasskey(challenge.challengeOptions)

    // Extract new public key from credential response (base64url → standard base64)
    // newCredential is JSON.stringify(RegistrationResponseJSON) from @simplewebauthn/browser
    const credentialJson = JSON.parse(newCredential)
    if (!credentialJson?.response?.publicKey) {
      throw new Error('Credential response missing publicKey')
    }
    const b64urlKey: string = credentialJson.response.publicKey
    const newPublicKey = base64urlToBase64(b64urlKey)

    // Construct Privy PATCH canonical payload and sign with device key
    const allKeys = [...challenge.existingPublicKeys, newPublicKey]
    const privyAppId = process.env['PRIVY_APP_ID']
    if (!privyAppId) {
      throw new Error('PRIVY_APP_ID is not set')
    }
    const payload = {
      body: { public_keys: allKeys },
      headers: { 'privy-app-id': privyAppId },
      method: 'PATCH',
      url: `https://api.privy.io/v1/key_quorums/${challenge.keyQuorumId}`,
      version: 1,
    }
    const canonicalJson = canonicalizeJSON(payload)
    const signingPayloadBase64url = base64ToBase64url(btoa(canonicalJson))
    const deviceSignature = await signWithDeviceKey(session.privateKey, signingPayloadBase64url)

    await EmbeddedWalletApiClient.fetchAddAuthenticatorRequest({ newCredential, deviceSignature })
  } catch (error) {
    logger.error(error, {
      tags: {
        file: 'authenticatorManagement.ts',
        function: 'registerNewAuthenticator',
      },
    })
    throw error
  }
}

export async function deleteRecoveryMethod(walletId: string): Promise<boolean> {
  const { Action } = await loadPrivyPbModule()
  try {
    const credential = await authenticateWithPasskey(Action.DELETE_RECOVERY, { walletId })
    if (!credential) {
      return false
    }
    // The server identifies which recovery method to delete from the authenticated credential
    // and wallet context — no explicit recovery method ID is needed in the request.
    const resp = await EmbeddedWalletApiClient.fetchDeleteRecovery({ credential })
    return resp.success
  } catch (error) {
    logger.error(error, {
      tags: {
        file: 'authenticatorManagement.ts',
        function: 'deleteRecoveryMethod',
      },
    })
    throw new Error('Failed to delete recovery method', { cause: error })
  }
}

export async function deleteAuthenticator({
  authenticator,
  credential,
}: {
  authenticator: Authenticator
  credential?: string
}): Promise<boolean | undefined> {
  try {
    if (credential) {
      await EmbeddedWalletApiClient.fetchDeleteAuthenticatorRequest({
        credential,
        authenticatorId: authenticator.credentialId,
      })
      return true
    }
    return false
  } catch (error) {
    logger.error(error, {
      tags: {
        file: 'authenticatorManagement.ts',
        function: 'deleteAuthenticator',
      },
    })
    throw error
  }
}
