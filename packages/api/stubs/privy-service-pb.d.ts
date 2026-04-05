// Type stubs for @uniswap/client-privy-embedded-wallet when the private package is not installed.

export declare enum AuthenticationTypes {
  AUTHENTICATION_TYPE_UNSPECIFIED = 0,
  PASSKEY_REGISTRATION = 1,
  PASSKEY_AUTHENTICATION = 2,
}

export declare enum Action {
  ACTION_UNSPECIFIED = 0,
  CREATE_WALLET = 1,
  SIGN_MESSAGE = 2,
  SIGN_TRANSACTION = 3,
  SIGN_TYPED_DATA = 4,
  WALLET_SIGNIN = 5,
  EXPORT_SEED_PHRASE = 6,
  DELETE_RECORD = 7,
  REGISTER_NEW_AUTHENTICATION_TYPES = 8,
  LIST_AUTHENTICATORS = 9,
  DELETE_AUTHENTICATOR = 10,
  SETUP_RECOVERY = 11,
  EXECUTE_RECOVERY = 12,
  DELETE_RECOVERY = 13,
}

export declare enum AuthenticatorNameType {
  AUTHENTICATOR_NAME_TYPE_UNSPECIFIED = 0,
  GOOGLE_PASSWORD_MANAGER = 1,
  CHROME_MAC = 2,
  WINDOWS_HELLO = 3,
  ICLOUD_KEYCHAIN_MANAGED = 4,
  ICLOUD_KEYCHAIN = 15,
  PLATFORM_AUTHENTICATOR = 30,
  SECURITY_KEY = 31,
}

export declare enum RegistrationOptions_AuthenticatorAttachment {
  AUTHENTICATOR_ATTACHMENT_UNSPECIFIED = 0,
  PLATFORM = 1,
  CROSS_PLATFORM = 2,
}

export declare class ChallengeResponse {
  challengeOptions?: string
  sessionActive: boolean
  signingPayload?: string
  keyQuorumId?: string
  existingPublicKeys: string[]
}

export declare class CreateWalletResponse {
  walletAddress: string
  walletId: string
  deviceKeyQuorumId?: string
  policyId?: string
  policyExpiresAt?: bigint
}

export declare class StartAuthenticatedSessionResponse {
  policyId?: string
  policyExpiresAt?: bigint
}

export declare class DeviceSignatureAuth {
  deviceSignature: string
  walletId: string
}

export declare class AddAuthenticatorResponse {
  credentialId: string
}

export declare class DisconnectResponse {
  success: boolean
}

export declare class RegistrationOptions {
  authenticatorAttachment?: RegistrationOptions_AuthenticatorAttachment
  username?: string
}

export declare class WalletSignInResponse {
  walletAddress: string
  walletId: string
}

export declare class SignMessageResponse {
  signature: string
}

export declare class SignTransactionResponse {
  signature: string
}

export declare class SignTypedDataResponse {
  signature: string
}

export declare class Authenticator {
  credentialId: string
  providerName: AuthenticatorNameType
  username?: string
  createdAt: bigint
  aaguid?: string
}

export declare class ListAuthenticatorsRequest {
  credential?: string
  walletId?: string
}

export declare class RecoveryMethod {
  type: string
  identifier: string
  createdAt: bigint
  status: string
}

export declare class ListAuthenticatorsResponse {
  authenticators: Authenticator[]
  recoveryMethods: RecoveryMethod[]
}

export declare class AddAuthenticatorRequest {
  newCredential: string
  deviceSignature?: string
}

export declare class StartAuthenticatedSessionRequest {
  existingCredential: string
  devicePublicKey?: string
}

export declare class DeleteAuthenticatorRequest {
  credential: string
  authenticatorId: string
}

export declare class DeleteAuthenticatorResponse {
  success: boolean
}

export declare class OprfEvaluateRequest {
  blindedElement: string
  isRecovery?: boolean
  authMethodId?: string
}

export declare class OprfEvaluateResponse {
  evaluatedElement?: string
  errorMessage?: string
}

export declare class SetupRecoveryRequest {
  walletId: string
  authPublicKey: string
  authMethodId: string
  authMethodType?: string
}

export declare class SetupRecoveryResponse {
  success: boolean
  recoveryQuorumId?: string
}

export declare class ExecuteRecoveryRequest {
  authMethodId: string
  newCredential: string
  authKeySignature: string
  emailJwt: string
}

export declare class ExecuteRecoveryResponse {
  credentialId?: string
  walletAddress?: string
  walletId?: string
  errorMessage?: string
}

export declare class ReportDecryptionResultRequest {
  success: boolean
  authMethodId: string
  newPasskeyPublicKey?: string
}

export declare class ReportDecryptionResultResponse {
  cooldownSeconds: number
  errorMessage?: string
  signingPayload?: string
}

export declare class GetRecoveryConfigResponse {
  found: boolean
  status?: string
  recoveryQuorumId?: string
  authMethodType?: string
  encryptedKeyId?: string
  walletAddress?: string
}

export declare class DeleteRecoveryRequest {
  credential: string
}

export declare class DeleteRecoveryResponse {
  success: boolean
}
